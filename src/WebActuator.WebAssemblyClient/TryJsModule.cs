using BlazorComponent.JSInterop;
using Microsoft.JSInterop;

namespace WebActuator.WebAssemblyClient;


public class TryJSModule : JSModule
{
    public TryJSModule(IJSRuntime js) : base(js, "/js/try.js")
    {
    }

    public async ValueTask Init()
    {
        await InvokeVoidAsync("init");
    }

}