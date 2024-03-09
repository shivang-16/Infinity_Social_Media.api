FROM node:20


WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY src src
COPY .env .env

EXPOSE 4000

CMD [ "node", "src/server.js" ]


