using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using System;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using System.Threading.Tasks;
using WebActuator.Options;

namespace WebActuator.App;

public partial class ExportManage
{
    [JSExport]
    public static string[] Using() => GlobalManage.Using();

    [JSExport]
    public static void SetUsing(string[] usings)
    {
        GlobalManage.AddUsing(usings);
    }

    [JSExport]
    public static void RemoveUsing(string @using)
    {
        GlobalManage.RemoveUsing(@using);
    }

    [JSExport]
    public static void ClearUsing()
    {
        GlobalManage.ClearUsing();
    }

    [JSExport]
    public static int LanguageVersion() => (int)GlobalManage.LanguageVersion;

    [JSExport]
    public static void SetLanguageVersion(int languageVersion)
    {
        GlobalManage.SetLanguageVersion((LanguageVersion)languageVersion);
    }

    [JSExport]
    public static string[] References() => ReferenceManage.ReferenceKeys;

    [JSExport]
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

    [JSExport]
    public static bool TryCompile(string source, bool concurrentBuild = false)
    {
        return ActuatorCompile.TryCompile(new CompileOptions { ConcurrentBuild = concurrentBuild, Source = source });
    }

    [JSExport]
    public static async Task RunSubmission(string code, bool concurrentBuild = false)
    {
        await ActuatorCompile.RunSubmission(code, concurrentBuild, (diagnostic) =>
        {
            var result = JsonSerializer.Serialize(diagnostic);
            Diagnostic(result);
        }, (exception) =>
        {
            Exception(exception.Message);
        });
    }

    [JSImport("ExportManage.Diagnostic", "exportManage.js")]
    internal static partial void Diagnostic(string json);

    [JSImport("ExportManage.Exception", "exportManage.js")]
    internal static partial void Exception(string json);
}
