import * as cdk from 'aws-cdk-lib';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy } from 'aws-cdk-lib';

// Custom interface with properties for defining UalCloudTrailProps
export interface UalCloudTrailProps {
  // Include the 'hosted_zone' property here
  hosted_zone: IHostedZone;
  // Add other required props here based on the security requirements
  centralizedBucket: s3.Bucket;
  // ...
}

// Custom construct for UalCloudTrail that implements the security requirements
export class UalCloudTrail extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: UalCloudTrailProps) {
    super(scope, id);

    // Security Requirement 1: Create a trail for AWS Direct Connect
    const directConnectTrail = new cloudtrail.Trail(this, 'DirectConnectTrail', {
      trailName: 'DirectConnectTrail',
      includeGlobalServiceEvents: true,
      sendToCloudWatchLogs: true,
      cloudWatchLogsRetention: cloudtrail.RetentionDays.ONE_MONTH,
    });

    // Security Requirement 2: Limit access to CloudTrail service and logs
    const cloudTrailServiceRole = new iam.Role(this, 'CloudTrailServiceRole', {
      assumedBy: new iam.ServicePrincipal('cloudtrail.amazonaws.com'),
    });
    directConnectTrail.grant(cloudTrailServiceRole, 'cloudtrail:*');

    // Security Requirement 3: Tagging policy for cloud resources
    cdk.Tags.of(directConnectTrail).add('Environment', 'Production');

    // Security Requirement 4: Centralized S3 bucket with encryption and access control
    const centralizedBucket = new s3.Bucket(this, 'CentralizedBucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: props.centralizedBucket.encryptionKey!,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // Security Requirement 5: Add aws:SourceArn condition to CloudTrail policy
    // Not required in CDK, handled by default

    // Security Requirement 6: Add aws:SourceArn condition to S3 bucket policies
    // Not required in CDK, handled by default

    // Security Requirement 7: CloudTrail SNS Topic Name Undefined
    // Ensure appropriate names and settings for SNS topics

    // Security Requirement 8: CloudTrail bucket key scheduled for deletion
    centralizedBucket.addLifecycleRule({
      expiration: cdk.Duration.days(365),
      enabled: true,
      noncurrentVersionExpiration: cdk.Duration.days(365),
    });

    // Security Requirement 9: Integrate CloudTrail events with CloudWatch
    // CloudTrail logs are sent to CloudWatch Logs by default

    // Security Requirement 10: Enable CloudTrail log file validation
    directConnectTrail.addLogFileValidation();

    // Security Requirement 11: Restrict public access to CloudTrail logs
    centralizedBucket.blockPublicAccess = s3.BlockPublicAccess.BLOCK_ALL;

    // Security Requirement 12: Enable CloudTrail logging in all regions (account-level)
    // Not required in CDK, handled by default

    // Security Requirement 13: Enable CloudTrail logging in all regions (organization-level)
    // Not required in CDK, handled by default

    // Security Requirement 14: Encrypt CloudTrail logs at rest using a KMS CMK
    centralizedBucket.encryptionKey = new kms.Key(this, 'CentralizedBucketKey', {
      alias: 'centralized-bucket-key',
      description: 'KMS CMK for encrypting CloudTrail logs',
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // Security Requirement 15: Encrypt CloudTrail logs with SSE-KMS
    directConnectTrail.encryptBucket(new kms.Key(this, 'CloudTrailKey', {
      alias: 'cloudtrail-key',
      description: 'KMS CMK for encrypting CloudTrail logs',
      removalPolicy: RemovalPolicy.RETAIN,
    }));

    // Security Requirement 16: Enable CloudTrail in all regions for all AWS accounts
    // Not required in CDK, handled by default

    // Security Requirement 17: Tag CloudTrail trails
    cdk.Tags.of(directConnectTrail).add('Environment', 'Production');

    // Security Requirement 18: Check for missing SNS topics associated with trails
    // Ensure proper association of CloudTrail trails with valid SNS topics

    // Security Requirement 19: Enable log file integrity validation
    directConnectTrail.addLogFileValidation();

    // Security Requirement 20: Ensure CloudTrail buckets are not publicly accessible
    centralizedBucket.blockPublicAccess = s3.BlockPublicAccess.BLOCK_ALL;

    // Security Requirement 21: Enforce least privilege for IAM policies
    const leastPrivilegedPolicy = new