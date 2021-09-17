export interface TweetPayload {
  id: number;
  shareLink: string;
  fullText: string;
  screenName: string;
  name: string;
  tweetUrl: string;
  twitterUserUrl: string;
  profileImageUrl: string;
  savedTags: string[];
  isThread: boolean;
  media: { type: "video" | "photo"; link: string }[];
}

export interface TweetResource {
  payload: TweetPayload;
  links: Link[];
}

export interface TweetsResource {
  payload: TweetResource[];
  links: Link[];
}

export interface CurrentUserResource {
  payload: CurrentUserPayload;
  links: Link[];
}

export interface Link {
  href: string;
  url: string;
  type: string;
  rel: string;
}

export interface CurrentUserPayload {
  twitter_user_id: string;
  user_id: string;
  authToken: string;
  screenName: string;
}
