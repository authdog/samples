using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

var apiToken = RequireEnv("AUTHDOG_API_TOKEN");
var webhookSecret = RequireEnv("AUTHDOG_WEBHOOK_SECRET");
var tenantId = RequireEnv("AUTHDOG_TENANT_ID");
var environmentId = RequireEnv("AUTHDOG_ENVIRONMENT_ID");

var seen = new HashSet<string>();
var port = Environment.GetEnvironmentVariable("PORT");
if (string.IsNullOrWhiteSpace(port))
{
    port = "3000";
}
var listener = new HttpListener();
listener.Prefixes.Add($"http://localhost:{port}/");
listener.Prefixes.Add($"http://127.0.0.1:{port}/");
listener.Start();
Console.WriteLine($"authdog observability (csharp) on http://localhost:{port}");

while (true)
{
    var context = await listener.GetContextAsync();
    _ = Task.Run(() => Handle(context));
}

async Task Handle(HttpListenerContext context)
{
    var request = context.Request;
    var response = context.Response;
    var path = request.Url?.AbsolutePath ?? "/";

    try
    {
        if (request.HttpMethod == "GET" && path == "/")
        {
            await WriteJson(response, 200, new
            {
                sample = "authdog observability on csharp",
                endpoints = new[] { "POST /webhooks/authdog", "GET /events" },
            });
            return;
        }

        if (request.HttpMethod == "POST" && path == "/webhooks/authdog")
        {
            using var body = new MemoryStream();
            await request.InputStream.CopyToAsync(body);
            var raw = body.ToArray();
            var signature = request.Headers["X-Authdog-Signature"];
            if (!VerifySignature(raw, signature, webhookSecret))
            {
                await WriteJson(response, 401, new { error = "Invalid signature" });
                return;
            }

            var deliveryId = request.Headers["X-Authdog-Delivery-Id"];
            var isDuplicate = false;
            if (!string.IsNullOrWhiteSpace(deliveryId))
            {
                lock (seen)
                {
                    isDuplicate = !seen.Add(deliveryId);
                }
            }
            if (isDuplicate)
            {
                await WriteJson(response, 200, new { ok = true, duplicate = true });
                return;
            }

            using var eventDoc = JsonDocument.Parse(raw);
            var id = eventDoc.RootElement.TryGetProperty("id", out var idProp) ? idProp.GetString() : "";
            Console.WriteLine($"[authdog] {request.Headers["X-Authdog-Event-Type"]} ({deliveryId}): {id}");
            await WriteJson(response, 200, new { ok = true });
            return;
        }

        if (request.HttpMethod == "GET" && path == "/events")
        {
            try
            {
                await WriteRaw(response, 200, await ListEvents(tenantId, environmentId, apiToken));
            }
            catch (Exception ex)
            {
                await WriteJson(response, 502, new { error = ex.Message });
            }
            return;
        }

        await WriteJson(response, 404, new { error = "Not found" });
    }
    catch (Exception ex)
    {
        await WriteJson(response, 500, new { error = ex.Message });
    }
}

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

static async Task<string> ListEvents(string tenant, string environment, string token)
{
    var url =
        $"https://api.authdog.com/v1/tenants/{tenant}/environments/{environment}/events?limit=20";
    using var client = new HttpClient();
    using var req = new HttpRequestMessage(HttpMethod.Get, url);
    req.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
    using var res = await client.SendAsync(req);
    var body = await res.Content.ReadAsStringAsync();
    if (!res.IsSuccessStatusCode)
    {
        throw new HttpRequestException($"Events API {(int)res.StatusCode}: {body}");
    }

    var parsed = JsonNode.Parse(body) as JsonObject ?? [];
    var events = parsed["data"] as JsonArray ?? parsed["events"] as JsonArray ?? [];
    var after = parsed["list_metadata"]?["after"];
    var page = new JsonObject
    {
        ["count"] = events.Count,
        ["after"] = after is null ? null : after.DeepClone(),
        ["events"] = events.DeepClone(),
    };
    return page.ToJsonString();
}

static string RequireEnv(string name)
{
    var value = Environment.GetEnvironmentVariable(name);
    if (string.IsNullOrWhiteSpace(value))
    {
        Console.Error.WriteLine(
            "Set AUTHDOG_API_TOKEN, AUTHDOG_WEBHOOK_SECRET, AUTHDOG_TENANT_ID, and AUTHDOG_ENVIRONMENT_ID");
        Environment.Exit(1);
    }
    return value!;
}

static async Task WriteJson(HttpListenerResponse response, int status, object payload)
{
    await WriteRaw(response, status, JsonSerializer.Serialize(payload));
}

static async Task WriteRaw(HttpListenerResponse response, int status, string json)
{
    var bytes = Encoding.UTF8.GetBytes(json);
    response.StatusCode = status;
    response.ContentType = "application/json; charset=utf-8";
    response.ContentLength64 = bytes.Length;
    await response.OutputStream.WriteAsync(bytes);
    response.OutputStream.Close();
}
