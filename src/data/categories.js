// Категории используют имена бесплатных Lucide-иконок.
export const categories = [
  { id: 'all', name: 'Все магазины', icon: 'grid', count: 21 },
  { id: 'electronics', name: 'Электроника', icon: 'smartphone', count: 5 },
  { id: 'fashion', name: 'Одежда и обувь', icon: 'shirt', count: 4 },
  { id: 'beauty', name: 'Красота', icon: 'sparkles', count: 2 },
  { id: 'groceries', name: 'Продукты', icon: 'shopping-basket', count: 3 },
  { id: 'home', name: 'Дом и ремонт', icon: 'home', count: 7 },
  { id: 'transport', name: 'Транспорт', icon: 'car', count: 1 },
  { id: 'sport', name: 'Спорт', icon: 'dumbbell', count: 1 }
];

const categoryIcons = {
  grid: 'Grid2X2', smartphone: 'Smartphone', shirt: 'Shirt', sparkles: 'Sparkles',
  'shopping-basket': 'ShoppingBasket', home: 'House', car: 'Car', dumbbell: 'Dumbbell'
};

export { categoryIcons };
