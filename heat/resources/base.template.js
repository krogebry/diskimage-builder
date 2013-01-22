{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description" : "Base bits",
  "Parameters" : {
    "BuildId" : {
      "Type" : "String",
      "Description" : "Build identifier."
    }
    //"KeyName": {
      //"Type" : "String",
      //"Default" : "key-e42de8d5-0100-4f18-b1d7-dffc8b8ea887",
      //"Default" : { "Fn::Join": [ "-", ["key", { "Ref": "BuildId" }]]},
      //"Description" : "Key name."
    //}
  },

  "Resources" : {
    "CfnUser" : {
      "Type" : "AWS::IAM::User"
    },

    "BuildKeys" : {
      "Type" : "AWS::IAM::AccessKey",
      "Properties" : {
        "UserName" : {"Ref": "CfnUser"}
      }
    },

    "WaitHandle" : {
      "Type" : "AWS::CloudFormation::WaitConditionHandle"
    }
  },

  "Outputs" : { }
}
