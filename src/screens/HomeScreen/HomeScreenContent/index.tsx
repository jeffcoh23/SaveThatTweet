import {
  Icon,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import { observer } from "mobx-react";
import React from "react";
import { StyleSheet } from "react-native";
import {
  SafeAreaLayout,
  SaveAreaInset,
} from "../../../../utils/components/SafeAreaLayout";
import CentralSpinner from "../../../components/CentralSpinner";
import GoogleAdMobBanner from "../../../components/GoogleAdMobBanner";
import { SaveThatTweetLogo } from "../../../components/InternalIcons";
import { TweetsResource } from "../../../interfaces";
import serverApi from "../../../serverApi";
import { currentUserStore } from "../../../stores/CurrentUserStore";
import TweetStore from "../../../stores/TweetStore";
import TweetsList from "../TweetsList";

interface Props {
  navigation: any;
}
// type Props = NativeStackScreenProps<RootStackParamList, "Tweets">;

const searchIcon = () => (
  <Icon height={25} width={25} fill="#8F9BB3" name="search-outline" />
);

const tagsIcon = () => (
  <Icon height={25} width={25} fill="#8F9BB3" name="pricetags-outline"></Icon>
);

class HomeScreenContent extends React.Component<Props> {
  private tweetStore: TweetStore = new TweetStore();
  private timeout: null | ReturnType<typeof setTimeout> = null;
  private subscribe: any;
  constructor(props: Props) {
    super(props);
    // this.props.navigation.navigate("Home", {
    //   screen: "TweetDetails",
    //   params: { savedTweetId: "jane" },
    // });
    this.tweetStore.loading();
  }

  fetchTweets = (link: string) => {
    if (link) {
      this.tweetStore.searching();
      serverApi.get(link).then((res: TweetsResource) => {
        this.tweetStore.ready(res);
      });
    }
  };

  refreshList = () => {
    if (currentUserStore.savedTweetsLink)
      this.fetchTweets(currentUserStore.savedTweetsLink);
  };

  componentDidMount() {
    this.subscribe = this.props.navigation.addListener("focus", () => {
      this.refreshList();
    });
  }

  componentWillUnmount() {
    if (!!this.subscribe.remove) {
      this.subscribe.remove();
    }
  }

  handleTextSearch = (searchText: string) => {
    this.tweetStore.searching(searchText);
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const link = currentUserStore.savedTweetsLink;
      if (link) {
        this.fetchTweets(`${link}?search_text=${searchText}`);
      }
    }, 1000);
  };

  handleTagSearch = (index: IndexPath | IndexPath[], tags: string[]) => {
    this.tweetStore.searching(undefined, tags, index);
    const link = currentUserStore.savedTweetsLink;
    if (link) {
      this.fetchTweets(
        `${link}?tags=${encodeURIComponent(
          this.tweetStore.currentSelectedTags.toString()
        )}`
      );
    }
  };

  selectedTagsDisplayValue = () => {
    const indexPath = Array.isArray(this.tweetStore.selectedTagsIndexPath)
      ? this.tweetStore.selectedTagsIndexPath
      : [this.tweetStore.selectedTagsIndexPath];
    return this.tweetStore.tags
      .filter((_, index) => indexPath.map((i) => i.row).includes(index))
      .join(", ");
  };

  render() {
    switch (this.tweetStore.state.kind) {
      case "loading":
      case "waiting":
        return <CentralSpinner />;
      case "searching":
      case "refreshing":
      case "ready":
        return (
          <SafeAreaLayout insets={[SaveAreaInset.TOP]} style={{ flex: 1 }}>
            <SaveThatTweetLogo />
            <Layout style={styles.searchContainer}>
              <Input
                status="control"
                value={this.tweetStore.searchText.slice()}
                label="Search tweet contents"
                placeholder="Ex: Hello Twitter"
                accessoryRight={searchIcon}
                onChangeText={this.handleTextSearch}
              />
              <Select
                // Need to figure out how to do value
                value={this.selectedTagsDisplayValue()}
                status="control"
                label="Select tags"
                placeholder="Ex: #cryptocurrency"
                multiSelect={true}
                accessoryRight={tagsIcon}
                selectedIndex={this.tweetStore.selectedTagsIndexPath}
                onSelect={(index) =>
                  this.handleTagSearch(index, this.tweetStore.tags)
                }
              >
                {this.tweetStore.tags.map((tag) => {
                  return <SelectItem key={tag} title={tag} />;
                })}
              </Select>
            </Layout>
            {this.tweetStore.state.kind === "searching" ? (
              <CentralSpinner />
            ) : (
              <TweetsList
                refreshList={this.refreshList}
                hideTweetDetails={false}
                tweetStore={this.tweetStore}
                tweetsResource={this.tweetStore.state.tweets}
              />
            )}
            {/* <GoogleAdMobBanner /> */}
          </SafeAreaLayout>
        );
    }
  }
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  searchContainer: {
    padding: 10,
    // borderBottomColor: "white",
    // borderBottomWidth: 1,
  },
});

export default observer(HomeScreenContent);
