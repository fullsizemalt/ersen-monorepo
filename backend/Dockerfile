FROM node:20-alpine as builder

WORKDIR /app

RUN apk add --no-cache curl unzip bash \
    && curl -fsSL https://bun.sh/install | bash \
    && mv /root/.bun/bin/bun /usr/local/bin/bun \
    && rm -rf /root/.bun

COPY package*.json ./
RUN bun install --frozen-lockfile

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl unzip bash \
    && curl -fsSL https://bun.sh/install | bash \
    && mv /root/.bun/bin/bun /usr/local/bin/bun \
    && rm -rf /root/.bun

COPY package*.json ./
RUN bun install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/schema.sql ./schema.sql
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

CMD ["node", "dist/index.js"]
