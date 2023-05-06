import { dotnet } from './dotnet.js'


window.OnWriteLine = (message) => {
    console.log('WriteLine', message)
}

export async function Init() {
    const { setModuleImports, getAssemblyExports, getConfig, Module } = await dotnet
        .withDiagnosticTracing(false)
        .withApplicationArgumentsFromQuery()
        .create();

    setModuleImports('exportManage.js', {
        ExportManage: {
            Exception: (json) => {
                console.log('Exception', json)
                try {
                    window.OnException(json)
                } catch (error) {
                }
            },
            Diagnostic: (json) => {
                try {
                    window.Diagnostic(json)
                } catch (error) {
                }
            }, WriteLine: (message) => {
                try {
                    window.OnWriteLine(message)
                } catch (error) {
                }
            }
        }
    });

    const config = getConfig();
    window.AssemblyExports = await getAssemblyExports(config.mainAssemblyName);

    await dotnet.run();
}

export function Using() {
    return window.AssemblyExports.WebActuator.App.ExportManage.Using();
}

export function SetUsing() {
    window.AssemblyExports.WebActuator.App.ExportManage.SetUsing();
}

export function RemoveUsing(using) {
    window.AssemblyExports.WebActuator.App.ExportManage.RemoveUsing(using);
}

export function ClearUsing() {
    window.AssemblyExports.WebActuator.App.ExportManage.ClearUsing();
}

export function LanguageVersion() {
    return window.AssemblyExports.WebActuator.App.ExportManage.LanguageVersion();
}

export function SetLanguageVersion(languageVersion) {
    window.AssemblyExports.WebActuator.App.ExportManage.SetLanguageVersion(languageVersion);
}

export function References() {
    return window.AssemblyExports.WebActuator.App.ExportManage.References();
}

export async function SetReferences(references) {
    await window.AssemblyExports.WebActuator.App.ExportManage.SetReferencesAsync(references);
}

export function TryCompile(source, concurrentBuild) {
    window.AssemblyExports.WebActuator.App.ExportManage.TryCompile(source, concurrentBuild);
}

export async function RunSubmission(code, concurrentBuild) {
    window.AssemblyExports.WebActuator.App.ExportManage.RunSubmission(code, concurrentBuild);
}