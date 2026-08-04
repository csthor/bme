FROM nginx:alpine

# Install Node.js and OpenSSL
RUN apk add --no-cache nodejs npm openssl

# Create SSL directory and generate self-signed certificate
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/kupon4uk.ru.key \
    -out /etc/nginx/ssl/kupon4uk.ru.crt \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=Kupon4UK/CN=kupon4uk.ru" \
    -addext "subjectAltName=DNS:kupon4uk.ru,DNS:www.kupon4uk.ru"

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
