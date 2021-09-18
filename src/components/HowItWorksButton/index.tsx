import { Button, Icon, Text } from "@ui-kitten/components";
import { observer } from "mobx-react";
import * as React from "react";
import { Linking, StyleSheet } from "react-native";
import { currentUserStore } from "../../stores/CurrentUserStore";

interface Props {}

const searchIcon = () => (
  <Icon height={25} width={25} fill="#8F9BB3" name="book-open-outline" />
);

const HowItWorksButton: React.FC<Props> = () => {
  const howItWorksLink = () => {
    Linking.openURL(
      "https://jeffcoh237.wixsite.com/save-that-tweet/how-it-works"
    );
  };
  return (
    <Button
      style={styles.howItWorksButton}
      onPress={howItWorksLink}
      status="success"
      appearance="outline"
      accessoryLeft={searchIcon}
      size="medium"
    >
      {(evaProps) => <Text {...evaProps}>How it works</Text>}
    </Button>
  );
};

const styles = StyleSheet.create({
  howItWorksButton: {
    width: 200,
    alignSelf: "center",
  },
});

export default observer(HowItWorksButton);
