import { IndexPath } from "@ui-kitten/components";
import { action, computed, observable } from "mobx";
import { TweetResource, TweetsResource } from "../interfaces";

interface Ready {
  kind: "ready";
  searchText: string;
  tweets: TweetsResource;
  tags: string[];
  selectedTagsIndex: IndexPath | IndexPath[];
}

interface Searching {
  kind: "searching";
  searchText: string;
  tweets: TweetsResource;
  tags: string[];
  selectedTagsIndex: IndexPath | IndexPath[];
}

interface Loading {
  kind: "loading";
}

interface Waiting {
  kind: "waiting";
}

type State = Searching | Ready | Loading | Waiting;

const loading = (): Loading => ({
  kind: "loading",
});

const waiting = (): Waiting => ({
  kind: "waiting",
});

// might get rid of tags since coming from currentUserStore
// and just save selectedIndex
const ready = (
  tweets: TweetsResource,
  searchText: string,
  tags: string[],
  selectedTagsIndex: IndexPath | IndexPath[]
): Ready => ({
  kind: "ready",
  tweets,
  searchText,
  tags,
  selectedTagsIndex,
});

const searching = (
  tweets: TweetsResource,
  searchText: string,
  tags: string[],
  selectedTagsIndex: IndexPath | IndexPath[]
): Searching => ({
  kind: "searching",
  tweets,
  searchText,
  tags,
  selectedTagsIndex,
});

class TweetStore {
  @observable state: State;
  constructor() {
    this.state = waiting();
  }

  @action
  loading = () => {
    switch (this.state.kind) {
      case "loading":
        break;
      case "waiting":
        this.state = loading();
        break;
      case "ready":
      case "searching":
        break;
    }
  };

  @action
  ready = (tweets: TweetsResource) => {
    switch (this.state.kind) {
      case "loading":
      case "waiting":
        this.state = ready(tweets, "", [], []);
        break;
      case "searching":
        this.state = ready(
          tweets,
          this.state.searchText,
          this.state.tags,
          this.state.selectedTagsIndex
        );
        break;
      case "ready":
    }
  };

  @action
  searching = (
    searchText?: string,
    tags?: string[],
    indexPath?: IndexPath | IndexPath[]
  ) => {
    switch (this.state.kind) {
      case "loading":
      case "waiting":
        break;
      case "searching":
      case "ready":
        this.state = searching(
          this.state.tweets,
          searchText ?? this.state.searchText,
          tags ?? this.state.tags,
          indexPath ?? this.state.selectedTagsIndex
        );
        break;
    }
  };

  @action
  updateTweetResource = (tweetResource: TweetResource) => {
    switch (this.state.kind) {
      case "loading":
      case "waiting":
        break;
      case "searching":
      case "ready":
        const tweetResourceToReplace = this.state.tweets.payload.findIndex(
          (resource) => resource.payload.id === tweetResource.payload.id
        );
        if (tweetResourceToReplace !== -1)
         this.state.tweets.payload.splice(
            tweetResourceToReplace,
            1,
            tweetResource
          );
        break;
    }
  };

  @action
  removeTweeetResource = (tweetResource: TweetResource) => {
    switch (this.state.kind) {
      case "loading":
      case "waiting":
        break;
      case "searching":
      case "ready":
        const tweetResourceToReplace = this.state.tweets.payload.findIndex(
          (resource) => resource.payload.id === tweetResource.payload.id
        );
        if (tweetResourceToReplace !== -1) {
          this.state.tweets.payload.splice(tweetResourceToReplace, 1);
        }
        break;
    }
  };

  @computed
  get tags(): string[] {
    switch (this.state.kind) {
      case "loading":
      case "waiting":
        return [];
      case "ready":
      case "searching":
        return [
          ...new Set(
            this.state.tweets.payload.flatMap(
              (tweetResource) => tweetResource.payload.savedTags
            )
          ),
        ];
    }
  }

  @computed
  get selectedTagsIndexPath(): IndexPath | IndexPath[] {
    switch (this.state.kind) {
      case "loading":
      case "waiting":
        return [];
      case "ready":
      case "searching":
        return this.state.selectedTagsIndex;
    }
  }
  // tagsIndex(indexPath: IndexPath[]): IndexPath[] {
  //   switch (this.state.kind) {
  //     case "loading":
  //     case "waiting":
  //       return [];
  //     case "ready":
  //     case "searching":
  //       return
  //   }
  // }
}

export default TweetStore;
