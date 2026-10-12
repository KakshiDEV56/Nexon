
<h1 align="center">Nexon</h1>
<p align="center">
  <a href="https://go.dev/"><img src="https://cdn.simpleicons.org/go/00ADD8" alt="Go" width="20" height="20" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://react.dev/"><img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" width="20" height="20" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.typescriptlang.org/"><img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" width="20" height="20" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://chakra-ui.com/"><img src="https://cdn.simpleicons.org/chakraui/319795" alt="Chakra UI" width="20" height="20" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.postgresql.org/"><img src="https://cdn.simpleicons.org/postgresql/4169E1" alt="PostgreSQL" width="20" height="20" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://redis.io/"><img src="https://cdn.simpleicons.org/redis/FF4438" alt="Redis" width="20" height="20" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.docker.com/"><img src="https://cdn.simpleicons.org/docker/2496ED" alt="Docker" width="20" height="20" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-container-registry"><img src="https://cdn.simpleicons.org/github/181717" alt="GitHub Container Registry" width="20" height="20" /></a>
</p>

<p align="center">
  <a href="https://github.com/KakshiDEV56/Nexon"><img src="https://img.shields.io/badge/repository-KakshiDEV56%2FNexon-181717?logo=github&logoColor=white" alt="GitHub repository" /></a>
  <a href="https://github.com/sentrionic/Valkyrie"><img src="https://img.shields.io/badge/based%20on-sentrionic%2FValkyrie-555555?logo=github&logoColor=white" alt="Based on Valkyrie by sentrionic" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?logo=mit&logoColor=white" alt="MIT License" /></a>
</p>

Nexon is a real-time community platform. People register an account, create or join spaces called guilds, talk in text channels, send direct messages, manage friends, and hold a basic voice session inside a guild. The browser client is a React application. The API and websocket server are a Go service. PostgreSQL stores accounts, guilds, channels, and messages. Redis stores sessions and short-lived tokens.

