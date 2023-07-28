import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { domain_name } from './config.json';
import { aws_certificatemanager as certificatemanager } from 'aws-cdk-lib';

// Define the new interface UalAcmProps
export interface UalAcmProps {
    // Include the 'hosted_zone' property here
  hosted_zone: IHostedZone;
  /**
   * The desired ID of the certificate. This value must be changed before deployment
   * Repeated certificate IDs will result in overwriting existing certificates or deployment failure
   *
   * @default
   * The standard ual certificate ID format:
   * /abc/certificates/dev/MyCertificate_CERTIFICATE_NAME
   */
  readonly certificateNameSSMParameter?: string;
}

// Use the new UalAcmProps interface in the class constructor
export class UalAcm extends Construct {
  public readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props: UalAcmProps) {
    super(scope, id);

    // Define the additional options for the Certificate
    const additionalOptions = {
      transparencyLoggingEnabled: true,
    };

    // Create the Certificate using an object literal with additional options
    this.certificate = new Certificate(scope, 'Certificate', {
      domainName: domain_name,
      validation: CertificateValidation.fromDns(props.hosted_zone),
      subjectAlternativeNames: [`*.${domain_name}`],
      ...additionalOptions, // Spread the additional options into the Certificate constructor
    });

    // Optionally, if you want to set the expiryEventsConfigurationProperty
    const expiryEventsConfigurationProperty: certificatemanager.CfnAccount.ExpiryEventsConfigurationProperty = {
      daysBeforeExpiry: 90,
    };
  }
}
