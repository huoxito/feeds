FROM ruby:latest

LABEL maintainer="Washington L Braga Jr, huoxito@gmail.com"

WORKDIR /app

ADD Gemfile /app/
ADD Gemfile.lock /app/
RUN bundle

ENV APP_ENV production
ADD application.rb /app/

EXPOSE 4567
