// Реалистичные категории
export const categories = [
  { id: 'all', name: 'Все', icon: '🏪', count: 1247 },
  { id: 'products', name: 'Продукты', icon: '🥑', count: 189 },
  { id: 'electronics', name: 'Электроника', icon: '📱', count: 342 },
  { id: 'fashion', name: 'Одежда', icon: '👕', count: 289 },
  { id: 'beauty', name: 'Красота', icon: '💄', count: 178 },
  { id: 'home', name: 'Дом', icon: '🏠', count: 156 },
  { id: 'auto', name: 'Авто', icon: '🚗', count: 89 },
  { id: 'travel', name: 'Путешествия', icon: '✈️', count: 67 },
  { id: 'sport', name: 'Спорт', icon: '⚽', count: 54 },
  { id: 'books', name: 'Книги', icon: '📚', count: 43 },
  { id: 'pets', name: 'Зоотовары', icon: '🐾', count: 29 }
];

const categoryIcons = {};
categories.forEach(cat => { categoryIcons[cat.icon] = cat.icon; });

export { categoryIcons };
