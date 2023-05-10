using Microsoft.CodeAnalysis;
using Microsoft.JSInterop;
using System.Reflection;

namespace WebActuator.WebAssemblyClient.Pages;

public partial class Index
{
    private const string Github = "https://github.com/239573049/WebActuator";

    private static bool first = true;

    private string value;

    private string error;

    private MMonacoEditor Monaco;

    bool _drawer = true;

    private object Options = new
    {
        value = "Console.WriteLine(\"Hello World！\");",
        language = "csharp",
        theme = "vs-dark",
        automaticLayout = true,
    };

    private List<string> Assemblys = new()
    {
        "https://assembly.tokengo.top:8843/System.dll",
        "https://assembly.tokengo.top:8843/System.Buffers.dll",
        "https://assembly.tokengo.top:8843/System.Collections.dll",
        "https://assembly.tokengo.top:8843/System.Core.dll",
        "https://assembly.tokengo.top:8843/System.Linq.Expressions.dll",
        "https://assembly.tokengo.top:8843/System.Linq.Parallel.dll",
        "https://assembly.tokengo.top:8843/mscorlib.dll",
        "https://assembly.tokengo.top:8843/System.Linq.dll",
        "https://assembly.tokengo.top:8843/System.Private.Uri.dll",
        "https://assembly.tokengo.top:8843/System.Console.dll",
        "https://assembly.tokengo.top:8843/System.Runtime.dll",
        "https://assembly.tokengo.top:8843/System.Net.Http.dll",
        "https://assembly.tokengo.top:8843/System.Private.CoreLib.dll",
        "https://assembly.tokengo.top:8843/System.Text.Json.dll",
        "https://assembly.tokengo.top:8843/System.Console.dll"
    };

    private StringNumber _selectedItem = 1;

    private List<StorageFile> files = new();

    protected override void OnInitialized()
    {
        files.Add(new StorageFile()
        {
            Name = "HelloWorld.cs",
            Cotent = "Console.WriteLine(\"Hello World！\");",
            CreatedTime = DateTime.Now
        });

    }

    private async Task RunCode()
    {
        if (first)
        {
            foreach (var x in Assemblys)
            {
                try
                {
                    using var stream = await GlobalManage.HttpClient.GetStreamAsync(x);
                    ReferenceManage.AddReference(x, MetadataReference.CreateFromStream(stream));
                }
                catch
                {
                }
            }
            first = false;
        }

        await ActuatorCompile.RunSubmission(value, false, diagnostic =>
        {
            diagnostic.ForEach(x =>
            {
                error += x.Code + ":" + x.Message + "\n";
                _ = InvokeAsync(StateHasChanged);
            });
        }, exception =>
        {
            error += "编译异常：" + exception.Message + "\n";
            _ = InvokeAsync(StateHasChanged);
        });
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await Task.Run(async () =>
            {
                await Task.Delay(100);

                await TryJSModule.Init();
            });
        }
    }

    private async Task Goto(string url)
    {
        await JSruntime.InvokeVoidAsync("open", url);
    }

    private async Task SetValue(string value)
    {
        await Monaco.SetValueAsync(value);
    }
}
