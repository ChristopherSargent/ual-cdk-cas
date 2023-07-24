import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface SSMProps {
  vpc: ec2.IVpc;
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
      vpc: props.vpc,
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
    const sensitiveEnvironmentVariable = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      'SensitiveEnvironmentVariable',
      {
        parameterName: '/path/to/sensitive/environment-variable',
        version: 1, // Specify the parameter version
      }
    );
    // You can add more code to handle other requirements as needed
  }
}
