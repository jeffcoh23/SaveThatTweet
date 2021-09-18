import React from "react";
import { StyleSheet } from "react-native";
import { Divider, List } from "@ui-kitten/components";
import { observer } from "mobx-react";
import TweetCard from "../../../components/TweetCard";
import { TweetResource, TweetsResource } from "../../../interfaces";
import TweetStore from "../../../stores/TweetStore";
import EmptyTweetsList from "./EmptyTweetsList";

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

  return (
    <List
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
