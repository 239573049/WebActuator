using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using System.Reflection;
using WebActuator.Models;
using WebActuator.Options;

namespace WebActuator;

public class ActuatorCompile
{
    private static object[] _submissionStates = { null, null };

    private static int _submissionIndex = 0;

    public static bool TryCompile(CompileOptions options)
    {
        var scriptCompilation = CSharpCompilation.CreateScriptCompilation(
            Path.GetRandomFileName(),
            CSharpSyntaxTree.ParseText(options.Source, CSharpParseOptions.Default.WithKind(SourceCodeKind.Script)
                .WithLanguageVersion(GlobalManage.LanguageVersion)), ReferenceManage.References,

            new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary, usings: GlobalManage.Using(), concurrentBuild: options.ConcurrentBuild),
            GlobalManage.CSharpCompilation
        );

        options.Diagnostics = scriptCompilation.GetDiagnostics();

        if (options.Diagnostics.Any(x => x.Severity == DiagnosticSeverity.Error))
        {
            return false;
        }

        using var peStream = new MemoryStream();
        var emitResult = scriptCompilation.Emit(peStream);
        if (emitResult.Success)
        {
            _submissionIndex++;

            GlobalManage.SetCSharpCompilation(scriptCompilation);
            options.Assembly = Assembly.Load(peStream.ToArray());
            return true;
        }

        return false;
    }

    /// <summary>
    /// 执行Code
    /// </summary>
    /// <param name="code"></param>
    /// <returns></returns>
    public static async Task RunSubmission(string code, bool concurrentBuild = false, Action<DiagnosticDto[]>? diagnostic = null, Action<Exception>? exception = null)
    {
        try
        {
            var options = new CompileOptions
            {
                Source = code,
                ConcurrentBuild = concurrentBuild
            };

            if (TryCompile(options))
            {
                if (options.Diagnostics?.Any() == true)
                {
                    diagnostic?.Invoke(options.Diagnostics!.Select(x => new DiagnosticDto
                    {
                        Code = x.Id,
                        Message = x.GetMessage(),
                        Severity = x.Severity
                    }).ToArray());
                }

                var entryPoint = GlobalManage.CSharpCompilation.GetEntryPoint(CancellationToken.None);
                var type = options.Assembly.GetType($"{entryPoint!.ContainingNamespace.MetadataName}.{entryPoint?.ContainingType.MetadataName}");
                var entryPointMethod = type?.GetMethod(entryPoint!.MetadataName);

                var submission = (Func<object[], Task>)entryPointMethod!.CreateDelegate(typeof(Func<object[], Task>));

                // 如果不进行添加会出现超出索引
                if (_submissionIndex >= _submissionStates.Length)
                {
                    Array.Resize(ref _submissionStates, Math.Max(_submissionIndex, _submissionStates.Length * 2));
                }
                // 执行代码
                _ = await ((Task<object>)submission(_submissionStates));

            }
            else
            {
                if (options.Diagnostics?.Any() == true)
                {
                    diagnostic?.Invoke(options.Diagnostics!.Select(x => new DiagnosticDto
                    {
                        Code = x.Id,
                        Message = x.GetMessage(),
                        Severity = x.Severity
                    }).ToArray());
                }
            }

        }
        catch (Exception ex)
        {
            exception?.Invoke(ex);
        }
    }
}
