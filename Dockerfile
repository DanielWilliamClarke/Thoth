FROM node:16.9-alpine

RUN apk add --update && \
    npm install -g npm@8.1.3

WORKDIR /thoth

COPY . .

RUN npm install && \
    npm run build && \
    npm run test:e2e

EXPOSE 5555

ENTRYPOINT npm run start