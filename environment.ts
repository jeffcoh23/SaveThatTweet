import Constants from "expo-constants";

const localhost = "http://localhost:3000";
// const localhost = "http://localhost:3000";

// cant change to slatebets.com until we have SSL available on heroku
// const production = "https://slate-bets-api.herokuapp.com/";
const production = "https://www.savethattweet.com/";

const ENV = {
  dev: {
    apiUrl: localhost,
  },

  staging: {
    apiUrl: production,
  },
  prod: {
    apiUrl: production,
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
