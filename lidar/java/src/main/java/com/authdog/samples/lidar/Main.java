package com.authdog.samples.lidar;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
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
  private static final Set<String> MARKED = ConcurrentHashMap.newKeySet();

  private Main() {}

  public static void main(String[] args) throws Exception {
    String webhookSecret = System.getenv("AUTHDOG_WEBHOOK_SECRET");
    if (webhookSecret == null || webhookSecret.isBlank()) {
      System.err.println("Set AUTHDOG_WEBHOOK_SECRET");
      System.exit(1);
    }

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
              "{\"sample\":\"authdog lidar on java\","
                  + "\"endpoints\":[\"POST /webhooks/authdog\","
                  + "\"GET /sensitive (X-Demo-User)\","
                  + "\"POST /step-up/complete (X-Demo-User)\"]}");
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
          String subject = eventSubject(event);
          if (subject != null) {
            MARKED.add(subject);
            System.out.println(
                "[authdog] " + header(exchange, "X-Authdog-Event-Type") + ": marked " + subject
                    + " for step-up");
          }
          write(exchange, 200, "{\"ok\":true}");
        });
    server.createContext(
        "/sensitive",
        exchange -> {
          if (!"GET".equals(exchange.getRequestMethod())) {
            write(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
          }
          String subject = header(exchange, "X-Demo-User");
          if (subject == null || subject.isBlank()) {
            write(exchange, 401, "{\"error\":\"Unauthenticated\"}");
            return;
          }
          if (MARKED.contains(subject)) {
            write(
                exchange,
                428,
                "{\"error\":\"Step-up required\",\"challenge\":\"/step-up/complete\","
                    + "\"reason\":\"A security-relevant event was recorded for this subject.\"}");
            return;
          }
          write(exchange, 200, "{\"secret\":\"the sensitive resource\"}");
        });
    server.createContext(
        "/step-up/complete",
        exchange -> {
          if (!"POST".equals(exchange.getRequestMethod())) {
            write(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
          }
          String subject = header(exchange, "X-Demo-User");
          if (subject == null || subject.isBlank()) {
            write(exchange, 401, "{\"error\":\"Unauthenticated\"}");
            return;
          }
          MARKED.remove(subject);
          write(exchange, 200, "{\"ok\":true}");
        });
    server.start();
    System.out.println("authdog lidar (java) on http://localhost:" + port);
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

  private static String eventSubject(JsonNode event) {
    JsonNode userId = event.path("data").path("user").path("id");
    if (userId.isTextual()) {
      return userId.asText();
    }
    JsonNode subject = event.path("data").path("subject");
    return subject.isTextual() ? subject.asText() : null;
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
