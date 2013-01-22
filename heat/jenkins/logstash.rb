#!/usr/bin/ruby
##
# Compile a giant heat config.
require 'rubygems'
require 'pp'
require 'uuid'
require 'json'
require "hash_deep_merge"

build_id = ARGV[0]

if(build_id == nil || build_id == "")
  puts "Usage: %s build_id" % File.basename( __FILE__ )
  exit
end

puts "Build: %s" % build_id

#params = { 
  #"KeyName" => "key-%s" % build_id,
  #"Client-InstanceId" => "client-%s" % build_id,
  #"Broker-InstanceId" => "broker-%s" % build_id,
  #"LogWeb-InstanceId" => "log_web-%s" % build_id,
  #"Indexer-InstanceId" => "indexer-%s" % build_id,
  #"ElasticSearch-InstanceId" => "elastic_search-%s" % build_id
#}
#cmd_create_stack = "heat stack-create -f builds/current/heat.js -P \"%s\" openstack-%s" % [params.map{|k,v| "%s=%s" % [k,v]}.join( ";" ),UUID.generate]
cmd_clear_key = "nova keypair-delete key-%s" % build_id
cmd_create_key = "nova keypair-add key-%s > builds/current/key.pem ; chmod 600 builds/current/key.pem" % build_id
cmd_create_stack = "heat -d stack-create -f builds/current/heat.js -P \"BuildId=%s;KeyName=key-%s\" log_stash-%s" % [build_id,build_id,build_id]
puts "CMD(clear key): %s" % cmd_clear_key
puts "CMD(add key): %s" % cmd_create_key
puts "CMD(create): %s" % cmd_create_stack
system( cmd_clear_key )
system( cmd_create_key )
system( cmd_create_stack )

(2..5).each{|i| system( "ssh-keygen -f '/home/ubuntu/.ssh/known_hosts' -R 10.0.0.%i" % i )}
