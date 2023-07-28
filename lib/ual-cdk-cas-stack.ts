import { Stack, StackProps } from 'aws-cdk-lib';
import { Port, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { UalAcm } from './acm/acm';
import { SSM } from './ssm/ssm';
import { Route53 } from './route53/route53';


//export declare class UalCdkCasStack extends Stack {

export class UalCdkCasStack extends Stack {
  public readonly acm: UalAcm;
  public readonly ssm: SSM;
  public readonly route53: Route53;
  public readonly vpc: Vpc;

    //constructor(scope: Construct, id: string, props?: StackProps);
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);
    
      this.route53 = new Route53(this, 'Route53');

      this.acm = new UalAcm(this, 'ACM', {
        hosted_zone: this.route53.hosted_zone,
      });
  
      this.vpc = new Vpc(this, 'UalCdkCasVPC', {
        subnetConfiguration: [
          {
            cidrMask: 24,
            name: 'ingress',
            subnetType: SubnetType.PUBLIC,
          },
          {
            cidrMask: 24,
            name: 'compute',
            subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          },
          {
            cidrMask: 28,
            name: 'rds',
            subnetType: SubnetType.PRIVATE_ISOLATED,
          },
        ],
      });
  
  }
}