using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.JSInterop;
using WebActuator.WebAssembly;

var builder = WebAssemblyHostBuilder.CreateDefault(args);


var app=  builder.Build();

WebActuatorApp.Init(app.Services);

var writer = new WebActuator.WebWriter(Console.OpenStandardOutput(), WebActuatorApp.GetRequiredService<IJSRuntime>());

Console.SetOut(writer);

await app.RunAsync();
