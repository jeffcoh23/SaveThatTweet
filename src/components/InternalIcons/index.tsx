import * as React from "react";
import { Icon } from "@ui-kitten/components";
import { Image } from "react-native";

export const TwitterIcon = () => (
  <Icon height={25} width={25} fill="white" name="twitter-outline" />
);

export const BackIcon = () => (
  <Icon height={25} width={25} fill="white" name={`arrow-ios-back-outline`} />
);

export const SaveThatTweetLogo = () => (
  <Image
    style={{
      alignSelf: "center",
      height: 50,
      width: 50,
      backgroundColor: "transparent",
    }}
    source={require("../../../assets/save-that-tweet-splash.png")}
  />
);
