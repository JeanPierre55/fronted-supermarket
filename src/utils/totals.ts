import type { CartLine, CartTotals, DiscountType } from "../types";
import { roundMoney } from "./money";

export interface LineComputed {
  lineSubtotalBeforeDiscount: number;
  lineDiscountAmount: number;
  lineSubtotalAfterDiscount: number;
}

function computeDiscount(base: number, type: DiscountType, value: number): number {
  if (!type || value <= 0 || base <= 0) {
    return 0;
  }
  const discount = type === "percent" ? (base * value) / 100 : value;
  return Math.min(roundMoney(discount), roundMoney(base));
}

export function computeLine(line: CartLine): LineComputed {
  const beforeDiscount = roundMoney(line.unitPrice * line.quantity);
  const lineDiscountAmount = computeDiscount(beforeDiscount, line.lineDiscountType, line.lineDiscountValue);
  const afterDiscount = roundMoney(Math.max(0, beforeDiscount - lineDiscountAmount));

  return {
    lineSubtotalBeforeDiscount: beforeDiscount,
    lineDiscountAmount,
    lineSubtotalAfterDiscount: afterDiscount
  };
}

export function calculateTotals(
  lines: CartLine[],
  cartDiscountType: DiscountType,
  cartDiscountValue: number,
  taxRate: number
): CartTotals {
  const lineResults = lines.map(computeLine);

  const subtotal = roundMoney(lineResults.reduce((sum, line) => sum + line.lineSubtotalBeforeDiscount, 0));
  const lineDiscountTotal = roundMoney(lineResults.reduce((sum, line) => sum + line.lineDiscountAmount, 0));
  const afterLineDiscount = roundMoney(lineResults.reduce((sum, line) => sum + line.lineSubtotalAfterDiscount, 0));

  const cartDiscountAmount = computeDiscount(afterLineDiscount, cartDiscountType, cartDiscountValue);
  const afterAllDiscounts = roundMoney(Math.max(0, afterLineDiscount - cartDiscountAmount));

  const taxableBeforeCartDiscount = roundMoney(
    lines.reduce((sum, line, index) => {
      if (!line.taxable) {
        return sum;
      }
      return sum + lineResults[index].lineSubtotalAfterDiscount;
    }, 0)
  );

  const taxableRatio = afterLineDiscount > 0 ? taxableBeforeCartDiscount / afterLineDiscount : 0;
  const taxableBase = roundMoney(Math.max(0, taxableBeforeCartDiscount - cartDiscountAmount * taxableRatio));
  const taxAmount = roundMoney(taxableBase * taxRate);
  const grandTotal = roundMoney(afterAllDiscounts + taxAmount);

  return {
    subtotal,
    lineDiscountTotal,
    cartDiscountAmount,
    discountTotal: roundMoney(lineDiscountTotal + cartDiscountAmount),
    taxableBase,
    taxAmount,
    grandTotal
  };
}
