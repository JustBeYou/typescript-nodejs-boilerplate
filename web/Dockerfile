FROM node:15.8.0-alpine3.10 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ADD . ./
RUN npm run build

FROM node:15.8.0-alpine3.10
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist .
COPY package*.json ./
RUN npm install --production && npm install pm2 -g
EXPOSE 3000
USER node
CMD [ "pm2-runtime", "start", "node", "--", "main" ]
