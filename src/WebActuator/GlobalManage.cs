using Microsoft.CodeAnalysis.CSharp;
using System.Runtime.InteropServices.JavaScript;

namespace WebActuator;
public partial class GlobalManage
{
    #region Using Setting
    private static readonly List<string> _usings = new(50)
    {
        "System","System.Collections.Generic","System.Net.Http","System.Console","System.Diagnostics","System.Dynamic","System.Linq","System.Linq.Expressions","System.Text","System.Threading.Tasks"
    };

    public static string[] Using() => _usings.ToArray();

    public static void AddUsing(params string[] @usings)
    {
        foreach (var @using in @usings)
        {
            if (!_usings.Contains(@using))
            {
                _usings.Add(@using);
            }
        }
    }

    public static void RemoveUsing(string @using)
    {
        _usings.Remove(@using);
    }

    public static void ClearUsing()
    {
        _usings.Clear();
    }

    #endregion

    #region Language Version Setting

    private static LanguageVersion languageVersion = LanguageVersion.CSharp9;

    public static LanguageVersion LanguageVersion => languageVersion;

    public static void SetLanguageVersion(LanguageVersion languageVersion)
    {
        GlobalManage.languageVersion = languageVersion;
    }

    #endregion

    #region CSharp Compilation 

    private static CSharpCompilation _CSharpCompilation;

    public static CSharpCompilation CSharpCompilation => _CSharpCompilation;

    public static void SetCSharpCompilation(CSharpCompilation cSharpCompilation)
    {
        _CSharpCompilation = cSharpCompilation;
    }

    #endregion

    public static HttpClient HttpClient { get; private set; } = new();

    public static void SetHttpClient(HttpClient httpClient)
    {
        GlobalManage.HttpClient = httpClient;
    }
}
