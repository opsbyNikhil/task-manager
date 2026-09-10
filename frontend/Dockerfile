FROM node:22-alpine AS build

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /task-manager-frontend
ADD . /task-manager-frontend
COPY package*.json ./
RUN npm install & npm run build

FROM nginx:1.29 AS runtime
COPY --from=build /task-manager-frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]