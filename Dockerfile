# Stage 1: Build frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve with Express
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --production --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY server.js ./
COPY seo-data.json ./
COPY nginx.conf ./

EXPOSE 80 443 5433

CMD ["node", "server.js"]
