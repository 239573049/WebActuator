using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.JSInterop;
using System.Text.Json;
using WebActuator.Options;

namespace WebActuator.WebAssembly;

public partial class ExportManage
{
    public ExportManage()
    {
    }

    [JSInvokable]
    public static Task<string[]> Using() => Task.FromResult(GlobalManage.Using());

    [JSInvokable]
    public static async Task SetUsing(string[] usings)
    {
        GlobalManage.AddUsing(usings);
        await Task.CompletedTask;
    }

    [JSInvokable]
    public static async Task RemoveUsing(string @using)
    {
        GlobalManage.RemoveUsing(@using);
        await Task.CompletedTask;
    }

    [JSInvokable]
    public static async Task ClearUsing()
    {
        GlobalManage.ClearUsing();
        await Task.CompletedTask;
    }

    [JSInvokable]
    public static Task<int> LanguageVersion() => Task.FromResult((int)GlobalManage.LanguageVersion);

    [JSInvokable]
    public static async Task SetLanguageVersion(int languageVersion)
    {
        GlobalManage.SetLanguageVersion((LanguageVersion)languageVersion);
        await Task.CompletedTask;
    }

    [JSInvokable]
    public static Task<string[]> References() => Task.FromResult(ReferenceManage.ReferenceKeys);

    [JSInvokable]
    public static async Task SetReferencesAsync(string[] references)
    {
        foreach (var reference in references)
        {
            if (!ReferenceManage.ReferenceKeys.Contains(reference))
            {
                try
                {
                    await using var stream = await GlobalManage.HttpClient.GetStreamAsync(reference);

                    ReferenceManage.AddReference(reference, MetadataReference.CreateFromStream(stream));
                }
                catch (Exception)
                {
                }
            }
        }
    }

    [JSInvokable]
    public static Task<bool> TryCompile(string source, bool concurrentBuild = false)
    {
        return Task.FromResult(ActuatorCompile.TryCompile(new CompileOptions { ConcurrentBuild = concurrentBuild, Source = source }));
    }

    [JSInvokable]
    public static async Task RunSubmission(string code, bool concurrentBuild = false)
    {
        // await ActuatorCompile.RunSubmission(code, concurrentBuild, async (diagnostic) =>
        // {
        //     var result = JsonSerializer.Serialize(diagnostic);
        //     await WebActuatorApp.GetRequiredService<IJSRuntime>().InvokeVoidAsync("OnDiagnostic", result);
        // }, async (exception) =>
        // {
        //     await WebActuatorApp.GetRequiredService<IJSRuntime>().InvokeVoidAsync("OnException", exception.Message);
        // });
    }

}