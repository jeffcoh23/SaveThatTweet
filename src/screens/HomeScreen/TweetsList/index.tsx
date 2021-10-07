import React from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { Divider, List } from "@ui-kitten/components";
import { observer } from "mobx-react";
import TweetCard from "../../../components/TweetCard";
import { TweetResource, TweetsResource } from "../../../interfaces";
import TweetStore from "../../../stores/TweetStore";
import EmptyTweetsList from "./EmptyTweetsList";
import serverApi from "../../../serverApi";

interface Props {
  tweetsResource: TweetsResource;
  tweetStore: TweetStore;
  hideTweetDetails: boolean;
}

const TweetsList: React.FC<Props> = ({
  tweetStore,
  tweetsResource,
  hideTweetDetails,
}) => {
  const renderItem = ({
    item,
    index,
  }: {
    item: TweetResource;
    index: number;
  }) => (
    <TweetCard
      hideTweetDetails={hideTweetDetails}
      key={item.payload.id}
      tweetStore={tweetStore}
      tweetResource={item}
    />
  );

  const refreshSavedTweets = () => {
    const link = tweetsResource.links.find((l) => l.rel === "self");
    if (link) {
      tweetStore.refreshing();
      serverApi.get(link.href).then(tweetStore.ready);
    }
  };

  return (
    <List
      refreshControl={
        <RefreshControl
          tintColor="white"
          refreshing={tweetStore.state.kind === "refreshing"}
          onRefresh={refreshSavedTweets}
        />
      }
      ListEmptyComponent={EmptyTweetsList}
      contentContainerStyle={styles.listContainer}
      data={tweetsResource.payload.slice()}
      ItemSeparatorComponent={Divider}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: { flexGrow: 1 },
});

export default observer(TweetsList);
