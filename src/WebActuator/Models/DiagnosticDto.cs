using Microsoft.CodeAnalysis;

namespace WebActuator.Models;

public class DiagnosticDto
{
    public DiagnosticSeverity Severity { get; set; }

    public string? Code { get; set; }

    public string? Message { get; set; }
}
