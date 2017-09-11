#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'

require 'json'
require 'octokit'
require 'sinatra'
require 'faraday-http-cache' # https://github.com/octokit/octokit.rb#caching
require 'dotenv/load'

stack = Faraday::RackBuilder.new do |builder|
  builder.use Faraday::HttpCache, serializer: Marshal, shared_cache: false
  builder.use Octokit::Response::RaiseError
  builder.adapter Faraday.default_adapter
end

Octokit.middleware = stack

ApiClient = Octokit::Client.new access_token: ENV['GITHUB_TOKEN']

#
class Feeds
  class << self
    def call(action, *arg)
      events = ApiClient.send(action, *arg)
      # puts client.last_response.headers[:etag]
      events.map(&:to_h).to_json
    end
  end
end

set :public_folder, File.dirname(__FILE__) + '/client/build/'

before do
  content_type :json
end

error Octokit::NotFound do
  status 404
end

error Faraday::ConnectionFailed do
  status 500
  { error: env['sinatra.error'].message }.to_json
end

get '/' do
  content_type :html
  send_file 'client/build/index.html'
end

get '/limits' do
  ApiClient.rate_limit.to_json
end

get '/feeds/:org-p' do
  Feeds.call 'organization_events', params[:org], page: params[:page]
end

get '/feeds' do
  Feeds.call 'received_events', ENV['GITHUB_USER'], page: params[:page]
end

get '/feeds/:org' do
  Feeds.call 'organization_public_events', params[:org], page: params[:page]
end

get '/feeds/:org/:repo' do
  Feeds.call 'repository_events', "#{params[:org]}/#{params[:repo]}", page: params[:page]
end
