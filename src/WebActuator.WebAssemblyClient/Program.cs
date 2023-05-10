using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using WebActuator.WebAssemblyClient;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

var writer = new WebActuator.WebWriter(Console.OpenStandardOutput());

Console.SetOut(writer);


builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddMasaBlazor(options =>
{
    options.ConfigureTheme(theme =>
    {
        theme.Dark = true;
    });
});
builder.Services.AddScoped<TryJSModule>();

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

await builder.Build().RunAsync();
