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
    "LogStash_Broker": {
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
          "echo \"domain novalocal\" > /etc/resolv.conf\n",
          "echo \"search novalocal\" >> /etc/resolv.conf\n",
          "echo \"nameserver 10.2.0.1\" >> /etc/resolv.conf\n",

          "mkdir -p /etc/chef\n",
          "echo \"chef_server_url 'http://15.185.102.107:4000'\" > /etc/chef/client.rb\n",
          "echo \"validation_key '/etc/chef/validation.pem'\" >> /etc/chef/client.rb\n",
          "echo \"validation_client_name 'validator'\" >> /etc/chef/client.rb\n",
          "wget -P /etc/chef/ https://s3.amazonaws.com/open_heat/validation.pem\n",

          //"chef-solo -j '{ \"run_list\": [ \"role[Basenode]\" ]}'\n",
          "chef-client\n"

          //"/opt/aws/bin/cfn-init -s ", { "Ref" : "AWS::StackName" },
          //" -r LaunchConfig ",
          //" --region ", { "Ref" : "AWS::Region" }, "\n"
        ]]}}
      }
    } // log_stash-broker instance 

  }
}
