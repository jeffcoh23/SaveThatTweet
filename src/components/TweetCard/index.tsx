import { Card, Text } from "@ui-kitten/components";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { TweetResource } from "../../interfaces";
import TweetStore from "../../stores/TweetStore";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  tweetResource: TweetResource;
  tweetStore: TweetStore;
}

const TweetCard: React.FC<Props> = ({ tweetStore, tweetResource }) => {
  return (
    <Card
      footer={() => (
        <Footer tweetStore={tweetStore} tweetResource={tweetResource} />
      )}
      header={(props) => (
        <Header tweetStore={tweetStore} tweetResource={tweetResource} />
      )}
    >
      <Text>{tweetResource.payload.fullText}</Text>
    </Card>
  );
};

export default observer(TweetCard);
