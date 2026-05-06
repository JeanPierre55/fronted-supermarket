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
      <h2>💳 Pago</h2>

      <div className="payment-methods" style={{ marginTop: "0.75rem" }}>
        <label>
          <input type="radio" checked={payment.method === "cash"} onChange={() => onMethodChange("cash")} />
          💵 Efectivo
        </label>
        <label>
          <input type="radio" checked={payment.method === "card"} onChange={() => onMethodChange("card")} />
          💳 Tarjeta
        </label>
        <label>
          <input type="radio" checked={payment.method === "mixed"} onChange={() => onMethodChange("mixed")} />
          🔀 Mixto
        </label>
      </div>

      {(payment.method === "cash" || payment.method === "mixed") && (
        <div>
          <span className="checkout-label">Efectivo recibido</span>
          <input
            type="number"
            min={0}
            value={payment.cashReceived || ""}
            placeholder="0"
            onChange={(e) => onPaymentChange({ cashReceived: Number(e.target.value || 0) })}
          />
        </div>
      )}

      {(payment.method === "card" || payment.method === "mixed") && (
        <div>
          <span className="checkout-label">Monto con tarjeta</span>
          <input
            type="number"
            min={0}
            value={payment.cardPaid || ""}
            placeholder="0"
            onChange={(e) => onPaymentChange({ cardPaid: Number(e.target.value || 0) })}
          />
        </div>
      )}

      <div className="checkout-summary">
        <span>Total a pagar: <strong>{formatCurrency(grandTotal)}</strong></span>
        <span style={{ color: changeDue > 0 ? "var(--green)" : "var(--text-secondary)" }}>
          Cambio: <strong>{formatCurrency(changeDue)}</strong>
        </span>
      </div>

      <button
        className="confirm"
        onClick={onComplete}
        disabled={!isValid || grandTotal <= 0}
      >
        ✓ Confirmar Pago
      </button>
    </section>
  );
}
