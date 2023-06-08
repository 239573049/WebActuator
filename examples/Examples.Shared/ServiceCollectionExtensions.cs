using WebActuator.WebAssemblyClient;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        
        public static IServiceCollection AddShared(this IServiceCollection services,string baseAddress)
        {
            services.AddMasaBlazor(options =>
            {
                options.ConfigureTheme(theme =>
                {
                    theme.Dark = true;
                });
            });
            services.AddScoped<TryJSModule>();

            services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(baseAddress) });

            return services;
        }
    }
}
