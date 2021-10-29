import { Button, Icon, Layout, Modal } from "@ui-kitten/components";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { screenHeight, screenWidth } from "../../../utils/constants";
import { TwitterImageProps } from "../../interfaces";

interface Props {
  imageProps: TwitterImageProps;
}

const ImageModal: React.FC<Props> = ({ imageProps }) => {
  const [visible, setVisible] = React.useState(false);

  const showImage = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={showImage}>
        <Layout key={imageProps.link} style={styles.layout}>
          <Image style={styles.image} source={{ uri: imageProps.link }} />
        </Layout>
      </TouchableOpacity>
      {/* <Layout style={styles.modalLayout}> */}
      <Modal onBackdropPress={hideModal} visible={visible}>
        <Layout style={styles.modal}>
          <TouchableOpacity onPress={hideModal}>
            <Icon
              height={40}
              fill="white"
              width={40}
              style={styles.icon}
              name="close-outline"
            />
          </TouchableOpacity>
          <Image
            style={{
              aspectRatio: imageProps.width / imageProps.height,
              width: screenWidth * 0.9,
              height: undefined,
              alignSelf: "center",
              resizeMode: "stretch",
            }}
            source={{ uri: imageProps.link }}
          />
        </Layout>
      </Modal>
      {/* </Layout> */}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-end",
  },
  layout: { flexDirection: "row" },

  image: { margin: 10, height: 150, width: 150 },

  icon: {
    color: "white",
    // position: "absolute",
    // top: 500,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  modal: {
    marginBottom: 50,
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    backgroundColor: "black",
    // alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default observer(ImageModal);
