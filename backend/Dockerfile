# syntax=docker/dockerfile:1

FROM golang:1.22-alpine AS build

RUN apk add --no-cache ca-certificates git

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/nexon .

FROM alpine:3.20

RUN apk add --no-cache ca-certificates wget \
    && adduser -D -H -u 10001 nexon

WORKDIR /app

COPY --from=build /out/nexon /app/nexon
COPY --from=build /src/static /app/static

USER nexon

EXPOSE 4000

ENV GIN_MODE=release \
    PORT=4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=5 \
    CMD wget -q -O /dev/null http://127.0.0.1:4000/ || exit 1

ENTRYPOINT ["/app/nexon"]
