import type { CartLine, CartTotals, DiscountType } from "../types";
import { computeLine } from "../utils/totals";
import { formatCurrency } from "../utils/money";

interface CartPanelProps {
  lines: CartLine[];
  totals: CartTotals;
  cartDiscountType: DiscountType;
  cartDiscountValue: number;
  onSetQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onSetLineDiscount: (productId: string, type: DiscountType, value: number) => void;
  onSetCartDiscount: (type: DiscountType, value: number) => void;
}

export function CartPanel({
  lines,
  totals,
  cartDiscountType,
  cartDiscountValue,
  onSetQuantity,
  onRemove,
  onSetLineDiscount,
  onSetCartDiscount
}: CartPanelProps) {
  return (
    <section className="panel">
      <h2>Cart</h2>

      {lines.length === 0 ? <p className="empty-state">Cart is empty.</p> : null}

      <ul className="cart-list">
        {lines.map((line) => {
          const lineComputed = computeLine(line);
          return (
            <li key={line.productId} className="cart-row">
              <div>
                <strong>{line.name}</strong>
                <small>{formatCurrency(line.unitPrice)} each</small>
              </div>

              <div className="qty-controls">
                <button onClick={() => onSetQuantity(line.productId, Math.max(1, line.quantity - 1))}>-</button>
                <span>{line.quantity}</span>
                <button onClick={() => onSetQuantity(line.productId, line.quantity + 1)}>+</button>
                <button className="danger" onClick={() => onRemove(line.productId)}>
                  Remove
                </button>
              </div>

              <div className="discount-controls">
                <select
                  value={line.lineDiscountType ?? "none"}
                  onChange={(event) => {
                    const value = event.target.value;
                    const type: DiscountType = value === "none" ? null : (value as DiscountType);
                    onSetLineDiscount(line.productId, type, type ? line.lineDiscountValue : 0);
                  }}
                >
                  <option value="none">No discount</option>
                  <option value="percent">% Discount</option>
                  <option value="fixed">Fixed Discount</option>
                </select>
                {line.lineDiscountType ? (
                  <input
                    type="number"
                    min={0}
                    value={line.lineDiscountValue}
                    onChange={(event) =>
                      onSetLineDiscount(line.productId, line.lineDiscountType, Number(event.target.value || 0))
                    }
                  />
                ) : null}
              </div>

              <div className="line-summary">
                <small>Line discount: {formatCurrency(lineComputed.lineDiscountAmount)}</small>
                <strong>{formatCurrency(lineComputed.lineSubtotalAfterDiscount)}</strong>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="cart-discount-box">
        <h3>Cart Discount</h3>
        <div className="discount-controls">
          <select
            value={cartDiscountType ?? "none"}
            onChange={(event) => {
              const raw = event.target.value;
              const type: DiscountType = raw === "none" ? null : (raw as DiscountType);
              onSetCartDiscount(type, type ? cartDiscountValue : 0);
            }}
          >
            <option value="none">No discount</option>
            <option value="percent">% Discount</option>
            <option value="fixed">Fixed Discount</option>
          </select>
          {cartDiscountType ? (
            <input
              type="number"
              min={0}
              value={cartDiscountValue}
              onChange={(event) => onSetCartDiscount(cartDiscountType, Number(event.target.value || 0))}
            />
          ) : null}
        </div>
      </div>

      <div className="totals-grid">
        <span>Subtotal</span>
        <strong>{formatCurrency(totals.subtotal)}</strong>
        <span>Line discounts</span>
        <strong>- {formatCurrency(totals.lineDiscountTotal)}</strong>
        <span>Cart discount</span>
        <strong>- {formatCurrency(totals.cartDiscountAmount)}</strong>
        <span>Taxable base</span>
        <strong>{formatCurrency(totals.taxableBase)}</strong>
        <span>Tax</span>
        <strong>{formatCurrency(totals.taxAmount)}</strong>
        <span>Total</span>
        <strong>{formatCurrency(totals.grandTotal)}</strong>
      </div>
    </section>
  );
}
