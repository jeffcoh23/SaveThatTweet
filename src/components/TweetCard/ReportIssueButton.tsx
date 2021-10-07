import { Button } from "@ui-kitten/components";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { Alert, StyleSheet } from "react-native";
import { TweetResource } from "../../interfaces";
import serverApi from "../../serverApi";

interface Props {
  tweetResource: TweetResource;
}

const ReportIssueButton: React.FC<Props> = ({ tweetResource }) => {
  const reportIssue = () => {
    const link = tweetResource.links.find((l) => l.rel === "report-issue");
    if (link) {
      Alert.alert(
        "Report Tweet",
        "Are you sure you want to report this Tweet?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: () =>
              serverApi
                .post(link.href, {
                  id: tweetResource.payload.id,
                })
                .then(() => alert("This Tweet has been reported.")),
          },
        ]
      );
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
