FROM node:22-alpine as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install --registry=https://mirrors.huaweicloud.com/repository/npm/
COPY ./ .
RUN npm run build

FROM nginx as production-stage
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]


