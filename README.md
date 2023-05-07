# WebActuator

## 介绍WebActuator

基于.NET Core WebAssembly实现的在线编译c#的功能。提供了c#的API，也封装了js的API，让js更容易嵌入Web 编译的功能！

### 使用SDK功能

项目将简单的介绍在`JavaScript`中使用动态编辑c#的`SDK`。

实现我们需要拉去SDK的代码

```shell
git clone https://github.com/239573049/WebActuator.git
```

然后使用`vs`打开`WebActuator.sln`解决方案，

选中`WebActuator.WebAssembly`项目进行发布

发布以后打开发布的文件夹，打开`_framework` 文件夹，然后删除文件夹下面的`*.gz`文件，因为默认使用的`br`压缩，所以不需要使用`*.gz`

下面是发布的根目录，我们需要复制除了`index.html`的文件到我们自己的项目当中

![image](https://user-images.githubusercontent.com/61819790/236690671-cc3f9556-6db1-46cd-b8da-75d1da32816c.png)

嵌入项目截图

![image](https://user-images.githubusercontent.com/61819790/236690673-da9fb86a-abe9-4e8c-88df-615da17969a6.png)

打开我们的`index.html`

```html

  <script src="_framework/blazor.webassembly.js" autostart="false"></script>
  <script type="module">
    import { BrotliDecode } from './decode.min.js';
    import * as exportManage from './exportManage.js';
    window.exportManage = exportManage;
    Blazor.start({
      loadBootResource: function (type, name, defaultUri, integrity) {
          if (type !== 'dotnetjs') {
          return (async function () {
            const response = await fetch(defaultUri + '.br', { cache: 'no-cache' });
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            const originalResponseBuffer = await response.arrayBuffer();
            const originalResponseArray = new Int8Array(originalResponseBuffer);
            const decompressedResponseArray = BrotliDecode(originalResponseArray);
            const contentType = type === 
              'dotnetwasm' ? 'application/wasm' : 'application/octet-stream';
            return new Response(decompressedResponseArray, 
              { headers: { 'content-type': contentType } });
          })();
        }
      }
    });
  </script>
```

将以上代码添加的我们项目的`index.html`中

然后在我们需要实现的界面进行编译初始化

```js
let assemblys=["https://assembly.tokengo.top:8843/System.dll",
      "https://assembly.tokengo.top:8843/System.Buffers.dll",
      "https://assembly.tokengo.top:8843/System.Collections.dll",
      "https://assembly.tokengo.top:8843/System.Core.dll",
      "https://assembly.tokengo.top:8843/System.Linq.Expressions.dll",
      "https://assembly.tokengo.top:8843/System.Linq.Parallel.dll",
      "https://assembly.tokengo.top:8843/mscorlib.dll",
      "https://assembly.tokengo.top:8843/System.Linq.dll",
      "https://assembly.tokengo.top:8843/System.Console.dll",
      "https://assembly.tokengo.top:8843/System.Runtime.dll",
      "https://assembly.tokengo.top:8843/System.Net.Http.dll",
      "https://assembly.tokengo.top:8843/System.Private.CoreLib.dll",
      "https://assembly.tokengo.top:8843/System.Console.dll"]
   await window.exportManage.SetReferences(assemblys);
```

使用` await window.exportManage.SetReferences(assemblys);`提供默认需要编译的程序集

` await window.exportManage.SetReferences(assemblys);`的代码是在`exportManage.js`中提供的`api`

这是用于初始化编译所需要的程序集，基本默认就这些，当然也可以添加其他的程序集，

监听`Console`输出

```js

window.OnWriteLine = (message: string) => {
            console.log(message);
    }

window.OnDiagnostic = (json: string) => {
		console.log(json);
    }
```

上面是`SDK`提供的控制台拦截器，

`OnWriteLine`是控制台的输出

`OnDiagnostic`是早编译的错误和日志

创建了俩个监听器然后就可以调用编辑方法了，调用

```js
await window.exportManage.RunSubmission(`Console.WriteLine("hello world");`, false);
```

执行编译，然后我们就可以在浏览器控制台中看到编译输出了

如果你想要重复写那么多代码可以修改`WebActuator.Web`项目当中的`ClientApp`的代码

项目提供了基于`monaco`实现的简单的编辑器。

`APIs`列表：

```js
// 获取当前引用
window.exportManage.Using()

// 添加默认引用
window.exportManage.SetUsing(using)
 
 // 删除指定引用
window.exportManage.RemoveUsing(using)

// 清空全局引用
window.exportManage.ClearUsing()

// 获取当前编译的语言版本
window.exportManage.LanguageVersion()

// 修改编译的语言版本
window.exportManage.SetLanguageVersion(languageVersion)

// 获取当前依赖的程序集URL
window.exportManage.References()

// 添加编译依赖的程序集
window.exportManage.SetReferences(references)

// 只编译代码
window.exportManage.TryCompile(source, concurrentBuild)

// 执行编译代码
window.exportManage.RunSubmission(code, concurrentBuild)
```

以上只是当前版本的`APIs`，后续还会优化并且更新，打造一个好用方便的在线编译c#代码的编辑器。

## 结尾

来自token的分享

仓库地址：https://github.com/239573049/WebActuator 欢迎PR和star

技术交流群：737776595

