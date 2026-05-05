import type { PaymentDraft, PaymentMethod } from "../types";
import { formatCurrency } from "../utils/money";

interface CheckoutPanelProps {
  payment: PaymentDraft;
  grandTotal: number;
  isValid: boolean;
  changeDue: number;
  onMethodChange: (method: PaymentMethod) => void;
  onPaymentChange: (payload: { cashReceived?: number; cardPaid?: number }) => void;
  onComplete: () => void;
}

export function CheckoutPanel({
  payment,
  grandTotal,
  isValid,
  changeDue,
  onMethodChange,
  onPaymentChange,
  onComplete
}: CheckoutPanelProps) {
  return (
    <section className="panel">
      <h2>Checkout</h2>

      <div className="payment-methods">
        <label>
          <input
            type="radio"
            checked={payment.method === "cash"}
            onChange={() => onMethodChange("cash")}
          />
          Cash
        </label>
        <label>
          <input
            type="radio"
            checked={payment.method === "card"}
            onChange={() => onMethodChange("card")}
          />
          Card
        </label>
        <label>
          <input
            type="radio"
            checked={payment.method === "mixed"}
            onChange={() => onMethodChange("mixed")}
          />
          Mixed
        </label>
      </div>

      {(payment.method === "cash" || payment.method === "mixed") && (
        <label>
          Cash received
          <input
            type="number"
            min={0}
            value={payment.cashReceived}
            onChange={(event) => onPaymentChange({ cashReceived: Number(event.target.value || 0) })}
          />
        </label>
      )}

      {(payment.method === "card" || payment.method === "mixed") && (
        <label>
          Card paid
          <input
            type="number"
            min={0}
            value={payment.cardPaid}
            onChange={(event) => onPaymentChange({ cardPaid: Number(event.target.value || 0) })}
          />
        </label>
      )}

      <div className="checkout-summary">
        <span>Total due: {formatCurrency(grandTotal)}</span>
        <span>Change due: {formatCurrency(changeDue)}</span>
      </div>

      <button onClick={onComplete} disabled={!isValid || grandTotal <= 0}>
        Confirm payment
      </button>
    </section>
  );
}
