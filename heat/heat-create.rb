#!/usr/bin/ruby
##
# Compile a giant heat config.
require 'rubygems'
require 'pp'
require 'uuid'
require 'json'
require "hash_deep_merge"

output_json = JSON::parse(File.read( "resources/base.template.js" ))

Dir.glob( "resources/*.js" ).each do |resource|
  next if(File.basename(resource) == "base.template.js")

  puts "Merging: %s" % resource 
  merge_json = JSON::parse(File.read( resource ))

  output_json.deep_merge( merge_json )

  #pp output_json
  #puts "---------"
end

build_dir = "%s/builds" % ENV['PWD']

build_id = ENV['BUILD_ID']

output_json["Description"] = "NovaStack %s" % build_id

#pp output_json

Dir.mkdir( build_dir ) if(!File.exists?( build_dir ))
Dir.mkdir( "%s/%s" % [build_dir,build_id] ) if(!File.exists?( "%s/%s" % [build_dir,build_id]))

fs_output = "%s/%s/heat.js" % [build_dir,build_id]

File.open( fs_output, "w" ).puts( output_json.to_json )

File.unlink( "%s/current" % build_dir ) if(File.exists?( "%s/current" % build_dir )) 
File.symlink( "%s/%s" % [build_dir,build_id], "%s/current" % build_dir )

params = { 
  "KeyName" => "kp0",

  "Keystone-InstanceId" => "keystone-%s" % build_id,
  "Keystone-InstanceType" => "m1.large",

  "GlanceAPI-InstanceId" => "glance-%s" % build_id,
  "GlanceAPI-InstanceType" => "m1.large"

}
cmd_create_stack = "heat stack-create -f builds/current/heat.js -P \"%s\" openstack-%s" % [params.map{|k,v| "%s=%s" % [k,v]}.join( ";" ),UUID.generate]
puts "CMD(create): %s" % cmd_create_stack

system( cmd_create_stack )

