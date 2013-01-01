{"AWSTemplateFormatVersion":"2010-09-09","Description":"NovaStack fb3f4a00-35e2-0130-cf6f-02163e214e11","Parameters":{"KeyName":{"Description":"Name of an existing EC2 KeyPair to enable SSH access to the instances","Type":"String"},"DBName":{"Default":"wordpress","Description":"The WordPress database name","Type":"String","MinLength":"1","MaxLength":"64","AllowedPattern":"[a-zA-Z][a-zA-Z0-9]*","ConstraintDescription":"must begin with a letter and contain only alphanumeric characters."},"DBUsername":{"Default":"admin","NoEcho":"true","Description":"The WordPress database admin account username","Type":"String","MinLength":"1","MaxLength":"16","AllowedPattern":"[a-zA-Z][a-zA-Z0-9]*","ConstraintDescription":"must begin with a letter and contain only alphanumeric characters."},"DBPassword":{"Default":"admin","NoEcho":"true","Description":"The WordPress database admin account password","Type":"String","MinLength":"1","MaxLength":"41","AllowedPattern":"[a-zA-Z0-9]*","ConstraintDescription":"must contain only alphanumeric characters."},"DBRootPassword":{"Default":"admin","NoEcho":"true","Description":"Root password for MySQL","Type":"String","MinLength":"1","MaxLength":"41","AllowedPattern":"[a-zA-Z0-9]*","ConstraintDescription":"must contain only alphanumeric characters."},"NovaAPIVar":{"Default":"admin","NoEcho":"true","Description":"The WordPress database admin account password","Type":"String","MinLength":"1","MaxLength":"41","AllowedPattern":"[a-zA-Z0-9]*","ConstraintDescription":"must contain only alphanumeric characters."},"GlanceAPI-InstanceId":{"Type":"String","MinLength":"1","MaxLength":"64","Description":"Glance instance id","ConstraintDescription":"must begin with a letter and contain only alphanumeric characters."},"GlanceAPI-InstanceType":{"Type":"String","Default":"m1.large","MinLength":"1","MaxLength":"64","Description":"Glance instance type","ConstraintDescription":"must begin with a letter and contain only alphanumeric characters."}},"Resources":{"CfnUser":{"Type":"AWS::IAM::User"},"WebServerKeys":{"Type":"AWS::IAM::AccessKey","Properties":{"UserName":{"Ref":"CfnUser"}}},"WaitHandle":{"Type":"AWS::CloudFormation::WaitConditionHandle"},"WaitCondition":{"Type":"AWS::CloudFormation::WaitCondition","DependsOn":"WikiDatabase","Properties":{"Handle":{"Ref":"WaitHandle"},"Timeout":"600"}},"NovaAPIServer":{"Type":"AWS::EC2::Instance","Metadata":{},"Properties":{"ImageId":"nova-api-current","InstanceType":{"Ref":"GlanceAPI-InstanceType"},"KeyName":{"Ref":"KeyName"},"UserData":{"Fn::Base64":{"Fn::Join":["",["#!/bin/bash -v\n","# Helper function\n","function error_exit\n","{\n","  /opt/aws/bin/cfn-signal -e 1 -r \"$1\" '",{"Ref":"WaitHandle"},"'\n","  exit 1\n","}\n","/opt/aws/bin/cfn-init -s ",{"Ref":"AWS::StackName"}," -r WikiDatabase "," --access-key ",{"Ref":"WebServerKeys"}," --secret-key ",{"Fn::GetAtt":["WebServerKeys","SecretAccessKey"]}," --region ",{"Ref":"AWS::Region"}," || error_exit 'Failed to run cfn-init'\n","# Setup MySQL root password and create a user\n","mysqladmin -u root password '",{"Ref":"DBRootPassword"},"' || error_exit 'Failed to initialize root password'\n","mysql -u root --password='",{"Ref":"DBRootPassword"},"' < /tmp/setup.mysql || error_exit 'Failed to create database.'\n","sed --in-place --e s/database_name_here/",{"Ref":"DBName"},"/ --e s/username_here/",{"Ref":"DBUsername"},"/ --e s/password_here/",{"Ref":"DBPassword"},"/ /usr/share/wordpress/wp-config.php\n","# install cfn-hup crontab\n","crontab /tmp/cfn-hup-crontab.txt\n","# All is well so signal success\n","/opt/aws/bin/cfn-signal -e 0 -r \"Wiki server setup complete\" '",{"Ref":"WaitHandle"},"'\n"]]}}}},"GlanceAPIServer":{"Type":"AWS::EC2::Instance","Metadata":{},"Properties":{"ImageId":{"Ref":"GlanceAPI-InstanceId"},"KeyName":{"Ref":"KeyName"},"InstanceType":{"Ref":"GlanceAPI-InstanceType"},"UserData":{"Fn::Base64":{"Fn::Join":["",["#!/bin/bash -v\n","# Helper function\n","function error_exit\n","{\n","  /opt/aws/bin/cfn-signal -e 1 -r \"$1\" '",{"Ref":"WaitHandle"},"'\n","  exit 1\n","}\n","/opt/aws/bin/cfn-init -s ",{"Ref":"AWS::StackName"}," -r WikiDatabase "," --access-key ",{"Ref":"WebServerKeys"}," --secret-key ",{"Fn::GetAtt":["WebServerKeys","SecretAccessKey"]}," --region ",{"Ref":"AWS::Region"}," || error_exit 'Failed to run cfn-init'\n","# Setup MySQL root password and create a user\n","mysqladmin -u root password '",{"Ref":"DBRootPassword"},"' || error_exit 'Failed to initialize root password'\n","mysql -u root --password='",{"Ref":"DBRootPassword"},"' < /tmp/setup.mysql || error_exit 'Failed to create database.'\n","sed --in-place --e s/database_name_here/",{"Ref":"DBName"},"/ --e s/username_here/",{"Ref":"DBUsername"},"/ --e s/password_here/",{"Ref":"DBPassword"},"/ /usr/share/wordpress/wp-config.php\n","# install cfn-hup crontab\n","crontab /tmp/cfn-hup-crontab.txt\n","# All is well so signal success\n","/opt/aws/bin/cfn-signal -e 0 -r \"Wiki server setup complete\" '",{"Ref":"WaitHandle"},"'\n"]]}}}}},"Outputs":{}}
