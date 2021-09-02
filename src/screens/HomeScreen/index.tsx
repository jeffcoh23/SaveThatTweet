import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import * as React from "react";
import CentralSpinner from "../../components/CentralSpinner";
import { RootStackParamList } from "../../navigation";
import { currentUserStore } from "../../stores/CurrentUserStore";
import LoginScreen from "../LoginScreen";
import HomeScreenContent from "./HomeScreenContent";
import { TabStackParamList } from "./../../navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

interface Props {}

class HomeScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    switch (currentUserStore.state.kind) {
      case "initializing":
      case "identifying":
      case "has-token":
        return <CentralSpinner />;
      case "authenticated":
        return <HomeScreenContent navigation={this.props.navigation} />;
      case "anonymous":
        return <LoginScreen />;
    }
  }
}

export default observer(HomeScreen);
