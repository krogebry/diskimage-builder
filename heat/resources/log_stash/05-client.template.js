/**
 * The client is basically just a redis server.
 */
{
  "Parameters" : {
    "client-instance_type": {
      "Type": "String",
      "Default": "m1.small",
      "Description": "log_stash client instance type."
    }
  },

  "Resources" : {
    // Instances
    "log_stash-client": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "ImageId": { "Fn::Join": [ "-", ["client", { "Ref": "BuildId" }]]},
        "KeyName": { "Ref" : "KeyName" },
        "InstanceType": { "Ref" : "client-instance_type" }
        //"UserData": { "Fn::Base64" : { "Fn::Join" : ["", [ "#!/bin/bash -v\n" ]]}}
      }
    } // log_stash-client instance 

  }
}
