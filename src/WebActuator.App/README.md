## .NET WebAssembly Browser app

��װ`WebAssembly`ģ��

```
dotnet new install Microsoft.NET.Runtime.WebAssembly.Templates
```

## Build

����Դ�Visual Studio���������й���Ӧ�ó���:

```shell
dotnet build -c Debug/Release
```

����Ӧ�ó���󣬽����' bin/$(Configuration)/net7.0/browser-wasm/AppBundle 'Ŀ¼�С�

## Run

����Դ�Visual Studio���������й���Ӧ�ó���:

```shell
dotnet run -c Debug/Release
```

��������Դ�AppBundleĿ¼�����κξ�̬�ļ�������:

```shell
dotnet tool install dotnet-serve
dotnet serve -d:bin/$(Configuration)/net7.0/browser-wasm/AppBundle
```
## Build

����Ӧ�ó������ڲ���

```shell
dotnet publish -c Release 
```
