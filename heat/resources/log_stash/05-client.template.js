/**
 * The client is basically just a redis server.
 */
{
  "Parameters" : {
    "client-instance_type": {
      "Type": "String",
      "Default": "m1.small",
      "Description": "log_stash client instance type."
    },
    "KeyName": {
      "Type" : "String",
      //"Default" : "key-e42de8d5-0100-4f18-b1d7-dffc8b8ea887",
      //"Default" : { "Fn::Join": [ "-", ["key", { "Ref": "BuildId" }]]},
      "Description" : "Key name."
    }
  },

  "Resources" : {
    // Instances
    "LogStash_Client": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "ImageId": { "Fn::Join": [ "-", ["client", { "Ref": "BuildId" }]]},
        "KeyName": { "Ref" : "KeyName" },
        //"KeyName": { "Fn::Join": [ "-", ["key", { "Ref": "BuildId" }]]},
        "InstanceType": { "Ref" : "client-instance_type" },
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
          //" --region ", { "Ref" : "AWS::Region" },
          //" --access-key ", { "Ref" : "BuildKeys" },
          //" --secret-key ", {"Fn::GetAtt": ["BuildKeys", "SecretAccessKey"]},
          //"\n"
        ]]}}
      }
    } // log_stash-client instance 

  }
}
