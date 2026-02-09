FROM node:18-alpine

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci --only=production

# copy app
COPY . .

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "src/server.js"]
