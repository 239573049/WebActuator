namespace WebActuator.WebAssembly;

public class WebActuatorApp
{
    private static IServiceProvider ServiceProvider;

    public static void Init(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider;
    }

    public static T? GetService<T>()
    {
        return ServiceProvider.GetService<T>();
    }

    public static IEnumerable<T> GetServices<T>()
    {
        return ServiceProvider.GetServices<T>();
    }

    public static T GetRequiredService<T>() where T : class
    {
        return ServiceProvider.GetRequiredService<T>();
    }
}
