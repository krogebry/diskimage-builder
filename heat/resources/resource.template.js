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
    // Instances
    "log_stash-broker": {
      "Type": "AWS::EC2::Instance",
      "Metadata" : { 
        "AWS::CloudFormation::Init": {
          "config" : {
            "packages" : {
              "apt": { }
            }
          }
        }
      },
      "Properties": {
        "ImageId": { "Fn::Join": [ "-", ["broker", { "Ref": "BuildId" }]]},
        "KeyName": { "Fn::Join": [ "-", ["key", { "Ref": "BuildId" }]]},
        "InstanceType": { "Ref" : "broker-instance_type" }
        //"UserData": { "Fn::Base64" : { "Fn::Join" : ["", [ "#!/bin/bash -v\n" ]]}}
      }
    } // log_stash-broker instance 

  }
}
