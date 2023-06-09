using Microsoft.Extensions.Caching.Memory;

namespace Examples.Service.Services
{
    public abstract class BaseService<T> : ServiceBase where T : class
    {
        internal ILogger<T> logger => GetRequiredService<ILogger<T>>();

        internal IMemoryCache memoryCache => GetRequiredService<IMemoryCache>();
    }
}
