import AsyncStorage from "@react-native-async-storage/async-storage";
import { action, computed, observable } from "mobx";
import { CurrentUserResource, Link } from "../interfaces";

interface Authenticated {
  kind: "authenticated";
  resource: CurrentUserResource;
}

interface Anonymous {
  kind: "anonymous";
}

interface Identifying {
  kind: "identifying";
}

interface Initializing {
  kind: "initializing";
}

interface HasToken {
  kind: "has-token";
  authToken: string;
}

const hasToken = (authToken: string): HasToken => ({
  kind: "has-token",
  authToken,
});

const authenticated = (resource: CurrentUserResource): Authenticated => ({
  kind: "authenticated",
  resource,
});

const anonymous = (): Anonymous => ({
  kind: "anonymous",
});

const initializing = (): Initializing => ({
  kind: "initializing",
});

type State = Authenticated | Anonymous | Identifying | HasToken | Initializing;
class CurrentUserStore {
  @observable state: State = initializing();

  constructor() {}

  @action
  hasToken = (token: string) => {
    switch (this.state.kind) {
      case "initializing":
      case "has-token":
      case "anonymous":
      case "authenticated":
      case "identifying":
        this.state = hasToken(token);
    }
  };

  @action
  anonymous = () => {
    switch (this.state.kind) {
      case "initializing":
      case "has-token":
      case "anonymous":
      case "authenticated":
      case "identifying":
        this.state = anonymous();
    }
  };

  @action
  authenticated = (resource: CurrentUserResource) => {
    switch (this.state.kind) {
      case "initializing":
      case "has-token":
      case "anonymous":
      case "authenticated":
      case "identifying":
        this.state = authenticated(resource);
    }
  };

  @computed
  get savedTweetsLink(): string | undefined {
    switch (this.state.kind) {
      case "initializing":
      case "has-token":
      case "anonymous":
      case "identifying":
        return undefined;
      case "authenticated":
        return this.state.resource.links.find((l) => l.rel === "saved-tweets")
          ?.href;
    }
  }

  @computed
  get authToken(): string {
    switch (this.state.kind) {
      case "initializing":
      case "anonymous":
      case "identifying":
        return "";
      case "has-token":
        return this.state.authToken;
      case "authenticated":
        return this.state.resource.payload.authToken;
    }
  }

  @computed
  get links(): Link[] {
    switch (this.state.kind) {
      case "initializing":
      case "anonymous":
      case "identifying":
      case "has-token":
        return [];
      case "authenticated":
        return this.state.resource.links;
    }
  }

  unsetAuthToken = async () => {
    await AsyncStorage.setItem("authToken", "");
  };

  retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem("authToken");
      if (value !== null) {
        return value;
      }
    } catch (error) {
      return undefined; // Error retrieving data
    }

    return undefined;
  };
}

export const currentUserStore = new CurrentUserStore();
