import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = process.argv[2];
const source = readFileSync(sourcePath, 'utf8');
const current = JSON.parse(readFileSync('promo-data.json', 'utf8'));
const knownValid = new Set(['Wildberries|328TZT6D', 'Ростикс|DEL03NKK2', 'Ростикс|GB01FA5I', 'Ростикс|DEL012ZD5']);
const categoryMap = {
  'Электроника': 'electronics', 'Продукты': 'groceries', 'Доставка еды': 'food_delivery',
  'Каршеринг': 'carsharing', 'Авто': 'auto', 'Подписки': 'subscriptions', 'Одежда': 'fashion',
  'Путешествия': 'travel', 'Красота': 'beauty', 'Офис': 'office', 'Дом и ремонт': 'home',
  'Зоотовары': 'pets', 'Здоровье': 'health', 'Рестораны': 'restaurants', 'Ювелирные товары': 'jewelry',
  'Обувь': 'fashion', 'Маркетплейс': 'marketplaces', 'Книги': 'books', 'Игры': 'games',
  'Развлечения': 'entertainment', 'Образование': 'education', 'ПО': 'software'
};

const officialUrl = (value) => {
  const match = value.match(/https?:\/\/[^)\s|]+/);
  return match ? match[0].replace(/[.,]$/, '') : '';
};
const clean = (value) => value.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/`/g, '').trim();
const add = [];
const seen = new Set();
const addRecord = (category, store, site, code, benefit, sourceInfo) => {
  code = clean(code).trim().toUpperCase();
  if (!code || code === '—' || code === '-') return;
  const sourceUrl = officialUrl(sourceInfo) || officialUrl(site);
  if (!sourceUrl) return;
  const fingerprint = [store, code, sourceUrl, ''].join('|').toLowerCase();
  if (seen.has(fingerprint)) return;
  seen.add(fingerprint);
  const valid = knownValid.has(`${store}|${code}`);
  const old = current.promos.find((promo) => promo.fingerprint === fingerprint || (promo.store === store && promo.code === code));
  const storeUrl = officialUrl(site) || sourceUrl;
  add.push({
    ...(old || {}), id: old?.id || `promo-${add.length + 1}`,
    store, code, title: old?.title || `Промокод ${store}`,
    description: clean(benefit) || `Промокод для магазина ${store}.`,
    conditions: clean(benefit), sourceUrl, sourceType: /официальн|official/i.test(sourceInfo) ? 'official_site' : 'aggregator',
    discoveryMethod: /кнопка|раскрыт/i.test(sourceInfo) ? 'revealed' : 'research',
    category: categoryMap[clean(category)] || 'other', validFrom: old?.validFrom || null, validUntil: old?.validUntil || null,
    status: valid ? 'approved' : 'pending', verificationStatus: valid ? 'valid' : 'unverified',
    usedCount: old?.usedCount || 0, createdAt: old?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
    iconUrl: old?.iconUrl || `${storeUrl.replace(/\/$/, '')}/favicon.ico`, iconFormat: old?.iconFormat || 'ico',
    iconSourceUrl: old?.iconSourceUrl || storeUrl, iconStatus: old?.iconStatus || 'unverified', fingerprint
  });
};

for (const line of source.split('\n')) {
  if (!line.startsWith('|') || line.includes('---') || line.includes('Категория |')) continue;
  const cells = line.split('|').slice(1, -1).map((value, index) => [2, 3, 5].includes(index) ? value.trim() : clean(value));
  if (cells.length >= 6 && cells[0] && cells[1] && cells[3]) {
    const codes = cells[3].match(/`[^`]+`/g) || [];
    for (const code of codes) addRecord(cells[0], cells[1], cells[2], code, cells[4], cells[5]);
  }
  if (cells.length >= 6 && cells[0] && cells[1] && cells[2] && cells[3]) {
    addRecord(cells[0], cells[1], cells[2], cells[3], cells[4], cells[5]);
  }
}

const output = { promos: add, updatedAt: new Date().toISOString() };
writeFileSync('promo-data.json', JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ imported: add.length, valid: add.filter((p) => p.verificationStatus === 'valid').length, pending: add.filter((p) => p.status === 'pending').length }, null, 2));
