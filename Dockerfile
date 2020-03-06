FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /snap-reports
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
RUN export NODE_ENV=production
ENTRYPOINT http-server dist
