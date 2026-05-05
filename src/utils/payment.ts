import type { PaymentDraft } from "../types";

export function getTotalPaid(payment: PaymentDraft): number {
  return payment.cashReceived + payment.cardPaid;
}

export function getPaymentValidation(payment: PaymentDraft, grandTotal: number): {
  isValid: boolean;
  changeDue: number;
  totalPaid: number;
} {
  const totalPaid = getTotalPaid(payment);

  if (payment.method === "card") {
    return {
      isValid: payment.cardPaid >= grandTotal,
      changeDue: 0,
      totalPaid
    };
  }

  const changeDue = Math.max(0, totalPaid - grandTotal);
  return {
    isValid: totalPaid >= grandTotal,
    changeDue,
    totalPaid
  };
}
