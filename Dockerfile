FROM node:17-alpine AS build
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install && npm run build --mode=production

FROM nginx:1.25.3-alpine-slim
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]