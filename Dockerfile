FROM node:lts-alpine

RUN npm install -g serve

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node build/ .

RUN export PORT="3600"

EXPOSE $PORT

CMD ["serve", ".", "-s", "-p", "3600" ]