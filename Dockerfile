FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run lint:js:fix && npm run dprint:fix && npm run build

FROM nginx:alpine
LABEL authors="Robert Sargsyan <robert.sargsyan@student.kdg.be>"
EXPOSE 80

COPY --from=builder /app/dist /app