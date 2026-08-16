# builder stage
FROM node:24-alpine AS builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN --mount=type=cache,id=npm-cache,target=/home/node/.npm,uid=1000,gid=1000 \
npm ci --cache /home/node/.npm

# Vite bakes VITE_* vars into the client bundle at build time, so it must be available here as a
# build arg, not just an env var at `docker run` time. 
# Override for a real deployment with e.g.
# `docker build --build-arg VITE_EPHEMERIDES_API_BASE=https://api.example.com .`
ARG VITE_EPHEMERIDES_API_BASE=http://localhost:3601
ENV VITE_EPHEMERIDES_API_BASE=$VITE_EPHEMERIDES_API_BASE

COPY --chown=node:node tsconfig.json vite.config.js index.html ./
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/ ./public/ 

RUN npm run build

# runner stage
FROM node:24-alpine AS runner

RUN apk add --no-cache tini
RUN npm install -g serve

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --from=builder --chown=node:node /home/node/app/build/ .

ENV PORT="3600"

EXPOSE $PORT

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["serve", ".", "-s", "-p", "3600"]
