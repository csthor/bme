# Stage 1: Build frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production image with SSL
FROM nginx:alpine AS nginx-ssl

# Install OpenSSL for cert generation
RUN apk add --no-cache openssl

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/kupon4uk.ru.key \
    -out /etc/nginx/ssl/kupon4uk.ru.crt \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=Kupon4UK/CN=kupon4uk.ru" \
    -addext "subjectAltName=DNS:kupon4uk.ru,DNS:www.kupon4uk.ru"

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Stage 3: Express application
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist
COPY server.js ./
COPY seo-data.json ./

EXPOSE 3000

CMD ["node", "server.js"]

# Stage 4: Final image - combine nginx + express
FROM nginx:alpine

# Install Node.js and OpenSSL
RUN apk add --no-cache nodejs npm openssl

# Create app directory
WORKDIR /app

# Copy SSL certificates from nginx-ssl stage
COPY --from=nginx-ssl /etc/nginx/ssl /etc/nginx/ssl

# Copy nginx configuration from nginx-ssl stage
COPY --from=nginx-ssl /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built frontend and server
COPY --from=builder /app/dist ./dist
COPY server.js ./
COPY seo-data.json ./

# Create volume for seo-data persistence
VOLUME ["/app"]

EXPOSE 80 443 5433

# Start both nginx and node
CMD ["sh", "-c", "nginx & node server.js"]
