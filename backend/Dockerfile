FROM node:8.16.0-alpine

COPY . /app

WORKDIR /app

RUN npm run install:only:setup

EXPOSE 3000

CMD npm start