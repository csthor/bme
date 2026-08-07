#!/bin/bash
# Для продакшена используйте Let's Encrypt или коммерческий SSL сертификат

CERT_DIR="$(dirname "$0")/ssl"
mkdir -p "$CERT_DIR"

echo "Генерация SSL сертификата для kupon4uk.ru..."

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$CERT_DIR/kupon4uk.ru.key" \
  -out "$CERT_DIR/kupon4uk.ru.crt" \
  -subj "/C=RU/ST=Moscow/L=Moscow/O=Kupon4UK/CN=kupon4uk.ru" \
  -addext "subjectAltName=DNS:kupon4uk.ru,DNS:www.kupon4uk.ru,IP:127.0.0.1"

echo "✅ SSL сертификаты созданы:"
echo "   - $CERT_DIR/kupon4uk.ru.crt"
echo "   - $CERT_DIR/kupon4uk.ru.key"
echo ""
echo "⚠️  Внимание: self-signed сертификаты не доверены браузерами."
echo "   Для продакшена используйте Let's Encrypt или коммерческий сертификат."
