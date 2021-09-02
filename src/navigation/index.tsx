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
    TweetDetails: "savedTweets/:savedTweetId",
  },
};

const prefix = Linking.createURL("/");

const linking = {
  prefixes: ["https://savethattweet.com", ...prefix],
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

const NavigationApp = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
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
                <Icon
                  height={25}
                  fill="white"
                  width={25}
                  name="person-outline"
                />
              ),
            })}
            name="Settings"
            component={AccountScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default observer(NavigationApp);