FROM node:lts-alpine
RUN npm install -g http-server
COPY . .
RUN npm install
RUN npm run build --mode=production
EXPOSE 8080
ENTRYPOINT http-server dist
