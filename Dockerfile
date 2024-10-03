FROM oven/bun:1 AS base

COPY bun.lockb /app/
COPY package.json /app/
RUN cd /app/ && bun i 

COPY . /app/
WORKDIR /app/packages/server
RUN bun run build

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start:prod" ]
