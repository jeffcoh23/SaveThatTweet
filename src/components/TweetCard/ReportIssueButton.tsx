import { Button } from "@ui-kitten/components";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { Alert, StyleSheet } from "react-native";
import { TweetResource } from "../../interfaces";
import serverApi from "../../serverApi";

interface Props {
  tweetResource: TweetResource;
  refreshList: () => void;
}

const ReportIssueButton: React.FC<Props> = ({ tweetResource, refreshList }) => {
  const reportIssue = () => {
    const link = tweetResource.links.find((l) => l.rel === "report-issue");
    if (link) {
      Alert.alert("Report Tweet", "What would you like to report?", [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Report Tweet",
          onPress: () =>
            serverApi
              .post(link.href, {
                id: tweetResource.payload.id,
                type: "tweet",
              })
              .then(() => alert("This Tweet has been reported."))
              .then(refreshList)
              .catch(() => {
                alert("Hmm something went wrong, please try again later.");
              }),
        },
        {
          text: "Block User",
          onPress: () =>
            serverApi
              .post(link.href, {
                id: tweetResource.payload.id,
                type: "user",
              })
              .then(() =>
                alert(
                  "This user has been blocked, you will no longer see their Tweets."
                )
              )
              .then(refreshList)
              .catch(() => {
                alert("Hmm something went wrong, please try again later.");
              }),
        },
      ]);
    } else {
      alert(
        "Sorry, something went wrong, please email us: levelingupweekly@gmail.com"
      );
    }
  };
  return (
    <Button
      style={styles.logoutButton}
      appearance="ghost"
      status="danger"
      size="small"
      onPress={reportIssue}
    >
      Report
    </Button>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    // width: 100,
    alignSelf: "center",
  },
});

export default observer(ReportIssueButton);
