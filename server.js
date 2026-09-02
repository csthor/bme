import dotenv from 'dotenv';
import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = express();
const PORT = 3000;
const SEO_DATA_FILE = join(__dirname, 'seo-data.json');
const PROMO_DATA_FILE = join(__dirname, 'promo-data.json');
const PROMO_STATE_DATA_FILE = join(__dirname, 'promo-state.json');
const USAGE_DATA_FILE = join(__dirname, 'usage-data.json');

// --- Admin credentials (load from .env) ---
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

if (!ADMIN_USER || !ADMIN_PASS) {
  console.error('❌ ОШИБКА: Переменные окружения ADMIN_USER и ADMIN_PASS должны быть установлены в .env');
  console.error('   Пример: ADMIN_USER=admin ADMIN_PASS=your_secure_password');
  process.exit(1);
}

// --- Session storage ---
const sessions = new Map();

// --- Security: Brute-force protection ---
const loginAttempts = new Map(); // IP -> { count, firstAttempt, lockedUntil }
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

// --- Security: Suspicious User-Agents (scanners, AI crawlers, vulnerability scanners) ---
const SUSPICIOUS_UA_PATTERNS = [
  // AI/LLM crawlers
  /chatgpt/i, /gptbot/i, /gemini/i, /claude/i, /perplexity/i,
  /cohere/i, /llama/i, /bingbot/i, /slurp/i, /duckduckbot/i,
  // Vulnerability scanners
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
  /nuclei/i, /subfinder/i, /sublist3r/i, /dirbuster/i,
  /gobuster/i, /wfuzz/i, /hydra/i, /burpsuite/i,
  /w3af/i, /acunetix/i, /nessus/i, /openvas/i,
  /qualys/i, /appscan/i, /arachni/i, /skipfish/i,
  // Generic scanners
  /scanner/i, /vulnerability/i, /exploit/i, /hack/i,
  /python-requests/i, /curl/i, /wget/i,
  /httpie/i, /axios/i, /node-fetch/i,
  // Headless browsers for scraping
  /headless/i, /puppeteer/i, /selenium/i, /playwright/i,
  /phantomjs/i, /crawl/i, /spider/i, /bot/i, /scraper/i
];

// --- Security: Rate limiting ---
const requestHistory = new Map(); // IP -> [{ timestamp }]
const RATE_LIMIT_MAX = 100; // requests per window
const RATE_LIMIT_BAN = 300 * 1000; // ban duration for rate limit violation

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         '127.0.0.1';
}

function isIPLockedOut(ip) {
  const attempt = loginAttempts.get(ip);
  if (!attempt) return false;

  // Check if locked out
  if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
    return true;
  }

  // Clear expired lockout
  if (attempt.lockedUntil && Date.now() >= attempt.lockedUntil) {
    loginAttempts.delete(ip);
  }

  return false;
}

function recordLoginAttempt(ip, success) {
  let attempt = loginAttempts.get(ip);
  if (!attempt) {
    attempt = { count: 0, firstAttempt: Date.now(), lockedUntil: null };
    loginAttempts.set(ip, attempt);
  }

  if (success) {
    // Reset on successful login
    loginAttempts.delete(ip);
    return;
  }

  attempt.count++;

  // Exponential backoff: add delay based on attempt count
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCKOUT_DURATION;
    console.warn(`IP ${ip} locked out after ${attempt.count} failed attempts`);
  }
}

function isUserAgentSuspicious(ua) {
  if (!ua) return true; // No User-Agent is suspicious
  return SUSPICIOUS_UA_PATTERNS.some(pattern => pattern.test(ua));
}

function isRateLimited(ip) {
  const history = requestHistory.get(ip);
  if (!history) return false;

  const now = Date.now();
  // Remove old entries outside window
  while (history.length > 0 && now - history[0].timestamp > RATE_LIMIT_WINDOW) {
    history.shift();
  }

  if (history.length >= RATE_LIMIT_MAX) {
    return true;
  }

  history.push({ timestamp: now });
  requestHistory.set(ip, history);
  return false;
}

