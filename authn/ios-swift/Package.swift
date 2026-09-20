// swift-tools-version:5.9
import PackageDescription

let package = Package(
  name: "AuthdogAuthn",
  platforms: [.macOS(.v13)],
  targets: [
    .executableTarget(name: "AuthdogAuthn")
  ]
)
