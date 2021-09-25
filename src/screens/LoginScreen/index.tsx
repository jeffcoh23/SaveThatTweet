import * as React from "react";
import * as AuthSession from "expo-auth-session";
import { Image, ImageBackground, Linking, StyleSheet } from "react-native";
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
import HowItWorksButton from "../../components/HowItWorksButton";
const redirect = AuthSession.makeRedirectUri();

function LoginScreen() {
  const howItWorksLink = () => {
    Linking.openURL(
      "https://jeffcoh237.wixsite.com/save-that-tweet/how-it-works"
    );
  };
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
      <Image
        style={styles.backgroundImage}
        // imageStyle={styles.backgroundImageStyle}
        source={require("../../../assets/save-that-tweet-higher-quality.png")}
      />
      <Layout style={styles.layout}>
        <Text style={styles.text} category="s1">
          Welcome to Save That Tweet! Use the button below to log in to Twitter
          or to create an account with Save That Tweet.
        </Text>
      </Layout>
      <Layout style={styles.bottomButtonSection}>
        <Button
          onPress={onLogin}
          accessoryRight={TwitterIcon}
          style={styles.loginButton}
        >
          Sign in / Create Account
        </Button>
        <Button appearance="outline" status="control" onPress={howItWorksLink}>
          Support Site
        </Button>
      </Layout>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(141, 192, 231)",
    alignItems: "center",
    // justifyContent: "center",
  },
  bottomButtonSection: {
    backgroundColor: "transparent",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  layout: {
    backgroundColor: "transparent",
  },
  backgroundImageStyle: { opacity: 0.5 },
  backgroundImage: {
    height: 400,
    width: 350,
    resizeMode: "contain",

    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // width: "100%",
    // height: "100%",
    // position: "absolute",
    // backgroundColor: "rgba(141, 92, 231, 0.9)",
  },
  text: { paddingHorizontal: 40, marginBottom: 30, textAlign: "left" },
  headerText: { marginBottom: 30, textDecorationLine: "underline" },
  loginButton: {
    marginVertical: 10,
    backgroundColor: "rgb(55, 161, 242)",
  },
});

export default observer(LoginScreen);
