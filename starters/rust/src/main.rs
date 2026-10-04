use axum::middleware;
use axum::routing::get;
use axum::{Json, Router};
use authdog_axum::{attach_session, require_auth, AuthContext, Authdog};
use serde_json::{json, Value};

#[tokio::main]
async fn main() {
    let public_key = std::env::var("PK_AUTHDOG")
        .expect("Set PK_AUTHDOG to your environment public key (pk_...)");
    let authdog = Authdog::new(&public_key).expect("invalid public key");

    let app = Router::new()
        .route(
            "/",
            get(|ctx: AuthContext| async move {
                Json(json!({
                    "sample": "Policy service",
                    "authenticated": ctx.is_authenticated,
                    "hint": "GET /me is the identity gate",
                }))
            }),
        )
        .route(
            "/me",
            get(|ctx: AuthContext| async move {
                Json(ctx.user.unwrap_or(Value::Null))
            })
            .layer(middleware::from_fn(require_auth)),
        )
        .layer(middleware::from_fn_with_state(authdog.clone(), attach_session))
        .with_state(authdog);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("bind");
    println!("policy-service listening on http://127.0.0.1:3000");
    axum::serve(listener, app).await.expect("serve");
}
