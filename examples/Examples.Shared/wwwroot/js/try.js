function init() {
    initLanguages();
    var splitter = document.getElementById('splitter');
    var code = document.getElementById('code');
    var render = document.getElementById('render');

    var mouseDownHandler = function (e) {
        // Prevent text selection
        e.preventDefault();

        // Set initial positions
        var startPos = e.clientX;
        var startLeftWidth = code.offsetWidth;
        var startRightWidth = render.offsetWidth;

        // Define the mouse move handler
        var mouseMoveHandler = function (e) {
            // Calculate the new widths
            var newLeftWidth = startLeftWidth + (e.clientX - startPos);
            var newRightWidth = startRightWidth - (e.clientX - startPos);

            // Update the widths
            code.style.width = newLeftWidth + 'px';
            render.style.width = newRightWidth + 'px';
        };

        // Define the mouse up handler
        var mouseUpHandler = function () {
            // Remove the handlers
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        // Add the handlers
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    splitter.addEventListener('mousedown', mouseDownHandler);
}
async function sendRequest(type, request) {
    let endPoint;
    switch (type) {
        case 'complete': endPoint = 'https://web-actuator-api.tokengo.top:8843/completion/complete'; break;
        case 'signature': endPoint = 'https://web-actuator-api.tokengo.top:8843/completion/signature'; break;
        case 'hover': endPoint = 'https://web-actuator-api.tokengo.top:8843/completion/hover'; break;
        case 'codeCheck': endPoint = 'https://web-actuator-api.tokengo.top:8843/completion/codeCheck'; break;
    }
    return await axios.post(endPoint, JSON.stringify(request))
}

function initLanguages() {

    var assemblies = ['System.Text.Json.dll'];

    monaco.languages.registerCompletionItemProvider('csharp', {
        triggerCharacters: [".", " "],
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

            let signatureHelp = {};
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

        var handle = null;
        model.onDidChangeContent(() => {
            monaco.editor.setModelMarkers(model, 'csharp', []);
            clearTimeout(handle);
            handle = setTimeout(() => validate(), 500);
        });
        validate();
    });
}

function setValue(key, value) {
    localStorage.setItem(key, value);
}

function getValue(key) {
    let result = localStorage.getItem(key);
    if (result) {
        return result;
    }
    return "";
}

function removeValue(key) {
    localStorage.removeItem(key);
}

function renderScroll() {
    var element = document.getElementById("render");
    element.scrollTop = element.scrollHeight;
}

function setClipboard(value) {

    // 创建一个临时的textarea元素
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = value;

    // 将textarea元素添加到DOM中
    document.body.appendChild(tempTextArea);

    // 选择文本
    tempTextArea.select();

    // 复制文本到剪贴板
    document.execCommand('copy');

    // 删除临时的textarea元素
    document.body.removeChild(tempTextArea);
}

function getHref() {
    return window.location.href;
}

export {
    init,
    renderScroll,
    setValue,
    getValue,
    removeValue,
    setClipboard,
    getHref
}