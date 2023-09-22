FROM node:lts-alpine AS build
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --mode=production

FROM nginx:1.18-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
