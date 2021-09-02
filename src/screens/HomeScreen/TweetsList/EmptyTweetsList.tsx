import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import HowItWorksButton from "../../../components/HowItWorksButton";

const EmptyTweetsList: React.FC = () => (
  <Layout style={styles.container}>
    <Text style={styles.headerText} category="h1">
      Uh oh.
    </Text>
    <Text style={styles.text} category="s1">
      You dont have any saved Tweets (yet). Click the link below to learn how to
      save Tweets.
    </Text>
    <HowItWorksButton />
  </Layout>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { marginBottom: 30, textAlign: "center" },
  headerText: { marginBottom: 30 },
});

export default EmptyTweetsList;
