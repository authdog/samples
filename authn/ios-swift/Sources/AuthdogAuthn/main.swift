import Foundation

struct PublicKeyPayload {
  var environmentId: String
  var identityHost: String
}

enum AuthdogError: Error, CustomStringConvertible {
  case usage
  case invalidPublicKey(String)
  case untrustedHost
  case userinfo(String)

  var description: String {
    switch self {
    case .usage:
      return """
      Usage:
        PK_AUTHDOG=pk_... swift run AuthdogAuthn authorize <redirect-url>
        PK_AUTHDOG=pk_... swift run AuthdogAuthn userinfo <access-token>
      """
    case .invalidPublicKey(let message):
      return "Invalid public key: \(message)"
    case .untrustedHost:
      return "Untrusted identity host"
    case .userinfo(let message):
      return "401 Unauthorized: \(message)"
    }
  }
}

func trustedIdentityHost(_ raw: String) throws -> String {
  guard let url = URL(string: raw), url.scheme == "https", let host = url.host?.lowercased() else {
    throw AuthdogError.untrustedHost
  }
  let allowed = ["authdog.com", "authdog.xyz"]
  let ok = allowed.contains { host == $0 || host.hasSuffix(".\($0)") }
  if !ok { throw AuthdogError.untrustedHost }
  return raw.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
}

func parsePublicKey(_ publicKey: String) throws -> PublicKeyPayload {
  guard publicKey.hasPrefix("pk_") else {
    throw AuthdogError.invalidPublicKey("must start with pk_")
  }
  let encoded = String(publicKey.dropFirst(3))
  guard let data = Data(base64Encoded: encoded) else {
    throw AuthdogError.invalidPublicKey("not base64")
  }
  guard
    let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
    let environmentId = json["environmentId"] as? String, !environmentId.isEmpty,
    let identityHost = json["identityHost"] as? String, !identityHost.isEmpty
  else {
    throw AuthdogError.invalidPublicKey("missing environmentId or identityHost")
  }
  return PublicKeyPayload(
    environmentId: environmentId,
    identityHost: try trustedIdentityHost(identityHost)
  )
}

func authorizeURL(publicKey: String, redirectURL: String) throws -> URL {
  let payload = try parsePublicKey(publicKey)
  var components = URLComponents(
    string: "\(payload.identityHost)/oidc/\(payload.environmentId)/authorize"
  )!
  components.queryItems = [
    URLQueryItem(name: "client_id", value: publicKey),
    URLQueryItem(name: "response_type", value: "code"),
    URLQueryItem(name: "scope", value: "openid profile email"),
    URLQueryItem(name: "redirect_uri", value: redirectURL),
  ]
  guard let url = components.url else { throw AuthdogError.invalidPublicKey("authorize URL") }
  return url
}

func fetchUser(publicKey: String, token: String) throws {
  let payload = try parsePublicKey(publicKey)
  let url = URL(string: "\(payload.identityHost)/oidc/\(payload.environmentId)/userinfo")!
  var request = URLRequest(url: url)
  request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
  let semaphore = DispatchSemaphore(value: 0)
  var captured: Result<[String: Any], Error> = .failure(AuthdogError.userinfo("request failed"))
  URLSession.shared.dataTask(with: request) { data, response, error in
    defer { semaphore.signal() }
    if let error {
      captured = .failure(AuthdogError.userinfo(error.localizedDescription))
      return
    }
    let status = (response as? HTTPURLResponse)?.statusCode ?? 0
    guard let data, status < 300,
      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
    else {
      captured = .failure(AuthdogError.userinfo("status \(status)"))
      return
    }
    captured = .success(json)
  }.resume()
  semaphore.wait()
  let json = try captured.get()
  let meta = json["meta"] as? [String: Any]
  let user = json["user"] as? [String: Any]
  guard (meta?["code"] as? Int) == 200, let user else {
    throw AuthdogError.userinfo("token did not resolve to a user")
  }
  let emails = user["emails"] as? [[String: Any]]
  let email = emails?.first?["value"] as? String
  print("Authenticated:")
  print("  id:    \(user["id"] ?? "")")
  print("  name:  \(user["displayName"] ?? "")")
  print("  email: \(email ?? "")")
}

do {
  guard let publicKey = ProcessInfo.processInfo.environment["PK_AUTHDOG"], !publicKey.isEmpty else {
    throw AuthdogError.usage
  }
  let args = Array(CommandLine.arguments.dropFirst())
  guard args.count == 2 else { throw AuthdogError.usage }
  switch args[0] {
  case "authorize":
    print(try authorizeURL(publicKey: publicKey, redirectURL: args[1]).absoluteString)
  case "userinfo":
    try fetchUser(publicKey: publicKey, token: args[1])
  default:
    throw AuthdogError.usage
  }
} catch {
  FileHandle.standardError.write(Data("\(error)\n".utf8))
  exit(1)
}
