# ============================================
# Stage 1: Build frontend
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# ============================================
# Stage 2: Production runtime
# ============================================
FROM nginx:alpine

# Install Node.js and OpenSSL
RUN apk add --no-cache nodejs npm openssl

# Create SSL directory with self-signed fallback
RUN mkdir -p /etc/nginx/ssl
RUN if [ ! -f /etc/nginx/ssl/fullchain.pem ]; then \
      openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/nginx/ssl/privkey.pem \
      -out /etc/nginx/ssl/fullchain.pem \
      -subj "/C=RU/ST=Moscow/L=Moscow/O=Kupon4UK/CN=localhost" 2>/dev/null; \
    fi

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend from builder stage
COPY --from=builder /app/dist /app/dist

# Copy server files
COPY server.js package*.json ./
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps && \
    npm cache clean --force

EXPOSE 80 443 5433

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/info || exit 1

CMD ["sh", "-c", "nginx & node server.js"]
