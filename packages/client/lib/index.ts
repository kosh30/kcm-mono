import * as sst from "@serverless-stack/resources";
import { Builder } from "@sls-next/lambda-at-edge";

import Stack from "./Stack";

export default function main(app: sst.App): void {
  const builder = new Builder(".", "./build", { args: ["build"] });

  builder
    .build()
    .then(() => {
      app.setDefaultFunctionProps({
        runtime: "nodejs14.x",
      });
      new Stack(app, "stack");
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e);
      process.exit(1);
    });
}
