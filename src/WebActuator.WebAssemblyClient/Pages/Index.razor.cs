using Microsoft.AspNetCore.Components.Forms;
using Microsoft.CodeAnalysis;
using Microsoft.JSInterop;

namespace WebActuator.WebAssemblyClient.Pages;

public partial class Index
{
    private const string Github = "https://github.com/239573049/WebActuator";

    private static bool first = true;

    private string value;

    private string error;

    private MMonacoEditor Monaco;

    private bool referenceDrawer = false;

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

    private string _reference = string.Empty;

    private List<string> _referenceAssembly
    {
        get
        {
            return ReferenceManage.ReferenceKeys.ToList();
        }
    }

    private StringNumber _selectedItem = 1;

    private List<StorageFile> files = new();

    protected override void OnInitialized()
    {
        WebWriter.OnWrite = (m) =>
        {
            error += m;
            RenderScroll();
        };

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
                    await OnAddReference(x);
                }
                catch
                {
                }
            }
            first = false;
        }

        await ActuatorCompile.RunSubmission(value, false, diagnostic =>
        {
            diagnostic.ForEach(async x =>
            {
                error += x.Code + ":" + x.Message + "\n";
                await InvokeAsync(StateHasChanged);
                RenderScroll();
            });
        }, async exception =>
        {
            error += "编译异常：" + exception.Message + "\n";
            await InvokeAsync(StateHasChanged);
            RenderScroll();
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

    private void RenderScroll()
    {
        _ = Task.Run(async () =>
        {
            await Task.Delay(50);
            await TryJSModule.RenderScroll();
        });
    }

    private async Task OnAddReference(string v)
    {
        try
        {
            using var stream = await GlobalManage.HttpClient.GetStreamAsync(v);
            ReferenceManage.AddReference(v, MetadataReference.CreateFromStream(stream));
        }
        catch
        {
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
