import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, FlowLog, FlowLogDestination, FlowLogTrafficType, FlowLogResourceType } from 'aws-cdk-lib/aws-ec2';
import { SSM } from './ssm/ssm';

export class UalCdkCasStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define your VPC for sensitive resources
    const existingVpc = Vpc.fromLookup(this, 'ExistingVpc', {
      vpcId: 'vpc-0e25f2478216c2dfa', // Replace with the appropriate VPC ID
    });

    // Enable VPC flow logs for the existing VPC
    const flowLog = new FlowLog(this, 'VpcFlowLog', {
      resourceType: FlowLogResourceType.fromVpc(existingVpc),
      trafficType: FlowLogTrafficType.ALL,
      destination: FlowLogDestination.toCloudWatchLogs(),
    });

    // Define your encryption key alias for SSM
    const encryptionKeyAlias = 'alias/aws/ssm'; // Replace with the actual encryption key alias

    // Create an instance of the SSM custom construct and add it to the stack
    new SSM(this, 'SSMConstruct', { vpc: existingVpc, encryptionKeyAlias });

    // Optionally, you can add more constructs or resources to the stack as needed
  }
}
