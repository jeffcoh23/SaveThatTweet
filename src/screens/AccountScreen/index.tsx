import { Button, Divider, Icon, Layout, Text } from "@ui-kitten/components";
import { observer } from "mobx-react";
import * as React from "react";
import { Linking, StyleSheet } from "react-native";
import {
  SafeAreaLayout,
  SaveAreaInset,
} from "../../../utils/components/SafeAreaLayout";
import CentralSpinner from "../../components/CentralSpinner";
import HowItWorksButton from "../../components/HowItWorksButton";
import { currentUserStore } from "../../stores/CurrentUserStore";
import LoginScreen from "../LoginScreen";

class AccountScreen extends React.Component {
  constructor(props: any) {
    super(props);
  }
  logout = () => {
    currentUserStore.anonymous();
  };

  componentDidMount() {}

  howItWorksLink = () => {
    const link = currentUserStore.links.find((l) => l.rel === "how-it-works");
    Linking.openURL(link?.href || "https://slatebets.wixsite.com/mysite");
  };

  handleSupportLink = () => {
    const supportLink = currentUserStore.links.find((l) => l.rel === "support");
    Linking.openURL(
      supportLink?.href || "https://slatebets.wixsite.com/mysite"
    );
  };

  render() {
    switch (currentUserStore.state.kind) {
      case "has-token":
      case "initializing":
      case "identifying":
        return <CentralSpinner />;
      case "anonymous":
        return <LoginScreen />;
      case "authenticated":
        return (
          <SafeAreaLayout
            insets={[SaveAreaInset.TOP]}
            style={styles.safeAreaContainer}
          >
            <Layout style={styles.container}>
              <Text style={styles.headerText} category="h2">
                Hello, {currentUserStore.state.resource.payload.screenName}!
              </Text>
            </Layout>
            <Divider />
            <Layout style={styles.container}>
              <HowItWorksButton />
              <Button
                style={styles.logoutButton}
                appearance="outline"
                status="danger"
                onPress={this.logout}
              >
                Logout
              </Button>
              <Text
                status="info"
                onPress={this.handleSupportLink}
                style={styles.supportSiteLink}
              >
                Support Site
              </Text>
            </Layout>
          </SafeAreaLayout>
        );
    }
  }
}

const styles = StyleSheet.create({
  logoutButtonContainer: {
    alignSelf: "center",
  },
  howItWorksButton: {
    width: 200,
    alignSelf: "center",
  },
  logoutButton: {
    width: 200,
    marginVertical: 20,
    alignSelf: "center",
  },
  headerText: {
    alignSelf: "center",
  },
  supportSiteLink: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },

  safeAreaContainer: {
    flex: 1,
  },
});

export default observer(AccountScreen);
