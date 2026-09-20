using System.Net.Http;
using Authdog;
using Authdog.Exceptions;
using Newtonsoft.Json.Linq;

const string requiredPermission = "invoices:read";

if (args.Length != 1 || string.IsNullOrWhiteSpace(args[0]))
{
    Console.Error.WriteLine("Usage: dotnet run -- <access-token>");
    return 1;
}

var token = args[0];

using var client = new AuthdogClient("https://api.authdog.com");

try
{
    var userInfo = await client.GetUserInfoAsync(token);
    var user = userInfo.User;
    if (user is null)
    {
        Console.Error.WriteLine("401 Unauthorized: token did not resolve to a user.");
        return 1;
    }

    // Typed User does not model permissions. Same official userinfo
    // call, kept as JObject so the claim is still readable.
    var envelope = await client.RequestAsync<JObject>(
        HttpMethod.Get,
        "/v1/userinfo",
        accessToken: token);
    var permissions = PermissionsOf(envelope?["user"]?["permissions"]);
    if (!permissions.Contains(requiredPermission))
    {
        Console.WriteLine($"403 Forbidden: missing {requiredPermission}");
        return 0;
    }

    Console.WriteLine($"200 OK: {user.DisplayName} may read invoices.");
    return 0;
}
catch (AuthenticationException ex)
{
    Console.Error.WriteLine($"401 Unauthorized: {ex.Message}");
    return 1;
}
catch (ApiException ex)
{
    Console.Error.WriteLine($"401 Unauthorized: {ex.Message}");
    return 1;
}

static List<string> PermissionsOf(JToken? node)
{
    if (node is not JArray array)
    {
        return [];
    }

    return array
        .Where(item => item.Type == JTokenType.String)
        .Select(item => item.ToString())
        .ToList();
}