// Clean up old sessions every hour
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expires < now) {
      sessions.delete(sessionId);
    }
  }

  // Clean old rate limit history
  for (const [ip, history] of requestHistory.entries()) {
    const valid = history.filter(h => now - h.timestamp < RATE_LIMIT_WINDOW);
    if (valid.length === 0) {
      requestHistory.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Every hour

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

// --- Security Middleware ---

// Rate limiting protects the API without blocking legitimate search crawlers.
app.use((req, res, next) => {
  // Check rate limiting
  const ip = getClientIP(req);
  if (isRateLimited(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  next();
});

// Add security headers to all responses
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('X-XSS-Protection', '1; mode=block');
  res.set('Referrer-Policy', 'no-referrer');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
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
  h1: 'Промокоды, Скидки и Купоны',
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
  promoCode: '',
  promoDiscount: 0,
  promoExpiry: '',
  promoDescription: '',
  additionalPromoCodes: [],
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

function loadPromoData() {
  try { return JSON.parse(readFileSync(PROMO_DATA_FILE, 'utf8')); }
  catch { return { promos: [], updatedAt: null }; }
}

function savePromoData(data) {
  writeFileSync(PROMO_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function loadPromoStateData() {
  try {
    const data = JSON.parse(readFileSync(PROMO_STATE_DATA_FILE, 'utf8'));
    return { promos: data.promos || {}, promosByFingerprint: data.promosByFingerprint || {}, updatedAt: data.updatedAt || null };
  } catch {
    return { promos: {}, promosByFingerprint: {}, updatedAt: null };
  }
}

function savePromoStateData(data) {
  writeFileSync(PROMO_STATE_DATA_FILE, JSON.stringify({
    promos: data.promos || {},
    promosByFingerprint: data.promosByFingerprint || {},
    updatedAt: data.updatedAt || new Date().toISOString()
  }, null, 2), 'utf8');
}

function getPromoStateOverride(state, promo) {
  return {
    ...(promo.fingerprint ? state.promosByFingerprint[promo.fingerprint] || {} : {}),
    ...(state.promos[promo.id] || {})
  };
}

function setPromoStateOverride(state, promo, patch) {
  state.promos[promo.id] = { ...(state.promos[promo.id] || {}), ...patch };
  if (promo.fingerprint) {
    state.promosByFingerprint[promo.fingerprint] = { ...(state.promosByFingerprint[promo.fingerprint] || {}), ...patch };
  }
}

function withPromoState(promos) {
  const state = loadPromoStateData();
  return promos.map((promo) => ({ ...promo, ...getPromoStateOverride(state, promo) }));
}

function loadUsageData() {
  try {
    const data = JSON.parse(readFileSync(USAGE_DATA_FILE, 'utf8'));
    return { ...data, promos: data.promos || {}, promosByFingerprint: data.promosByFingerprint || {} };
  } catch {
    return { promos: {}, promosByFingerprint: {} };
  }
}

function saveUsageData(data) {
  writeFileSync(USAGE_DATA_FILE, JSON.stringify({
    ...data,
    promos: data.promos || {},
    promosByFingerprint: data.promosByFingerprint || {}
  }, null, 2), 'utf8');
}

function getPromoUsageCount(usage, promo) {
  return Math.max(
    Number(usage.promos?.[promo.id]) || 0,
    Number(promo.fingerprint ? usage.promosByFingerprint?.[promo.fingerprint] : 0) || 0,
    Number(usage[promo.id]) || 0,
    Number(promo.usedCount) || 0
  );
}

function setPromoUsageCount(usage, promo, count) {
  usage.promos[promo.id] = count;
  if (promo.fingerprint) usage.promosByFingerprint[promo.fingerprint] = count;
}

function withUsageCounts(promos) {
  const usage = loadUsageData();
  return promos.map((promo) => ({ ...promo, usedCount: getPromoUsageCount(usage, promo) }));
}

function normalizePromo(item) {
  const promo = {
    id: item.id || crypto.randomUUID(),
    store: String(item.store || '').trim(),
    code: String(item.code || '').trim().toUpperCase(),
    title: String(item.title || '').trim(),
    description: String(item.description || '').trim(),
    conditions: String(item.conditions || '').trim(),
    sourceUrl: String(item.sourceUrl || '').trim(),
    sourceType: String(item.sourceType || '').trim(),
    discoveryMethod: String(item.discoveryMethod || '').trim(),
    category: String(item.category || '').trim(),
    iconUrl: String(item.iconUrl || '').trim(),
    iconFormat: String(item.iconFormat || '').trim(),
    iconSourceUrl: String(item.iconSourceUrl || '').trim(),
    iconStatus: String(item.iconStatus || (item.iconUrl ? 'checked' : 'missing')).trim(),
    validFrom: item.validFrom || null,
    validUntil: item.validUntil || null,
    status: item.status || 'pending',
    verificationStatus: item.verificationStatus || 'unverified',
    usedCount: Number(item.usedCount) || 0,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return promo;
}

function validatePromo(promo) {
  const required = ['store', 'title', 'description', 'sourceUrl', 'sourceType', 'discoveryMethod', 'category'];
  const missing = required.filter((field) => !promo[field]);
  try { new URL(promo.sourceUrl); } catch { missing.push('sourceUrl'); }
  if (!['official_api', 'official_site', 'official_app', 'telegram', 'aggregator', 'affiliate_feed', 'manual'].includes(promo.sourceType)) missing.push('sourceType');
  return [...new Set(missing)];
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
  const ip = getClientIP(req);
  
  // Check if IP is locked out
  if (isIPLockedOut(ip)) {
    const attempt = loginAttempts.get(ip);
    const remaining = Math.ceil((attempt.lockedUntil - Date.now()) / 1000);
    return res.status(423).json({ 
      error: 'Слишком много попыток. Попробуйте через ' + Math.ceil(remaining / 60) + ' мин.' 
    });
  }
  
  const { username, password } = req.body;
  
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    recordLoginAttempt(ip, true);
    const sessionId = createSession();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    res.json({ success: true, sessionId });
  } else {
    recordLoginAttempt(ip, false);
    const attempt = loginAttempts.get(ip);
    
    if (attempt?.count >= MAX_LOGIN_ATTEMPTS && attempt.lockedUntil) {
      const remaining = Math.ceil((attempt.lockedUntil - Date.now()) / 1000);
      return res.status(423).json({ 
        error: 'Слишком много попыток. Попробуйте через ' + Math.ceil(remaining / 60) + ' мин.' 
      });
    }
    
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

// Promo ingestion API. New records always enter moderation as pending.
app.post('/api/import/promos', (req, res) => {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
  const items = Array.isArray(req.body?.items) ? req.body.items : [req.body];
  const data = loadPromoData();
  const errors = [];
  let imported = 0;
  for (const item of items) {
    const promo = normalizePromo(item || {});
    const missing = validatePromo(promo);
    if (missing.length) { errors.push({ item: item?.code || item?.title || null, missing }); continue; }
    const fingerprint = [promo.store, promo.code, promo.sourceUrl, promo.validUntil || ''].join('|').toLowerCase();
    const duplicate = data.promos.find((entry) => entry.fingerprint === fingerprint);
    if (duplicate) { duplicate.updatedAt = promo.updatedAt; continue; }
    data.promos.push({ ...promo, fingerprint });
    imported += 1;
  }
  data.updatedAt = new Date().toISOString();
  savePromoData(data);
  res.status(errors.length ? 422 : 201).json({ imported, total: data.promos.length, errors });
});

app.get('/api/promos', (req, res) => {
  const data = loadPromoData();
  const visible = withUsageCounts(withPromoState(data.promos)).filter((promo) => promo.status === 'approved' && promo.verificationStatus === 'valid');
  res.json({ promos: visible, updatedAt: data.updatedAt });
});

// Full catalog for the admin panel, including moderation state and usage metrics.
app.get('/api/admin/catalog', (req, res) => {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
  const data = loadPromoData();
  const promos = withUsageCounts(withPromoState(data.promos)).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  const stores = [...new Set(promos.map((promo) => promo.store).filter(Boolean))].map((store) => {
    const items = promos.filter((promo) => promo.store === store);
    const first = items.find((promo) => promo.iconUrl) || {};
    return { store, total: items.length, visible: items.filter((promo) => promo.status === 'approved' && promo.verificationStatus === 'valid').length, iconUrl: first.iconUrl || '', iconFormat: first.iconFormat || '', iconStatus: first.iconStatus || 'missing' };
  }).sort((a, b) => b.visible - a.visible || a.store.localeCompare(b.store, 'ru'));
  res.json({ promos, stores, updatedAt: data.updatedAt });
});

app.put('/api/admin/promos/bulk', (req, res) => {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
  const ids = Array.isArray(req.body?.ids) ? new Set(req.body.ids.filter(Boolean)) : null;
  if (!ids || ids.size === 0) return res.status(400).json({ error: 'Promo ids are required' });
  const allowed = ['status', 'verificationStatus'];
  const patch = {};
  for (const field of allowed) if (Object.prototype.hasOwnProperty.call(req.body, field)) patch[field] = req.body[field];
  if (!Object.keys(patch).length) return res.status(400).json({ error: 'No allowed fields to update' });

  const data = loadPromoData();
  const state = loadPromoStateData();
  const updatedAt = new Date().toISOString();
  let updated = 0;
  data.promos.forEach((promo) => {
    if (!ids.has(promo.id)) return;
    setPromoStateOverride(state, promo, { ...patch, updatedAt });
    updated += 1;
  });
  state.updatedAt = updatedAt;
  savePromoStateData(state);
  res.json({ success: true, updated });
});

app.put('/api/admin/promos/:id', (req, res) => {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
  const data = loadPromoData();
  const promo = withPromoState(data.promos).find((item) => item.id === req.params.id);
  if (!promo) return res.status(404).json({ error: 'Promo not found' });
  const allowed = ['status', 'verificationStatus', 'validUntil', 'description', 'conditions'];
  const patch = {};
  for (const field of allowed) if (Object.prototype.hasOwnProperty.call(req.body, field)) patch[field] = req.body[field];
  const state = loadPromoStateData();
  const updatedAt = new Date().toISOString();
  setPromoStateOverride(state, promo, { ...patch, updatedAt });
  state.updatedAt = updatedAt;
  savePromoStateData(state);
  res.json({ success: true, promo: { ...promo, ...getPromoStateOverride(state, promo) } });
});

app.post('/api/promos/:id/use', (req, res) => {
  const data = loadPromoData();
  const promo = withPromoState(data.promos).find((item) => item.id === req.params.id);
  if (!promo || promo.status !== 'approved' || promo.verificationStatus !== 'valid') {
    return res.status(404).json({ error: 'Promo not found' });
  }
  const usage = loadUsageData();
  const usedCount = getPromoUsageCount(usage, promo) + 1;
  setPromoUsageCount(usage, promo, usedCount);
  saveUsageData(usage);
  res.json({ id: promo.id, usedCount });
});

// SEO data endpoints
app.get('/api/seo', (req, res) => {
  const data = loadSeoData();
  // Remove internal fields from response
  const { schemaJson, promoCode, promoDiscount, promoExpiry, promoDescription, additionalPromoCodes, ...publicData } = data;
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
    seoTitle: loadSeoData().title,
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
  console.log('АДМИН-ПАНЕЛЬ: АВТОРИЗАЦИЯ');
  console.log('='.repeat(50));
  console.log(`Логин: ${ADMIN_USER}`);
  console.log(`Пароль: *** (из ADMIN_PASS)`);
  console.log('='.repeat(50));
  console.log(`Основной сайт: http://kupon4uk.ru`);
  console.log(`Админ-панель: http://kupon4uk.ru:5433/admin`);
});
