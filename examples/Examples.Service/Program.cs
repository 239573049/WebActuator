using System.Diagnostics;
using System.Text.Json;
using Examples.Service.MonacoRoslynCompletionProvider;
using Examples.Service.MonacoRoslynCompletionProvider.Api;
using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMemoryCache()
    .AddCors(options =>
    {
        options.AddPolicy("CorsPolicy", corsBuilder =>
        {
            corsBuilder.SetIsOriginAllowed((string _) => true).AllowAnyMethod().AllowAnyHeader()
                .AllowCredentials();
        });
    });

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.Use((async (context, next) =>
{
    if (context.Request.Path == "/")
    {
        // 获取wwwroot下默认'index.html'
        context.Request.Path = "/index.html";
        await next(context);
    }
    else
    {
        await next(context);
    }
} ));

app.UseCors("CorsPolicy");

var types = new FileExtensionContentTypeProvider();

types.Mappings.Add(".dll", "application/octet-stream");
types.Mappings.Add(".br", "application/octet-stream");

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = types,
});


app.MapPost("/completion/{0}", async (e) =>
{
    using var reader = new StreamReader(e.Request.Body);
    string text = await reader.ReadToEndAsync();
    if (text != null)
    {
        if (e.Request.Path.Value?.EndsWith("complete") == true)
        {
            var tabCompletionRequest = JsonSerializer.Deserialize<TabCompletionRequest>(text);
            var tabCompletionResults = await CompletitionRequestHandler.Handle(tabCompletionRequest);
            await JsonSerializer.SerializeAsync(e.Response.Body, tabCompletionResults);
            return;
        }
        else if (e.Request.Path.Value?.EndsWith("signature") == true)
        {
            var signatureHelpRequest = JsonSerializer.Deserialize<SignatureHelpRequest>(text);
            var signatureHelpResult = await CompletitionRequestHandler.Handle(signatureHelpRequest);
            await JsonSerializer.SerializeAsync(e.Response.Body, signatureHelpResult);
            return;
        }
        else if (e.Request.Path.Value?.EndsWith("hover") == true)
        {
            var hoverInfoRequest = JsonSerializer.Deserialize<HoverInfoRequest>(text);
            var hoverInfoResult = await CompletitionRequestHandler.Handle(hoverInfoRequest);
            await JsonSerializer.SerializeAsync(e.Response.Body, hoverInfoResult);
            return;
        }
        else if (e.Request.Path.Value?.EndsWith("codeCheck") == true)
        {
            var codeCheckRequest = JsonSerializer.Deserialize<CodeCheckRequest>(text);
            var codeCheckResults = await CompletitionRequestHandler.Handle(codeCheckRequest);
            await JsonSerializer.SerializeAsync(e.Response.Body, codeCheckResults);
            return;
        }
    }

    e.Response.StatusCode = 405;
});

app.Run();
 