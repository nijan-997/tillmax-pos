export type ProductVariant = {
  id: string;
  name: string;
  price?: number;        // override parent price if different
  barcode?: string;
  note?: string;         // e.g. "Imported", "Organic"
};

export type Product = {
  id: string;
  barcode?: string;
  name: string;
  price: number;
  categoryId: string;
  weighed?: boolean;
  ageRestricted?: boolean;
  vatRate: number;
  variants?: ProductVariant[];   // if present, tapping shows variant picker first
};

export const PRODUCTS: Product[] = [
  // ── Bread & Bakery ─────────────────────────────────────────────
  { id: 'p-001', barcode: '5000169004003', name: 'Warburtons White Sliced', price: 1.49, categoryId: 'cat-1-1', vatRate: 0 },
  { id: 'p-002', barcode: '5000169006007', name: 'Hovis Granary Bloomer', price: 1.89, categoryId: 'cat-1-1', vatRate: 0 },
  { id: 'p-003', barcode: '5060080820014', name: 'Croissants 4pk', price: 1.20, categoryId: 'cat-1-1', vatRate: 0 },
  {
    id: 'p-031', name: 'Brown Bread', price: 1.30, categoryId: 'cat-1-1', vatRate: 0,
    variants: [
      { id: 'p-031-a', name: 'Kingsmill Wholemeal 800g', price: 1.30 },
      { id: 'p-031-b', name: 'Hovis Seed Sensations 800g', price: 1.60 },
      { id: 'p-031-c', name: 'Nimble Wholemeal 400g', price: 1.10 },
    ],
  },

  // ── Dairy & Eggs ───────────────────────────────────────────────
  {
    id: 'p-004', name: 'Milk', price: 1.39, categoryId: 'cat-1-2', vatRate: 0,
    variants: [
      { id: 'p-004-a', barcode: '5000077040702', name: 'Semi-Skimmed 2L', price: 1.39 },
      { id: 'p-004-b', barcode: '5000077040800', name: 'Whole Milk 2L', price: 1.45 },
      { id: 'p-004-c', barcode: '5000077040900', name: 'Skimmed Milk 2L', price: 1.35 },
      { id: 'p-004-d', barcode: '5000077041100', name: 'Oat Milk 1L', price: 1.80, note: 'Plant-based' },
      { id: 'p-004-e', barcode: '5000077041200', name: 'Almond Milk 1L', price: 1.75, note: 'Plant-based' },
    ],
  },
  {
    id: 'p-005', name: 'Cheese', price: 3.50, categoryId: 'cat-1-2', vatRate: 0,
    variants: [
      { id: 'p-005-a', barcode: '5000077041006', name: 'Cheddar 400g', price: 3.50 },
      { id: 'p-005-b', barcode: '5000077041106', name: 'Red Leicester 400g', price: 3.40 },
      { id: 'p-005-c', barcode: '5000077041206', name: 'Mozzarella Ball 125g', price: 1.20 },
      { id: 'p-005-d', barcode: '5000077041306', name: 'Brie Wedge 200g', price: 2.50 },
    ],
  },
  { id: 'p-006', barcode: '5000077042003', name: 'Free Range Eggs 6pk', price: 2.25, categoryId: 'cat-1-2', vatRate: 0 },
  { id: 'p-007', barcode: '5000077043000', name: 'Butter 250g', price: 1.79, categoryId: 'cat-1-2', vatRate: 0 },

  // ── Fresh Produce — Fruit ──────────────────────────────────────
  { id: 'p-008', barcode: '0000000000001', name: 'Bananas', price: 1.09, categoryId: 'cat-2-1', weighed: true, vatRate: 0 },
  {
    id: 'p-009', name: 'Apples', price: 2.49, categoryId: 'cat-2-1', weighed: true, vatRate: 0,
    variants: [
      { id: 'p-009-a', name: 'Granny Smith (Green)', price: 2.49, note: 'Tart & crisp' },
      { id: 'p-009-b', name: 'Royal Gala (Red)', price: 2.29, note: 'Sweet & mild' },
      { id: 'p-009-c', name: 'Pink Lady', price: 2.79, note: 'Crisp & sweet' },
      { id: 'p-009-d', name: 'Braeburn', price: 2.20, note: 'Firm & aromatic' },
      { id: 'p-009-e', name: 'Australian Fuji', price: 2.99, note: 'Imported · Premium' },
    ],
  },
  {
    id: 'p-032', name: 'Grapes', price: 1.99, categoryId: 'cat-2-1', weighed: true, vatRate: 0,
    variants: [
      { id: 'p-032-a', name: 'Red Seedless Grapes', price: 1.99 },
      { id: 'p-032-b', name: 'White Seedless Grapes', price: 1.89 },
      { id: 'p-032-c', name: 'Black Muscat Grapes', price: 2.49, note: 'Seasonal' },
    ],
  },

  // ── Fresh Produce — Vegetables ─────────────────────────────────
  { id: 'p-010', barcode: '0000000000003', name: 'Loose Tomatoes', price: 1.79, categoryId: 'cat-2-2', weighed: true, vatRate: 0 },
  { id: 'p-011', barcode: '0000000000004', name: 'Carrots Loose', price: 0.89, categoryId: 'cat-2-2', weighed: true, vatRate: 0 },
  {
    id: 'p-033', name: 'Potatoes', price: 0.75, categoryId: 'cat-2-2', weighed: true, vatRate: 0,
    variants: [
      { id: 'p-033-a', name: 'Maris Piper (Loose)', price: 0.75, note: 'Great for chips' },
      { id: 'p-033-b', name: 'King Edward (Loose)', price: 0.80, note: 'Fluffy bakers' },
      { id: 'p-033-c', name: 'Charlotte New Potatoes', price: 1.20, note: 'Waxy & firm' },
      { id: 'p-033-d', name: 'Sweet Potato (Loose)', price: 0.90 },
    ],
  },

  // ── Soft Drinks ────────────────────────────────────────────────
  {
    id: 'p-012', name: 'Coca-Cola', price: 1.25, categoryId: 'cat-3-1', vatRate: 0.20,
    variants: [
      { id: 'p-012-a', barcode: '5449000000996', name: 'Coca-Cola 330ml Can', price: 1.25 },
      { id: 'p-012-b', barcode: '5449000133328', name: 'Coca-Cola 1.75L Bottle', price: 2.49 },
      { id: 'p-012-c', barcode: '5449000200006', name: 'Diet Coke 330ml Can', price: 1.20 },
      { id: 'p-012-d', barcode: '5449000200007', name: 'Coke Zero 330ml Can', price: 1.20 },
      { id: 'p-012-e', barcode: '5449000200008', name: 'Coca-Cola Zero Sugar 1.75L', price: 2.35 },
    ],
  },
  { id: 'p-014', barcode: '5449000054227', name: 'Fanta Orange 330ml', price: 1.20, categoryId: 'cat-3-1', vatRate: 0.20 },
  { id: 'p-015', barcode: '5000347012145', name: 'Lucozade Energy 500ml', price: 1.65, categoryId: 'cat-3-1', vatRate: 0.20 },
  {
    id: 'p-034', name: 'Monster Energy', price: 1.99, categoryId: 'cat-3-1', vatRate: 0.20,
    variants: [
      { id: 'p-034-a', name: 'Monster Original 500ml', price: 1.99 },
      { id: 'p-034-b', name: 'Monster Ultra White 500ml', price: 1.99 },
      { id: 'p-034-c', name: 'Monster Mango Loco 500ml', price: 1.99 },
      { id: 'p-034-d', name: 'Monster Pipeline Punch 500ml', price: 1.99 },
    ],
  },

  // ── Water & Juices ─────────────────────────────────────────────
  {
    id: 'p-035', name: 'Water', price: 0.65, categoryId: 'cat-3-2', vatRate: 0,
    variants: [
      { id: 'p-035-a', name: 'Buxton Still 500ml', price: 0.65 },
      { id: 'p-035-b', name: 'Buxton Still 1.5L', price: 1.10 },
      { id: 'p-035-c', name: 'Perrier Sparkling 330ml', price: 0.99 },
      { id: 'p-035-d', name: 'San Pellegrino 500ml', price: 1.20 },
    ],
  },

  // ── Alcohol — age restricted ───────────────────────────────────
  { id: 'p-016', barcode: '5010093001162', name: 'Stella Artois 4pk', price: 4.99, categoryId: 'cat-4-1', ageRestricted: true, vatRate: 0.20 },
  { id: 'p-017', barcode: '5000213001204', name: 'Corona Extra 6pk', price: 7.50, categoryId: 'cat-4-1', ageRestricted: true, vatRate: 0.20 },
  { id: 'p-018', barcode: '5010213651070', name: 'Strongbow Cider 4pk', price: 4.50, categoryId: 'cat-4-1', ageRestricted: true, vatRate: 0.20 },
  {
    id: 'p-019', name: 'Wine', price: 6.99, categoryId: 'cat-4-2', ageRestricted: true, vatRate: 0.20,
    variants: [
      { id: 'p-019-a', barcode: '3155240010137', name: 'Blossom Hill Rosé 75cl', price: 6.99 },
      { id: 'p-019-b', barcode: '3155240010200', name: 'Blossom Hill White 75cl', price: 6.49 },
      { id: 'p-019-c', barcode: '3155240010300', name: 'Barefoot Merlot 75cl', price: 7.50 },
      { id: 'p-019-d', barcode: '3155240010400', name: 'Yellow Tail Shiraz 75cl', price: 7.99 },
    ],
  },
  { id: 'p-020', barcode: '5010103601157', name: "Jack Daniel's 70cl", price: 22.00, categoryId: 'cat-4-3', ageRestricted: true, vatRate: 0.20 },

  // ── Snacks ─────────────────────────────────────────────────────
  { id: 'p-021', barcode: '5000328105520', name: 'Walkers Ready Salted', price: 1.00, categoryId: 'cat-5-1', vatRate: 0.20 },
  { id: 'p-022', barcode: '5000328108422', name: 'Walkers Cheese & Onion', price: 1.00, categoryId: 'cat-5-1', vatRate: 0.20 },
  { id: 'p-023', barcode: '5000328108439', name: 'Walkers Salt & Vinegar', price: 1.00, categoryId: 'cat-5-1', vatRate: 0.20 },
  {
    id: 'p-024', name: 'Cadbury Dairy Milk', price: 1.50, categoryId: 'cat-5-2', vatRate: 0.20,
    variants: [
      { id: 'p-024-a', barcode: '7622210100337', name: 'Dairy Milk 95g', price: 1.50 },
      { id: 'p-024-b', barcode: '7622210101680', name: 'Dairy Milk Caramel 120g', price: 1.80 },
      { id: 'p-024-c', barcode: '7622210101691', name: 'Dairy Milk Oreo 120g', price: 1.80 },
      { id: 'p-024-d', barcode: '7622210101702', name: 'Dairy Milk Fruit & Nut 95g', price: 1.55 },
    ],
  },
  { id: 'p-025', barcode: '7622210101679', name: 'Cadbury Roses 400g', price: 5.00, categoryId: 'cat-5-2', vatRate: 0.20 },

  // ── Frozen ─────────────────────────────────────────────────────
  { id: 'p-026', barcode: '5051794138054', name: 'Birds Eye Fish Fingers 10pk', price: 2.49, categoryId: 'cat-6-1', vatRate: 0 },
  {
    id: 'p-027', name: 'Ice Cream', price: 3.99, categoryId: 'cat-6-2', vatRate: 0.20,
    variants: [
      { id: 'p-027-a', barcode: '5051794001701', name: 'Walls Classic Vanilla 2L', price: 3.99 },
      { id: 'p-027-b', barcode: '5051794001702', name: 'Walls Chocolate 2L', price: 3.99 },
      { id: 'p-027-c', barcode: '5051794001703', name: 'Ben & Jerry\'s Cookie Dough 500ml', price: 5.50 },
      { id: 'p-027-d', barcode: '5051794001704', name: 'Häagen-Dazs Strawberry 460ml', price: 6.00 },
    ],
  },

  // ── Household ──────────────────────────────────────────────────
  { id: 'p-028', barcode: '8001480011367', name: 'Ariel Washing Pods 30pk', price: 9.00, categoryId: 'cat-7', vatRate: 0.20 },
  { id: 'p-029', barcode: '8711600563734', name: 'Domestos Bleach 750ml', price: 1.50, categoryId: 'cat-7', vatRate: 0.20 },

  // ── Tobacco — age restricted ───────────────────────────────────
  {
    id: 'p-030', name: 'Cigarettes', price: 12.50, categoryId: 'cat-8', ageRestricted: true, vatRate: 0.20,
    variants: [
      { id: 'p-030-a', barcode: '5000679000001', name: 'Marlboro Red 20pk', price: 12.50 },
      { id: 'p-030-b', barcode: '5000679000002', name: 'Marlboro Gold 20pk', price: 12.50 },
      { id: 'p-030-c', barcode: '5000679000003', name: 'Benson & Hedges 20pk', price: 13.00 },
      { id: 'p-030-d', barcode: '5000679000004', name: 'Richmond Superkings 20pk', price: 11.50 },
    ],
  },
];

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.barcode?.includes(q) ||
      p.variants?.some(
        (v) => v.name.toLowerCase().includes(q) || v.barcode?.includes(q)
      )
  );
}

export function getProductByBarcode(barcode: string): Product | undefined {
  return PRODUCTS.find(
    (p) => p.barcode === barcode || p.variants?.some((v) => v.barcode === barcode)
  );
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}
