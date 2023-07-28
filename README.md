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
3. cd /home/cas/ual-cdk-cas && checkout -b v125923_branch01
4. npm install
5. cdk synth
```
[WARNING] aws-cdk-lib.aws_ec2.SubnetType#PRIVATE_WITH_NAT is deprecated.
  use `PRIVATE_WITH_EGRESS`
  This API will be removed in the next major release.
Resources:
  Certificate4E7ABB08:
    Type: AWS::CertificateManager::Certificate
    Properties:
      DomainName: cas.sh
      DomainValidationOptions:
        - DomainName: cas.sh
          HostedZoneId: Z02121921778TTILNLBVT
      SubjectAlternativeNames:
        - "*.cas.sh"
      Tags:
        - Key: Name
          Value: UalCdkCasStack/Certificate
      ValidationMethod: DNS
    Metadata:
      aws:cdk:path: UalCdkCasStack/Certificate/Resource
  MyVPCAFB07A31:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      InstanceTenancy: default
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/Resource
  MyVPCingressSubnet1Subnet826B3239:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1a
      CidrBlock: 10.0.0.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: aws-cdk:subnet-name
          Value: ingress
        - Key: aws-cdk:subnet-type
          Value: Public
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet1
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet1/Subnet
  MyVPCingressSubnet1RouteTableB42CFE20:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet1
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet1/RouteTable
  MyVPCingressSubnet1RouteTableAssociationC24F338C:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet1RouteTableB42CFE20
      SubnetId:
        Ref: MyVPCingressSubnet1Subnet826B3239
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet1/RouteTableAssociation
  MyVPCingressSubnet1DefaultRoute284CEB77:
    Type: AWS::EC2::Route
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId:
        Ref: MyVPCIGW30AB6DD6
      RouteTableId:
        Ref: MyVPCingressSubnet1RouteTableB42CFE20
    DependsOn:
      - MyVPCVPCGWE6F260E1
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet1/DefaultRoute
  MyVPCingressSubnet1EIPEFD3F682:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet1
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet1/EIP
  MyVPCingressSubnet1NATGateway33681E44:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId:
        Fn::GetAtt:
          - MyVPCingressSubnet1EIPEFD3F682
          - AllocationId
      SubnetId:
        Ref: MyVPCingressSubnet1Subnet826B3239
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet1
    DependsOn:
      - MyVPCingressSubnet1DefaultRoute284CEB77
      - MyVPCingressSubnet1RouteTableAssociationC24F338C
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet1/NATGateway
  MyVPCingressSubnet2Subnet1C4FF535:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1b
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: aws-cdk:subnet-name
          Value: ingress
        - Key: aws-cdk:subnet-type
          Value: Public
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet2
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet2/Subnet
  MyVPCingressSubnet2RouteTable9F8D47F4:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet2
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet2/RouteTable
  MyVPCingressSubnet2RouteTableAssociation89A79312:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet2RouteTable9F8D47F4
      SubnetId:
        Ref: MyVPCingressSubnet2Subnet1C4FF535
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet2/RouteTableAssociation
  MyVPCingressSubnet2DefaultRoute6FDE9456:
    Type: AWS::EC2::Route
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId:
        Ref: MyVPCIGW30AB6DD6
      RouteTableId:
        Ref: MyVPCingressSubnet2RouteTable9F8D47F4
    DependsOn:
      - MyVPCVPCGWE6F260E1
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet2/DefaultRoute
  MyVPCingressSubnet2EIP7F8C559A:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet2
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet2/EIP
  MyVPCingressSubnet2NATGateway0DA97D15:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId:
        Fn::GetAtt:
          - MyVPCingressSubnet2EIP7F8C559A
          - AllocationId
      SubnetId:
        Ref: MyVPCingressSubnet2Subnet1C4FF535
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet2
    DependsOn:
      - MyVPCingressSubnet2DefaultRoute6FDE9456
      - MyVPCingressSubnet2RouteTableAssociation89A79312
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet2/NATGateway
  MyVPCingressSubnet3Subnet01F7F4E4:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1c
      CidrBlock: 10.0.2.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: aws-cdk:subnet-name
          Value: ingress
        - Key: aws-cdk:subnet-type
          Value: Public
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet3
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet3/Subnet
  MyVPCingressSubnet3RouteTable5E2E1EA6:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet3
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet3/RouteTable
  MyVPCingressSubnet3RouteTableAssociation2F73A846:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet3RouteTable5E2E1EA6
      SubnetId:
        Ref: MyVPCingressSubnet3Subnet01F7F4E4
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet3/RouteTableAssociation
  MyVPCingressSubnet3DefaultRoute4724FC03:
    Type: AWS::EC2::Route
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId:
        Ref: MyVPCIGW30AB6DD6
      RouteTableId:
        Ref: MyVPCingressSubnet3RouteTable5E2E1EA6
    DependsOn:
      - MyVPCVPCGWE6F260E1
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet3/DefaultRoute
  MyVPCingressSubnet3EIPBF58E0CA:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet3
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet3/EIP
  MyVPCingressSubnet3NATGateway99FB4363:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId:
        Fn::GetAtt:
          - MyVPCingressSubnet3EIPBF58E0CA
          - AllocationId
      SubnetId:
        Ref: MyVPCingressSubnet3Subnet01F7F4E4
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/ingressSubnet3
    DependsOn:
      - MyVPCingressSubnet3DefaultRoute4724FC03
      - MyVPCingressSubnet3RouteTableAssociation2F73A846
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/ingressSubnet3/NATGateway
  MyVPCcomputeSubnet1Subnet13EB6C6D:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1a
      CidrBlock: 10.0.3.0/24
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: compute
        - Key: aws-cdk:subnet-type
          Value: Private
        - Key: Name
          Value: UalCdkCasStack/MyVPC/computeSubnet1
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet1/Subnet
  MyVPCcomputeSubnet1RouteTableE444B407:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/computeSubnet1
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet1/RouteTable
  MyVPCcomputeSubnet1RouteTableAssociation545714D8:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet1RouteTableE444B407
      SubnetId:
        Ref: MyVPCcomputeSubnet1Subnet13EB6C6D
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet1/RouteTableAssociation
  MyVPCcomputeSubnet1DefaultRoute3E741F04:
    Type: AWS::EC2::Route
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId:
        Ref: MyVPCingressSubnet1NATGateway33681E44
      RouteTableId:
        Ref: MyVPCcomputeSubnet1RouteTableE444B407
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet1/DefaultRoute
  MyVPCcomputeSubnet2SubnetC720E999:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1b
      CidrBlock: 10.0.4.0/24
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: compute
        - Key: aws-cdk:subnet-type
          Value: Private
        - Key: Name
          Value: UalCdkCasStack/MyVPC/computeSubnet2
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet2/Subnet
  MyVPCcomputeSubnet2RouteTable7F9BBD0C:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/computeSubnet2
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet2/RouteTable
  MyVPCcomputeSubnet2RouteTableAssociationAA4AF9CA:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet2RouteTable7F9BBD0C
      SubnetId:
        Ref: MyVPCcomputeSubnet2SubnetC720E999
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet2/RouteTableAssociation
  MyVPCcomputeSubnet2DefaultRouteF6E72A84:
    Type: AWS::EC2::Route
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId:
        Ref: MyVPCingressSubnet2NATGateway0DA97D15
      RouteTableId:
        Ref: MyVPCcomputeSubnet2RouteTable7F9BBD0C
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet2/DefaultRoute
  MyVPCcomputeSubnet3SubnetAD3DE84C:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1c
      CidrBlock: 10.0.5.0/24
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: compute
        - Key: aws-cdk:subnet-type
          Value: Private
        - Key: Name
          Value: UalCdkCasStack/MyVPC/computeSubnet3
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet3/Subnet
  MyVPCcomputeSubnet3RouteTable6C11E432:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/computeSubnet3
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet3/RouteTable
  MyVPCcomputeSubnet3RouteTableAssociationB65CE417:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet3RouteTable6C11E432
      SubnetId:
        Ref: MyVPCcomputeSubnet3SubnetAD3DE84C
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet3/RouteTableAssociation
  MyVPCcomputeSubnet3DefaultRoute5108908F:
    Type: AWS::EC2::Route
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId:
        Ref: MyVPCingressSubnet3NATGateway99FB4363
      RouteTableId:
        Ref: MyVPCcomputeSubnet3RouteTable6C11E432
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/computeSubnet3/DefaultRoute
  MyVPCrdsSubnet1Subnet923AFB93:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1a
      CidrBlock: 10.0.6.0/28
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: rds
        - Key: aws-cdk:subnet-type
          Value: Isolated
        - Key: Name
          Value: UalCdkCasStack/MyVPC/rdsSubnet1
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet1/Subnet
  MyVPCrdsSubnet1RouteTable63F43E5F:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/rdsSubnet1
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet1/RouteTable
  MyVPCrdsSubnet1RouteTableAssociation30DA2878:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCrdsSubnet1RouteTable63F43E5F
      SubnetId:
        Ref: MyVPCrdsSubnet1Subnet923AFB93
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet1/RouteTableAssociation
  MyVPCrdsSubnet2Subnet12A42E21:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1b
      CidrBlock: 10.0.6.16/28
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: rds
        - Key: aws-cdk:subnet-type
          Value: Isolated
        - Key: Name
          Value: UalCdkCasStack/MyVPC/rdsSubnet2
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet2/Subnet
  MyVPCrdsSubnet2RouteTable78F32F5A:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/rdsSubnet2
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet2/RouteTable
  MyVPCrdsSubnet2RouteTableAssociationB51FD5B4:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCrdsSubnet2RouteTable78F32F5A
      SubnetId:
        Ref: MyVPCrdsSubnet2Subnet12A42E21
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet2/RouteTableAssociation
  MyVPCrdsSubnet3Subnet3F66F75E:
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: us-east-1c
      CidrBlock: 10.0.6.32/28
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: rds
        - Key: aws-cdk:subnet-type
          Value: Isolated
        - Key: Name
          Value: UalCdkCasStack/MyVPC/rdsSubnet3
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet3/Subnet
  MyVPCrdsSubnet3RouteTable24A0303E:
    Type: AWS::EC2::RouteTable
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC/rdsSubnet3
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet3/RouteTable
  MyVPCrdsSubnet3RouteTableAssociation650CFA8D:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCrdsSubnet3RouteTable24A0303E
      SubnetId:
        Ref: MyVPCrdsSubnet3Subnet3F66F75E
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/rdsSubnet3/RouteTableAssociation
  MyVPCIGW30AB6DD6:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: UalCdkCasStack/MyVPC
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/IGW
  MyVPCVPCGWE6F260E1:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      InternetGatewayId:
        Ref: MyVPCIGW30AB6DD6
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/VPCGW
  MyVPCRestrictDefaultSecurityGroupCustomResourceC3FF5EE0:
    Type: Custom::VpcRestrictDefaultSG
    Properties:
      ServiceToken:
        Fn::GetAtt:
          - CustomVpcRestrictDefaultSGCustomResourceProviderHandlerDC833E5E
          - Arn
      DefaultSecurityGroupId:
        Fn::GetAtt:
          - MyVPCAFB07A31
          - DefaultSecurityGroup
      Account: "507370583167"
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: UalCdkCasStack/MyVPC/RestrictDefaultSecurityGroupCustomResource/Default
  CustomVpcRestrictDefaultSGCustomResourceProviderRole26592FE0:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
      ManagedPolicyArns:
        - Fn::Sub: arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
      Policies:
        - PolicyName: Inline
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action:
                  - ec2:AuthorizeSecurityGroupIngress
                  - ec2:AuthorizeSecurityGroupEgress
                  - ec2:RevokeSecurityGroupIngress
                  - ec2:RevokeSecurityGroupEgress
                Resource:
                  - Fn::Join:
                      - ""
                      - - arn:aws:ec2:us-east-1:507370583167:security-group/
                        - Fn::GetAtt:
                            - MyVPCAFB07A31
                            - DefaultSecurityGroup
    Metadata:
      aws:cdk:path: UalCdkCasStack/Custom::VpcRestrictDefaultSGCustomResourceProvider/Role
  CustomVpcRestrictDefaultSGCustomResourceProviderHandlerDC833E5E:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        S3Bucket: cdk-hnb659fds-assets-507370583167-us-east-1
        S3Key: e77031893275c08bcaa0a774aa8b611727afd045b3b5d8e1e6f0f04063d9d386.zip
      Timeout: 900
      MemorySize: 128
      Handler: __entrypoint__.handler
      Role:
        Fn::GetAtt:
          - CustomVpcRestrictDefaultSGCustomResourceProviderRole26592FE0
          - Arn
      Runtime: nodejs16.x
      Description: Lambda function for removing all inbound/outbound rules from the VPC default security group
    DependsOn:
      - CustomVpcRestrictDefaultSGCustomResourceProviderRole26592FE0
    Metadata:
      aws:cdk:path: UalCdkCasStack/Custom::VpcRestrictDefaultSGCustomResourceProvider/Handler
      aws:asset:path: asset.e77031893275c08bcaa0a774aa8b611727afd045b3b5d8e1e6f0f04063d9d386
      aws:asset:property: Code
  CDKMetadata:
    Type: AWS::CDK::Metadata
    Properties:
      Analytics: v2:deflate64:H4sIAAAAAAAA/1WQTWvDMAyGf0vvjrf0MHItYYxehklHr8VR1ExtYg9bTikh/3023eLtpEfvK/S1lVUlnzf65gvorsVArZwPrOEqGvQ2OEARvdMM6JjOBJpx1Eb36ORcZ03UZ/MnXQTCVs7HL0jGUdVChXYgOITWICctU2MD44duB8x61nbeWyDNZM1anOB1r1J41/wW5930XShHU8TceG8YXeTfgscmP9mO45GfIxpeFlEHz3ZcD05zVv5nKWcn6tCJuBZy/FNPpl+EsR3Ki3+aykqWL7LcXDxR4YJhGlE2j/gNEsKXMmoBAAA=
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

6. cdk synth | regula run
```
[WARNING] aws-cdk-lib.aws_ec2.SubnetType#PRIVATE_WITH_NAT is deprecated.
  use `PRIVATE_WITH_EGRESS`
  This API will be removed in the next major release.


FG_R00054: VPC flow logging should be enabled [Medium]
           https://docs.fugue.co/FG_R00054.html

  [1]: MyVPCAFB07A31
       in <stdin>:17:3

Found one problem.
```
7. cdk bootstrap
```
[WARNING] aws-cdk-lib.aws_ec2.SubnetType#PRIVATE_WITH_NAT is deprecated.
  use `PRIVATE_WITH_EGRESS`
  This API will be removed in the next major release.
 ⏳  Bootstrapping environment aws://507370583167/us-east-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.

 ✨ hotswap deployment skipped - no changes were detected (use --force to override)

 ✅  Environment aws://507370583167/us-east-1 bootstrapped (no changes).
```
8. cdk deploy 
```

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
