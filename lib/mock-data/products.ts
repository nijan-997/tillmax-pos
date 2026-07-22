export type Product = {
  id: string;
  barcode?: string;
  name: string;
  price: number;      // pence / GBP amount
  categoryId: string;
  weighed?: boolean;        // true → captured by weight, not count
  ageRestricted?: boolean;  // true → triggers Challenge 25 check on add
  vatRate: number;          // e.g. 0.20 for 20% VAT, 0 for zero-rated
};

export const PRODUCTS: Product[] = [
  // Bread & Bakery
  { id: 'p-001', barcode: '5000169004003', name: 'Warburtons White Sliced', price: 1.49, categoryId: 'cat-1-1', vatRate: 0 },
  { id: 'p-002', barcode: '5000169006007', name: 'Hovis Granary Bloomer', price: 1.89, categoryId: 'cat-1-1', vatRate: 0 },
  { id: 'p-003', barcode: '5060080820014', name: 'Croissants 4pk', price: 1.20, categoryId: 'cat-1-1', vatRate: 0 },

  // Dairy & Eggs
  { id: 'p-004', barcode: '5000077040702', name: 'Semi-Skimmed Milk 2L', price: 1.39, categoryId: 'cat-1-2', vatRate: 0 },
  { id: 'p-005', barcode: '5000077041006', name: 'Cheddar Cheese 400g', price: 3.50, categoryId: 'cat-1-2', vatRate: 0 },
  { id: 'p-006', barcode: '5000077042003', name: 'Free Range Eggs 6pk', price: 2.25, categoryId: 'cat-1-2', vatRate: 0 },
  { id: 'p-007', barcode: '5000077043000', name: 'Butter 250g', price: 1.79, categoryId: 'cat-1-2', vatRate: 0 },

  // Fresh Produce — Fruit (weighed items)
  { id: 'p-008', barcode: '0000000000001', name: 'Bananas', price: 1.09, categoryId: 'cat-2-1', weighed: true, vatRate: 0 },
  { id: 'p-009', barcode: '0000000000002', name: 'Granny Smith Apples', price: 2.49, categoryId: 'cat-2-1', weighed: true, vatRate: 0 },
  { id: 'p-010', barcode: '0000000000003', name: 'Loose Tomatoes', price: 1.79, categoryId: 'cat-2-2', weighed: true, vatRate: 0 },
  { id: 'p-011', barcode: '0000000000004', name: 'Carrots Loose', price: 0.89, categoryId: 'cat-2-2', weighed: true, vatRate: 0 },

  // Soft Drinks
  { id: 'p-012', barcode: '5449000000996', name: 'Coca-Cola 330ml', price: 1.25, categoryId: 'cat-3-1', vatRate: 0.20 },
  { id: 'p-013', barcode: '5449000133328', name: 'Coca-Cola 1.75L', price: 2.49, categoryId: 'cat-3-1', vatRate: 0.20 },
  { id: 'p-014', barcode: '5449000054227', name: 'Fanta Orange 330ml', price: 1.20, categoryId: 'cat-3-1', vatRate: 0.20 },
  { id: 'p-015', barcode: '5000347012145', name: 'Lucozade Energy 500ml', price: 1.65, categoryId: 'cat-3-1', vatRate: 0.20 },

  // Alcohol — age restricted
  { id: 'p-016', barcode: '5010093001162', name: 'Stella Artois 4pk', price: 4.99, categoryId: 'cat-4-1', ageRestricted: true, vatRate: 0.20 },
  { id: 'p-017', barcode: '5000213001204', name: 'Corona Extra 6pk', price: 7.50, categoryId: 'cat-4-1', ageRestricted: true, vatRate: 0.20 },
  { id: 'p-018', barcode: '5010213651070', name: 'Strongbow Cider 4pk', price: 4.50, categoryId: 'cat-4-1', ageRestricted: true, vatRate: 0.20 },
  { id: 'p-019', barcode: '3155240010137', name: 'Blossom Hill Rosé 75cl', price: 6.99, categoryId: 'cat-4-2', ageRestricted: true, vatRate: 0.20 },
  { id: 'p-020', barcode: '5010103601157', name: 'Jack Daniel\'s 70cl', price: 22.00, categoryId: 'cat-4-3', ageRestricted: true, vatRate: 0.20 },

  // Snacks — Mix & Match eligible
  { id: 'p-021', barcode: '5000328105520', name: 'Walkers Crisps Ready Salted', price: 1.00, categoryId: 'cat-5-1', vatRate: 0.20 },
  { id: 'p-022', barcode: '5000328108422', name: 'Walkers Crisps Cheese & Onion', price: 1.00, categoryId: 'cat-5-1', vatRate: 0.20 },
  { id: 'p-023', barcode: '5000328108439', name: 'Walkers Crisps Salt & Vinegar', price: 1.00, categoryId: 'cat-5-1', vatRate: 0.20 },
  { id: 'p-024', barcode: '7622210100337', name: 'Cadbury Dairy Milk 95g', price: 1.50, categoryId: 'cat-5-2', vatRate: 0.20 },
  { id: 'p-025', barcode: '7622210101679', name: 'Cadbury Roses 400g', price: 5.00, categoryId: 'cat-5-2', vatRate: 0.20 },

  // Frozen
  { id: 'p-026', barcode: '5051794138054', name: 'Birds Eye Fish Fingers 10pk', price: 2.49, categoryId: 'cat-6-1', vatRate: 0 },
  { id: 'p-027', barcode: '5051794001701', name: 'Walls Classic Vanilla 2L', price: 3.99, categoryId: 'cat-6-2', vatRate: 0.20 },

  // Household
  { id: 'p-028', barcode: '8001480011367', name: 'Ariel Washing Pods 30pk', price: 9.00, categoryId: 'cat-7', vatRate: 0.20 },
  { id: 'p-029', barcode: '8711600563734', name: 'Domestos Bleach 750ml', price: 1.50, categoryId: 'cat-7', vatRate: 0.20 },

  // Tobacco — age restricted
  { id: 'p-030', barcode: '5000679000001', name: 'Marlboro Red 20pk', price: 12.50, categoryId: 'cat-8', ageRestricted: true, vatRate: 0.20 },
];

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.barcode?.includes(q)
  );
}

export function getProductByBarcode(barcode: string): Product | undefined {
  return PRODUCTS.find((p) => p.barcode === barcode);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}
