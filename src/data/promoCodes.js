// Промокоды из внутреннего каталога. Перед публикацией в продакшене
// их нужно подтверждать через официальный источник магазина.
export const promoCodes = [
  {
    id: 1,
    store: 'Ozon',
    storeLogo: 'https://www.ozon.ru/favicon.ico',
    code: 'OZON2026X',
    discount: 15,
    description: 'Скидка 15% на первый заказ от 3000₽',
    worksToday: true,
    usedCount: 2847,
    expiresAt: '2026-12-31',
    type: 'promo'
  },
  {
    id: 2,
    store: 'DNS',
    storeLogo: 'https://www.dns-shop.ru/favicon.ico',
    code: 'DNS-TECH-20',
    discount: 20,
    description: 'Скидка 20% на компьютерные комплектующие',
    worksToday: true,
    usedCount: 1563,
    expiresAt: '2026-09-15',
    type: 'promo'
  },
  {
    id: 3,
    store: 'Ламод',
    storeLogo: 'https://www.lamoda.ru/favicon.ico',
    code: 'LAMODA-NEW',
    discount: 25,
    description: 'Скидка 25% на весеннюю коллекцию',
    worksToday: true,
    usedCount: 3192,
    expiresAt: '2026-10-01',
    type: 'promo'
  },
  {
    id: 4,
    store: 'М.Видео',
    storeLogo: 'https://www.mvideo.ru/favicon.ico',
    code: 'MV-TRAVEL',
    discount: 10,
    description: 'Скидка 10% на смартфоны и аксессуары',
    worksToday: true,
    usedCount: 987,
    expiresAt: '2026-11-30',
    type: 'promo'
  },
  {
    id: 5,
    store: 'Золотое Яблоко',
    storeLogo: 'https://goldapple.ru/favicon.ico',
    code: 'ZLATO-GLOW',
    discount: 30,
    description: 'Скидка 30% на бренды косметики',
    worksToday: true,
    usedCount: 4201,
    expiresAt: '2026-09-30',
    type: 'promo'
  },
  {
    id: 6,
    store: 'Ситимобил',
    storeLogo: 'https://city-mobil.ru/favicon.ico',
    code: 'CITY-FRIDE',
    discount: 40,
    description: 'Скидка 40% на первые 5 поездок',
    worksToday: true,
    usedCount: 1876,
    expiresAt: '2026-12-31',
    type: 'promo'
  },
  {
    id: 7,
    store: 'Wildberries',
    storeLogo: 'https://www.wildberries.ru/favicon.ico',
    code: 'WB-PREMIUM',
    discount: 12,
    description: 'Скидка 12% на одежду больших размеров',
    worksToday: true,
    usedCount: 2134,
    expiresAt: '2026-10-15',
    type: 'promo'
  },
  {
    id: 8,
    store: 'Яндекс Маркет',
    storeLogo: 'https://market.yandex.ru/favicon.ico',
    code: 'YAM-PRIME',
    discount: 35,
    description: 'Скидка 35% на подписку Яндекс Плюс',
    worksToday: true,
    usedCount: 5678,
    expiresAt: '2026-08-31',
    type: 'promo'
  }
];

export const hotDeals = [
  {
    id: 1,
    store: 'Ozon',
    title: 'Скидки до 70%',
    description: 'На всю электронику и гаджеты',
    discount: 70,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    link: 'https://www.ozon.ru/'
  },
  {
    id: 2,
    store: 'Ламод',
    title: 'Распродажа обуви',
    description: 'Брендовая обувь со скидкой до 50%',
    discount: 50,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    link: 'https://www.lamoda.ru/'
  },
  {
    id: 3,
    store: 'DNS',
    title: 'Техника для дома',
    description: 'Кухонная техника со скидкой до 30%',
    discount: 30,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    link: 'https://www.dns-shop.ru/'
  },
  {
    id: 4,
    store: 'Золотое Яблоко',
    title: 'День красоты',
    description: 'Двойные бонусы на всю косметику',
    discount: 45,
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    link: 'https://goldapple.ru/'
  },
  {
    id: 5,
    store: 'СберМаркет',
    title: 'Бесплатная доставка',
    description: 'На первый заказ от 500₽',
    discount: 100,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    link: 'https://kuper.ru/'
  },
  {
    id: 6,
    store: 'М.Видео',
    title: 'Смартфоны в кредит',
    description: '0% на 24 месяца на iPhone и Samsung',
    discount: 0,
    color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    link: 'https://www.mvideo.ru/'
  }
];

export const expiringToday = [
  {
    id: 1,
    store: 'Ozon',
    storeLogo: 'https://www.ozon.ru/favicon.ico',
    code: 'OZON-NIGHT',
    description: 'Ночная распродажа: -30% на всё',
    expiresAt: '23:59',
    timeLeft: '4ч 12мин',
    usedCount: 5621
  },
  {
    id: 2,
    store: 'Wildberries',
    storeLogo: 'https://www.wildberries.ru/favicon.ico',
    code: 'WB-LATE',
    description: 'Бесплатная доставка без минимума',
    expiresAt: '23:59',
    timeLeft: '4ч 12мин',
    usedCount: 3409
  },
  {
    id: 3,
    store: 'Ситимобил',
    storeLogo: 'https://city-mobil.ru/favicon.ico',
    code: 'CITY-NIGHT',
    description: 'Скидка 50% на вечерние поездки',
    expiresAt: '23:00',
    timeLeft: '3ч 12мин',
    usedCount: 1247
  }
];
