FROM node:24-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm ci

# Vite bakes VITE_* vars into the client bundle at build time, so it must be available here as a
# build arg, not just an env var at `docker run` time. 
# Override for a real deployment with e.g.
# `docker build --build-arg VITE_EPHEMERIDES_API_BASE=https://api.example.com .`
ARG VITE_EPHEMERIDES_API_BASE=http://localhost:3601
ENV VITE_EPHEMERIDES_API_BASE=$VITE_EPHEMERIDES_API_BASE

COPY --chown=node:node . .

RUN npm run build

FROM node:24-alpine

RUN apk add --no-cache tini
RUN npm install -g serve

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --from=0 --chown=node:node /home/node/app/build/ .

ENV PORT="3600"

EXPOSE $PORT

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["serve", ".", "-s", "-p", "3600"]
