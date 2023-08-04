using Examples.Service.MonacoRoslynCompletionProvider.Api;

namespace Examples.Service.MonacoRoslynCompletionProvider
{
    public static class CompletitionRequestHandler
    {
        public static async Task<TabCompletionResult[]> Handle(TabCompletionRequest tabCompletionRequest)
        {
            var workspace = CompletionWorkspace.Create(tabCompletionRequest.Assemblies);
            var document = await workspace.CreateDocument(tabCompletionRequest.Code);
            return await document.GetTabCompletion(tabCompletionRequest.Position, CancellationToken.None);
        }

        public static async Task<HoverInfoResult> Handle(HoverInfoRequest hoverInfoRequest)
        {
            var workspace = CompletionWorkspace.Create(hoverInfoRequest.Assemblies);
            var document = await workspace.CreateDocument(hoverInfoRequest.Code);
            return await document.GetHoverInformation(hoverInfoRequest.Position, CancellationToken.None);
        }

        public static async Task<CodeCheckResult[]> Handle(CodeCheckRequest codeCheckRequest)
        {
            var workspace = CompletionWorkspace.Create(codeCheckRequest.Assemblies);
            var document = await workspace.CreateDocument(codeCheckRequest.Code);
            return await document.GetCodeCheckResults(CancellationToken.None);
        }

        public static async Task<SignatureHelpResult> Handle(SignatureHelpRequest signatureHelpRequest)
        {
            var workspace = CompletionWorkspace.Create(signatureHelpRequest.Assemblies);
            var document = await workspace.CreateDocument(signatureHelpRequest.Code);
            return await document.GetSignatureHelp(signatureHelpRequest.Position, CancellationToken.None);
        }
    }
}
