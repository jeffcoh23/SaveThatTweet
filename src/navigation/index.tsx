import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { observer } from "mobx-react";
import AccountScreen from "../screens/AccountScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TweetDetailsScreen from "../screens/TweetDetailsScreen";
import * as Linking from "expo-linking";
import { navigationRef } from "./RootNavigation";
import { Button, Icon } from "@ui-kitten/components";
import { currentUserStore } from "../stores/CurrentUserStore";
import LoginScreen from "../screens/LoginScreen";
import CentralSpinner from "../components/CentralSpinner";

export type RootStackParamList = {
  TweetDetails: { savedTweetId: string };
  Tweets: undefined;
};

export type TabStackParamList = {
  Home: {};
  Settings: {};
};

const config = {
  screens: {
    Home: {
      screens: { TweetDetails: "savedTweets/:savedTweetId" },
    },
  },
};

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [
    "http://www.savethattweet.com",
    "www.savethattweet.com",
    "http://savethattweet.com",
    "https://www.savethattweet.com",
    "https://savethattweet.com",
    ...prefix,
  ],
  config,
};

const HomeStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabStackParamList>();

const HomeStackScreen = observer(() => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Tweets" component={HomeScreen} />
      <HomeStack.Screen name="TweetDetails" component={TweetDetailsScreen} />
    </HomeStack.Navigator>
  );
});

const AuthenticatedApp = observer(() => (
  <NavigationContainer ref={navigationRef} linking={linking}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#222B45" },
      })}
    >
      <Tab.Screen
        options={({ navigation }) => ({
          title: "Home",
          tabBarIcon: () => (
            <Icon height={25} fill="white" width={25} name="home" />
          ),
        })}
        name="Home"
        component={HomeStackScreen}
      />
      <Tab.Screen
        options={({ navigation }) => ({
          title: "Account",
          tabBarIcon: () => (
            <Icon height={25} fill="white" width={25} name="person-outline" />
          ),
        })}
        name="Settings"
        component={AccountScreen}
      />
    </Tab.Navigator>
  </NavigationContainer>
));

const NavigationApp = () => {
  switch (currentUserStore.state.kind) {
    case "anonymous":
      return (
        <SafeAreaProvider style={{ flex: 1 }}>
          <LoginScreen />
        </SafeAreaProvider>
      );

    case "has-token":
    case "identifying":
    case "initializing":
      return <CentralSpinner />;
    case "authenticated":
      return (
        <SafeAreaProvider style={{ flex: 1 }}>
          <AuthenticatedApp />
        </SafeAreaProvider>
      );
  }
};

export default observer(NavigationApp);
