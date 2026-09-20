package com.authdog.samples.authz;

import com.authdog.AuthdogClient;
import com.authdog.exceptions.ApiException;
import com.authdog.exceptions.AuthenticationException;
import com.authdog.types.User;
import com.authdog.types.UserInfoResponse;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;

public final class Main {
  private static final String REQUIRED_PERMISSION = "invoices:read";

  private Main() {}

  public static void main(String[] args) {
    if (args.length != 1 || args[0].isBlank()) {
      System.err.println("Usage: java -jar target/authdog-authz-java-0.1.0.jar <access-token>");
      System.exit(1);
    }

    String token = args[0];

    try (AuthdogClient client = new AuthdogClient("https://api.authdog.com")) {
      UserInfoResponse userInfo = client.getUserInfo(token);
      User user = userInfo.getUser();
      if (user == null) {
        System.err.println("401 Unauthorized: token did not resolve to a user.");
        System.exit(1);
      }

      // Typed User does not model permissions. Same official userinfo
      // call, kept as JsonNode so the claim is still readable.
      JsonNode envelope =
          client.request("GET", "/v1/userinfo", null, null, JsonNode.class, token);
      List<String> permissions = permissionsOf(envelope.path("user").path("permissions"));
      if (!permissions.contains(REQUIRED_PERMISSION)) {
        System.out.println("403 Forbidden: missing " + REQUIRED_PERMISSION);
        return;
      }

      System.out.println("200 OK: " + user.getDisplayName() + " may read invoices.");
    } catch (AuthenticationException e) {
      System.err.println("401 Unauthorized: " + e.getMessage());
      System.exit(1);
    } catch (ApiException e) {
      System.err.println("401 Unauthorized: " + e.getMessage());
      System.exit(1);
    }
  }

  private static List<String> permissionsOf(JsonNode node) {
    List<String> out = new ArrayList<>();
    if (node == null || !node.isArray()) {
      return out;
    }
    for (JsonNode item : node) {
      if (item != null && item.isTextual()) {
        out.add(item.asText());
      }
    }
    return out;
  }
}
