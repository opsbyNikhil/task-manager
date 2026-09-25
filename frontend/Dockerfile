FROM node:22-alpine AS build

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /task-manager-frontend
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build

FROM nginx:1.29 AS runtime
COPY --from=build /task-manager-frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]