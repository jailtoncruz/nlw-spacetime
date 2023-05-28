FROM node:18-alpine3.16

WORKDIR /app

COPY . .

RUN npm install --omit-dev
RUN npm run build
RUN rm -rf src

EXPOSE 3333

CMD npm run start