FROM nginx:alpine

# Install Node.js and OpenSSL
RUN apk add --no-cache nodejs npm openssl

# Create SSL directory and copy certificates
RUN mkdir -p /etc/nginx/ssl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create app directory
WORKDIR /app

# Copy package files and install dependencies (including dev for build)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Build frontend
COPY . .
RUN npm run build

# Remove dev dependencies (vite, etc.)
RUN rm -rf node_modules/@vitejs

EXPOSE 80 443 5433

CMD ["sh", "-c", "nginx & node server.js"]
