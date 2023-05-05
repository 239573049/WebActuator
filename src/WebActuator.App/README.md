## .NET WebAssembly Browser app

安装`WebAssembly`模板

```
dotnet new install Microsoft.NET.Runtime.WebAssembly.Templates
```

## Build

你可以从Visual Studio或命令行中构建应用程序:

```shell
dotnet build -c Debug/Release
```

构建应用程序后，结果在' bin/$(Configuration)/net7.0/browser-wasm/AppBundle '目录中。

## Run

你可以从Visual Studio或命令行中构建应用程序:

```shell
dotnet run -c Debug/Release
```

或者你可以从AppBundle目录启动任何静态文件服务器:

```shell
dotnet tool install dotnet-serve
dotnet serve -d:bin/$(Configuration)/net7.0/browser-wasm/AppBundle
```
## Build

构建应用程序用于部署

```shell
dotnet publish -c Release 
```
