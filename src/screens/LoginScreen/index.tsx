import * as React from "react";
import * as AuthSession from "expo-auth-session";
import { Button, StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react";
import serverApi from "../../serverApi";
import { currentUserStore } from "../../stores/CurrentUserStore";
import { CurrentUserResource } from "../../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

const redirect = AuthSession.makeRedirectUri();

function LoginScreen() {
  const onLogin = async () => {
    try {
      serverApi
        .register(redirect)
        .then(
          (res: {
            oauth_token: string;
            oauth_token_secret: string;
            callbackUrl: string;
          }) => {
            return AuthSession.startAsync({
              authUrl: res.callbackUrl,
            }).then((authResponse) => {
              if (authResponse.type === "success") {
                if (authResponse.params.denied) {
                  // return setError('AuthSession failed, user did not authorize the app');
                }
                return serverApi
                  .createSession(
                    res.oauth_token,
                    res.oauth_token_secret,
                    authResponse.params.oauth_verifier
                  )
                  .then((currentUserResource: CurrentUserResource) => {
                    currentUserStore.authenticated(currentUserResource);
                    AsyncStorage.setItem(
                      "authToken",
                      currentUserResource.payload.authToken
                    );
                  });
              }
            });
          }
        );
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Example: Twitter login</Text>
        <Button title="Login with Twitter" onPress={onLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});

export default observer(LoginScreen);
