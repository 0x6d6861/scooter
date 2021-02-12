FROM node:14-alpine as base

WORKDIR /src
COPY package*.json ./
EXPOSE 7070

FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . .
CMD ["node", "index.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . .
CMD ["nodemon", "index.js"]
