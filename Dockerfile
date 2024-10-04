FROM oven/bun:1 AS base
COPY --from=node:20-slim /usr/local/bin/node /usr/local/bin/node

COPY . /app/
WORKDIR /app/

RUN bun i --frozen-lockfile \
  && (cd packages/server && bun run build) \
  && (cd packages/client && bun run build) \
  && cp -r packages/client/dist packages/server/public
WORKDIR /app/packages/server

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start:prod" ]
