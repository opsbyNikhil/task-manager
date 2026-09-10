FROM node:22-alpine AS build

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /task-manager-frontend
ADD . /task-manager-frontend
RUN npm install & npm run dev

FROM nginx:1.29 AS runtime
COPY --from=build /task-manager-frontend/dist /usr/share/nginx/html
EXPOSE 80