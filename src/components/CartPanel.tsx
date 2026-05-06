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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h2>🛒 Carrito</h2>
        {lines.length > 0 && (
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {lines.length} {lines.length === 1 ? "artículo" : "artículos"}
          </span>
        )}
      </div>

      {lines.length === 0 ? (
        <p className="empty-state">El carrito está vacío.<br />Agrega productos desde el catálogo.</p>
      ) : (
        <ul className="cart-list">
          {lines.map((line) => {
            const computed = computeLine(line);
            return (
              <li key={line.productId} className="cart-row">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong>{line.name}</strong>
                    <small>{formatCurrency(line.unitPrice)} c/u</small>
                  </div>
                  <button className="danger" onClick={() => onRemove(line.productId)} style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}>
                    ✕
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="qty-controls">
                    <button onClick={() => onSetQuantity(line.productId, Math.max(1, line.quantity - 1))}>−</button>
                    <span>{line.quantity}</span>
                    <button onClick={() => onSetQuantity(line.productId, line.quantity + 1)}>+</button>
                  </div>
                  <div className="line-summary">
                    {computed.lineDiscountAmount > 0 && (
                      <small>− {formatCurrency(computed.lineDiscountAmount)}</small>
                    )}
                    <strong>{formatCurrency(computed.lineSubtotalAfterDiscount)}</strong>
                  </div>
                </div>

                <div className="discount-controls">
                  <select
                    value={line.lineDiscountType ?? "none"}
                    onChange={(e) => {
                      const val = e.target.value;
                      const type: DiscountType = val === "none" ? null : (val as DiscountType);
                      onSetLineDiscount(line.productId, type, type ? line.lineDiscountValue : 0);
                    }}
                  >
                    <option value="none">Sin descuento</option>
                    <option value="percent">% Descuento</option>
                    <option value="fixed">$ Descuento fijo</option>
                  </select>
                  {line.lineDiscountType ? (
                    <input
                      type="number"
                      min={0}
                      value={line.lineDiscountValue}
                      onChange={(e) =>
                        onSetLineDiscount(line.productId, line.lineDiscountType, Number(e.target.value || 0))
                      }
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {lines.length > 0 && (
        <>
          <div className="cart-discount-box" style={{ marginTop: "0.75rem" }}>
            <h3>Descuento del carrito</h3>
            <div className="discount-controls">
              <select
                value={cartDiscountType ?? "none"}
                onChange={(e) => {
                  const raw = e.target.value;
                  const type: DiscountType = raw === "none" ? null : (raw as DiscountType);
                  onSetCartDiscount(type, type ? cartDiscountValue : 0);
                }}
              >
                <option value="none">Sin descuento</option>
                <option value="percent">% Descuento</option>
                <option value="fixed">$ Descuento fijo</option>
              </select>
              {cartDiscountType ? (
                <input
                  type="number"
                  min={0}
                  value={cartDiscountValue}
                  onChange={(e) => onSetCartDiscount(cartDiscountType, Number(e.target.value || 0))}
                />
              ) : null}
            </div>
          </div>

          <div className="totals-grid">
            <span>Subtotal</span>
            <strong>{formatCurrency(totals.subtotal)}</strong>

            {totals.lineDiscountTotal > 0 && (
              <>
                <span>Desc. por línea</span>
                <strong style={{ color: "var(--green)" }}>− {formatCurrency(totals.lineDiscountTotal)}</strong>
              </>
            )}

            {totals.cartDiscountAmount > 0 && (
              <>
                <span>Desc. carrito</span>
                <strong style={{ color: "var(--green)" }}>− {formatCurrency(totals.cartDiscountAmount)}</strong>
              </>
            )}

            <span>Base gravable</span>
            <strong>{formatCurrency(totals.taxableBase)}</strong>

            <span>IVA (19%)</span>
            <strong>{formatCurrency(totals.taxAmount)}</strong>

            <span>Total</span>
            <strong style={{ color: "var(--accent)", fontSize: "1rem" }}>{formatCurrency(totals.grandTotal)}</strong>
          </div>
        </>
      )}
    </section>
  );
}
