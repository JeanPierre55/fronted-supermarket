import { describe, expect, it } from "vitest";
import { calculateTotals } from "./totals";
import type { CartLine } from "../types";

const sampleLines: CartLine[] = [
  {
    productId: "1",
    name: "Item A",
    barcode: "111",
    unitPrice: 100,
    quantity: 2,
    taxable: true,
    lineDiscountType: "percent",
    lineDiscountValue: 10
  },
  {
    productId: "2",
    name: "Item B",
    barcode: "222",
    unitPrice: 50,
    quantity: 1,
    taxable: false,
    lineDiscountType: null,
    lineDiscountValue: 0
  }
];

describe("calculateTotals", () => {
  it("applies line discounts, cart discount and tax", () => {
    const totals = calculateTotals(sampleLines, "fixed", 10, 0.19);

    expect(totals.subtotal).toBe(250);
    expect(totals.lineDiscountTotal).toBe(20);
    expect(totals.cartDiscountAmount).toBe(10);
    expect(totals.taxableBase).toBeGreaterThan(0);
    expect(totals.grandTotal).toBeGreaterThan(0);
  });

  it("never returns negative totals", () => {
    const totals = calculateTotals(sampleLines, "fixed", 9999, 0.19);
    expect(totals.grandTotal).toBeGreaterThanOrEqual(0);
    expect(totals.taxableBase).toBeGreaterThanOrEqual(0);
  });
});
