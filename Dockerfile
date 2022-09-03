ARG NODE_IMAGE=node:16.17.0

FROM $NODE_IMAGE AS base
RUN apt-get update -y
RUN apt-get install -y dumb-init
RUN apt-get install -y \
        python3 \
        python3-pip \
        python3-setuptools \
        groff \
        less \
        && pip3 install --upgrade pip \
        && apt-get clean
RUN pip3 --no-cache-dir install --upgrade awscli
RUN chown -R node:node /usr/local
RUN mkdir -p /home/node/app && chown node:node /home/node/app && mkdir /home/node/.ssh/
COPY --chown=node:node known_hosts /home/node/.ssh/
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE $PORT
CMD [ "dumb-init", "node", "server.js" ]
