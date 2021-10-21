FROM node:16.9-alpine

RUN apk add --update 

WORKDIR /thoth

COPY . .

RUN npm install && \
    npm run build 
    # && \
    # npm run test:e2e

EXPOSE 5555

ENTRYPOINT npm run start