import { describe, expect, it } from "vitest";
import { getPaymentValidation } from "./payment";

describe("getPaymentValidation", () => {
  it("validates cash payments and change", () => {
    const result = getPaymentValidation(
      {
        method: "cash",
        cashReceived: 120,
        cardPaid: 0
      },
      100
    );

    expect(result.isValid).toBe(true);
    expect(result.changeDue).toBe(20);
  });

  it("requires card amount to cover total in card mode", () => {
    const fail = getPaymentValidation(
      {
        method: "card",
        cashReceived: 0,
        cardPaid: 90
      },
      100
    );

    const ok = getPaymentValidation(
      {
        method: "card",
        cashReceived: 0,
        cardPaid: 100
      },
      100
    );

    expect(fail.isValid).toBe(false);
    expect(ok.isValid).toBe(true);
    expect(ok.changeDue).toBe(0);
  });
});
