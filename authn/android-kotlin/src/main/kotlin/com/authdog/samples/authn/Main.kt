package com.authdog.samples.authn

import java.net.URI
import java.net.URLEncoder
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.StandardCharsets
import java.util.Base64
import org.json.JSONObject

data class PublicKeyPayload(val environmentId: String, val identityHost: String)

fun trustedIdentityHost(raw: String): String {
    val url = URI(raw)
    require(url.scheme == "https") { "Untrusted identity host" }
    val host = (url.host ?: "").lowercase()
    val allowed = listOf("authdog.com", "authdog.xyz")
    require(allowed.any { host == it || host.endsWith(".$it") }) { "Untrusted identity host" }
    return raw.trimEnd('/')
}

fun parsePublicKey(publicKey: String): PublicKeyPayload {
    require(publicKey.startsWith("pk_")) { "Invalid public key: must start with pk_" }
    val decoded =
        try {
            String(Base64.getDecoder().decode(publicKey.removePrefix("pk_")), StandardCharsets.UTF_8)
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException("Invalid public key: not base64")
        }
    val json = JSONObject(decoded)
    val environmentId = json.optString("environmentId")
    val identityHost = json.optString("identityHost")
    require(environmentId.isNotEmpty() && identityHost.isNotEmpty()) {
        "Invalid public key: missing environmentId or identityHost"
    }
    return PublicKeyPayload(environmentId, trustedIdentityHost(identityHost))
}

fun authorizeUrl(publicKey: String, redirectUrl: String): String {
    val payload = parsePublicKey(publicKey)
    val enc = { value: String -> URLEncoder.encode(value, StandardCharsets.UTF_8) }
    return "${payload.identityHost}/oidc/${payload.environmentId}/authorize" +
        "?client_id=${enc(publicKey)}" +
        "&response_type=code" +
        "&scope=${enc("openid profile email")}" +
        "&redirect_uri=${enc(redirectUrl)}"
}

fun fetchUser(publicKey: String, token: String) {
    val payload = parsePublicKey(publicKey)
    val request =
        HttpRequest.newBuilder(URI.create("${payload.identityHost}/oidc/${payload.environmentId}/userinfo"))
            .header("Authorization", "Bearer $token")
            .GET()
            .build()
    val response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString())
    if (response.statusCode() >= 300) {
        System.err.println("401 Unauthorized: status ${response.statusCode()}")
        kotlin.system.exitProcess(1)
    }
    val body = JSONObject(response.body())
    val user = body.optJSONObject("user")
    val code = body.optJSONObject("meta")?.optInt("code")
    if (user == null || code != 200) {
        System.err.println("401 Unauthorized: token did not resolve to a user.")
        kotlin.system.exitProcess(1)
    }
    val email = user.optJSONArray("emails")?.optJSONObject(0)?.optString("value")
    println("Authenticated:")
    println("  id:    ${user.optString("id")}")
    println("  name:  ${user.optString("displayName")}")
    println("  email: $email")
}

fun main(args: Array<String>) {
    val publicKey = System.getenv("PK_AUTHDOG")
    if (publicKey.isNullOrBlank() || args.size != 2) {
        System.err.println(
            """
            Usage:
              PK_AUTHDOG=pk_... ./gradlew run --args='authorize myapp://callback'
              PK_AUTHDOG=pk_... ./gradlew run --args='userinfo <access-token>'
            """.trimIndent(),
        )
        kotlin.system.exitProcess(1)
    }
    try {
        when (args[0]) {
            "authorize" -> println(authorizeUrl(publicKey, args[1]))
            "userinfo" -> fetchUser(publicKey, args[1])
            else -> {
                System.err.println("Unknown command ${args[0]}")
                kotlin.system.exitProcess(1)
            }
        }
    } catch (e: Exception) {
        System.err.println(e.message ?: "error")
        kotlin.system.exitProcess(1)
    }
}
