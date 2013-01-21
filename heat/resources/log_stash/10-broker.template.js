/**
 * The broker is basically just a redis server.
 */
{
  "Parameters" : {
    "broker-instance_type": {
      "Type": "String",
      "Default": "m1.small",
      "Description": "log_stash broker instance type."
    },
    "broker-redis_port": {
      "Type": "String",
      "Default": "6379",
      "Description": "log_stash broker redis port."
    }

  },

  "Resources" : {
    // ELB def
    /**
    "log_stash-broker-elb": {
      "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
      "DependsOn": "log_stash-broker",
      "Properties" : {
        "AvailabilityZones" : ["nova"],
        "KeyName": { "Fn::Join": [ "-", ["key", { "Ref": "BuildId" }]]},
        "Instances" : [{ "Ref" : "log_stash-broker" }],
        "Listeners" : [{
          "Protocol" : "HTTP",
          "InstancePort" : "6379",
          "LoadBalancerPort" : "6379"
        }],
        "HealthCheck" : {
          "Target" : { "Fn::Join" : [ "", ["HTTP:", { "Ref" : "broker-redis_port" }, "/_status"]]},
          "Timeout" : "5",
          "Interval" : "30",
          "HealthyThreshold" : "3",
          "UnhealthyThreshold" : "5"
        }
      }
    }, // log_stash-broker-elb
    */

    // Instances
    "log_stash-broker": {
      "Type": "AWS::EC2::Instance",
      "Metadata" : { 
        "AWS::CloudFormation::Init": {
          "config" : {
            "files": {
              "/etc/cfn/cfn-credentials" : {
                "content" : { "Fn::Join" : ["", [
                  "AWSAccessKeyId=", { "Ref" : "BuildKeys" }, "\n",
                  "AWSSecretKey=", {"Fn::GetAtt": ["BuildKeys", "SecretAccessKey"]}, "\n"
                ]]},
                "mode"    : "000400",
                "owner"   : "root",
                "group"   : "root"
              }
            },
            "packages" : {
              "yum": { 
                "httpd": []
              }
            }
          }
        }
      },
      "Properties": {
        "ImageId": { "Fn::Join": [ "-", ["broker", { "Ref": "BuildId" }]]},
        "KeyName": { "Fn::Join": [ "-", ["key", { "Ref": "BuildId" }]]},
        "InstanceType": { "Ref" : "broker-instance_type" },
        "UserData": { "Fn::Base64" : { "Fn::Join" : ["", [ 
          "#!/bin/bash -v\n",
          "/opt/aws/bin/cfn-init -s ", { "Ref" : "AWS::StackName" },
          " -r LaunchConfig ",
          " --region ", { "Ref" : "AWS::Region" }, "\n"
        ]]}}
      }
    } // log_stash-broker instance 

  }
}
