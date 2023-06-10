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

var app = builder.AddServices();

app.UseCors("CorsPolicy");

app.Run();
 