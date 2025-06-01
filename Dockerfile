FROM node:18-alpine AS builder

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .

RUN npm run build:css

RUN mkdir -p \
    src/vendor/jquery \
    src/vendor/bootstrap \
    src/vendor/jquery-easing \
    src/vendor/fortawesome-fontawesome/css \
    src/vendor/chartjs && \
    cp node_modules/jquery/dist/jquery.min.js src/vendor/jquery/ && \
    cp node_modules/bootstrap/dist/js/bootstrap.bundle.min.js src/vendor/bootstrap/ && \
    cp node_modules/jquery.easing/jquery.easing.min.js src/vendor/jquery-easing/ && \
    cp node_modules/@fortawesome/fontawesome-free/css/all.min.css src/vendor/fortawesome-fontawesome/css/all.min.css && \
    cp node_modules/chart.js/dist/chart.umd.js src/vendor/chartjs/chart.js && \
    cp -r node_modules/@fortawesome/fontawesome-free/webfonts src/vendor/fortawesome-fontawesome/



FROM nginx:alpine
LABEL authors="Robert Sargsyan <robert.sargsyan@student.kdg.be>"
EXPOSE 80

RUN mkdir -p /usr/app
COPY --from=builder /app /usr/app




