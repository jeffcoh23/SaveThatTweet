import { Card, Text } from "@ui-kitten/components";
import { Video } from "expo-av";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { StyleSheet } from "react-native";
import { TweetResource } from "../../interfaces";
import TweetStore from "../../stores/TweetStore";
import ImageModal from "../ImageModal";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  tweetResource: TweetResource;
  tweetStore: TweetStore;
  hideTweetDetails: boolean;
  refreshList: () => void;
}

const TweetCard: React.FC<Props> = ({
  tweetStore,
  tweetResource,
  hideTweetDetails,
  refreshList,
}) => {
  const video = React.useRef(null);
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
          refreshList={refreshList}
          hideTweetDetails={hideTweetDetails}
          tweetStore={tweetStore}
          tweetResource={tweetResource}
        />
      )}
    >
      <Text>{tweetResource.payload.fullText}</Text>
      {tweetResource.payload.media.map((media) => {
        switch (media.type) {
          case "photo":
            return <ImageModal imageProps={media} />;
          case "video":
            return (
              <Video
                key={media.link}
                ref={video}
                style={styles.video}
                source={{
                  uri: media.link,
                }}
                useNativeControls
                resizeMode="contain"
              />
            );
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
