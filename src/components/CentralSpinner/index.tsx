import React from "react";
import { Layout, Spinner } from "@ui-kitten/components";

const CentralSpinner = () => (
  <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Spinner />
  </Layout>
);

export default CentralSpinner;
