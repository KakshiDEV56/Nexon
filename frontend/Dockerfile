# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Create React App reads these at build time and does not let files
# such as .env.production overwrite variables that are already set.
ARG REACT_APP_API=http://localhost:4000
ARG REACT_APP_WS=ws://localhost:4000/ws
ENV REACT_APP_API=${REACT_APP_API} \
    REACT_APP_WS=${REACT_APP_WS} \
    DISABLE_ESLINT_PLUGIN=true \
    GENERATE_SOURCEMAP=false \
    CI=false

RUN yarn build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
