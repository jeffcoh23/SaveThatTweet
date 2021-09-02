import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import React from "react";
import NavigationApp from "./src/navigation";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import CurrentUserReaction from "./src/reactions/CurrentUserReaction";
import { observer } from "mobx-react";

const App = () => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <NavigationApp />
        <CurrentUserReaction />
      </ApplicationProvider>
    </>
  );
};

export default observer(App);
