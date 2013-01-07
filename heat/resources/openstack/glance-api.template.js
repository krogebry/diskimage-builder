{
  "Parameters" : {
    "GlanceAPI-InstanceId": {
      "Type": "String",
      "MinLength": "1",
      "MaxLength": "64",
      "Description": "Glance instance id",
      "ConstraintDescription": "must begin with a letter and contain only alphanumeric characters."
    },

    "GlanceAPI-InstanceType": {
      "Type": "String",
      "Default": "m1.large",
      "MinLength": "1",
      "MaxLength": "64",
      "Description": "Glance instance type",
      "ConstraintDescription" : "must begin with a letter and contain only alphanumeric characters."
    }

  },

  "Resources" : {
    "WaitCondition" : {
      "Type" : "AWS::CloudFormation::WaitCondition",
      "DependsOn" : "GlanceAPIServer",
      "Properties" : {
        "Handle" : {"Ref" : "WaitHandle"},
        "Timeout" : "600"
      }
    },

    "GlanceAPIServer": {
      "Type": "AWS::EC2::Instance",
      "Metadata" : { },
      "Properties": {
        "ImageId": { "Ref": "GlanceAPI-InstanceId" },
        "KeyName": { "Ref" : "KeyName" },
        "InstanceType": { "Ref" : "GlanceAPI-InstanceType" },
        "UserData": { "Fn::Base64" : { "Fn::Join" : ["", [
          "#!/bin/bash -v\n",
          "# Helper function\n",
          "function error_exit\n",
          "{\n",
          "  /opt/aws/bin/cfn-signal -e 1 -r \"$1\" '", { "Ref" : "WaitHandle" }, "'\n",
          "  exit 1\n",
          "}\n",

          "/opt/aws/bin/cfn-init -s ", { "Ref" : "AWS::StackName" },
          " -r WikiDatabase ",
          " --access-key ", { "Ref" : "WebServerKeys" },
          " --secret-key ", {"Fn::GetAtt": ["WebServerKeys", "SecretAccessKey"]},
          " --region ", { "Ref" : "AWS::Region" },
          " || error_exit 'Failed to run cfn-init'\n",

          "# Setup MySQL root password and create a user\n",
          "mysqladmin -u root password '", { "Ref" : "DBRootPassword" },
          "' || error_exit 'Failed to initialize root password'\n",

          "mysql -u root --password='", { "Ref" : "DBRootPassword" },
          "' < /tmp/setup.mysql || error_exit 'Failed to create database.'\n",

          "sed --in-place --e s/database_name_here/", { "Ref" : "DBName" },
          "/ --e s/username_here/", { "Ref" : "DBUsername" },
          "/ --e s/password_here/", { "Ref" : "DBPassword" },
          "/ /usr/share/wordpress/wp-config.php\n",

          "# install cfn-hup crontab\n",
          "crontab /tmp/cfn-hup-crontab.txt\n",

          "# All is well so signal success\n",
          "/opt/aws/bin/cfn-signal -e 0 -r \"Wiki server setup complete\" '",
          { "Ref" : "WaitHandle" }, "'\n"
        ]]}}
      }
    }
  }
}
