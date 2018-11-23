FROM node:8

ADD ./ /sources
WORKDIR /sources

RUN npm i

FROM node:8-alpine

COPY --from=0 /sources /sources

WORKDIR /sources

ENV REST_PORT 8085
ENV MONGO_HOST mongo

USER node

EXPOSE 8085

CMD ["node", "./server.js"]