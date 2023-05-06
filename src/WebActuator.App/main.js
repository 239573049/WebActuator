import * as exportManage from './exportManage.js'

window.exportManage = exportManage;


let assembly = ["https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Buffers.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Collections.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Core.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Linq.Expressions.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Linq.Parallel.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/mscorlib.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Linq.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Console.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Runtime.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Net.Http.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Private.CoreLib.dll",
    "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Console.dll"];

await window.exportManage.Init();

await window.exportManage.SetReferences(assembly);

window.exportManage.RunSubmission(`Console.WriteLine("Hello World");`, false);