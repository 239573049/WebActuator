var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddMasaBlazor(options =>
{
    options.ConfigureTheme(theme =>
    {
        theme.Dark = true;
    });
});

await builder.Build().RunAsync();