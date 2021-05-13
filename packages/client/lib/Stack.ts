import * as sst from "@serverless-stack/resources";
import { NextJSLambdaEdge } from "@sls-next/cdk-construct";

export default class Stack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const nextjs = new NextJSLambdaEdge(this, "NextJsApp", {
      serverlessBuildOutDir: "./build",
    });

    this.addOutputs({
      NextJSLambdaEdge: nextjs.distribution.domainName,
    });
  }
}
