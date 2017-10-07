#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'

require 'json'
require 'octokit'
require 'sinatra'
require 'faraday-http-cache' # https://github.com/octokit/octokit.rb#caching
require 'dotenv/load'
require 'oauth2'
require 'bson'

stack = Faraday::RackBuilder.new do |builder|
  builder.use Faraday::HttpCache, serializer: Marshal, shared_cache: false
  builder.use Octokit::Response::RaiseError
  builder.adapter Faraday.default_adapter
end

Octokit.middleware = stack

use Rack::Session::Cookie, key: '_github_feeds',
                           expire_after: 4320,
                           secret: ENV['SECRET_COOKIE']

set :public_folder, File.dirname(__FILE__) + '/client/build/'

before do
  content_type :json

  @page_args = { page: params[:page] }
  @keys = {
    client_id: ENV['CLIENT_APP_ID'],
    client_secret: ENV['CLIENT_APP_SECRET']
  }
  @keys = @keys.merge access_token: session[:g_token] if session[:g_token]
  @client = Octokit::Client.new @keys
end

after do
  if request.path.start_with? '/feeds'
    response.body = response.body.map(&:to_h).to_json
  end
end

error Octokit::NotFound do
  status 404
end

error Faraday::ConnectionFailed do
  status 500
  { error: env['sinatra.error'].message }.to_json
end

error Octokit::Unauthorized do
  status 500
  { error: env['sinatra.error'].message }.to_json
end

get '/auth' do
  options = {
    site: 'https://github.com',
    authorize_url: '/login/oauth/authorize',
    token_url: '/login/oauth/access_token'
  }
  oauth = OAuth2::Client.new(@keys[:client_id], @keys[:client_secret], options)

  session[:oauth_state] = BSON::ObjectId.new.to_s.chars.shuffle.join.to_s
  args = { state: session[:oauth_state], scope: 'repo' }

  sleep 0.5
  redirect oauth.auth_code.authorize_url args
end

get '/auth/callback' do
  raise if params[:state] != session[:oauth_state]
  session[:oauth_state] = nil

  options = {
    site: 'https://github.com',
    authorize_url: '/login/oauth/authorize',
    token_url: '/login/oauth/access_token'
  }
  oauth = OAuth2::Client.new(@keys[:client_id], @keys[:client_secret], options)
  session[:g_token] = oauth.auth_code.get_token(params[:code]).token

  redirect '/'
end

get '/logout' do
  session[:g_token] = nil
  session[:login] = nil
  redirect '/'
end

get '/limits' do
  @client.rate_limit.to_json
end

get '/me' do
  if session[:g_token]
    user = @client.user
    session[:login] = user[:login]
    user.to_h.to_json
  else
    raise Octokit::Unauthorized
  end
end

get '/feeds/:org-p' do
  @client.organization_events params[:org], @page_args
end

get '/feeds' do
  if session[:g_token] && session[:login]
    @client.received_events session[:login], @page_args
  else
    @client.public_events @page_args
  end
end

get '/feeds/:org' do
  client = Octokit::Client.new(
    client_id: ENV['CLIENT_APP_ID'],
    client_secret: ENV['CLIENT_APP_SECRET']
  )
  client.organization_public_events params[:org], @page_args
end

get '/feeds/:org/:repo' do
  @client.repository_events "#{params[:org]}/#{params[:repo]}", @page_args
end

get '/*' do
  content_type :html
  send_file 'client/build/index.html'
end
