import { Avatar, Button, Layout, Text } from "@ui-kitten/components";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { StyleSheet } from "react-native";
import { TweetResource } from "../../interfaces";
import TweetStore from "../../stores/TweetStore";
import * as RootNavigation from "../../navigation/RootNavigation";
import ReportIssueButton from "./ReportIssueButton";

interface Props {
  tweetResource: TweetResource;
  tweetStore: TweetStore;
  hideTweetDetails: boolean;
  refreshList: () => void;
}

const Header: React.FC<Props> = ({
  tweetStore,
  refreshList,
  tweetResource,
  hideTweetDetails,
}) => {
  const pressViewThread = () => {
    RootNavigation.navigate("Home", {
      screen: "TweetDetails",
      params: { savedTweetId: tweetResource.payload.id },
    });
  };
  return (
    <Layout style={styles.container}>
      <Layout style={styles.userAccountContainer}>
        <Layout style={styles.userData}>
          <Avatar
            style={styles.avatar}
            source={{ uri: tweetResource.payload.profileImageUrl }}
          />
        </Layout>
        <Layout style={styles.userNames}>
          <Text>{tweetResource.payload.screenName}</Text>
          <Text>{tweetResource.payload.name}</Text>
        </Layout>
      </Layout>
      <Layout>
        {tweetResource.payload.isThread && !hideTweetDetails ? (
          <Button size="small" onPress={pressViewThread}>
            View Thread
          </Button>
        ) : (
          <></>
        )}
        {hideTweetDetails ? (
          <></>
        ) : (
          <ReportIssueButton
            refreshList={refreshList}
            tweetResource={tweetResource}
          />
        )}
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
    flexDirection: "row",
  },
  userAccountContainer: {
    flexDirection: "row",
  },

  userNames: {
    flexDirection: "column",
  },
  avatar: {
    marginRight: 10,
  },
  userData: {
    paddingBottom: 10,
  },
});

export default observer(Header);
