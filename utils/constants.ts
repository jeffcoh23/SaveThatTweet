import { Dimensions } from "react-native";

export const screenHeight = Math.round(Dimensions.get("window").height);

export const screenWidth = Math.round(Dimensions.get("window").width);

export const HmmErrorMessage =
  "Hmm, something is not right. Please try again later.";
