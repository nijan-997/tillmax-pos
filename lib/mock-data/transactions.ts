export type BasketLine = {
  id: string;
  productId: string;
  qty?: number;
  weight?: number;           // kg, for weighed items
  unitPrice: number;
  lineDiscount?: { type: 'percent' | 'amount'; value: number };
  ageVerified?: boolean;
  isPromotionLine?: boolean; // auto-applied Mix & Match discount line
  promotionId?: string;
};

export type PaymentMethod = 'cash' | 'card' | 'mixed' | 'loyalty';

export type PastTransaction = {
  id: string;
  timestamp: string;         // ISO 8601
  cashier: string;           // staff name
  cashierId: string;
  paymentMethod: PaymentMethod;
  total: number;
  lines: BasketLine[];
  type: 'sale' | 'refund' | 'void';
  receiptNumber: string;
};

export const TRANSACTIONS: PastTransaction[] = [
  {
    id: 'tx-001',
    timestamp: '2026-07-22T08:14:32Z',
    cashier: 'Amy Chen',
    cashierId: 'staff-4',
    paymentMethod: 'cash',
    total: 6.13,
    receiptNumber: 'R-2026-001',
    type: 'sale',
    lines: [
      { id: 'l1', productId: 'p-004', qty: 1, unitPrice: 1.39 },
      { id: 'l2', productId: 'p-006', qty: 1, unitPrice: 2.25 },
      { id: 'l3', productId: 'p-001', qty: 2, unitPrice: 1.49 },
    ],
  },
  {
    id: 'tx-002',
    timestamp: '2026-07-22T08:32:10Z',
    cashier: 'Tom Walsh',
    cashierId: 'staff-5',
    paymentMethod: 'card',
    total: 14.49,
    receiptNumber: 'R-2026-002',
    type: 'sale',
    lines: [
      { id: 'l4', productId: 'p-016', qty: 1, unitPrice: 4.99, ageVerified: true },
      { id: 'l5', productId: 'p-019', qty: 1, unitPrice: 6.99, ageVerified: true },
      { id: 'l6', productId: 'p-021', qty: 1, unitPrice: 1.00 },
      { id: 'l7', productId: 'p-022', qty: 1, unitPrice: 1.00 },
      { id: 'l8', productId: 'p-023', qty: 1, unitPrice: 1.00 },
      {
        id: 'l9',
        productId: 'promo-discount',
        qty: 1,
        unitPrice: -0.50,
        isPromotionLine: true,
        promotionId: 'promo-1',
      },
    ],
  },
  {
    id: 'tx-003',
    timestamp: '2026-07-22T09:05:44Z',
    cashier: 'Amy Chen',
    cashierId: 'staff-4',
    paymentMethod: 'mixed',
    total: 28.48,
    receiptNumber: 'R-2026-003',
    type: 'sale',
    lines: [
      { id: 'l10', productId: 'p-020', qty: 1, unitPrice: 22.00, ageVerified: true },
      { id: 'l11', productId: 'p-028', qty: 1, unitPrice: 9.00 },
      { id: 'l12', productId: 'p-004', qty: 1, unitPrice: 1.39 },
    ],
  },
  {
    id: 'tx-004',
    timestamp: '2026-07-22T09:22:18Z',
    cashier: 'Tom Walsh',
    cashierId: 'staff-5',
    paymentMethod: 'cash',
    total: 3.28,
    receiptNumber: 'R-2026-004',
    type: 'sale',
    lines: [
      { id: 'l13', productId: 'p-012', qty: 2, unitPrice: 1.25 },
      { id: 'l14', productId: 'p-024', qty: 1, unitPrice: 1.50, lineDiscount: { type: 'percent', value: 10 } },
    ],
  },
  {
    id: 'tx-005',
    timestamp: '2026-07-22T09:45:00Z',
    cashier: 'Amy Chen',
    cashierId: 'staff-4',
    paymentMethod: 'card',
    total: -4.99,
    receiptNumber: 'R-2026-005',
    type: 'refund',
    lines: [
      { id: 'l15', productId: 'p-016', qty: 1, unitPrice: -4.99, ageVerified: true },
    ],
  },
  {
    id: 'tx-006',
    timestamp: '2026-07-22T10:10:05Z',
    cashier: 'James Patel',
    cashierId: 'staff-3',
    paymentMethod: 'cash',
    total: 7.27,
    receiptNumber: 'R-2026-006',
    type: 'sale',
    lines: [
      { id: 'l16', productId: 'p-002', qty: 1, unitPrice: 1.89 },
      { id: 'l17', productId: 'p-005', qty: 1, unitPrice: 3.50 },
      { id: 'l18', productId: 'p-013', qty: 1, unitPrice: 2.49 },
    ],
  },
  {
    id: 'tx-007',
    timestamp: '2026-07-22T10:33:51Z',
    cashier: 'James Patel',
    cashierId: 'staff-3',
    paymentMethod: 'loyalty',
    total: 5.74,
    receiptNumber: 'R-2026-007',
    type: 'sale',
    lines: [
      { id: 'l19', productId: 'p-008', qty: 1, weight: 0.85, unitPrice: 1.09 },
      { id: 'l20', productId: 'p-010', qty: 1, weight: 0.60, unitPrice: 1.79 },
      { id: 'l21', productId: 'p-007', qty: 2, unitPrice: 1.79 },
    ],
  },
  {
    id: 'tx-008',
    timestamp: '2026-07-22T11:02:17Z',
    cashier: 'Amy Chen',
    cashierId: 'staff-4',
    paymentMethod: 'cash',
    total: 2.50,
    receiptNumber: 'R-2026-008',
    type: 'sale',
    lines: [
      { id: 'l22', productId: 'p-021', qty: 1, unitPrice: 1.00 },
      { id: 'l23', productId: 'p-022', qty: 1, unitPrice: 1.00 },
      { id: 'l24', productId: 'p-023', qty: 1, unitPrice: 1.00 },
      {
        id: 'l25',
        productId: 'promo-discount',
        qty: 1,
        unitPrice: -0.50,
        isPromotionLine: true,
        promotionId: 'promo-1',
      },
    ],
  },
  {
    id: 'tx-009',
    timestamp: '2026-07-22T11:28:44Z',
    cashier: 'Tom Walsh',
    cashierId: 'staff-5',
    paymentMethod: 'card',
    total: 18.25,
    receiptNumber: 'R-2026-009',
    type: 'sale',
    lines: [
      { id: 'l26', productId: 'p-030', qty: 1, unitPrice: 12.50, ageVerified: true },
      { id: 'l27', productId: 'p-015', qty: 2, unitPrice: 1.65 },
      { id: 'l28', productId: 'p-003', qty: 2, unitPrice: 1.20 },
    ],
  },
  {
    id: 'tx-010',
    timestamp: '2026-07-22T11:55:30Z',
    cashier: 'James Patel',
    cashierId: 'staff-3',
    paymentMethod: 'mixed',
    total: 32.48,
    receiptNumber: 'R-2026-010',
    type: 'sale',
    lines: [
      { id: 'l29', productId: 'p-025', qty: 1, unitPrice: 5.00 },
      { id: 'l30', productId: 'p-017', qty: 1, unitPrice: 7.50, ageVerified: true },
      { id: 'l31', productId: 'p-018', qty: 1, unitPrice: 4.50, ageVerified: true },
      { id: 'l32', productId: 'p-028', qty: 1, unitPrice: 9.00 },
      { id: 'l33', productId: 'p-027', qty: 1, unitPrice: 3.99 },
    ],
  },
  {
    id: 'tx-011',
    timestamp: '2026-07-22T12:15:09Z',
    cashier: 'Amy Chen',
    cashierId: 'staff-4',
    paymentMethod: 'card',
    total: 15.99,
    receiptNumber: 'R-2026-011',
    type: 'sale',
    lines: [
      { id: 'l34', productId: 'p-026', qty: 1, unitPrice: 2.49 },
      { id: 'l35', productId: 'p-029', qty: 2, unitPrice: 1.50 },
      { id: 'l36', productId: 'p-009', qty: 1, weight: 1.2, unitPrice: 2.49 },
      { id: 'l37', productId: 'p-011', qty: 1, weight: 0.9, unitPrice: 0.89 },
      { id: 'l38', productId: 'p-013', qty: 2, unitPrice: 2.49 },
      { id: 'l39', productId: 'p-014', qty: 1, unitPrice: 1.20 },
    ],
  },
];
