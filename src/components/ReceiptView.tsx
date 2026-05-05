import type { Receipt } from "../types";
import { formatCurrency } from "../utils/money";

interface ReceiptViewProps {
  receipt: Receipt;
  onNewSale: () => void;
}

export function ReceiptView({ receipt, onNewSale }: ReceiptViewProps) {
  return (
    <div className="receipt-overlay" role="dialog" aria-modal="true">
      <div className="receipt-card">
        <h2>Digital Receipt</h2>
        <p>
          {receipt.transactionId} | {new Date(receipt.createdAt).toLocaleString()}
        </p>
        <p>{receipt.cashierLabel}</p>
        {receipt.pendingSync ? <p className="badge badge-offline">Pending sync</p> : null}

        <ul className="receipt-lines">
          {receipt.lines.map((line) => (
            <li key={line.productId}>
              <span>
                {line.name} x{line.quantity}
              </span>
              <strong>{formatCurrency(line.unitPrice * line.quantity)}</strong>
            </li>
          ))}
        </ul>

        <div className="totals-grid compact">
          <span>Subtotal</span>
          <strong>{formatCurrency(receipt.totals.subtotal)}</strong>
          <span>Discounts</span>
          <strong>- {formatCurrency(receipt.totals.discountTotal)}</strong>
          <span>Tax</span>
          <strong>{formatCurrency(receipt.totals.taxAmount)}</strong>
          <span>Total</span>
          <strong>{formatCurrency(receipt.totals.grandTotal)}</strong>
          <span>Paid</span>
          <strong>{formatCurrency(receipt.payment.totalPaid)}</strong>
          <span>Change</span>
          <strong>{formatCurrency(receipt.payment.changeDue)}</strong>
          <span>Method</span>
          <strong>{receipt.payment.method}</strong>
        </div>

        <button onClick={onNewSale}>Start New Sale</button>
      </div>
    </div>
  );
}
