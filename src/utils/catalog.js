export function slugifyStore(value = '') {
  return String(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-|-$/g, '');
}

export function storePath(storeName) {
  return `/stores/${encodeURIComponent(slugifyStore(storeName))}`;
}

export function matchesStoreSlug(storeName, routeSlug = '') {
  const decodedSlug = decodeURIComponent(String(routeSlug)).toLowerCase().replace(/ё/g, 'е');
  return slugifyStore(storeName) === decodedSlug;
}

export function formatPromoWord(count) {
  const value = Number(count) || 0;
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return 'промокод';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'промокода';
  return 'промокодов';
}
