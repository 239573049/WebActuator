using Examples.Service.MonacoRoslynCompletionProvider.Api;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Emit;

namespace Examples.Service.MonacoRoslynCompletionProvider
{
    public class CodeCheckProvider
    {
        public CodeCheckProvider()
        {
        }

        public async Task<CodeCheckResult[]> Provide(EmitResult emitResult, Document document, CancellationToken cancellationToken)
        {
            var result = new List<CodeCheckResult>();
            foreach(var r in emitResult.Diagnostics)
            {
                var sev = r.Severity == DiagnosticSeverity.Error ? CodeCheckSeverity.Error : r.Severity == DiagnosticSeverity.Warning ? CodeCheckSeverity.Warning : r.Severity == DiagnosticSeverity.Info ? CodeCheckSeverity.Info : CodeCheckSeverity.Hint;
                var keyword = (await document.GetTextAsync(cancellationToken)).GetSubText(r.Location.SourceSpan).ToString();
                var msg = new CodeCheckResult() { Id = r.Id, Keyword = keyword, Message = r.GetMessage(), OffsetFrom = r.Location.SourceSpan.Start, OffsetTo = r.Location.SourceSpan.End, Severity = sev, SeverityNumeric = (int)sev };
                result.Add(msg);
            }
            return result.ToArray();
        }
    }
}
