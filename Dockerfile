# syntax=docker/dockerfile:1
FROM --platform=linux/amd64 synthetixio/docker-e2e:18.16-ubuntu as base

RUN mkdir /app
WORKDIR /app

RUN curl https://dl.google.com/linux/linux_signing_key.pub | tee /etc/apt/trusted.gpg.d/google.asc >/dev/null
RUN apt update && apt install -y nginx

COPY nginx.conf /etc/nginx/sites-available/default

COPY . .

RUN pnpm install --frozen-lockfile --prefer-offline

