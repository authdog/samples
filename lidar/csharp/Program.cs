using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

var webhookSecret = Environment.GetEnvironmentVariable("AUTHDOG_WEBHOOK_SECRET");
if (string.IsNullOrWhiteSpace(webhookSecret))
{
    Console.Error.WriteLine("Set AUTHDOG_WEBHOOK_SECRET");
    return 1;
}

var seen = new HashSet<string>();
var marked = new HashSet<string>();

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
builder.Logging.ClearProviders();
var app = builder.Build();

app.MapGet("/", () => Results.Json(new
{
    sample = "authdog lidar on csharp",
    endpoints = new[]
    {
        "POST /webhooks/authdog",
        "GET /sensitive (X-Demo-User)",
        "POST /step-up/complete (X-Demo-User)",
    },
}));

app.MapPost("/webhooks/authdog", async (HttpRequest request) =>
{
    using var body = new MemoryStream();
    await request.Body.CopyToAsync(body);
    var raw = body.ToArray();
    if (!VerifySignature(raw, request.Headers["X-Authdog-Signature"], webhookSecret))
    {
        return Results.Json(new { error = "Invalid signature" }, statusCode: 401);
    }

    var deliveryId = request.Headers["X-Authdog-Delivery-Id"].ToString();
    lock (seen)
    {
        if (!string.IsNullOrWhiteSpace(deliveryId) && !seen.Add(deliveryId))
        {
            return Results.Json(new { ok = true, duplicate = true });
        }
    }

    using var eventDoc = JsonDocument.Parse(raw);
    var subject = EventSubject(eventDoc.RootElement);
    if (subject is not null)
    {
        lock (marked)
        {
            marked.Add(subject);
        }
        Console.WriteLine($"[authdog] {request.Headers["X-Authdog-Event-Type"]}: marked {subject} for step-up");
    }
    return Results.Json(new { ok = true });
});

app.MapGet("/sensitive", (HttpRequest request) =>
{
    var subject = request.Headers["X-Demo-User"].ToString();
    if (string.IsNullOrWhiteSpace(subject))
    {
        return Results.Json(new { error = "Unauthenticated" }, statusCode: 401);
    }
    lock (marked)
    {
        if (marked.Contains(subject))
        {
            return Results.Json(new
            {
                error = "Step-up required",
                challenge = "/step-up/complete",
                reason = "A security-relevant event was recorded for this subject.",
            }, statusCode: 428);
        }
    }
    return Results.Json(new { secret = "the sensitive resource" });
});

app.MapPost("/step-up/complete", (HttpRequest request) =>
{
    var subject = request.Headers["X-Demo-User"].ToString();
    if (string.IsNullOrWhiteSpace(subject))
    {
        return Results.Json(new { error = "Unauthenticated" }, statusCode: 401);
    }
    lock (marked)
    {
        marked.Remove(subject);
    }
    return Results.Json(new { ok = true });
});

app.Run();
return 0;

static bool VerifySignature(byte[] rawBody, string? header, string secret)
{
    if (string.IsNullOrWhiteSpace(header))
    {
        return false;
    }

    var parts = new Dictionary<string, string>();
    foreach (var kv in header.Split(','))
    {
        var pair = kv.Trim().Split('=', 2);
        if (pair.Length == 2)
        {
            parts[pair[0]] = pair[1];
        }
    }

    if (!parts.TryGetValue("t", out var t) || !parts.TryGetValue("v1", out var v1))
    {
        return false;
    }
    if (!long.TryParse(t, out var timestamp))
    {
        return false;
    }
    if (Math.Abs(DateTimeOffset.UtcNow.ToUnixTimeSeconds() - timestamp) > 300)
    {
        return false;
    }

    var key = Encoding.UTF8.GetBytes(secret);
    var prefix = Encoding.UTF8.GetBytes(t + ".");
    byte[] expected;
    using (var hmac = new HMACSHA256(key))
    {
        hmac.TransformBlock(prefix, 0, prefix.Length, null, 0);
        hmac.TransformFinalBlock(rawBody, 0, rawBody.Length);
        expected = hmac.Hash!;
    }

    byte[] received;
    try
    {
        received = Convert.FromHexString(v1);
    }
    catch (FormatException)
    {
        return false;
    }

    return expected.Length == received.Length
        && CryptographicOperations.FixedTimeEquals(expected, received);
}

static string? EventSubject(JsonElement eventDoc)
{
    if (eventDoc.TryGetProperty("data", out var data))
    {
        if (data.TryGetProperty("user", out var user)
            && user.TryGetProperty("id", out var id)
            && id.ValueKind == JsonValueKind.String)
        {
            return id.GetString();
        }
        if (data.TryGetProperty("subject", out var subject)
            && subject.ValueKind == JsonValueKind.String)
        {
            return subject.GetString();
        }
    }
    return null;
}
