using System.Reactive.Disposables;
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
            new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary, usings: GlobalManage.Using(),
                concurrentBuild: options.ConcurrentBuild),
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
    /// <param name="onOutput"></param>
    /// <param name="onError"></param>
    /// <param name="diagnostic"></param>
    /// <param name="concurrentBuild"></param>
    /// <param name="exception"></param>
    /// <returns></returns>
    public static void RunSubmission(string code, Action<string> onOutput,
        Action<string> onError,
        Action<DiagnosticDto[]>? diagnostic = null, bool concurrentBuild = false, Action<Exception>? exception = null)
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
                    diagnostic?.Invoke(options.Diagnostics.Where(x => x.Severity == DiagnosticSeverity.Error)!.Select(x => new DiagnosticDto
                    {
                        Code = x.Id,
                        Message = x.GetMessage(),
                        Severity = x.Severity
                    }).ToArray());
                }

                var entryPoint = EntryPointDiscoverer.FindStaticEntryMethod(options.Assembly);

                using var _ = ConsoleOutput.Subscribe(c => new CompositeDisposable
                {
                    c.Out.Subscribe(onOutput),
                    c.Error.Subscribe(onError)
                });

                try
                {
                    var parameters = entryPoint.GetParameters();
                    if (parameters.Length != 0)
                    {
                        var parameterValues = parameters.Select(p =>
                                p.ParameterType.IsValueType ? Activator.CreateInstance(p.ParameterType) : null)
                            .ToArray();
                        entryPoint.Invoke(null, parameterValues);
                    }
                    else
                    {
                        entryPoint.Invoke(null, null);
                    }
                }
                catch (Exception e)
                {
                    exception?.Invoke(e);
                }
            }
            else
            {
                if (options.Diagnostics?.Any() == true)
                {
                    diagnostic?.Invoke(options.Diagnostics.Where(x => x.Severity == DiagnosticSeverity.Error)!.Select(x => new DiagnosticDto
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