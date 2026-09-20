package com.authdog.samples.observability;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public final class Main {
  private static final Duration REPLAY_TOLERANCE = Duration.ofMinutes(5);
  private static final ObjectMapper JSON = new ObjectMapper();
  private static final Set<String> SEEN = ConcurrentHashMap.newKeySet();

  private Main() {}

  public static void main(String[] args) throws Exception {
    String apiToken = env("AUTHDOG_API_TOKEN");
    String webhookSecret = env("AUTHDOG_WEBHOOK_SECRET");
    String tenantId = env("AUTHDOG_TENANT_ID");
    String environmentId = env("AUTHDOG_ENVIRONMENT_ID");

    int port = 3000;
    String portEnv = System.getenv("PORT");
    if (portEnv != null && !portEnv.isBlank()) {
      port = Integer.parseInt(portEnv);
    }
    HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
    server.createContext(
        "/",
        exchange -> {
          if (!"GET".equals(exchange.getRequestMethod())
              || !"/".equals(exchange.getRequestURI().getPath())) {
            write(exchange, 404, "{\"error\":\"Not found\"}");
            return;
          }
          write(
              exchange,
              200,
              "{\"sample\":\"authdog observability on java\","
                  + "\"endpoints\":[\"POST /webhooks/authdog\",\"GET /events\"]}");
        });
    server.createContext(
        "/webhooks/authdog",
        exchange -> {
          if (!"POST".equals(exchange.getRequestMethod())) {
            write(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
          }
          byte[] raw = exchange.getRequestBody().readAllBytes();
          if (!verifySignature(raw, header(exchange, "X-Authdog-Signature"), webhookSecret)) {
            write(exchange, 401, "{\"error\":\"Invalid signature\"}");
            return;
          }
          String deliveryId = header(exchange, "X-Authdog-Delivery-Id");
          if (deliveryId != null && !deliveryId.isBlank() && !SEEN.add(deliveryId)) {
            write(exchange, 200, "{\"ok\":true,\"duplicate\":true}");
            return;
          }
          JsonNode event = JSON.readTree(raw);
          System.out.println(
              "[authdog] "
                  + header(exchange, "X-Authdog-Event-Type")
                  + " ("
                  + deliveryId
                  + "): "
                  + event.path("id").asText(""));
          write(exchange, 200, "{\"ok\":true}");
        });
    server.createContext(
        "/events",
        exchange -> {
          if (!"GET".equals(exchange.getRequestMethod())) {
            write(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
          }
          try {
            write(exchange, 200, listEvents(tenantId, environmentId, apiToken));
          } catch (Exception e) {
            ObjectNode err = JSON.createObjectNode();
            err.put("error", e.getMessage() == null ? "Events API failed" : e.getMessage());
            write(exchange, 502, JSON.writeValueAsString(err));
          }
        });
    server.start();
    System.out.println("authdog observability (java) on http://localhost:" + port);
  }

  static boolean verifySignature(byte[] rawBody, String header, String secret) {
    if (header == null || header.isBlank()) {
      return false;
    }
    Map<String, String> parts = new java.util.HashMap<>();
    for (String kv : header.split(",")) {
      String[] pair = kv.trim().split("=", 2);
      if (pair.length == 2) {
        parts.put(pair[0], pair[1]);
      }
    }
    String t = parts.get("t");
    String v1 = parts.get("v1");
    if (t == null || v1 == null) {
      return false;
    }
    long timestamp;
    try {
      timestamp = Long.parseLong(t);
    } catch (NumberFormatException e) {
      return false;
    }
    Duration age = Duration.between(Instant.ofEpochSecond(timestamp), Instant.now()).abs();
    if (age.compareTo(REPLAY_TOLERANCE) > 0) {
      return false;
    }
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      mac.update((t + ".").getBytes(StandardCharsets.UTF_8));
      mac.update(rawBody);
      byte[] expected = mac.doFinal();
      byte[] received = fromHex(v1);
      return expected.length == received.length && MessageDigest.isEqual(expected, received);
    } catch (Exception e) {
      return false;
    }
  }

  private static String listEvents(String tenantId, String environmentId, String apiToken)
      throws IOException, InterruptedException {
    String url =
        "https://api.authdog.com/v1/tenants/"
            + tenantId
            + "/environments/"
            + environmentId
            + "/events?limit=20";
    HttpRequest request =
        HttpRequest.newBuilder(URI.create(url))
            .header("Authorization", "Bearer " + apiToken)
            .GET()
            .build();
    HttpResponse<String> response =
        HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() >= 300) {
      throw new IOException("Events API " + response.statusCode() + ": " + response.body());
    }
    JsonNode body = JSON.readTree(response.body());
    JsonNode events = body.get("data");
    if (events == null || !events.isArray()) {
      events = body.get("events");
    }
    if (events == null || !events.isArray()) {
      events = JSON.createArrayNode();
    }
    JsonNode after = body.path("list_metadata").get("after");
    ObjectNode page = JSON.createObjectNode();
    page.put("count", ((ArrayNode) events).size());
    page.set("after", after == null ? JSON.nullNode() : after);
    page.set("events", events);
    return JSON.writeValueAsString(page);
  }

  private static byte[] fromHex(String hex) {
    if (hex.length() % 2 != 0) {
      throw new IllegalArgumentException("hex");
    }
    byte[] out = new byte[hex.length() / 2];
    for (int i = 0; i < hex.length(); i += 2) {
      out[i / 2] = (byte) Integer.parseInt(hex.substring(i, i + 2), 16);
    }
    return out;
  }

  private static String env(String name) {
    String value = System.getenv(name);
    if (value == null || value.isBlank()) {
      System.err.println(
          "Set AUTHDOG_API_TOKEN, AUTHDOG_WEBHOOK_SECRET, AUTHDOG_TENANT_ID, and AUTHDOG_ENVIRONMENT_ID");
      System.exit(1);
    }
    return value;
  }

  private static String header(HttpExchange exchange, String name) {
    return exchange.getRequestHeaders().getFirst(name);
  }

  private static void write(HttpExchange exchange, int status, String json) throws IOException {
    byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
    exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
    exchange.sendResponseHeaders(status, bytes.length);
    try (OutputStream out = exchange.getResponseBody()) {
      out.write(bytes);
    }
  }
}
