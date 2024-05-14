FROM node:21-alpine3.18

RUN apk add --no-cache curl

WORKDIR /usr/src/app

COPY .next .next
COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3002

CMD ["npm", "start"]