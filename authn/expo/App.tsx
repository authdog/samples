import { useEffect } from "react";
import { Button, Linking, StyleSheet, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import {
  AuthdogProvider,
  createSecureStoreAdapter,
  useRedirectHandler,
  useSignIn,
  useSignOut,
  useUser,
  type IFetchUserData,
} from "@authdog/react-native";

const publicKey = process.env.EXPO_PUBLIC_PK_AUTHDOG ?? "";

function Home() {
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();
  const { handleRedirect } = useRedirectHandler();
  const { user, fetchUser, isAuthenticated, isLoading, error } = useUser();
  const redirectUrl = "authdog-authn://callback";

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleRedirect(url);
    });
    const sub = Linking.addEventListener("url", ({ url }) => handleRedirect(url));
    return () => sub.remove();
  }, [handleRedirect]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  const info = user as IFetchUserData["user"] | null;
  const email = info?.emails?.[0]?.value;

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>authdog authentication (Expo)</Text>
      <Text>
        Mobile identity via a deep-link return. Authentication is not
        authorization. Client state is UX, not a security boundary.
      </Text>
      {isLoading ? <Text>Loading…</Text> : null}
      {error ? <Text>Could not load the user.</Text> : null}
      {isAuthenticated && info ? (
        <Text>Signed in as {email ?? info.displayName ?? info.id}</Text>
      ) : (
        <Text>Signed out</Text>
      )}
      <Button title="Sign in" onPress={() => signIn(redirectUrl)} />
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
}

export default function App() {
  if (!publicKey.startsWith("pk_")) {
    return (
      <View style={styles.wrap}>
        <Text>
          Set EXPO_PUBLIC_PK_AUTHDOG to your environment public key (pk_...).
        </Text>
      </View>
    );
  }

  return (
    <AuthdogProvider
      publicKey={publicKey}
      storage={createSecureStoreAdapter(SecureStore)}
    >
      <Home />
    </AuthdogProvider>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 12, padding: 24, justifyContent: "center" },
  h1: { fontSize: 22, fontWeight: "600" },
});
