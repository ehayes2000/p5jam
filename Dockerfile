FROM oven/bun:1 AS base

COPY bun.lockb /app/
COPY package.json /app/
RUN cd /app/ && bun i 

COPY . /app/
WORKDIR /app/packages/server
RUN bun i && bun run build
RUN NODE_ENV=production bunx prisma migrate deploy

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start:prod" ]
