import * as React from "react";
import * as AuthSession from "expo-auth-session";
import { ImageBackground, StyleSheet } from "react-native";
import { observer } from "mobx-react";
import serverApi from "../../serverApi";
import { currentUserStore } from "../../stores/CurrentUserStore";
import { CurrentUserResource } from "../../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaLayout,
  SaveAreaInset,
} from "../../../utils/components/SafeAreaLayout";
import { Layout, Text, Button } from "@ui-kitten/components";
import { TwitterIcon } from "../../components/InternalIcons";
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
    <SafeAreaLayout style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        source={require("../../../assets/bedroomBackground.jpg")}
      />
      <Layout style={styles.layout}>
        <Text style={styles.headerText} category="h1">
          Welcome!
        </Text>
        <Text style={styles.text} category="s1">
          Please use the button below to sign in or create an account.
        </Text>
      </Layout>
      <Button
        onPress={onLogin}
        accessoryRight={TwitterIcon}
        style={styles.loginButton}
      >
        Sign in / Create Account
      </Button>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
    backgroundColor: "transparent",
  },
  backgroundImageStyle: { opacity: 0.5 },
  backgroundImage: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  text: { marginBottom: 30, textAlign: "left" },
  headerText: { marginBottom: 30, textDecorationLine: "underline" },
  loginButton: {
    backgroundColor: "rgb(55, 161, 242)",
  },
});

export default observer(LoginScreen);
