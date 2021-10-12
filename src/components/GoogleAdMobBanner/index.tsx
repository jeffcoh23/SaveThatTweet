import React, { useState } from "react";
import getEnvVars from "../../../environment";
import { AdMobBanner } from "expo-ads-admob";
import { Layout } from "@ui-kitten/components";

interface Props {
  style?: any;
  withSpacing?: boolean;
}

const GoogleAdMobBanner: React.FC<Props> = ({ withSpacing, style }) => {
  const [showAd, toggleShowAd] = useState(true);
  const hideAd = () => toggleShowAd(false);
  return showAd ? (
    <Layout style={withSpacing ? { marginVertical: 10 } : {}}>
      <AdMobBanner
        style={style}
        bannerSize="smartBannerPortrait"
        adUnitID={getEnvVars().admobBannerId}
        testID={getEnvVars().testId}
        onDidFailToReceiveAdWithError={hideAd}
      />
    </Layout>
  ) : (
    <></>
  );
};

export default GoogleAdMobBanner;
