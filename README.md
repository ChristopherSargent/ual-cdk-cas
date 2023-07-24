![alt text](swclogo.jpg)
# CDKCasStack
This repository contains aws cdk to deploy s3 custom react todo app, s3, vpc, acm, cname and A records, LB, ECS and custom container image. For additional details, please email at [christopher.sargent@sargentwalker.io](mailto:christopher.sargent@sargentwalker.io).

# Install aws cli
1. ssh cas@172.18.0.193
2. sudo -i 
3. curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
4. apt install unzip -y && unzip awscliv2.zip
5. ./aws/install -i /usr/local/aws-cli -b /usr/local/bin/
6. export PATH=/usr/local/bin/:$PATH
7. complete -C '/usr/local/bin/aws_completer' aws
8. aws configure
9. aws s3 ls
```
2023-07-14 09:56:13 cass301
```
# Install Node js
1. ssh cas@172.18.0.193
2. sudo -i 
3. curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
4. bash nodesource_setup.sh
5. apt install gcc g++ make nodejs -y 
6. node -v
```
v18.16.1
```
7. npm -v
```
9.5.1
```
# Install AWS CDK
1. ssh cas@172.18.0.193
2. sudo -i 
3. npm install -g aws-cdk@2.25.0

# Install ual-cdk-cas
1. ssh cas@172.18.0.193
2. sudo -i
3. cd /home/cas/ual-cdk-cas && cdk init app --language typescript
4. vim bin/ual-cdk-cas.ts
* 
```
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UalCdkCasStack } from '../lib/ual-cdk-cas-stack'; // Import the UalCdkCasStack construct

const app = new cdk.App();

const stack = new UalCdkCasStack(app, 'UalCdkCasStack', {
  // Provide any required configuration for the UalCdkCasStack here
  env: { account: '507370583167', region: 'us-east-1' },
});

// Optionally, you can add more constructs or resources to the stack as needed

// Synthesize the AWS CDK app
app.synth();

```
5. vim lib/ual-cdk-cas-stack
* 
```
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
```
6. mkdir lib/ssm 
7. vim lib/ssm/ssm.ts
```
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
```
8. cdk synth
```
Resources:
  VpcFlowLogIAMRoleB4DCB624:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: vpc-flow-logs.amazonaws.com
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: UalCdkCasStack/VpcFlowLog/IAMRole/Resource
  VpcFlowLogIAMRoleDefaultPolicy7533133B:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - logs:CreateLogStream
              - logs:DescribeLogStreams
              - logs:PutLogEvents
            Effect: Allow
            Resource:
              Fn::GetAtt:
                - VpcFlowLogLogGroupBB186289
                - Arn
          - Action: iam:PassRole
            Effect: Allow
            Resource:
              Fn::GetAtt:
                - VpcFlowLogIAMRoleB4DCB624
                - Arn
        Version: "2012-10-17"
      PolicyName: VpcFlowLogIAMRoleDefaultPolicy7533133B
      Roles:
        - Ref: VpcFlowLogIAMRoleB4DCB624
    Metadata:
      aws:cdk:path: UalCdkCasStack/VpcFlowLog/IAMRole/DefaultPolicy/Resource
  VpcFlowLogLogGroupBB186289:
    Type: AWS::Logs::LogGroup
    Properties:
      RetentionInDays: 731
    UpdateReplacePolicy: Retain
    DeletionPolicy: Retain
    Metadata:
      aws:cdk:path: UalCdkCasStack/VpcFlowLog/LogGroup/Resource
  VpcFlowLogF72230C7:
    Type: AWS::EC2::FlowLog
    Properties:
      DeliverLogsPermissionArn:
        Fn::GetAtt:
          - VpcFlowLogIAMRoleB4DCB624
          - Arn
      LogDestinationType: cloud-watch-logs
      LogGroupName:
        Ref: VpcFlowLogLogGroupBB186289
      ResourceId: vpc-0e25f2478216c2dfa
      ResourceType: VPC
      TrafficType: ALL
    Metadata:
      aws:cdk:path: UalCdkCasStack/VpcFlowLog/FlowLog
  SSMConstructDocumentParameterED063CD5:
    Type: AWS::SSM::Parameter
    Properties:
      AllowedPattern: ^\d{3}-\d{2}-\d{4}$
      Name: /path/to/document/parameter
      Type: String
      Value: 123-45-6789
    Metadata:
      aws:cdk:path: UalCdkCasStack/SSMConstruct/DocumentParameter/Resource
  SSMConstructSSMEndpointSecurityGroupD2BA8F5D:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: UalCdkCasStack/SSMConstruct/SSMEndpoint/SecurityGroup
      SecurityGroupEgress:
        - CidrIp: 0.0.0.0/0
          Description: Allow all outbound traffic by default
          IpProtocol: "-1"
      SecurityGroupIngress:
        - CidrIp: 172.31.0.0/16
          Description: from 172.31.0.0/16:443
          FromPort: 443
          IpProtocol: tcp
          ToPort: 443
      VpcId: vpc-0e25f2478216c2dfa
    Metadata:
      aws:cdk:path: UalCdkCasStack/SSMConstruct/SSMEndpoint/SecurityGroup/Resource
  SSMConstructSSMEndpoint90102B8E:
    Type: AWS::EC2::VPCEndpoint
    Properties:
      PrivateDnsEnabled: true
      SecurityGroupIds:
        - Fn::GetAtt:
            - SSMConstructSSMEndpointSecurityGroupD2BA8F5D
            - GroupId
      ServiceName: com.amazonaws.us-east-1.ssm
      SubnetIds:
        - subnet-0f174dc95909a8f41
        - subnet-012bf401b47b837c4
        - subnet-0a43904bfb9b97599
        - subnet-0c853d2b9e6a834d6
        - subnet-08f5c7674f490fedc
        - subnet-09d154b1ede8f008e
      VpcEndpointType: Interface
      VpcId: vpc-0e25f2478216c2dfa
    Metadata:
      aws:cdk:path: UalCdkCasStack/SSMConstruct/SSMEndpoint/Resource
  SSMConstructSSMRole0C7A81B7:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: ssm.amazonaws.com
        Version: "2012-10-17"
      ManagedPolicyArns:
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/AmazonSSMFullAccess
    Metadata:
      aws:cdk:path: UalCdkCasStack/SSMConstruct/SSMRole/Resource
  SSMConstructSSMRoleDefaultPolicy2BA91AC4:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action: ssm:StartSession
            Condition:
              StringEquals:
                aws:RequestedRegion: us-west-2
              Bool:
                aws:DocumentRequireInteractive: true
            Effect: Allow
            Resource: "*"
        Version: "2012-10-17"
      PolicyName: SSMConstructSSMRoleDefaultPolicy2BA91AC4
      Roles:
        - Ref: SSMConstructSSMRole0C7A81B7
    Metadata:
      aws:cdk:path: UalCdkCasStack/SSMConstruct/SSMRole/DefaultPolicy/Resource
  CDKMetadata:
    Type: AWS::CDK::Metadata
    Properties:
      Analytics: v2:deflate64:H4sIAAAAAAAA/2VPwQ6CMAz9Fu+jigfD3agx8UAw4WrmqKQ6VrINiVn27wKKF0997Xt9fV1DlsFqIXuXqOqRaLpCOHupHqJAx51VKAbuElCtIew19yeuxfZmZng0Hu1NKixbtTNVy2S8OKPqLPnXwXLXjuq/QZlvZ3UUJBsIBWscmanmrEm9xvaDotBcOwjDxZ/FjKNwrhlDWzJ1Lq1scIg07c5NjJPz96EoDFcId7d8phmkG0gXd0eU2M54ahCKT30DNuYjyhoBAAA=
    Metadata:
      aws:cdk:path: UalCdkCasStack/CDKMetadata/Default
Parameters:
  BootstrapVersion:
    Type: AWS::SSM::Parameter::Value<String>
    Default: /cdk-bootstrap/hnb659fds/version
    Description: Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]
Rules:
  CheckBootstrapVersion:
    Assertions:
      - Assert:
          Fn::Not:
            - Fn::Contains:
                - - "1"
                  - "2"
                  - "3"
                  - "4"
                  - "5"
                - Ref: BootstrapVersion
        AssertDescription: CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI.
```
9. cdk synth | regula run
```
No problems found. I knew you could do it.
```
10. cdk bootstrap
```
 ⏳  Bootstrapping environment aws://507370583167/us-east-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.

 ✨ hotswap deployment skipped - no changes were detected (use --force to override)

 ✅  Environment aws://507370583167/us-east-1 bootstrapped (no changes).
```
11. cdk deploy 
```
✨  Synthesis time: 6.93s

UalCdkCasStack:  start: Building c126734b3d7d2b67664ce45355fe976bf5671d3156f0d9c8c35eae2841414414:507370583167-us-east-1
UalCdkCasStack:  success: Built c126734b3d7d2b67664ce45355fe976bf5671d3156f0d9c8c35eae2841414414:507370583167-us-east-1
UalCdkCasStack:  start: Publishing c126734b3d7d2b67664ce45355fe976bf5671d3156f0d9c8c35eae2841414414:507370583167-us-east-1
UalCdkCasStack:  success: Published c126734b3d7d2b67664ce45355fe976bf5671d3156f0d9c8c35eae2841414414:507370583167-us-east-1
This deployment will make potentially sensitive changes according to your current security approval level (--require-approval broadening).
Please confirm you intend to make the following modifications:

IAM Statement Changes
┌───┬─────────────────────────────┬────────┬──────────────────────────────────────────────────────────────┬─────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   │ Resource                    │ Effect │ Action                                                       │ Principal                           │ Condition                                                                                                 │
├───┼─────────────────────────────┼────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${SSMConstruct/SSMRole.Arn} │ Allow  │ sts:AssumeRole                                               │ Service:ssm.amazonaws.com           │                                                                                                           │
├───┼─────────────────────────────┼────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${VpcFlowLog/IAMRole.Arn}   │ Allow  │ sts:AssumeRole                                               │ Service:vpc-flow-logs.amazonaws.com │                                                                                                           │
│ + │ ${VpcFlowLog/IAMRole.Arn}   │ Allow  │ iam:PassRole                                                 │ AWS:${VpcFlowLog/IAMRole}           │                                                                                                           │
├───┼─────────────────────────────┼────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${VpcFlowLog/LogGroup.Arn}  │ Allow  │ logs:CreateLogStream                                         │ AWS:${VpcFlowLog/IAMRole}           │                                                                                                           │
│   │                             │        │ logs:DescribeLogStreams                                      │                                     │                                                                                                           │
│   │                             │        │ logs:PutLogEvents                                            │                                     │                                                                                                           │
├───┼─────────────────────────────┼────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ *                           │ Allow  │ ssm:StartSession                                             │ AWS:${SSMConstruct/SSMRole}         │ "StringEquals": {                                                                                         │
│   │                             │        │                                                              │                                     │   "aws:RequestedRegion": "us-west-2"                                                                      │
│   │                             │        │                                                              │                                     │ },                                                                                                        │
│   │                             │        │                                                              │                                     │ "Bool": {                                                                                                 │
│   │                             │        │                                                              │                                     │   "aws:DocumentRequireInteractive": true                                                                  │
│   │                             │        │                                                              │                                     │ }                                                                                                         │
└───┴─────────────────────────────┴────────┴──────────────────────────────────────────────────────────────┴─────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
IAM Policy Changes
┌───┬─────────────────────────┬───────────────────────────────────────────────────────────┐
│   │ Resource                │ Managed Policy ARN                                        │
├───┼─────────────────────────┼───────────────────────────────────────────────────────────┤
│ + │ ${SSMConstruct/SSMRole} │ arn:${AWS::Partition}:iam::aws:policy/AmazonSSMFullAccess │
└───┴─────────────────────────┴───────────────────────────────────────────────────────────┘
Security Group Changes
┌───┬───────────────────────────────────────────────────┬─────┬────────────┬─────────────────┐
│   │ Group                                             │ Dir │ Protocol   │ Peer            │
├───┼───────────────────────────────────────────────────┼─────┼────────────┼─────────────────┤
│ + │ ${SSMConstruct/SSMEndpoint/SecurityGroup.GroupId} │ In  │ TCP 443    │ 172.31.0.0/16   │
│ + │ ${SSMConstruct/SSMEndpoint/SecurityGroup.GroupId} │ Out │ Everything │ Everyone (IPv4) │
└───┴───────────────────────────────────────────────────┴─────┴────────────┴─────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Do you wish to deploy these changes (y/n)?
```
12. 

