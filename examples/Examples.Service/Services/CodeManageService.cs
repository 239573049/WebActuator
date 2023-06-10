using Examples.Service.Models;
using Masa.BuildingBlocks.Data;
using Microsoft.Extensions.Caching.Memory;
using System.Threading.Channels;

namespace Examples.Service.Services
{
    public class CodeManageService : BaseService<CodeManageService>
    {
        private static readonly Channel<string> channel;

        static CodeManageService()
        {
            // 定义缓存最大数量v
            channel = Channel.CreateBounded<string>(new BoundedChannelOptions(50000)
            {
                FullMode = BoundedChannelFullMode.DropOldest
            }, item =>
            {
                var cache = MasaApp.GetRequiredService<IMemoryCache>();
                cache.Remove(item);
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("删除缓存key:" + item);
                Console.ResetColor();
            });
        }

        public async Task<string> CreateCodeAsync(CreateCodeModel code)
        {
            var key = Guid.NewGuid().ToString("N");
            var entry = memoryCache.GetOrCreate(key, cache => code.Code);
            await channel.Writer.WriteAsync(key);

            return await Task.FromResult(key);
        }

        public async Task<string> GetCodeAsync(string key)
        {
            memoryCache.TryGetValue(key, out string? code);

            return await Task.FromResult(code ?? string.Empty);
        }
    }
}