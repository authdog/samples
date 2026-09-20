package com.authdog.samples.authn;

import com.authdog.AuthdogClient;
import com.authdog.exceptions.ApiException;
import com.authdog.exceptions.AuthenticationException;
import com.authdog.types.Email;
import com.authdog.types.User;
import com.authdog.types.UserInfoResponse;
import java.util.List;

public final class Main {
  private Main() {}

  public static void main(String[] args) {
    if (args.length != 1 || args[0].isBlank()) {
      System.err.println("Usage: java -jar target/authdog-authn-java-0.1.0.jar <access-token>");
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

      List<Email> emails = user.getEmails();
      String email =
          emails == null || emails.isEmpty() || emails.get(0) == null
              ? null
              : emails.get(0).getValue();

      System.out.println("Authenticated:");
      System.out.println("  id:    " + user.getId());
      System.out.println("  name:  " + user.getDisplayName());
      System.out.println("  email: " + email);
    } catch (AuthenticationException e) {
      System.err.println("401 Unauthorized: " + e.getMessage());
      System.exit(1);
    } catch (ApiException e) {
      System.err.println("401 Unauthorized: " + e.getMessage());
      System.exit(1);
    }
  }
}
