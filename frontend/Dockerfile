# frontend/Dockerfile

# -- Giai đoạn 1: Build React --
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# -- Giai đoạn 2: Chạy Nginx --
FROM nginx:alpine
# Copy file đã build sang Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy cấu hình nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]