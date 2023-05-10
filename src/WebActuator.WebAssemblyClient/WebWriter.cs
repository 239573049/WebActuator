using System.Diagnostics.CodeAnalysis;

namespace WebActuator;

public class WebWriter : StreamWriter
{
    public static Action<string>? OnWrite;

    public WebWriter(Stream stream) : base(stream)
    {
    }

    public override async Task WriteAsync(string value)
    {
        OnWrite?.Invoke(value);
    }

    public override async void Write(string? value)
    {
        OnWrite?.Invoke(value);
    }

    public override async void WriteLine(string value)
    {
        OnWrite?.Invoke(value + "\n");
    }

    public override async void WriteLine(bool value)
    {
        OnWrite?.Invoke(value + "\n");
    }

    public override async void Write(decimal value)
    {
        OnWrite?.Invoke(value.ToString());
    }

    public override async void Write(double value)
    {
        OnWrite?.Invoke(value.ToString());
    }

    public override async void Write([StringSyntax("CompositeFormat")] string format, object arg0)
    {
        OnWrite?.Invoke(string.Format(format, arg0));
    }

    public override async void WriteLine([StringSyntax("CompositeFormat")] string format, object arg0)
    {
        OnWrite?.Invoke(string.Format(format, arg0) + "\n");
    }

    public override async void WriteLine([StringSyntax("CompositeFormat")] string format, params object?[] arg)
    {
        OnWrite?.Invoke(string.Format(format, arg) + "\n");
    }

    public override async void WriteLine(double value)
    {
        OnWrite?.Invoke(value + "\n");
    }

    public override async void WriteLine(decimal value)
    {
        OnWrite?.Invoke(value + "\n");
    }
    public override async void WriteLine(float value)
    {
        OnWrite?.Invoke(value + "\n");
    }

    public override async void WriteLine(int value)
    {
        OnWrite?.Invoke(value + "\n");
    }

    public override async void WriteLine(long value)
    {
        OnWrite?.Invoke(value + "\n");
    }

    public override async void WriteLine(object? value)
    {
        OnWrite?.Invoke(value + "\n");
    }

    public override void Write(bool value)
    {
        OnWrite?.Invoke(value.ToString());
    }

    public override void WriteLine()
    {
        OnWrite?.Invoke("\n");
    }

    public override void WriteLine([StringSyntax("CompositeFormat")] string format, object? arg0, object? arg1)
    {
        OnWrite?.Invoke(string.Format(format, arg0, arg1) + "\n");
    }

    public override void WriteLine([StringSyntax("CompositeFormat")] string format, object? arg0, object? arg1, object? arg2)
    {
        OnWrite?.Invoke(string.Format(format, arg0, arg1, arg2) + "\n");
    }

    public override async Task WriteLineAsync(string? value)
    {
        OnWrite?.Invoke(value + "\n");
    }
}
