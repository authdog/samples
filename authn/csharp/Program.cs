using Authdog;
using Authdog.Exceptions;
using Authdog.Types;

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

    var email = user.Emails?.FirstOrDefault()?.Value;

    Console.WriteLine("Authenticated:");
    Console.WriteLine($"  id:    {user.Id}");
    Console.WriteLine($"  name:  {user.DisplayName}");
    Console.WriteLine($"  email: {email}");
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
