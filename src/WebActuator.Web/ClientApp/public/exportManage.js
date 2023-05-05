import { dotnet } from './dotnet.js'

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

setModuleImports('exportManage.js', {
    ExportManage: {
        Exception: (json) => {
            console.log('Exception', json)
        },
        Diagnostic: (json) => {
            console.log('Diagnostic', JSON.parse(json))
        }
    }
});

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);

export function Using() {
    return exports.WebActuator.App.ExportManage.Using();
}

export function SetUsing() {
    exports.WebActuator.App.ExportManage.SetUsing();
}

export function RemoveUsing(using) {
    exports.WebActuator.App.ExportManage.RemoveUsing(using);
}

export function ClearUsing() {
    exports.WebActuator.App.ExportManage.ClearUsing();
}

export function LanguageVersion() {
    return exports.WebActuator.App.ExportManage.LanguageVersion();
}

export function SetLanguageVersion(languageVersion) {
    exports.WebActuator.App.ExportManage.SetLanguageVersion(languageVersion);
}

export function References() {
    return exports.WebActuator.App.ExportManage.References();
}

export async function SetReferences(references) {
    await exports.WebActuator.App.ExportManage.SetReferencesAsync(references);
}

export function TryCompile(source, concurrentBuild) {
    exports.WebActuator.App.ExportManage.TryCompile(source, concurrentBuild);
}

export async function RunSubmission(code, concurrentBuild) {
    exports.WebActuator.App.ExportManage.RunSubmission(code, concurrentBuild);
}