This repository is a modified copy of [Valkyrie](https://github.com/sentrionic/Valkyrie) by [sentrionic](https://github.com/sentrionic). Valkyrie is a full-stack Discord-style application written in React and Go and released under the MIT License. Nexon keeps that architecture and module layout, presents the product under the Nexon name, and adds container images so the frontend and the backend can be built in GitHub Actions and run from the GitHub Container Registry on another machine. The Go module path inside the backend is still `github.com/sentrionic/valkyrie`, which is the path from the original project.

## Origin and attribution

The source tree was cloned from the public Valkyrie repository and then modified for Nexon.

| | |
| --- | --- |
| Original project | [Valkyrie](https://github.com/sentrionic/Valkyrie) |
| Original author | [sentrionic](https://github.com/sentrionic) |
| Original license | MIT, Copyright (c) 2021 sentrionic. The full notice is in [LICENSE](./LICENSE). |
| This repository | [KakshiDEV56/Nexon](https://github.com/KakshiDEV56/Nexon) |

sentrionic's own readme also credits the work this design grew out of. Those credits travel with the code:

- [Ben Awad](https://github.com/benawad) for the Slack tutorial series that shaped the first version of the product.
- [Jacob Goodwin](https://github.com/JacobSNGoodwin/memrizr) for the backend structure used by the Go service.
- [Jeroen de Kok](https://dev.to/jeroendk/building-a-simple-chat-application-with-websockets-in-go-and-vue-js-gao) for the websocket layout.
- [ericellb](https://github.com/ericellb/React-Discord-Clone) for the approach used by the basic voice chat.

Nexon is not affiliated with Discord. The interaction model, including guilds, channels, and friends, follows the structure inherited from Valkyrie.

## What the application does

A signed-in member can:

- Register, log in, log out, and reset a password by email when a Gmail account is configured.
- Create guilds, join them with an invite, and leave them.
- Create text channels, including private channels, and post, edit, and delete messages.
- Exchange direct messages.
- Send, accept, and remove friend requests.
- Receive guild, channel, message, friend, and voice events over a websocket.
- Upload avatars and guild icons when an S3 bucket is configured.
- Use the guild owner's moderation actions to delete messages and kick or ban members.
- Join one voice channel per guild, with mute and deafen.

Authentication uses server-side sessions stored in Redis. The browser sends the session cookie with `withCredentials`. The API only accepts browser calls from the origin named in `CORS_ORIGIN`.

## Architecture and repository structure

### System architecture

The frontend is a React/TypeScript single-page application. It uses HTTP for REST API calls and WebSockets for live events. The Go/Gin backend wires handlers to services and repositories, and uses PostgreSQL for persistent application data and Redis for sessions, reset tokens, and rate limiting.

```mermaid
graph TD
    Browser["Browser"]

    subgraph Frontend["Frontend: React and TypeScript"]
        Routes["Routes and page layouts"]
        Components["UI components"]
        Client["REST API client, React Query, and state stores"]
        SocketClient["WebSocket client and hooks"]
        Routes --> Components
        Components --> Client
        Components --> SocketClient
    end

    subgraph Backend["Backend: Go and Gin"]
        Router["Router and middleware"]
        Handlers["HTTP handlers"]
        Services["Service layer"]
        Repositories["Repository layer"]
        WS["WebSocket hub and handlers"]
        Config["Configuration and data sources"]
        Router --> Handlers
        Handlers --> Services
        Services --> Repositories
        Router --> WS
        Config --> Router
    end

    Postgres[("PostgreSQL")]
    Redis[("Redis")]

    Browser --> Routes
    Client -->|"HTTP /api"| Router
    SocketClient -->|"WebSocket /ws"| WS
    Repositories --> Postgres
    Services --> Redis
```

### Source tree at a glance

```text
Nexon/
├── .github/
│   └── workflows/
│       └── publish-images.yml   # Build and publish container images
├── backend/
│   ├── main.go                  # Server startup and graceful shutdown
│   ├── injection.go             # Dependency wiring
│   ├── data_sources.go          # PostgreSQL / Redis initialization
│   ├── config/                  # Environment-based configuration
│   ├── handler/                 # HTTP handlers and middleware
│   ├── service/                 # Application/business logic
│   ├── repository/              # Data-access layer
│   ├── model/                   # Domain models, errors, and fixtures
│   ├── ws/                      # WebSocket implementation
│   ├── mocks/                   # Test doubles
│   ├── Dockerfile
│   ├── Makefile
│   └── go.mod
├── frontend/
│   ├── public/                  # Static assets and HTML shell
│   ├── src/
│   │   ├── routes/              # Application routes
│   │   ├── components/          # UI, layouts, menus, and modals
│   │   ├── lib/
│   │   │   ├── api/             # HTTP clients, DTOs, WebSocket hooks
│   │   │   ├── models/          # Frontend data types
│   │   │   ├── stores/          # Client-side state stores
│   │   │   └── utils/           # Validation and shared utilities
│   │   └── tests/               # Frontend tests and fixtures
│   ├── cypress/                 # End-to-end tests
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml            # Local full-stack environment
├── README.md
└── LICENSE
```

### Request and event flow

1. The browser loads the frontend on port `3000`.
2. REST requests go to the Go API on port `4000` under `/api`. The router applies middleware and dispatches to handlers; handlers call services, which use repositories for database operations.
3. Live updates travel over the WebSocket endpoint `/ws` and are handled by the backend's WebSocket components.
4. PostgreSQL stores durable application records. Redis supports server-side sessions and short-lived data such as reset tokens and rate-limit state.

The published frontend image is a static React build served by nginx. The API address and the websocket address are compiled into that build. The image published by this repository expects the API at `http://localhost:4000` and the websocket at `ws://localhost:4000/ws`, which matches the ports in `docker-compose.yml`.

The backend image is a static Go binary. On startup it connects to PostgreSQL, migrates the tables, connects to Redis, and listens on port 4000. In the container, `GIN_MODE=release`, so the process reads its settings from the environment and does not look for a `.env` file.

PostgreSQL and Redis are not part of the Nexon images. They are started next to the application by Docker Compose when you want the full stack on a laptop.

## Container images

GitHub Actions builds two images and pushes them to the GitHub Container Registry on every push to `main`, on version tags such as `v1.0.0`, and when the workflow is started by hand.

| Image | Contents | Published name |
| --- | --- | --- |
| Backend | Go API and websocket server | `ghcr.io/kakshidev56/nexon-backend` |
| Frontend | React production build served by nginx | `ghcr.io/kakshidev56/nexon-frontend` |

Both images are built for `linux/amd64` and `linux/arm64`, so they run on typical Intel and Apple Silicon laptops. The `latest` tag tracks the default branch. A commit also receives a `sha-<commit>` tag. A version tag such as `v1.2.0` is published under that tag name as well.

The workflow file is [`.github/workflows/publish-images.yml`](.github/workflows/publish-images.yml). It logs in with `GITHUB_TOKEN` and requests `packages: write`. The image label `org.opencontainers.image.source` points at this repository so GitHub can attach each package to the repo.

After the first successful run, open the repository Packages page and set each package's visibility. A new GitHub package is private until that setting is changed. A private package can still be pulled after `docker login ghcr.io`. A public package can be pulled by anyone without a login.

## Run Nexon on a laptop

Install [Docker](https://docs.docker.com/get-docker/) with the Compose plugin. Clone this repository, then start the stack from the repository root:

```bash
git clone https://github.com/KakshiDEV56/Nexon.git
cd Nexon
docker compose up --build
```

Compose builds the backend and frontend from the Dockerfiles in this repository, starts PostgreSQL 16 and Redis 7 on a private network, waits until both data stores are healthy, and then starts the API and the website.

Open [http://localhost:3000](http://localhost:3000). The API is at [http://localhost:4000](http://localhost:4000). Postgres data is kept in the Compose volume `postgres_data`, so accounts and messages survive a restart. `docker compose down` stops the stack and leaves that volume in place. `docker compose down -v` stops the stack and deletes the database volume.

### Use the images from the registry

Once the workflow has published the packages, a machine can pull them instead of compiling the source:

```bash
docker login ghcr.io
docker compose pull
docker compose up
```

`docker login` is required while the packages are private. Use a personal access token with the `read:packages` scope as the password. The workflow's own token is only available inside GitHub Actions and is not the token you use on a laptop.

You can also run the two application images yourself. Postgres and Redis still have to be reachable at the addresses you pass in, and the frontend build has to point at a host the browser can reach.

```bash
docker pull ghcr.io/kakshidev56/nexon-backend:latest
docker pull ghcr.io/kakshidev56/nexon-frontend:latest

docker run --rm -p 4000:4000 \
  -e DATABASE_URL="postgresql://nexon:nexon@host.docker.internal:5432/nexon?sslmode=disable" \
  -e REDIS_URL="redis://host.docker.internal:6379/0" \
  -e SECRET="replace-this-secret" \
  -e CORS_ORIGIN="http://localhost:3000" \
  ghcr.io/kakshidev56/nexon-backend:latest

docker run --rm -p 3000:80 ghcr.io/kakshidev56/nexon-frontend:latest
```

`host.docker.internal` is the Docker host as seen from inside a container. It is the right hostname when Postgres and Redis are already running on the laptop rather than in Compose.

### Point the frontend at a different API

The React client does not read environment variables after it has been built. To publish or run a frontend that calls a different host, rebuild it with build arguments:

```bash
docker build \
  --build-arg REACT_APP_API=https://api.example.com \
  --build-arg REACT_APP_WS=wss://api.example.com/ws \
  -t nexon-frontend \
  ./frontend
```

`CORS_ORIGIN` on the backend must be the exact origin of that website, including the scheme and port, for example `https://app.example.com`.

## Configuration

The Compose file supplies everything required to sign up and chat on a laptop. Set a real session secret before you treat an instance as shared:

```bash
export NEXON_SECRET="a-long-random-string"
docker compose up --build
```

| Variable | Required to start | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. Use `sslmode=disable` on the Compose network. |
| `REDIS_URL` | Yes | Redis connection string used for sessions, reset tokens, and the rate limiter. |
| `SECRET` | Yes | Signs the session cookie. The server also passes this value to the S3 client as the secret credential. |
| `CORS_ORIGIN` | Yes | Browser origin allowed to call the API, for example `http://localhost:3000`. |
| `PORT` | No | Listen port inside the container. Defaults to `4000`. |
| `DOMAIN` | No | Cookie domain. Leave it unset for local Docker so the cookie stays on the API host. |
| `HANDLER_TIMEOUT` | No | Request timeout in seconds. Defaults to `5`. |
| `MAX_BODY_BYTES` | No | Maximum request body size. Defaults to `4194304` (4 MiB). |
| `AWS_ACCESS_KEY` | No | S3 access key. Image and file upload APIs need a real bucket. |
| `BUCKET_NAME` | No | S3 bucket name. |
| `REGION` | No | S3 region. |
| `GMAIL_USER` | No | Gmail address used for password-reset mail. |
| `GMAIL_PASSWORD` | No | Gmail app password used with `GMAIL_USER`. |

`backend/.env.example` still uses the variable names from the original Valkyrie readme (`AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_REGION`). The process itself reads the names in `backend/config/config.go`, which are the names in the table above. Container configuration follows the code.

Chat file attachments are hidden in the production frontend build. Account and guild image uploads still call the API and will fail until S3 credentials and a bucket are provided. Password reset will not send mail until the Gmail settings are provided. Neither feature is required to create an account or to exchange messages.

## Project layout

| Path | Role |
| --- | --- |
| `backend/` | Go API, websocket hub, Gorm models, and the AsyncAPI static page. |
| `frontend/` | React and TypeScript client, Chakra UI, React Query, and Zustand. |
| `backend/Dockerfile` | Multi-stage build of the API image. |
| `frontend/Dockerfile` | Multi-stage build of the nginx image. |
| `docker-compose.yml` | Laptop stack: Postgres, Redis, backend, and frontend. |
| `.github/workflows/publish-images.yml` | Builds and pushes both images to GHCR. |

## Development without the application containers

The Dockerfiles are for running Nexon. Day-to-day code changes can still use the toolchain directly.

Backend, from `backend/`:

```bash
make postgres
make redis
make createdb
cp .env.example .env
go run .
```

The Makefile starts Postgres and Redis with the original Valkyrie database name and credentials. Adjust `.env` so `DATABASE_URL`, `REDIS_URL`, `SECRET`, and `CORS_ORIGIN` match those containers and the React dev server on port 3000. Align the S3 key names with `backend/config/config.go` if you enable uploads.

Frontend, from `frontend/`:

```bash
yarn
```

Create `frontend/.env.development` with:

```text
REACT_APP_API=http://localhost:4000
REACT_APP_WS=ws://localhost:4000/ws
```

Then run:

```bash
yarn start
```

The client opens on [http://localhost:3000](http://localhost:3000). Node.js 20 and Yarn 1 match the versions used inside the frontend image.

Backend tests that do not need a database:

```bash
go test -v -cover ./service/... ./handler/...
```

The end-to-end Go tests expect Postgres and Redis. Frontend unit tests are `yarn test`. Cypress is available with `yarn cypress` while both the API and the client are already running.

## License

Nexon is distributed under the MIT License included with the original Valkyrie project. Copyright (c) 2021 [sentrionic](https://github.com/sentrionic). See [LICENSE](./LICENSE).
