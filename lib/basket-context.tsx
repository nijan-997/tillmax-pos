'use client';

import React, { createContext, useContext, useCallback, useReducer } from 'react';
import { Product } from './mock-data/products';
import { PROMOTIONS } from './mock-data/promotions';

export type BasketLine = {
  id: string;
  productId: string;
  productName: string;
  qty?: number;
  weight?: number;
  unitPrice: number;
  lineDiscount?: { type: 'percent' | 'amount'; value: number };
  ageVerified?: boolean;
  isPromotionLine?: boolean;
  promotionId?: string;
};

export type HeldSale = {
  id: string;
  heldAt: string;
  lines: BasketLine[];
};

export type BasketState = {
  lines: BasketLine[];
  heldSales: HeldSale[];
  appliedPromotions: string[]; // promotion IDs currently applied
};

type BasketAction =
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'REMOVE_LINE'; lineId: string }
  | { type: 'SET_QTY'; lineId: string; qty: number }
  | { type: 'SET_WEIGHT'; lineId: string; weight: number }
  | { type: 'SET_LINE_DISCOUNT'; lineId: string; discount: { type: 'percent' | 'amount'; value: number } }
  | { type: 'SET_PRICE'; lineId: string; newPrice: number }
  | { type: 'VERIFY_AGE'; lineId: string }
  | { type: 'HOLD_SALE' }
  | { type: 'RECALL_SALE'; heldId: string }
  | { type: 'CANCEL_SALE' }
  | { type: 'ADD_PROMOTION_LINE'; promotionId: string; discountAmount: number; description: string }
  | { type: 'REMOVE_PROMOTION_LINES' };

function evaluatePromotions(lines: BasketLine[]): { promotionId: string; discountAmount: number; description: string }[] {
  const results: { promotionId: string; discountAmount: number; description: string }[] = [];

  for (const promo of PROMOTIONS) {
    const matchingLines = lines.filter(
      (l) => !l.isPromotionLine && promo.productIds.includes(l.productId)
    );
    const totalQty = matchingLines.reduce((sum, l) => sum + (l.qty ?? 1), 0);

    if (promo.type === 'mix-and-match' && promo.qualifyingQty && totalQty >= promo.qualifyingQty) {
      const times = Math.floor(totalQty / promo.qualifyingQty);
      if (promo.forPrice !== undefined) {
        // e.g. 3 for £2.50 — calculate saving vs full price
        const fullPrice = matchingLines
          .filter((l) => !l.isPromotionLine)
          .reduce((sum, l) => sum + l.unitPrice * (l.qty ?? 1), 0);
        const discountAmount = fullPrice - promo.forPrice * times;
        if (discountAmount > 0) {
          results.push({ promotionId: promo.id, discountAmount, description: promo.description });
        }
      } else if (promo.discountPercent !== undefined) {
        const eligibleTotal = matchingLines.reduce(
          (sum, l) => sum + l.unitPrice * Math.min(l.qty ?? 1, promo.qualifyingQty! * times),
          0
        );
        const discountAmount = (eligibleTotal * promo.discountPercent) / 100;
        results.push({ promotionId: promo.id, discountAmount, description: promo.description });
      }
    }
  }

  return results;
}

