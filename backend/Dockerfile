FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN bun install --frozen-lockfile

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN bun install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/schema.sql ./schema.sql
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

CMD ["node", "dist/index.js"]
