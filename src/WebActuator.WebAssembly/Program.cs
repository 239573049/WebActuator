using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using WebActuator.WebAssembly;

var builder = WebAssemblyHostBuilder.CreateDefault(args);


var app = builder.Build();

WebActuatorApp.Init(app.Services);

await app.RunAsync();