# CDK-nag
* [cdk-nag-walkthrough](https://aws.amazon.com/blogs/devops/manage-application-security-and-compliance-with-the-aws-cloud-development-kit-and-cdk-nag/)
* [cdk-nag-github](https://github.com/cdklabs/cdk-nag)
1. ssh cas@172.18.0.193
2. sudo -i 
3. 
4. vim package.json
* update aws-cdk-lib": "2.34.0" to aws-cdk-lib": "2.78.0"
```
{
  "name": "chapter-4",
  "version": "0.1.0",
  "bin": {
    "chapter-4": "bin/chapter-4.js"
  },
  "scripts": {
    "build:frontend": "cd ../web && yarn install && yarn build",
    "build": "tsc",
    "watch": "tsc -w",
    "test": "jest",
    "cdk": "cdk"
  },
  "devDependencies": {
    "@types/cors": "^2.8.12",
    "@types/express": "^4.17.13",
    "@types/jest": "^27.5.0",
    "@types/node": "10.17.27",
    "@types/prettier": "2.6.0",
    "@types/uuid": "^8.3.4",
    "@typescript-eslint/eslint-plugin": "^5.31.0",
    "@typescript-eslint/parser": "^5.31.0",
    "aws-cdk": "2.34.0",
    "eslint": "^8.20.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-import-resolver-typescript": "^3.3.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-promise": "^6.0.0",
    "jest": "^27.5.1",
    "prettier": "^2.7.1",
    "ts-jest": "^27.1.4",
    "ts-node": "^10.7.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "~3.9.7"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.121.0",
    "@aws-sdk/lib-dynamodb": "^3.121.0",
    "aws-cdk-lib": "2.78.0",
    "cdk-nag": "^2.27.79",
    "constructs": "^10.0.0",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "source-map-support": "^0.5.21",
    "uuid": "^8.3.2"
  }
}
```
5. vim bin/chapter-4.ts 
* add cdk-nag check imports and Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
```
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Chapter3Stack } from '../lib/chapter-4-stack';
// Add cdk-nag checks 
import { AwsSolutionsChecks } from 'cdk-nag'
import { Aspects } from 'aws-cdk-lib';

const app = new cdk.App();
// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
// Original Chapter4Stack below
new Chapter3Stack(app, 'Chapter4Stack', {
//  env: { region: 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT },
    env: { account: '507370583167', region: 'us-east-1' },
});
```
6. npm install cdk-nag
7. cdk synth
```
[WARNING] aws-cdk-lib.aws_ec2.SubnetType#PRIVATE_WITH_NAT is deprecated.
  use `PRIVATE_WITH_EGRESS`
  This API will be removed in the next major release.
[Error at /Chapter4Stack/MyVPC/Resource] AwsSolutions-VPC7: The VPC does not have an associated Flow Log. VPC Flow Logs capture network flow information for a VPC, subnet, or network interface and stores it in Amazon CloudWatch Logs. Flow log data can help customers troubleshoot network issues; for example, to diagnose why specific traffic is not reaching an instance, which might be a result of overly restrictive security group rules.

[Error at /Chapter4Stack/WebBucket/Resource] AwsSolutions-S1: The S3 Bucket has server access logs disabled. The bucket should have server access logging enabled to provide detailed records for the requests that are made to the bucket.

[Error at /Chapter4Stack/WebBucket/Resource] AwsSolutions-S2: The S3 Bucket does not have public access restricted and blocked. The bucket should have public access restricted and blocked to prevent unauthorized access.

[Error at /Chapter4Stack/WebBucket/Resource] AwsSolutions-S5: The S3 static website bucket either has an open world bucket policy or does not use a CloudFront Origin Access Identity (OAI) in the bucket policy for limited getObject and/or putObject permissions. An OAI allows you to provide access to content in your S3 static website bucket through CloudFront URLs without enabling public access through an open bucket policy, disabling S3 Block Public Access settings, and/or through object ACLs.

[Error at /Chapter4Stack/WebBucket/Resource] AwsSolutions-S10: The S3 Bucket or bucket policy does not require requests to use SSL. You can use HTTPS (TLS) to help prevent potential attackers from eavesdropping on or manipulating network traffic using person-in-the-middle or similar attacks. You should allow only encrypted connections over HTTPS (TLS) using the aws:SecureTransport condition on Amazon S3 bucket policies.

[Error at /Chapter4Stack/WebBucket/Policy/Resource] AwsSolutions-S10: The S3 Bucket or bucket policy does not require requests to use SSL. You can use HTTPS (TLS) to help prevent potential attackers from eavesdropping on or manipulating network traffic using person-in-the-middle or similar attacks. You should allow only encrypted connections over HTTPS (TLS) using the aws:SecureTransport condition on Amazon S3 bucket policies.

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:GetBucket*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:GetObject*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:List*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::arn:<AWS::Partition>:s3:::cdk-hnb659fds-assets-507370583167-us-east-1/*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:Abort*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:DeleteObject*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::<WebBucket12880F5B.Arn>/*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/Resource] AwsSolutions-L1: The non-container Lambda function is not configured to use the latest runtime version. Use the latest available runtime for the targeted language to avoid technical debt. Runtimes specific to a language or framework version are deprecated when the version reaches end of life. This rule only applies to non-container Lambda functions.

[Warning at /Chapter4Stack/Frontend-Distribution/Resource] AwsSolutions-CFR1: The CloudFront distribution may require Geo restrictions. Geo restriction may need to be enabled for the distribution in order to allow or deny a country in order to allow or restrict users in specific locations from accessing content.

[Warning at /Chapter4Stack/Frontend-Distribution/Resource] AwsSolutions-CFR2: The CloudFront distribution may require integration with AWS WAF. The Web Application Firewall can help protect against application-layer attacks that can compromise the security of the system or place unnecessary load on them.

[Error at /Chapter4Stack/Frontend-Distribution/Resource] AwsSolutions-CFR3: The CloudFront distribution does not have access logging enabled. Enabling access logs helps operators track all viewer requests for the content delivered through the Content Delivery Network.

[Error at /Chapter4Stack/Frontend-Distribution/Resource] AwsSolutions-CFR5: The CloudFront distributions uses SSLv3 or TLSv1 for communication to the origin. Vulnerabilities have been and continue to be discovered in the deprecated SSL and TLS protocols. Using a security policy with minimum TLSv1.1 or TLSv1.2 and appropriate security ciphers for HTTPS helps protect viewer connections.

[Error at /Chapter4Stack/MySQLCredentials/Resource] AwsSolutions-SMG4: The secret does not have automatic rotation scheduled. AWS Secrets Manager can be configured to automatically rotate the secret for a secured service or database.

[Error at /Chapter4Stack/MySQL-RDS-Instance/Resource] AwsSolutions-RDS2: The RDS instance or Aurora DB cluster does not have storage encryption enabled. Storage encryption helps protect data-at-rest by encrypting the underlying storage, automated backups, read replicas, and snapshots for the database.

[Error at /Chapter4Stack/MySQL-RDS-Instance/Resource] AwsSolutions-RDS3: The non-Aurora RDS DB instance does not have multi-AZ support enabled. Use multi-AZ deployment configurations for high availability and automatic failover support fully managed by AWS.

[Error at /Chapter4Stack/MySQL-RDS-Instance/Resource] AwsSolutions-RDS10: The RDS instance or Aurora DB cluster does not have deletion protection enabled. Enabling Deletion Protection at the cluster level for Amazon Aurora databases or instance level for non Aurora instances helps protect from accidental deletion.

[Error at /Chapter4Stack/MySQL-RDS-Instance/Resource] AwsSolutions-RDS11: The RDS instance or Aurora DB cluster uses the default endpoint port. Port obfuscation (using a non default endpoint port) adds an additional layer of defense against non-targeted attacks (i.e. MySQL/Aurora port 3306, SQL Server port 1433, PostgreSQL port 5432, etc).

[Error at /Chapter4Stack/Function/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/Function/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/AwsCustomResourceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::arn:aws:lambda:us-east-1:507370583167:function:*-ResInitChapter4Stack]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Warning at /Chapter4Stack/AwsCustomResource] installLatestAwsSdk was not specified, and defaults to true. You probably do not want this. Set the global context flag '@aws-cdk/customresources:installLatestAwsSdkDefault' to false to switch this behavior off project-wide, or set the property explicitly to true if you know you need to call APIs that are not in Lambda's built-in SDK version.
[Error at /Chapter4Stack/AwsCustomResource/CustomResourcePolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/AWS679f53fac002430cb0da5b7982bd2287/Resource] AwsSolutions-L1: The non-container Lambda function is not configured to use the latest runtime version. Use the latest available runtime for the targeted language to avoid technical debt. Runtimes specific to a language or framework version are deprecated when the version reaches end of life. This rule only applies to non-container Lambda functions.

[Error at /Chapter4Stack/EcsCluster/Resource] AwsSolutions-ECS4: The ECS Cluster has CloudWatch Container Insights disabled. CloudWatch Container Insights allow operators to gain a better perspective on how the cluster’s applications and microservices are performing.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::ecs:Submit*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LaunchConfig] AwsSolutions-EC26: The resource creates one or more EBS volumes that have encryption disabled. With EBS encryption, you aren't required to build, maintain, and secure your own key management infrastructure. EBS encryption uses KMS keys when creating encrypted volumes and snapshots. This helps protect data at rest.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/ASG] AwsSolutions-AS3: The Auto Scaling Group does not have notifications configured for all scaling events. Notifications on EC2 instance launch, launch error, termination, and termination errors allow operators to gain better insights into systems attributes such as activity and health.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::arn:<AWS::Partition>:autoscaling:us-east-1:507370583167:autoScalingGroup:*:autoScalingGroupName/<EcsClusterDefaultAutoScalingGroupASGC1A785DB>]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/Resource] AwsSolutions-L1: The non-container Lambda function is not configured to use the latest runtime version. Use the latest available runtime for the targeted language to avoid technical debt. Runtimes specific to a language or framework version are deprecated when the version reaches end of life. This rule only applies to non-container Lambda functions.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LifecycleHookDrainHook/Topic/Resource] AwsSolutions-SNS2: The SNS Topic does not have server-side encryption enabled. Server side encryption adds additional protection of sensitive data delivered as messages to subscribers.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LifecycleHookDrainHook/Topic/Resource] AwsSolutions-SNS3: The SNS Topic does not require publishers to use SSL. Without HTTPS (TLS), a network-based attacker can eavesdrop on network traffic or manipulate it, using an attack such as man-in-the-middle. Allow only encrypted connections over HTTPS (TLS) using the aws:SecureTransport condition and the 'sns: Publish' action in the topic policy to force publishers to use SSL. If SSE is already enabled then this control is auto enforced.

[Error at /Chapter4Stack/TaskDefinition/Resource] AwsSolutions-ECS2: The ECS Task Definition includes a container definition that directly specifies environment variables. Use secrets to inject environment variables during container startup from AWS Systems Manager Parameter Store or Secrets Manager instead of directly specifying plaintext environment variables. Updates to direct environment variables require operators to change task definitions and perform new deployments.

[Error at /Chapter4Stack/TaskDefinition/ExecutionRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/LB/Resource] AwsSolutions-ELB2: The ELB does not have access logs enabled. Access logs allow operators to to analyze traffic patterns and identify and troubleshoot security issues.

[Error at /Chapter4Stack/LB/SecurityGroup/Resource] AwsSolutions-EC23: The Security Group allows for 0.0.0.0/0 or ::/0 inbound access. Large port ranges, when open, expose instances to unwanted attacks. More than that, they make traceability of vulnerabilities very difficult. For instance, your web servers may only require 80 and 443 ports to be open, but not all. One of the most common mistakes observed is when  all ports for 0.0.0.0/0 range are open in a rush to access the instance. EC2 instances must expose only to those ports enabled on the corresponding security group level.


Found errors
```
8. cat cdk.out/AwsSolutions-Chapter4Stack-NagReport.csv

# References
* [regula](https://github.com/fugue/regula)
* [regula.dev](https://regula.dev/getting-started.html#tutorial-run-regula-locally-on-terraform-iac)
* [secureCDK](https://www.fugue.co/blog/securing-an-aws-cdk-app-with-regula-and-openpolicyagent)
* [AWS-CDK-API-Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)

# Notes
The `cdk.json` file tells the CDK Toolkit how to execute your app.

# Useful commands
* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
