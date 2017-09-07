FROM  node:alpine

LABEL maintainer="Washington L Braga Jr, huoxito@gmail.com"

WORKDIR /app

RUN apk add --no-cache yarn

ADD package.json /app
ADD yarn.lock /app
RUN yarn

ADD src /app/src
ADD public /app/public

RUN yarn build
