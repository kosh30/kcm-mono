import * as sst from "@serverless-stack/resources";

import Stack from "./Stack";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
  });

  new Stack(app, "stack");
}
