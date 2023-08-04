
window.OnDiagnostic = (message) => {
    try {
        window.Diagnostic(message)
    } catch (error) {
    }
}

window.OnWriteLine = (value) => {
    try {
        window.WriteLine(value)
    } catch (error) {

    }
}
window.OnException = (value) => {
    try {
        window.Exception(value)
    } catch (error) {

    }
}

export async function Using() {
    return await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'Using');
}

export async function SetUsing() {
    await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'SetUsing');
}

export async function RemoveUsing(using) {
    await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'RemoveUsing', using);
}

export async function ClearUsing() {
    await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'ClearUsing');
}

export async function LanguageVersion() {
    return await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'LanguageVersion');
}

export async function SetLanguageVersion(languageVersion) {
    await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'SetLanguageVersion', languageVersion);
}

export async function References() {
    return await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'References');
}

export async function SetReferences(references) {
    await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'SetReferencesAsync', references);
}

export async function TryCompile(source, concurrentBuild) {
    await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'TryCompile', source, concurrentBuild);
}

export async function RunSubmission(code, concurrentBuild) {
    await DotNet.invokeMethodAsync('WebActuator.WebAssembly', 'RunSubmission', code, concurrentBuild);
}