using Microsoft.CodeAnalysis;
using System.Reflection;

namespace WebActuator.Options;
public class CompileOptions
{
    public string Source { get; set; } = null!;

    public Assembly Assembly { get; set; } = null!;

    public IEnumerable<Diagnostic>? Diagnostics { get; set; }

    public bool ConcurrentBuild { get; set; } = false;
}
