#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UalCdkCasStack } from '../lib/ssm/ssm'; // Import the UalCdkCasStack construct from ssm.ts

const app = new cdk.App();

const stack = new UalCdkCasStack(app, 'UalCdkCasStack', {
  // Provide any required configuration for the UalCdkCasStack here
  env: { account: '507370583167', region: 'us-east-1' },
});

// Optionally, you can add more constructs or resources to the stack as needed

// Synthesize the AWS CDK app
app.synth();
