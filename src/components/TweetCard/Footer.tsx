import {
  Button,
  Icon,
  Input,
  Layout,
  List,
  ListItem,
  Modal,
  Text,
} from "@ui-kitten/components";
import { observer } from "mobx-react-lite";
import * as React from "react";
import {
  Alert,
  Linking,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  HmmErrorMessage,
  screenHeight,
  screenWidth,
} from "../../../utils/constants";
import { TweetResource } from "../../interfaces";
import serverApi from "../../serverApi";
import TweetStore from "../../stores/TweetStore";
import * as Clipboard from "expo-clipboard";

interface Props {
  tweetResource: TweetResource;
  tweetStore: TweetStore;
}

interface ModalProps {
  tweetStore: TweetStore;
  tweetResource: TweetResource;
  modalOpen: boolean;
  setModalOpen: (val: boolean) => void;
}

const TagsModal: React.FC<ModalProps> = observer(
  ({ tweetStore, tweetResource, modalOpen, setModalOpen }) => {
    const closeModal = () => setModalOpen(false);
    const [tags, setTags] = React.useState(tweetResource.payload.savedTags);
    const [tagText, setTagText] = React.useState("");

    const updateSavedTweet = () => {
      const link = tweetResource.links.find((l) => l.rel === "update");
      if (link) {
        serverApi
          .put(link.href, { saved_tweet: { saved_tags: tags } })
          .then((tweetResource: TweetResource) => {
            tweetStore.updateTweetResource(tweetResource);
            // setTags(tweetResource.payload.savedTags);
            alert("Tags have been successfully updated!");
          })
          .catch(() => alert(HmmErrorMessage));
      }
    };

    const addTag = () => {
      const strippedTextTag = tagText.replace(/[^a-z0-9]/gi, "");
      setTags((prevArray) => [...prevArray, `#${strippedTextTag}`]);
      setTagText("");
    };

    const renderInputAccessory = (props: any) => (
      <Button disabled={!!!tagText} onPress={addTag} size="tiny">
        Add
      </Button>
    );

    const renderItem = ({ item, index }: any) => {
      const removeTag = () => {
        setTags(tags.filter((i) => i !== item));
      };

      const renderRemoveButton = (props: any) => (
        <Button onPress={removeTag} status="danger" size="tiny">
          Remove
        </Button>
      );
      return <ListItem title={item} accessoryRight={renderRemoveButton} />;
    };

    const resetTags = () => {
      setTags(tweetResource.payload.savedTags);
    };

    return (
      <Modal
        style={styles.container}
        onBackdropPress={closeModal}
        backdropStyle={styles.backdrop}
        visible={modalOpen}
      >
        <List
          ListHeaderComponent={
            <Text style={{ alignSelf: "center" }} category="h4">
              Tags
            </Text>
          }
          contentContainerStyle={{
            // borderBottomColor: "white",
            // borderBottomWidth: 1,
            marginBottom: 20,
            width: screenWidth - 40,
          }}
          ListFooterComponent={
            <>
              <Input
                onChangeText={setTagText}
                value={tagText}
                style={{ alignSelf: "center", marginHorizontal: 10 }}
                status="control"
                accessoryRight={renderInputAccessory}
                placeholder="Ex: #work"
                caption="Type to add tags"
              />
              <Layout
                style={{
                  marginTop: 20,
                  flex: 1,
                  backgroundColor: "transparent",
                  justifyContent: "space-around",
                  flexDirection: "row",
                }}
              >
                <Button
                  disabled={tags.every((i) =>
                    tweetResource.payload.savedTags.includes(i)
                  )}
                  onPress={resetTags}
                  style={{ alignSelf: "center", width: 100 }}
                  status="danger"
                >
                  Reset
                </Button>
                <Button
                  onPress={updateSavedTweet}
                  style={{ alignSelf: "center", width: 100 }}
                  status="success"
                >
                  Save
                </Button>
              </Layout>
            </>
          }
          data={tags.slice()}
          renderItem={renderItem}
        />
      </Modal>
    );
  }
);

const Footer: React.FC<Props> = ({ tweetStore, tweetResource }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const openModal = () => setModalOpen(true);

  const deleteSavedTweet = () => {
    const link = tweetResource.links.find((l) => l.rel === "delete");
    if (link) {
      serverApi
        .delete(link.href)
        .then(() => {
          tweetStore.removeTweeetResource(tweetResource);
        })
        .catch(() => alert(HmmErrorMessage));
    }
  };

  const openTwitterLink = () => {
    Linking.openURL(tweetResource.payload.tweetUrl);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Share this tweet with friends!",
        url: tweetResource.payload.shareLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteTweetButton = () =>
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete this Tweet? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "default",
          onPress: deleteSavedTweet,
        },
      ]
    );

  return (
    <>
      <Layout
        style={{
          flexDirection: "row",
          paddingVertical: 10,
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity style={{ maxHeight: 100 }} onPress={openModal}>
          <TagsModal
            tweetStore={tweetStore}
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
            tweetResource={tweetResource}
          />
          <Icon
            height={25}
            width={25}
            fill="#8F9BB3"
            name="pricetags-outline"
          ></Icon>
        </TouchableOpacity>
        <TouchableOpacity onPress={openTwitterLink}>
          <Icon height={25} width={25} fill="#8F9BB3" name="twitter-outline" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteTweetButton}>
          <Icon height={25} width={25} fill="#8F9BB3" name="trash-outline" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare}>
          <Icon height={25} width={25} fill="#8F9BB3" name="link-2-outline" />
        </TouchableOpacity>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: screenWidth - 20,
    // justifyContent: "center",
    top: 100,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 5,
    flex: 1,
    // backgroundColor: "white",
    // alignItems: "center",
    // height: 192,
  },
  modalContainer: {
    opacity: 0.7,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
    height: 200,
    width: screenWidth - 40,
  },
  scrollview: {
    maxHeight: screenHeight * 0.7,
  },
  backdrop: {
    // height: 100,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default observer(Footer);
