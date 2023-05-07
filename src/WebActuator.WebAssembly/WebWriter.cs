using Microsoft.JSInterop;
using System.Diagnostics.CodeAnalysis;

namespace WebActuator;

public class WebWriter : StreamWriter
{
    private readonly IJSRuntime JSRuntime;

    public WebWriter(Stream stream, IJSRuntime jSRuntime) : base(stream)
    {
        JSRuntime = jSRuntime;
    }

    public override async Task WriteAsync(string value)
    {
        await JSRuntime.InvokeVoidAsync("OnWriteLine", value);
        await Task.CompletedTask;
    }

    public override async void Write(string? value)
    {
        await JSRuntime.InvokeVoidAsync("OnWriteLine", value);
    }

    public override async void WriteLine(string value)
    {
        await JSRuntime.InvokeVoidAsync("OnWriteLine", value);
    }

    public override async void WriteLine(bool value)
    {
        await JSRuntime.InvokeVoidAsync("OnWriteLine", value);
    }

    public override async void Write(decimal value)
    {
        await JSRuntime.InvokeVoidAsync("OnWriteLine", value);
    }

    public override async void Write(double value)
    {
        await JSRuntime.InvokeVoidAsync("OnWriteLine", value);
    }

    public override async void Write([StringSyntax("CompositeFormat")] string format, object arg0)
    {
        await JSRuntime.InvokeVoidAsync("OnWriteLine", string.Format(format, arg0));
    }

    public override async void WriteLine([StringSyntax("CompositeFormat")] string format, object arg0)
    {
        await JSRuntime.InvokeVoidAsync("OnWriteLine", string.Format(format, arg0));
    }

}
