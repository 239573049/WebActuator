
using System.IO;
using System.Text.Json;
using System.Net.Http;
using System.Text.Json.Serialization;

var json = new
        {
            model = "gpt-3.5-turbo",
            max_tokens = 1000,
            temperature = 0,
            stream = true,
            messages = new object[]
            {
                new
                {
                    role ="user",
                    content = "c#的数据结构"
                }
            }
        };


var response = await HttpRequestRaw("https://open666.cn/api/v1/Chats/SendMessage",json);

var line="";
var reader = new StreamReader(await response.Content.ReadAsStreamAsync());
while (( line = reader.ReadLine()) != null)
{
    Console.WriteLine(line);
}

static async Task<HttpResponseMessage> HttpRequestRaw(string url, object postData = null)
{
    HttpRequestMessage req = new(HttpMethod.Post, url);

    if (postData != null)
    {
        if (postData is HttpContent data)
        {
            req.Content = data;
        }
        else
        {
            string jsonContent = JsonSerializer.Serialize(postData, new JsonSerializerOptions()
            {
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            });
            var stringContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            req.Content = stringContent;
        }
    }

    var http = new HttpClient();

    req.Headers.Remove("Authorization");
    req.Headers.Add("Authorization", "Bearer 您的token");
    var response = await http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead);

    if (response.IsSuccessStatusCode)
    {
        return response;
    }

    throw new HttpRequestException();
}

