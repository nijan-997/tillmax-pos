export type PromotionRule = {
  id: string;
  type: 'mix-and-match' | 'discount-offer';
  description: string;
  productIds: string[];
  qualifyingQty?: number;   // how many items needed to qualify
  forPrice?: number;         // the price the qualifying qty costs (e.g. 3 for £2.50)
  discountPercent?: number;  // for discount-offer type
};

export const PROMOTIONS: PromotionRule[] = [
  {
    // 3 Walkers crisps for £2.50 (individual price £1.00 each = £3.00 without promo)
    id: 'promo-1',
    type: 'mix-and-match',
    description: 'Any 3 Walkers Crisps for £2.50',
    productIds: ['p-021', 'p-022', 'p-023'],
    qualifyingQty: 3,
    forPrice: 2.50,
  },
  {
    // Buy 2 Cadbury Dairy Milk, get 10% off
    id: 'promo-2',
    type: 'mix-and-match',
    description: '2 Cadbury Dairy Milk — 10% off',
    productIds: ['p-024'],
    qualifyingQty: 2,
    discountPercent: 10,
  },
  {
    // Buy any 4 beers/ciders — save £1
    id: 'promo-3',
    type: 'mix-and-match',
    description: 'Any 4 Beers or Ciders — Save £1.00',
    productIds: ['p-016', 'p-017', 'p-018'],
    qualifyingQty: 4,
    forPrice: undefined,
    discountPercent: undefined,
    // special: save a flat £1 — evaluated in basket-context
  },
];

// Configurable pay-in / pay-out reasons (admin can add/remove via Store Config)
export const PAY_IN_REASONS = [
  'Change',
  'Lottery Payout',
  'Petty Cash Replenishment',
  'Other',
];

export const PAY_OUT_REASONS = [
  'Lottery Win',
  'Petty Cash',
  'Supplier Payment',
  'Safe Drop',
  'Other',
];

export const NO_SALE_REASONS = [
  'Get Change',
  'Check Drawer',
  'Manager Request',
  'Other',
];
