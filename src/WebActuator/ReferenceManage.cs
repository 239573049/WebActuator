﻿using Microsoft.CodeAnalysis;
using System.Collections.Concurrent;

namespace WebActuator;

public static class ReferenceManage
{
    private static readonly ConcurrentDictionary<string, MetadataReference> _references = new();

    public static IEnumerable<MetadataReference> References => _references.Select(x => x.Value).ToArray();

    public static string[] ReferenceKeys => _references.Select(x => x.Key).ToArray();

    /// <summary>
    /// 新增引用
    /// </summary>
    /// <param name="name"></param>
    /// <param name="reference"></param>
    public static void AddReference(string name, MetadataReference reference)
    {
        _references.TryAdd(name, reference);
    }

    /// <summary>
    /// 卸载引用
    /// </summary>
    /// <param name="name"></param>
    public static void RemoveReference(string name)
    {
        _references.TryRemove(name, out _);
    }
}
