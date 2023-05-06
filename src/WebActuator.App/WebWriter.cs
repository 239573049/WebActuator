using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Threading.Tasks;
using WebActuator.App;

namespace WebActuator;

public class WebWriter : StreamWriter
{
    public WebWriter(Stream stream) : base(stream)
    {
    }

    public override async Task WriteAsync(string value)
    {
        ExportManage.WriteLine(value);
        await Task.CompletedTask;
    }

    public override void Write(string? value)
    {
        ExportManage.WriteLine(value);
    }

    public override void WriteLine(string value)
    {
        ExportManage.WriteLine(value);
    }

    public override void WriteLine(bool value)
    {
        ExportManage.WriteLine(value.ToString());
    }

    public override void Write(decimal value)
    {
        ExportManage.WriteLine(value.ToString());
    }

    public override void Write(double value)
    {
        ExportManage.WriteLine(value.ToString());
    }

    public override void Write([StringSyntax("CompositeFormat")] string format, object arg0)
    {
        ExportManage.WriteLine(string.Format(format,arg0));
    }

    public override void WriteLine([StringSyntax("CompositeFormat")] string format, object arg0)
    {
        ExportManage.WriteLine(string.Format(format, arg0));
    }

}
