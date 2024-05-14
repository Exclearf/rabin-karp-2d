FROM node:21-alpine3.18

RUN apk add --no-cache curl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]