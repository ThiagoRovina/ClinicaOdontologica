FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY public ./public
COPY src ./src

# CRA reads REACT_APP_* at build time.
ARG REACT_APP_API_ORIGIN
ENV REACT_APP_API_ORIGIN=$REACT_APP_API_ORIGIN

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
