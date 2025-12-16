FROM node:20-alpine as builder

WORKDIR /app

RUN apk add --no-cache curl unzip bash \
    && curl -fsSL https://bun.sh/install | bash \
    && mv /root/.bun/bin/bun /usr/local/bin/bun \
    && rm -rf /root/.bun

COPY package*.json ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build --filter=ersen-frontend

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx alpine already runs worker as non-root (nginx user)
# Ensure proper ownership
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]