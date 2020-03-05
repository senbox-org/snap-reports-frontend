FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /snap-reports
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
ENTRYPOINT http-server dist