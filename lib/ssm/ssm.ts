import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Port, SubnetType, Vpc, FlowLog, FlowLogDestination, FlowLogTrafficType, FlowLogResourceType } from 'aws-cdk-lib/aws-ec2';

export interface SSMProps {
  vpc: ec2.IVpc; // Update this type to IVpc
  encryptionKeyAlias: string;
}

export class SSM extends Construct {
  constructor(scope: Construct, id: string, props: SSMProps) {
    super(scope, id);

    // Requirement 1: Reference the existing SecureString parameter
    const sensitiveParameter = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'SensitiveParameter', {
      parameterName: '/path/to/sensitive/parameter',
      version: 1, // Specify the parameter version
    });

    // Requirement 2: Define AllowedValue and AllowedPattern for document parameters
    const documentParameter = new ssm.StringParameter(this, 'DocumentParameter', {
      parameterName: '/path/to/document/parameter',
      stringValue: '123-45-6789',
      allowedPattern: '^\\d{3}-\\d{2}-\\d{4}$',
    });

    // Requirement 3: Interface VPC Endpoints for SSM
    const ssmEndpoint = new ec2.InterfaceVpcEndpoint(this, 'SSMEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SSM,
      vpc: props.vpc, // Use IVpc from SSMProps
      // Other configuration for the endpoint, if needed
    });

    // Requirement 4: Least privilege access for administering SSM
    const ssmRole = new iam.Role(this, 'SSMRole', {
      assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
    });
    // Attach a policy with least privilege permissions for administering SSM
    // Replace 'AmazonSSMFullAccess' with the appropriate policy based on your requirements
    ssmRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMFullAccess'));

    // Requirement 5: Restrict Session Manager users to Interactive Commands
    const ssmPolicy = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ssm:StartSession'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'aws:RequestedRegion': 'us-west-2', // Replace with your desired region
          },
          Bool: {
            'aws:DocumentRequireInteractive': true,
          },
        },
      });
      ssmRole.addToPolicy(ssmPolicy);

    // Requirement 6: Store sensitive variables/parameters in SSM as SecureString
    const sensitiveEnvironmentVariable = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'SensitiveEnvironmentVariable', {
      parameterName: '/path/to/sensitive/environment-variable',
      version: 1, // Specify the parameter version
    });
    // You can add more code to handle other requirements as needed
  }
}

export class UalCdkCasStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define your VPC for sensitive resources
    const existingVpc = ec2.Vpc.fromLookup(this, 'ExistingVpc', {
      vpcId: 'vpc-0e25f2478216c2dfa', // Replace with the appropriate VPC ID
    });

    // Enable VPC flow logs for the existing VPC
    const flowLog = new ec2.FlowLog(this, 'VpcFlowLog', {
      resourceType: ec2.FlowLogResourceType.fromVpc(existingVpc),
      trafficType: ec2.FlowLogTrafficType.ALL,
      destination: ec2.FlowLogDestination.toCloudWatchLogs(),
    });

        // Define your new VPC for sensitive resources
        const newVpc = new Vpc(this, 'NewVPC', {
            subnetConfiguration: [
              {
                cidrMask: 24,
                name: 'ingress',
                subnetType: SubnetType.PUBLIC,
              },
              {
                cidrMask: 24,
                name: 'compute',
                subnetType: SubnetType.PRIVATE_WITH_NAT,
              },
              {
                cidrMask: 28,
                name: 'rds',
                subnetType: SubnetType.PRIVATE_ISOLATED,
              },
            ],
          });
      
          // Enable VPC flow logs for the new VPC
          const flowLogNewVpc = new FlowLog(this, 'VpcFlowLogNew', {
            resourceType: FlowLogResourceType.fromVpc(newVpc),
            trafficType: FlowLogTrafficType.ALL,
            destination: FlowLogDestination.toCloudWatchLogs(),
          });

    // Define your encryption key alias for SSM
    const encryptionKeyAlias = 'alias/aws/ssm'; // Replace with the actual encryption key alias

    // Create an instance of the SSM custom construct and add it to the stack
    new SSM(this, 'SSMConstruct', { vpc: existingVpc, encryptionKeyAlias });
  }
}
