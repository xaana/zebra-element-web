# Builder
FROM --platform=$BUILDPLATFORM node:20-bullseye as builder

RUN apt-get update && apt-get install -y git dos2unix

WORKDIR /src

COPY . /src
RUN yarn --network-timeout=200000 install

RUN dos2unix /src/scripts/docker-package.sh && bash /src/scripts/docker-package.sh

# Copy the config now so that we don't create another layer in the app image
RUN cp /src/config.prod.json /src/webapp/config.json

# App
FROM nginx:alpine-slim

COPY --from=builder /src/webapp /app

# Override default nginx config
COPY /nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html \
    && ln -s /app /usr/share/nginx/html
