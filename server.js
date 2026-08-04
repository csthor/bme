import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = express();
const PORT = 3000;
const SEO_DATA_FILE = join(__dirname, 'seo-data.json');

// --- Admin credentials (change in production) ---
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'kzR8vL#mP2qW';

// --- Session storage ---
const sessions = new Map();

function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

function isAuthenticated(req) {
  const sessionId = req.cookies?.sessionId || req.query?.sessionId;
  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId);
    if (session.expires > Date.now()) {
      req.sessionId = sessionId;
      req.user = session.user;
      return true;
    } else {
      sessions.delete(sessionId);
    }
  }
  return false;
}

function createSession() {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    user: ADMIN_USER,
    expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  return sessionId;
}

app.use(express.json());

// Cookie parsing (simple version)
app.use((req, res, next) => {
  const cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const [key, ...valArr] = cookie.trim().split('=');
      if (key && valArr.length) {
        cookies[key.trim()] = decodeURIComponent(valArr.join('='));
      }
    });
  }
  req.cookies = cookies;
  next();
});

// --- Default SEO data ---
const defaultSeo = {
  title: 'Промокод 2026 — Скидки, Акции и Купоны на Всё | Kupon4UK',
  description: 'Находите лучшие промокоды, купоны и скидки каждый день. Актуальные акции от топовых брендов. Экономьте до 70% с нашими эксклюзивными купонами!',
  keywords: 'промокод, промо код, скидка, купон, купоны, акции, промокоды 2026, бесплатная доставка, эксклюзивные предложения, распродажа',
  ogTitle: 'Kupon4UK — Промокоды, Скидки и Купоны 2026',
  ogDescription: 'Тысячи проверенных промокодов и купонов. Актуальные акции каждый день!',
  ogImage: '/og-image.png',
  canonicalUrl: 'https://kupon4uk.ru',
  h1: '🎁 Промокоды, Скидки и Купоны',
  h2: 'Лучшие Актуальные Предложения',
  seoContent: [
    {
      heading: 'Почему наши промокоды самые выгодные?',
      text: 'Мы собираем лучшие промокоды и купоны от более чем 10 000 магазинов. Каждая скидка проходит проверку перед публикацией. Наши пользователи экономят в среднем 35% на каждой покупке.'
    },
    {
      heading: 'Как использовать купон?',
      text: '1. Найдите нужный промокод в нашем каталоге акций. 2. Скопируйте код купона. 3. Перейдите на сайт магазина. 4. Вставьте промокод в поле при оформлении заказа. 5. Получите скидку мгновенно!'
    },
    {
      heading: 'Эксклюзивные акции недели',
      text: 'Каждую неделю мы публикуем специальные предложения с увеличенными скидками. Подпишитесь на рассылку, чтобы первыми узнавать о новых промокодах и купонах.'
    }
  ],
  promoCode: 'KUPON4UK2026',
  promoDiscount: 30,
  promoExpiry: '2026-12-31',
  promoDescription: 'Эксклюзивный промокод на скидку 30% от Kupon4UK — действующие акции и купоны',
  additionalPromoCodes: [
    { code: 'SUMMER26', discount: 20, desc: 'Летняя акция — скидка 20%', expires: '2026-09-01', active: true },
    { code: 'FREEDEL', discount: 0, desc: 'Бесплатная доставка по всей России', expires: '2026-12-31', active: true },
    { code: 'WELCOME26', discount: 15, desc: 'Приветственный купон для новых клиентов', expires: '2026-12-31', active: true }
  ],
  schemaJson: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kupon4UK",
    "description": "Сервис актуальных промокодов, скидок и купонов",
    "url": "https://kupon4uk.ru",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kupon4uk.ru/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
};

function loadSeoData() {
  try {
    const data = readFileSync(SEO_DATA_FILE, 'utf-8');
    return { ...defaultSeo, ...JSON.parse(data) };
  } catch {
    return { ...defaultSeo };
  }
}

