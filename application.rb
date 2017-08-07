#!/usr/bin/env ruby

require 'json'
require 'octokit'
require 'sinatra'
require 'dotenv/load'

client = Octokit::Client.new access_token: ENV['GITHUB_TOKEN']

get '/limits' do
  content_type :json
  client.rate_limit.to_json
end

get '/feeds/' do
  content_type :json
  events = client.received_events 'huoxito'
  events.map(&:to_h).to_json
end

get '/feeds/:org' do
  content_type :json

  begin
    events = client.organization_public_events params[:org]
    events.map(&:to_h).to_json
  rescue Octokit::NotFound
    status 404
  end
end

get '/feeds/:org/private' do
  content_type :json

  begin
    events = client.organization_events params[:org]
    events.map(&:to_h).to_json
  rescue Octokit::NotFound
    status 404
  end
end
