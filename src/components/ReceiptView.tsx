import type { Receipt } from "../types";
import { formatCurrency } from "../utils/money";

interface ReceiptViewProps {
  receipt: Receipt;
  onNewSale: () => void;
}

export function ReceiptView({ receipt, onNewSale }: ReceiptViewProps) {
  const methodLabel: Record<string, string> = {
    cash: "Efectivo",
    card: "Tarjeta",
    mixed: "Mixto"
  };

  return (
    <div className="receipt-overlay" role="dialog" aria-modal="true">
      <div className="receipt-card">
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>🧾</div>
          <h2>Recibo Digital</h2>
          <p>{receipt.transactionId}</p>
          <p>{new Date(receipt.createdAt).toLocaleString("es-CO")}</p>
          <p>{receipt.cashierLabel}</p>
          {receipt.pendingSync && (
            <span className="badge badge-pending" style={{ marginTop: "0.5rem", display: "inline-flex" }}>
              ⏳ Pendiente de sincronización
            </span>
          )}
        </div>

        <div className="divider" />

        <ul className="receipt-lines">
          {receipt.lines.map((line) => (
            <li key={line.productId}>
              <span>
                {line.name}
                <small style={{ display: "block", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  {line.quantity} × {formatCurrency(line.unitPrice)}
                </small>
              </span>
              <strong>{formatCurrency(line.unitPrice * line.quantity)}</strong>
            </li>
          ))}
        </ul>

        <div className="divider" />

        <div className="totals-grid compact">
          <span>Subtotal</span>
          <strong>{formatCurrency(receipt.totals.subtotal)}</strong>

          {receipt.totals.discountTotal > 0 && (
            <>
              <span>Descuentos</span>
              <strong style={{ color: "var(--green)" }}>− {formatCurrency(receipt.totals.discountTotal)}</strong>
            </>
          )}

          <span>IVA</span>
          <strong>{formatCurrency(receipt.totals.taxAmount)}</strong>

          <span>Total</span>
          <strong style={{ color: "var(--accent)" }}>{formatCurrency(receipt.totals.grandTotal)}</strong>

          <span>Método</span>
          <strong>{methodLabel[receipt.payment.method] ?? receipt.payment.method}</strong>

          <span>Pagado</span>
          <strong>{formatCurrency(receipt.payment.totalPaid)}</strong>

          {receipt.payment.changeDue > 0 && (
            <>
              <span>Cambio</span>
              <strong style={{ color: "var(--green)" }}>{formatCurrency(receipt.payment.changeDue)}</strong>
            </>
          )}
        </div>

        <button className="confirm" onClick={onNewSale}>
          + Nueva Venta
        </button>
      </div>
    </div>
  );
}
