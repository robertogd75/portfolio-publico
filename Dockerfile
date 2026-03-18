# Etapa 1: Build
FROM node:22-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Etapa 2: Serve
FROM nginx:stable-alpine
# Copiamos solo el resultado del build (la carpeta dist)
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Configuracion de Nginx (SPA fallback + proxy al mailer)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]