﻿using Microsoft.AspNetCore.Components;
using Microsoft.CodeAnalysis;
using Microsoft.JSInterop;
using System.Net.Http.Json;
using System.Runtime.Loader;
using System.Text.Json;
using WebActuator;
using WebActuator.WebAssemblyClient;

namespace Examples.Shared;

public partial class Index : IDisposable
{
    private const string Github = "https://github.com/239573049/WebActuator";

    private static bool first = true;

    private string value;

    private string error;

    private MMonacoEditor Monaco;

    private DotNetObjectReference<Index>? _objRef;

    /// <summary>
    /// 新增reference弹窗状态
    /// </summary>
    private bool referenceDrawer = false;

    /// <summary>
    /// new File弹窗状态
    /// </summary>
    private bool newFileDrawer = false;

    /// <summary>
    /// 新文件名称
    /// </summary>
    private string newFileName = string.Empty;

    bool _drawer = true;

    private object Options = new
    {
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

    private List<string> _referenceAssembly => ReferenceManage.ReferenceKeys.ToList();

    private StringNumber _selectedItem = 0;

    private StorageFile? selectStorageFile;

    private List<StorageFile> files = new();

    [SupplyParameterFromQuery] [Parameter] public string? Home { get; set; }

    [Parameter] public string? Code { get; set; }

    protected override void OnInitialized()
    {
        _objRef = DotNetObjectReference.Create(this);
    }

    [JSInvokable(nameof(RunCode))]
    public async Task RunCode()
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


        ActuatorCompile.RunSubmission(value, onOutput: OnOutput, OnError, diagnostic =>
        {
            diagnostic.ForEach(async x =>
            {
                error += x.Code + ":" + x.Message + "\n";
                await InvokeAsync(StateHasChanged);
                RenderScroll();
            });
        }, false, async exception =>
        {
            error += "[error] " + exception.Message + "\n";
            await InvokeAsync(StateHasChanged);
            RenderScroll();
        });

        await SaveFile();
    }

    /// <summary>
    /// 监听日志输出
    /// </summary>
    /// <param name="output"></param>
    private async void OnOutput(string output)
    {
        error += output;
        await InvokeAsync(StateHasChanged);
        RenderScroll();
    }

    private async Task AddAssembly()
    {
        try
        {
            await OnAddReference(_reference);
        }
        finally
        {
            _reference = string.Empty;
            _ = InvokeAsync(StateHasChanged);
        }
    }

