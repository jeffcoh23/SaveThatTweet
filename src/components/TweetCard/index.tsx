import { Card, Layout, Text } from "@ui-kitten/components";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { Image, StyleSheet } from "react-native";
import { TweetResource } from "../../interfaces";
import TweetStore from "../../stores/TweetStore";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  tweetResource: TweetResource;
  tweetStore: TweetStore;
  hideTweetDetails: boolean;
}

const TweetCard: React.FC<Props> = ({
  tweetStore,
  tweetResource,
  hideTweetDetails,
}) => {
  return (
    <Card
      footer={() =>
        hideTweetDetails ? (
          <></>
        ) : (
          <Footer tweetStore={tweetStore} tweetResource={tweetResource} />
        )
      }
      header={(props) => (
        <Header
          hideTweetDetails={hideTweetDetails}
          tweetStore={tweetStore}
          tweetResource={tweetResource}
        />
      )}
    >
      <Text>{tweetResource.payload.fullText}</Text>
      {tweetResource.payload.media.map((imgUrl) => {
        switch (imgUrl.type) {
          case "photo":
            return (
              <Layout key={imgUrl.link} style={styles.imgLayout}>
                <Image style={styles.mediaImg} source={{ uri: imgUrl.link }} />
              </Layout>
            );
          case "video":
            return <></>;
          // (
          //   <Layout style={styles.imgLayout}>
          //     <Video style={styles.mediaImg} source={{ uri: imgUrl.link }} />
          //   </Layout>
          // );
        }
      })}
    </Card>
  );
};

const styles = StyleSheet.create({
  mediaImg: { margin: 10, height: 150, width: 150 },
  imgLayout: { flexWrap: "wrap", flexDirection: "row" },
});

export default observer(TweetCard);
