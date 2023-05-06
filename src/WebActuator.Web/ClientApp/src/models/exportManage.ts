export interface DiagnosticDto {
    Severity: DiagnosticSeverity;
    Code: string | null;
    Message: string | null;
}

export enum DiagnosticSeverity {
    Hidden,
    Info,
    Warning,
    Error
}