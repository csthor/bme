# --- Frontend build -------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev --legacy-peer-deps

COPY . .
RUN npm run build

# --- Production runtime ---------------------------------------------------
FROM nginx:alpine

RUN apk add --no-cache nodejs npm openssl \
    && mkdir -p /etc/nginx/ssl

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

# The API server needs only production dependencies at runtime.
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps \
    && npm cache clean --force

COPY server.js ./
COPY seo-data.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 80 443 5433

CMD ["sh", "-c", "nginx & node server.js"]
