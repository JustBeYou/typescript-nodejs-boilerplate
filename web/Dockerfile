FROM node:16.15.1-buster AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ADD . ./
RUN npm run build

FROM node:16.15.1-alpine3.16
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist .
COPY package*.json ./
RUN npm install --production && npm install pm2 -g

RUN mkdir -p /data/images && chown -R node:node /data/images 
VOLUME /data/images

EXPOSE 3000
USER node
CMD [ "pm2-runtime", "start", "node", "--", "main" ]