function basketReducer(state: BasketState, action: BasketAction): BasketState {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const { product } = action;
      const existing = state.lines.find((l) => l.productId === product.id && !l.isPromotionLine);
      let newLines: BasketLine[];
      if (existing && !product.weighed) {
        newLines = state.lines.map((l) =>
          l.id === existing.id ? { ...l, qty: (l.qty ?? 1) + 1 } : l
        );
      } else {
        const newLine: BasketLine = {
          id: `line-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          productId: product.id,
          productName: product.name,
          qty: product.weighed ? undefined : 1,
          weight: product.weighed ? 0 : undefined,
          unitPrice: product.price,
          ageVerified: product.ageRestricted ? false : undefined,
        };
        newLines = [...state.lines, newLine];
      }
      // Re-evaluate promotions
      const promotions = evaluatePromotions(newLines.filter((l) => !l.isPromotionLine));
      const baseLines = newLines.filter((l) => !l.isPromotionLine);
      const promoLines: BasketLine[] = promotions.map((p) => ({
        id: `promo-${p.promotionId}`,
        productId: `promo-${p.promotionId}`,
        productName: p.description,
        qty: 1,
        unitPrice: -p.discountAmount,
        isPromotionLine: true,
        promotionId: p.promotionId,
      }));
      return {
        ...state,
        lines: [...baseLines, ...promoLines],
        appliedPromotions: promotions.map((p) => p.promotionId),
      };
    }

    case 'REMOVE_LINE': {
      const newLines = state.lines.filter((l) => l.id !== action.lineId);
      const baseLines = newLines.filter((l) => !l.isPromotionLine);
      const promotions = evaluatePromotions(baseLines);
      const promoLines: BasketLine[] = promotions.map((p) => ({
        id: `promo-${p.promotionId}`,
        productId: `promo-${p.promotionId}`,
        productName: p.description,
        qty: 1,
        unitPrice: -p.discountAmount,
        isPromotionLine: true,
        promotionId: p.promotionId,
      }));
      return {
        ...state,
        lines: [...baseLines, ...promoLines],
        appliedPromotions: promotions.map((p) => p.promotionId),
      };
    }

    case 'SET_QTY': {
      const newLines = state.lines.map((l) =>
        l.id === action.lineId ? { ...l, qty: action.qty } : l
      );
      const baseLines = newLines.filter((l) => !l.isPromotionLine);
      const promotions = evaluatePromotions(baseLines);
      const promoLines: BasketLine[] = promotions.map((p) => ({
        id: `promo-${p.promotionId}`,
        productId: `promo-${p.promotionId}`,
        productName: p.description,
        qty: 1,
        unitPrice: -p.discountAmount,
        isPromotionLine: true,
        promotionId: p.promotionId,
      }));
      return {
        ...state,
        lines: [...baseLines, ...promoLines],
        appliedPromotions: promotions.map((p) => p.promotionId),
      };
    }

    case 'SET_WEIGHT':
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === action.lineId ? { ...l, weight: action.weight } : l
        ),
      };

    case 'SET_LINE_DISCOUNT':
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === action.lineId ? { ...l, lineDiscount: action.discount } : l
        ),
      };

    case 'SET_PRICE':
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === action.lineId ? { ...l, unitPrice: action.newPrice } : l
        ),
      };

    case 'VERIFY_AGE':
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === action.lineId ? { ...l, ageVerified: true } : l
        ),
      };

    case 'HOLD_SALE': {
      if (state.lines.length === 0) return state;
      const held: HeldSale = {
        id: `held-${Date.now()}`,
        heldAt: new Date().toISOString(),
        lines: state.lines,
      };
      return { ...state, lines: [], heldSales: [...state.heldSales, held], appliedPromotions: [] };
    }

    case 'RECALL_SALE': {
      const held = state.heldSales.find((h) => h.id === action.heldId);
      if (!held) return state;
      return {
        ...state,
        lines: held.lines,
        heldSales: state.heldSales.filter((h) => h.id !== action.heldId),
        appliedPromotions: held.lines.filter((l) => l.isPromotionLine).map((l) => l.promotionId ?? ''),
      };
    }

    case 'CANCEL_SALE':
      return { ...state, lines: [], appliedPromotions: [] };

    default:
      return state;
  }
}

// Compute totals
export function computeBasketTotals(lines: BasketLine[]) {
  let subtotal = 0;
  let totalDiscount = 0;

  for (const line of lines) {
    const qty = line.qty ?? 1;
    const weight = line.weight ?? 1;
    const effectiveQty = line.weight !== undefined ? weight : qty;
    const lineTotal = line.unitPrice * effectiveQty;

    if (line.isPromotionLine) {
      totalDiscount += Math.abs(lineTotal);
    } else if (line.lineDiscount) {
      const gross = lineTotal;
      const discAmt =
        line.lineDiscount.type === 'percent'
          ? gross * (line.lineDiscount.value / 100)
          : line.lineDiscount.value;
      subtotal += gross;
      totalDiscount += discAmt;
    } else {
      subtotal += lineTotal;
    }
  }

  const total = subtotal - totalDiscount;
  return { subtotal, totalDiscount, total: Math.max(0, total) };
}

const initialState: BasketState = {
  lines: [],
  heldSales: [],
  appliedPromotions: [],
};

type BasketContextType = {
  state: BasketState;
  dispatch: React.Dispatch<BasketAction>;
  totals: ReturnType<typeof computeBasketTotals>;
};

const BasketContext = createContext<BasketContextType | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(basketReducer, initialState);
  const totals = computeBasketTotals(state.lines);

  return (
    <BasketContext.Provider value={{ state, dispatch, totals }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasket must be inside BasketProvider');
  return ctx;
}
