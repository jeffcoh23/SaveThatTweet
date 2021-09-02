import { observer } from "mobx-react";
import getEnvVars from "../../environment";
import serverApi from "../serverApi";
import { currentUserStore } from "../stores/CurrentUserStore";
const { apiUrl } = getEnvVars();

interface Props {}

const getCurrentUser = () => {
  serverApi
    .get(`${apiUrl}/sessions.json`)
    .then(currentUserStore.authenticated)
    .catch(currentUserStore.anonymous);
};

const initializing = async () => {
  const token = await currentUserStore.retrieveToken();
  if (token) {
    currentUserStore.hasToken(token);
  } else {
    currentUserStore.anonymous();
  }
};

const CurrentUserStoreReaction: React.SFC<Props> = () => {
  switch (currentUserStore.state.kind) {
    case "has-token":
    case "identifying":
      getCurrentUser();
      break;
    case "initializing":
      initializing();
      break;
    case "anonymous":
    case "authenticated":
      break;
  }
  return null;
};

export default observer(CurrentUserStoreReaction);
