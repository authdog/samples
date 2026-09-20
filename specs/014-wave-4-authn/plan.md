# Implementation Plan: Wave 4 Authentication

**Branch**: `014-wave-4-authn` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship four copyable authentication starters for Wave 4. Expo uses
`@authdog/react-native`. Native stacks implement the documented
redirect + userinfo bridge. Update the root listing.

## Technical Context

**Language/Version**: Expo SDK 52 / RN 0.76, Swift 5.9+, Kotlin 1.9+, Dart 3

**Primary Dependencies**: `@authdog/react-native@^0.3.1` (Expo);
stdlib HTTP for native

**Testing**: `npm install` + typecheck Expo; Gradle compile Kotlin;
source review for Swift/Dart if toolchains are missing

**Constraints**: Real API surface; pk only; no authz; trusted hosts

**Scale/Scope**: Four folders under `authn/`

## Constitution Check

- I–VII PASS (Wave 3 authn is Present; no invented SDKs)

## Project Structure

```text
authn/expo/
authn/ios-swift/
authn/android-kotlin/
authn/flutter-dart/
README.md
```
