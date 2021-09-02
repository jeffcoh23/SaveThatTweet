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
}

const TweetsList: React.FC<Props> = ({ tweetStore, tweetsResource }) => {
  const renderItem = ({
    item,
    index,
  }: {
    item: TweetResource;
    index: number;
  }) => <TweetCard tweetStore={tweetStore} tweetResource={item} />;

  return (
    <List
      ListEmptyComponent={EmptyTweetsList}
      style={styles.container}
      contentContainerStyle={styles.container}
      data={tweetsResource.payload.slice()}
      ItemSeparatorComponent={Divider}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default observer(TweetsList);