function saveSeoData(data) {
  writeFileSync(SEO_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// --- CPU usage monitoring via /proc/stat ---
let prevCpu = null;

function getCpuUsage() {
  try {
    const stat = readFileSync('/proc/stat', 'utf-8').split('\n')[0];
    const values = stat.split(/\s+/).slice(1).map(Number);
    const idle = values[3] + (values[4] || 0);
    const total = values.reduce((a, b) => a + b, 0);

    if (prevCpu) {
      const totalDiff = total - prevCpu.total;
      const idleDiff = idle - prevCpu.idle;
      const usage = ((totalDiff - idleDiff) / totalDiff) * 100;
      prevCpu = { total, idle };
      return Math.max(0, Math.min(100, usage));
    }

    prevCpu = { total, idle };
    return 0;
  } catch {
    return 0;
  }
}

setInterval(getCpuUsage, 2000);

// --- Auth API Routes ---

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const sessionId = createSession();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    res.json({ success: true, sessionId });
  } else {
    res.status(401).json({ error: 'Неверный логин или пароль' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  if (req.sessionId) {
    sessions.delete(req.sessionId);
  }
  res.clearCookie('sessionId');
  res.json({ success: true });
});

app.get('/api/auth/status', (req, res) => {
  const authenticated = isAuthenticated(req);
  res.json({ authenticated });
});

// --- Admin API Routes (require authentication) ---

app.put('/api/seo', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const current = loadSeoData();
    const updated = { ...current, ...req.body };
    saveSeoData(updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seo/promo-codes', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const current = loadSeoData();
    const newCode = { ...req.body, active: true, createdAt: new Date().toISOString() };
    if (!current.additionalPromoCodes) current.additionalPromoCodes = [];
    current.additionalPromoCodes.push(newCode);
    saveSeoData(current);
    res.json({ success: true, data: current });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/seo/promo-codes/:index', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const current = loadSeoData();
    const idx = parseInt(req.params.index);
    if (current.additionalPromoCodes && current.additionalPromoCodes[idx]) {
      current.additionalPromoCodes.splice(idx, 1);
      saveSeoData(current);
      res.json({ success: true, data: current });
    } else {
      res.status(404).json({ error: 'Promo code not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/seo/promo-codes/:index', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const current = loadSeoData();
    const idx = parseInt(req.params.index);
    if (current.additionalPromoCodes && current.additionalPromoCodes[idx]) {
      current.additionalPromoCodes[idx] = { ...current.additionalPromoCodes[idx], ...req.body };
      saveSeoData(current);
      res.json({ success: true, data: current });
    } else {
      res.status(404).json({ error: 'Promo code not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Public API Routes ---

// SEO data endpoints
app.get('/api/seo', (req, res) => {
  const data = loadSeoData();
  // Remove internal fields from response
  const { schemaJson, ...publicData } = data;
  res.json(publicData);
});

app.get('/api/seo/all', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const data = loadSeoData();
  res.json(data);
});

// Main info endpoint
app.get('/api/info', (req, res) => {
  const now = new Date();
  const randomNum = Math.floor(Math.random() * 10000);
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const seoData = loadSeoData();

  res.json({
    date: now.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: now.toLocaleTimeString('ru-RU'),
    randomNum,
    ip,
    promoCode: seoData.promoCode,
    promoDiscount: seoData.promoDiscount,
    seoTitle: seoData.title,
  });
});

app.get('/api/cpu', (req, res) => {
  res.json({ cpu: getCpuUsage() });
});

// Serve SEO data as JSON-LD
app.get('/api/schema', (req, res) => {
  const seoData = loadSeoData();
  res.json(seoData.schemaJson);
});

// --- Serve static files in production with SPA fallback ---
const distPath = join(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA fallback - all non-API routes go to index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(distPath, 'index.html'));
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('🔐 АДМИН-ПАНЕЛЬ АВТОРИЗАЦИЯ');
  console.log('='.repeat(50));
  console.log(`Логин: ${ADMIN_USER}`);
  console.log(`Пароль: ${ADMIN_PASS}`);
  console.log('='.repeat(50));
  console.log(`Основной сайт: http://kupon4uk.ru`);
  console.log(`Админ-панель: http://kupon4uk.ru:5433/admin`);
});
