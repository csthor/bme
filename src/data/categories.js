// Категории используют имена бесплатных Lucide-иконок.
export const categories = [
  { id: 'all', name: 'Все магазины', icon: 'grid', count: 16 },
  { id: 'electronics', name: 'Электроника', icon: 'smartphone', count: 5 },
  { id: 'fashion', name: 'Одежда и обувь', icon: 'shirt', count: 3 },
  { id: 'beauty', name: 'Красота', icon: 'sparkles', count: 1 },
  { id: 'groceries', name: 'Продукты', icon: 'shopping-basket', count: 3 },
  { id: 'home', name: 'Дом и ремонт', icon: 'home', count: 3 },
  { id: 'transport', name: 'Транспорт', icon: 'car', count: 1 }
];

const categoryIcons = {
  grid: 'Grid2X2', smartphone: 'Smartphone', shirt: 'Shirt', sparkles: 'Sparkles',
  'shopping-basket': 'ShoppingBasket', home: 'House', car: 'Car'
};

export { categoryIcons };
