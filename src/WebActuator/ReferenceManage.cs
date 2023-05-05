using Microsoft.CodeAnalysis;
using System.Collections.Concurrent;

namespace WebActuator;
public class ReferenceManage
{
    private readonly static ConcurrentDictionary<string, MetadataReference> _references = new();

    public static MetadataReference[] References => _references.Select(x => x.Value).ToArray();

    public static string[] ReferenceKeys => _references.Select(x => x.Key).ToArray();

    public static void AddReference(string name, MetadataReference reference)
    {
        _references.TryAdd(name, reference);
    }

    public static void RemoveReference(string name)
    {
        _references.TryRemove(name, out _);
    }
}
