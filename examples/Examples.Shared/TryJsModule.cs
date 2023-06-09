using BlazorComponent.JSInterop;
using Microsoft.JSInterop;
using Microsoft.VisualBasic;
using System.Text.Json;

namespace WebActuator.WebAssemblyClient;


public class TryJSModule : JSModule
{
    public TryJSModule(IJSRuntime js) : base(js, "./_content/Examples.Shared/js/try.js")
    {
    }

    public async ValueTask Init()
    {
        await InvokeVoidAsync("init");
    }

    public async ValueTask RenderScroll()
    {
        await InvokeVoidAsync("renderScroll");
    }

    public async ValueTask<string?> GetValue(string key)
    {
        return await InvokeAsync<string?>("getValue", key);
    }

    public async ValueTask<T?> GetValue<T>(string key)
    {
        var result = await GetValue(key);

        if (string.IsNullOrEmpty(result))
        {
            return default;
        }

        return JsonSerializer.Deserialize<T>(result);
    }

    public async ValueTask SetValue(string key, string value)
    {
        await InvokeVoidAsync("setValue",key, value);
    }

    public async ValueTask SetValue<T>(string key, T value)
    {
        var json = JsonSerializer.Serialize(value);
        await SetValue(key, json);
    }

    public async ValueTask RemoveValue(string key)
    {
        await InvokeVoidAsync("removeValue", key);
    }

    public async ValueTask SetClipboard(string value)
    {
        await InvokeVoidAsync("setClipboard", value);
    }

    public async ValueTask<string> GetHref()
    {
        return await InvokeAsync<string>("getHref");
    }
}