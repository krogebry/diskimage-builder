{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description" : "Base bits",
  "Parameters" : {
    "BuildId" : {
      "Type" : "String",
      "Description" : "Build identifier."
    },
    "KeyName": {
      "Type" : "String",
      "Default" : "key-4fc4ce20-39f8-0130-9bab-3cd92b5434b6",
      //"Default" : { "Fn::Join": [ "-", ["key", { "Ref": "BuildId" }]]},
      "Description" : "Key name."
    }
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
