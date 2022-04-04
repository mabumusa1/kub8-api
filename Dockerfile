FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package.json node_modules.* key.pem ./

RUN apk add --no-cache git openssh

COPY . /home/node/app/

RUN chown -R node:node /home/node

RUN npm i

USER node

EXPOSE 3333

ENTRYPOINT ["node","ace","serve","--watch"]