#!/usr/bin/ruby
##
# Compile a giant heat config.
require 'rubygems'
require 'pp'
require 'uuid'
require 'json'
require 'logger'
require "hash_deep_merge"

build_id = ARGV[0]
stack_name = ARGV[1]

fs_root = File.expand_path(File.dirname( __FILE__ ))
fs_build_dir = "%s/builds" % fs_root
fs_resources_dir = "%s/resources" % fs_root
fs_unique_build_dir = "%s/%s" % [fs_build_dir,build_id] 

ALog = Logger.new( STDOUT )


# "ImageId": { "Fn::Join": [ "-", "broker", { "Ref": "BuildId" }]},
# "KeyName": { "Fn::Join": [ "-", "key", { "Ref": "BuildId" }]},


begin
  ## Everyone get this.
  output_json = JSON::parse(File.read( "%s/base.template.js" % fs_resources_dir ))
 
rescue => e
  ALog::fatal( "Unable to parse base json: %s" % e )
  exit
end


fs_stack_resources_dir = "%s/%s" % [fs_resources_dir,stack_name]
Dir.glob( "%s/*.js" % fs_stack_resources_dir ).each do |resource|
  #next if(File.basename(resource) == "base.template.js")

  #puts "Merging: %s" % resource 
  ALog.debug( "Merging resource: %s" % resource )

  begin
    merge_json = JSON::parse(File.read( resource ))
    output_json.deep_merge( merge_json )

  rescue => e
    ALog::fatal( "Unable to parse base json: %s" % e )
    #exit

  end

  #pp output_json
  #puts "---------"
end

Dir.mkdir( fs_build_dir ) if(!File.exists?( fs_build_dir ))
Dir.mkdir( fs_unique_build_dir ) if(!File.exists?( fs_unique_build_dir ))

fs_output = "%s/heat.js" % fs_unique_build_dir

File.open( fs_output, "w" ).puts( output_json.to_json )

File.unlink( "%s/current" % fs_build_dir ) if(File.exists?( "%s/current" % fs_build_dir )) 
File.symlink( fs_unique_build_dir, "%s/current" % fs_build_dir )