    private async void OnError(string err)
    {
        error += "[error] " + err + "\n";
        await InvokeAsync(StateHasChanged);
        RenderScroll();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await Task.Run(async () =>
            {
                await Task.Delay(100);

                await TryJsModule.Init();
            });

            var result = await TryJsModule.GetValue("files");

            if (string.IsNullOrEmpty(result))
            {
                files.Add(new StorageFile()
                {
                    Name = "HelloWorld.cs",
                    Cotent =
                        "using System;\r\ninternal class Program\r\n{\r\n    private static void Main(string[] args)\r\n    {\r\n        Console.WriteLine(\"Hello World!\");\r\n    }\r\n}",
                    CreatedTime = DateTime.Now
                });

                await SaveFile();
            }
            else
            {
                files = JsonSerializer.Deserialize<List<StorageFile>>(result) ?? new List<StorageFile>();
            }

            if (!string.IsNullOrEmpty(Code))
            {
                try
                {
                    var code = await GlobalManage.HttpClient.GetStringAsync(
                        "https://web-actuator-api.tokengo.top:8843/api/v1/CodeManages/Code?key=" + Code);
                    if (!string.IsNullOrEmpty(code))
                    {
                        await Monaco.SetValueAsync(code);
                    }
                }
                catch
                {
                    await InitMonacoData();
                }
            }
            else
            {
                await InitMonacoData();
            }
        }
    }

    private async Task InitMonacoData()
    {
        var name = files.FirstOrDefault()?.Name;
        if (!string.IsNullOrEmpty(name))
        {
            await Monaco.SetValueAsync(await TryJsModule.GetValue(name));
        }

        selectStorageFile = files.FirstOrDefault();
    }

    private void RenderScroll()
    {
        _ = Task.Run(async () =>
        {
            await Task.Delay(50);
            await TryJsModule.RenderScroll();
        });
    }

    private async Task OnAddReference(string v)
    {
        try
        {
            // await using var stream = await GlobalManage.HttpClient.GetStreamAsync(v);
            // ReferenceManage.AddReference(v, MetadataReference.CreateFromStream(stream));
            foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
            {
                ReferenceManage.AddReference(assembly.Location, MetadataReference.CreateFromFile(assembly.Location));
            }
        }
        catch
        {
        }
    }

    private async Task InitMonaco()
    {
        // 监听CTRL+S
        await Monaco.AddCommandAsync(2097, _objRef, nameof(RunCode));

        if (!string.IsNullOrEmpty(selectStorageFile?.Cotent))
        {
            await Monaco.SetValueAsync(selectStorageFile.Cotent);
        }
    }

    private async Task Goto(string url)
    {
        await JsRuntime.InvokeVoidAsync("open", url);
    }

    private async Task SetValue(StorageFile file)
    {
        if (file == selectStorageFile)
        {
            selectStorageFile = null;
            await Monaco.SetValueAsync(string.Empty);
        }
        else
        {
            selectStorageFile = file;
            var result = await TryJsModule.GetValue(file.Name);
            file.Cotent = result;
            await Monaco.SetValueAsync(result);
        }
    }

    private async Task OnNewFile()
    {
        if (files.Any(x => x.Name == newFileName))
        {
            await PopupService.EnqueueSnackbarAsync("已经存在相同名称的文件", AlertTypes.Error);
            return;
        }

        var file = new StorageFile()
        {
            Name = newFileName,
            Cotent =
                "using System;\r\ninternal class Program\r\n{\r\n    private static void Main(string[] args)\r\n    {\r\n        Console.WriteLine(\"Hello World!\");\r\n    }\r\n}",
            CreatedTime = DateTime.Now
        };

        files.Add(file);

        await SaveFile();

        newFileDrawer = false;
    }

    private async Task SaveFile()
    {
        await TryJsModule.SetValue("files", files.Select(x => new
        {
            x.Name,
            x.CreatedTime
        }));

        foreach (var file in files)
        {
            if (file.Name == selectStorageFile?.Name)
            {
                file.Cotent = value;
                await TryJsModule.SetValue(file.Name, file.Cotent);
            }
            else
            {
                await TryJsModule.SetValue(file.Name, file.Cotent);
            }
        }
    }

    private async Task CreateCodeSharedAsync()
    {
        var code = await Monaco.GetValueAsync();
        var result = await GlobalManage.HttpClient.PostAsJsonAsync(
            "https://web-actuator-api.tokengo.top:8843/api/v1/CodeManages/Code", new
            {
                code,
            });

        if (result.IsSuccessStatusCode)
        {
            var href = await TryJsModule.GetHref();

            // 设置粘贴板
            await TryJsModule.SetClipboard(href + await result.Content.ReadAsStringAsync());

            await PopupService.EnqueueSnackbarAsync(new Masa.Blazor.Presets.SnackbarOptions()
            {
                Title = "已复制到粘贴板",
                Type = AlertTypes.Success
            });
        }
        else
        {
            await PopupService.EnqueueSnackbarAsync(new Masa.Blazor.Presets.SnackbarOptions()
            {
                Title = "生成共享码错误",
                Type = AlertTypes.Error
            });
        }
    }

    private async Task OnCloseFile(StorageFile file)
    {
        if (files.Count == 0)
        {
            return;
        }

        await TryJsModule.RemoveValue(file.Name);
        files.Remove(file);
        await SaveFile();
    }

    public void Dispose()
    {
        _objRef?.Dispose();
    }
}