import { Component } from 'react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import axios from 'axios';

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}
var assemblies = ['System.Text.Json.dll'];

monaco.languages.registerCompletionItemProvider('csharp', {
    triggerCharacters: [".", " "],
    // @ts-ignore
    provideCompletionItems: async (model, position) => {
        let suggestions = [];

        let request = {
            Code: model.getValue(),
            Position: model.getOffsetAt(position),
            Assemblies: assemblies
        }

        let resultQ = await sendRequest("complete", request);

        for (let elem of resultQ.data) {
            suggestions.push({
                label: {
                    label: elem.Suggestion,
                    description: elem.Description
                },
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: elem.Suggestion
            });
        }

        return { suggestions: suggestions };
    }
});

monaco.languages.registerSignatureHelpProvider('csharp', {
    signatureHelpTriggerCharacters: ["("],
    signatureHelpRetriggerCharacters: [","],

    provideSignatureHelp: async (model, position, token, context) => {

        let request = {
            Code: model.getValue(),
            Position: model.getOffsetAt(position),
            Assemblies: assemblies
        }

        let resultQ = await sendRequest("signature", request);
        if (!resultQ.data) return;

        let signatures = [];
        for (let signature of resultQ.data.Signatures) {
            let params = [];
            for (let param of signature.Parameters) {
                params.push({
                    label: param.Label,
                    documentation: param.Documentation ?? ""
                });
            }

            signatures.push({
                label: signature.Label,
                documentation: signature.Documentation ?? "",
                parameters: params,
            });
        }

        let signatureHelp = {} as any;
        signatureHelp.signatures = signatures;
        signatureHelp.activeParameter = resultQ.data.ActiveParameter;
        signatureHelp.activeSignature = resultQ.data.ActiveSignature;

        return {
            value: signatureHelp,
            dispose: () => { }
        };
    }
});


monaco.languages.registerHoverProvider('csharp', {
    provideHover: async function (model, position) {

        let request = {
            Code: model.getValue(),
            Position: model.getOffsetAt(position),
            Assemblies: assemblies
        }

        let resultQ = await sendRequest("hover", request);

        if (resultQ.data) {
            const posStart = model.getPositionAt(resultQ.data.OffsetFrom);
            const posEnd = model.getPositionAt(resultQ.data.OffsetTo);

            return {
                range: new monaco.Range(posStart.lineNumber, posStart.column, posEnd.lineNumber, posEnd.column),
                contents: [
                    { value: resultQ.data.Information }
                ]
            };
        }

        return null;
    }
});

monaco.editor.onDidCreateModel(function (model) {
    async function validate() {

        let request = {
            Code: model.getValue(),
            Assemblies: assemblies
        }

        let resultQ = await sendRequest("codeCheck", request)

        let markers = [];

        for (let elem of resultQ.data) {
            const posStart = model.getPositionAt(elem.OffsetFrom);
            const posEnd = model.getPositionAt(elem.OffsetTo);
            markers.push({
                severity: elem.Severity,
                startLineNumber: posStart.lineNumber,
                startColumn: posStart.column,
                endLineNumber: posEnd.lineNumber,
                endColumn: posEnd.column,
                message: elem.Message,
                code: elem.Id
            });
        }

        monaco.editor.setModelMarkers(model, 'csharp', markers);
    }

    var handle = null as any;
    model.onDidChangeContent(() => {
        monaco.editor.setModelMarkers(model, 'csharp', []);
        clearTimeout(handle);
        handle = setTimeout(() => validate(), 500);
    });
    validate();
});

async function sendRequest(type: any, request: any) {
    let endPoint= null as any;
    switch (type) {
        case 'complete': endPoint = 'http://localhost:5102/completion/complete'; break;
        case 'signature': endPoint = 'http://localhost:5102/completion/signature'; break;
        case 'hover': endPoint = 'http://localhost:5102/completion/hover'; break;
        case 'codeCheck': endPoint = 'http://localhost:5102/completion/codeCheck'; break;
    }
    return await axios.post(endPoint, JSON.stringify(request))
}

interface IState {
}

interface IProps {
    value: string;
    language: string;
}

export default class SMonaco extends Component<IProps, IState> {
    public monacoInstance: monaco.editor.IStandaloneCodeEditor | null = null;
    private containerElement: HTMLDivElement | null = null;

    constructor(props: IProps) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.initMonaco();
    }

    componentDidUpdate(prevProps: IProps) {
        if (this.props.value !== prevProps.value) {
            this.monacoInstance?.setValue(this.props.value);
        }

        if (this.props.language !== prevProps.language) {
            monaco.editor.setModelLanguage(this.monacoInstance?.getModel() as monaco.editor.ITextModel, this.props.language);
        }
    }

    componentWillUnmount() {
        this.destroyMonaco();
    }

    getCode() {
        return this.monacoInstance?.getValue();
    }

    setCode(code: string) {
        this.monacoInstance?.setValue(code);
    }

    initMonaco() {
        const { value, language } = this.props;

        this.monacoInstance = monaco.editor.create(this.containerElement as HTMLElement, {
            value,
            language,
            // 右边缩略图
            minimap: {
                enabled: false,
            },
            theme: 'vs-dark',
            automaticLayout: true,
        });
    }

    destroyMonaco() {
        if (this.monacoInstance) {
            this.monacoInstance.dispose();
            this.monacoInstance = null;
        }
    }

    render() {
        return (
            <div
                ref={(element) => { this.containerElement = element; }}
                style={{ width: '100%' }}
            />
        );
    }
}
