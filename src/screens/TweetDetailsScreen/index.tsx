import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigationState } from "@react-navigation/routers";
import { Button, Layout } from "@ui-kitten/components";
import { observer } from "mobx-react";
import * as React from "react";
import {
  SafeAreaLayout,
  SaveAreaInset,
} from "../../../utils/components/SafeAreaLayout";
import CentralSpinner from "../../components/CentralSpinner";
import { TweetsResource } from "../../interfaces";
import serverApi from "../../serverApi";
import { currentUserStore } from "../../stores/CurrentUserStore";
import TweetStore from "../../stores/TweetStore";
import TweetsList from "../HomeScreen/TweetsList";
import getEnvVars from "../../../environment";
import { BackIcon, SaveThatTweetLogo } from "../../components/InternalIcons";
import * as RootNavigation from "../../navigation/RootNavigation";
import { StyleSheet } from "react-native";
import GoogleAdMobBanner from "../../components/GoogleAdMobBanner";

// import { NavigationScreenProp, NavigationState } from "react-navigation";
const { apiUrl } = getEnvVars();

type RootStackParamList = {
  TweetDetails: { savedTweetId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "TweetDetails">;

class TweetDetailsScreen extends React.Component<Props> {
  private tweetStore: TweetStore = new TweetStore();

  constructor(props: Props) {
    super(props);
    this.tweetStore.loading();
  }

  componentDidMount() {
    if (currentUserStore.savedTweetsLink) {
      serverApi
        .get(
          `${apiUrl}/saved_tweets/${this.props.route.params.savedTweetId}.json`
        )
        .then((res: TweetsResource) => {
          this.tweetStore.ready(res);
        })
        .catch(this.cantFindTweetAlertAndGoBack);
    } else {
      this.cantFindTweetAlertAndGoBack();
    }
  }

  cantFindTweetAlertAndGoBack = () => {
    alert("Hmm something went wrong, please try again later.");
    this.onPressBack();
  };

  onPressBack = () => {
    RootNavigation.navigate("Home", {
      screen: "Tweets",
    });
  };

  render() {
    switch (this.tweetStore.state.kind) {
      case "loading":
      case "waiting":
        return <CentralSpinner />;
      case "searching":
      case "ready":
        return (
          <SafeAreaLayout insets={[SaveAreaInset.TOP]} style={{ flex: 1 }}>
            <Layout style={styles.top}>
              <Button
                style={styles.button}
                onPress={this.onPressBack}
                appearance="ghost"
                accessoryRight={BackIcon}
              />
              <SaveThatTweetLogo />
            </Layout>

            <Layout style={{ flex: 1 }}>
              <TweetsList
                refreshList={this.onPressBack}
                hideTweetDetails={true}
                tweetStore={this.tweetStore}
                tweetsResource={this.tweetStore.state.tweets}
              />
            </Layout>
            <GoogleAdMobBanner />
          </SafeAreaLayout>
        );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    position: "absolute",
    left: 0,
    alignSelf: "flex-start",
  },
  top: {
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
  },
});

export default observer(TweetDetailsScreen);
