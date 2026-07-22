export type Category = {
  id: string;
  name: string;
  parentId?: string;
  icon?: string; // emoji icon for quick visual
  colour?: string; // tile accent colour
};

export const CATEGORIES: Category[] = [
  // Top-level departments
  { id: 'cat-1', name: 'Groceries', icon: '🛒', colour: '#2E7D32' },
  { id: 'cat-2', name: 'Fresh Produce', icon: '🥦', colour: '#388E3C' },
  { id: 'cat-3', name: 'Drinks', icon: '🥤', colour: '#1565C0' },
  { id: 'cat-4', name: 'Alcohol', icon: '🍷', colour: '#6A1B9A' },
  { id: 'cat-5', name: 'Snacks & Confectionery', icon: '🍫', colour: '#E65100' },
  { id: 'cat-6', name: 'Frozen', icon: '🧊', colour: '#0277BD' },
  { id: 'cat-7', name: 'Household', icon: '🧹', colour: '#455A64' },
  { id: 'cat-8', name: 'Tobacco', icon: '🚬', colour: '#4E342E' },

  // Groceries subcategories
  { id: 'cat-1-1', name: 'Bread & Bakery', parentId: 'cat-1', icon: '🍞' },
  { id: 'cat-1-2', name: 'Dairy & Eggs', parentId: 'cat-1', icon: '🥛' },
  { id: 'cat-1-3', name: 'Canned Goods', parentId: 'cat-1', icon: '🥫' },
  { id: 'cat-1-4', name: 'Pasta & Rice', parentId: 'cat-1', icon: '🍝' },

  // Fresh Produce subcategories
  { id: 'cat-2-1', name: 'Fruit', parentId: 'cat-2', icon: '🍎' },
  { id: 'cat-2-2', name: 'Vegetables', parentId: 'cat-2', icon: '🥕' },
  { id: 'cat-2-3', name: 'Salad & Herbs', parentId: 'cat-2', icon: '🥗' },

  // Drinks subcategories
  { id: 'cat-3-1', name: 'Soft Drinks', parentId: 'cat-3', icon: '🥤' },
  { id: 'cat-3-2', name: 'Water & Juices', parentId: 'cat-3', icon: '💧' },
  { id: 'cat-3-3', name: 'Hot Drinks', parentId: 'cat-3', icon: '☕' },

  // Alcohol subcategories
  { id: 'cat-4-1', name: 'Beer & Cider', parentId: 'cat-4', icon: '🍺' },
  { id: 'cat-4-2', name: 'Wine', parentId: 'cat-4', icon: '🍷' },
  { id: 'cat-4-3', name: 'Spirits', parentId: 'cat-4', icon: '🥃' },

  // Snacks subcategories
  { id: 'cat-5-1', name: 'Crisps', parentId: 'cat-5', icon: '🥔' },
  { id: 'cat-5-2', name: 'Chocolate & Sweets', parentId: 'cat-5', icon: '🍬' },

  // Frozen subcategories
  { id: 'cat-6-1', name: 'Ready Meals', parentId: 'cat-6', icon: '🍱' },
  { id: 'cat-6-2', name: 'Ice Cream', parentId: 'cat-6', icon: '🍦' },
];

export function getTopLevelCategories() {
  return CATEGORIES.filter((c) => !c.parentId);
}

export function getSubcategories(parentId: string) {
  return CATEGORIES.filter((c) => c.parentId === parentId);
}
