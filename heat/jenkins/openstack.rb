#!/usr/bin/ruby
##
# Compile a giant heat config.
require 'rubygems'
require 'pp'
require 'uuid'
require 'json'
require "hash_deep_merge"

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

