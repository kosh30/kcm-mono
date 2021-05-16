import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { HostedZone } from "@aws-cdk/aws-route53";
import * as sst from "@serverless-stack/resources";
import { NextJSLambdaEdge } from "@sls-next/cdk-construct";

export default class Stack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const nextjs = new NextJSLambdaEdge(this, "NextJsApp", {
      domain: {
        certificate: Certificate.fromCertificateArn(
          this,
          "Certificate",
          "arn:aws:acm:us-east-1:374494503513:certificate/c14fd0ed-44e0-48c2-90e2-c5dbb046f0a5"
        ),
        domainNames: [
          `${
            this.stage !== "prod" ? `${this.stage}.` : ""
          }karnscategorymanager.com`,
        ],
        hostedZone: HostedZone.fromHostedZoneAttributes(this, "Zone", {
          hostedZoneId: "Z03567093CUBN4U7M7ZLF",
          zoneName: "karnscategorymanager.com",
        }),
      },
      serverlessBuildOutDir: "./build",
    });

    this.addOutputs({
      NextJSLambdaEdge: nextjs.distribution.domainName,
    });
  }
}
