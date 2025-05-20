import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { supabase } from "../app/utils/supabase";

export function Auth() {
  if (Platform.OS === "ios")
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 64 }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: "apple",
                token: credential.identityToken,
              });
              console.log(JSON.stringify({ error, user }, null, 2));
              if (!error) {
                // User is signed in.
              }
            } else {
              throw new Error("No identityToken.");
            }
          } catch (e: unknown) {
            if (typeof e === "object" && e !== null && "code" in e) {
              const error = e as { code: string };
              if (error.code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
              } else {
                // handle other errors
              }
            } else {
              // handle unexpected error shape
            }
          }
        }}
      />
    );
  return <>{/* Implement Android Auth options. */}</>;
}
