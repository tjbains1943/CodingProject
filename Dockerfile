FROM mhart/alpine-node:8

RUN npm install -g express-generator
RUN npm install -g nyc
RUN apk add --update \
        curl \
        mongodb \
  && rm /usr/bin/mongoperf \
  && rm -rf /var/cache/apk/*
RUN mkdir -p /data/db

WORKDIR /app
EXPOSE 3000

CMD [ "mongod", "--bind_ip", "0.0.0.0" ]
