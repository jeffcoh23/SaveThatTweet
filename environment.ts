import Constants from "expo-constants";

const localhost = "http://localhost:3000";
// const localhost = "https://522a-68-161-202-223.ngrok.io";

const production = "https://www.savethattweet.com/";

const admobBannerProd = "ca-app-pub-2307234117375592/2397205341";
const admobBannerLocal = "ca-app-pub-3940256099942544/2934735716";
const ENV = {
  dev: {
    apiUrl: localhost,
    admobBannerId: admobBannerLocal,
    testId: "EMULATOR",
  },

  staging: {
    apiUrl: production,
    testId: undefined,
    admobBannerId: admobBannerProd,
  },
  prod: {
    apiUrl: production,
    testId: undefined,
    admobBannerId: admobBannerProd,
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__) {
    return ENV.dev;
  } else if (env === "staging") {
    return ENV.staging;
  } else if (env === "prod") {
    return ENV.prod;
  } else {
    return ENV.prod;
  }
};

export default getEnvVars;
