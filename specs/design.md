# POS Frontend Design

## 1. Purpose

This document defines the frontend architecture and data flow for the supermarket POS terminal, aligned with `requirements.md`.

## 2. Architectural Style

- Application type: Single Page Application (SPA)
- Approach: Feature-oriented modular frontend
- State strategy:
  - UI local state for view-only concerns (modals, focus, temporary inputs)
  - Central sale state for cart/totals/checkout workflow
  - Local persistence for offline continuity and refresh recovery

## 3. High-Level Module Breakdown

1. `ProductCatalog`
- Product search input
- Category filter
- Product result list
- Add-to-cart interactions

2. `BarcodeScanner`
- Manual barcode entry
- Camera scanner launcher/container
- Scanner error and permission handling

3. `Cart`
- Cart line items
- Quantity controls
- Remove item
- Cart summary (subtotal, discounts, taxes, total)

4. `Discounts`
- Line discount editor
- Cart discount editor
- Validation and conflict rules

5. `Checkout`
- Payment method selector (cash, card, mixed)
- Payment amount inputs
- Change calculation
- Confirm payment action

6. `Receipt`
- Post-checkout transaction detail
- New sale action

7. `OfflineSync`
- Online/offline status indicator
- Local transaction persistence
- Pending sync marker

## 4. Proposed Component Tree

- `App`
- `PosLayout`
- `StatusBar`
- `OfflineBadge`
- `CatalogPanel`
- `ProductSearchBar`
- `CategoryFilter`
- `ProductList`
- `BarcodeSection`
- `ManualBarcodeInput`
- `CameraScannerModal`
- `CartPanel`
- `CartLineList`
- `CartLineItem`
- `CartTotals`
- `DiscountControls`
- `CheckoutPanel`
- `PaymentMethodSelector`
- `PaymentInputs`
- `CheckoutActions`
- `ReceiptModal` or `ReceiptPage`

## 5. Domain Data Model

## 5.1 Product

- `id: string`
- `barcode: string`
- `name: string`
- `category: string`
- `unitPrice: number`
- `taxable: boolean`
- `stock: number`

## 5.2 CartLine

- `productId: string`
- `name: string`
- `barcode: string`
- `unitPrice: number`
- `quantity: number`
- `lineDiscountType: "percent" | "fixed" | null`
- `lineDiscountValue: number`
- `lineSubtotalBeforeDiscount: number`
- `lineDiscountAmount: number`
- `lineSubtotalAfterDiscount: number`
- `taxable: boolean`

## 5.3 CartTotals

- `subtotal: number`
- `lineDiscountTotal: number`
- `cartDiscountType: "percent" | "fixed" | null`
- `cartDiscountValue: number`
- `cartDiscountAmount: number`
- `discountTotal: number`
- `taxableBase: number`
- `taxAmount: number`
- `grandTotal: number`

## 5.4 Payment

- `method: "cash" | "card" | "mixed"`
- `cashReceived: number`
- `cardPaid: number`
- `totalPaid: number`
- `changeDue: number`

## 5.5 Receipt

- `transactionId: string`
- `createdAt: ISO string`
- `cashierLabel: string`
- `lines: CartLine[]`
- `totals: CartTotals`
- `payment: Payment`
- `pendingSync: boolean`

## 6. State Management Design

Primary store slices:

1. `catalogState`
- `products`
- `searchTerm`
- `selectedCategory`
- `filteredProducts`

2. `cartState`
- `lines`
- `totals`
- `activeDiscountInputs`

3. `checkoutState`
- `payment`
- `isCheckoutValid`
- `lastReceipt`

4. `appState`
- `isOffline`
- `pendingTransactions`
- `ui` flags (scanner open, receipt view open)

Suggested implementation choices:
- React Context + reducer for workshop simplicity, or lightweight store library.
- Derived totals should be recomputed through pure utility functions, not hand-mutated.

## 7. Core Data Flows

## 7.1 Product Search / Filter

1. Cashier types in search bar.
2. `searchTerm` updates.
3. Selector filters products by:
- case-insensitive partial name match
- selected category
4. `ProductList` re-renders with filtered items.

## 7.2 Add by Barcode (Manual)

1. Cashier enters barcode.
2. Lookup by exact barcode in local product index.
3. If found:
- add line or increment quantity
- recompute totals
- clear barcode input
4. If not found:
- show user-facing validation error.

## 7.3 Add by Camera

1. Cashier opens scanner modal.
2. Browser asks permission for camera.
3. On scan success:
- parse barcode value
- execute same flow as manual barcode add
- close scanner (configurable)
4. On permission denied / scan timeout:
- show retry/help state
- keep current cart unchanged.

## 7.4 Cart and Totals Recalculation

Any of these triggers totals recompute:
- add line
- remove line
- quantity change
- line discount change
- cart discount change

Recalculation order:
1. Compute line subtotal before discount.
2. Apply line discount with floor at 0.
3. Aggregate discounted lines into subtotal.
4. Apply cart discount with floor at 0.
5. Compute taxable base.
6. Compute tax from configurable tax rate.
7. Round outputs to 2 decimals.

## 7.5 Checkout

1. Cashier selects payment method.
2. Inputs payment amounts.
3. Validation checks `totalPaid >= grandTotal`.
4. On confirm:
- create receipt object
- persist transaction locally
- mark `pendingSync` if offline
- clear active cart
- show receipt screen.

## 8. Offline and Persistence Strategy

Data to persist locally:
- cached product catalog
- active cart draft
- pending offline transactions
- app settings (tax rate, currency label)

Storage:
- `localStorage` for workshop scope
- optional migration path to IndexedDB for larger datasets

Offline behavior:
- Core flows (search from cache, barcode add, cart, checkout, receipt) continue without network.
- `isOffline` detected via browser online events + optional heartbeat fallback.

Recovery behavior:
- On reload, restore active cart if checkout not completed.
- On reconnect, keep pending transactions flagged for future sync pipeline.

## 9. Validation and Error Handling

Validation rules:
- Barcode input cannot be empty on submit.
- Quantity minimum is 1 for active lines.
- Discount values cannot produce negative line/cart amounts.
- Checkout blocked until payment is sufficient.

Error display:
- Inline form errors for input issues.
- Non-blocking alert/toast for scanner/camera issues.
- Persistent status badge for offline mode.

## 10. Performance and UX Considerations

- Memoize filtered product selectors for up to 5,000 products.
- Debounce search input (100-150 ms) to reduce unnecessary renders.
- Keep keyboard-first path:
- focus starts on search
- Enter adds highlighted product
- barcode input submit via Enter
- checkout confirm reachable without mouse

## 11. Testing Strategy (Design-Level)

1. Unit tests
- totals calculation utilities
- discount and tax edge cases
- payment validation and change calculation

2. Component tests
- catalog filtering behavior
- cart quantity/line updates
- checkout validation states

3. Integration tests
- complete sale flow from search to receipt
- offline sale marked as pending sync

## 12. Implementation Notes for Kiro

- Build feature by feature following `tasks.md` sequence.
- Keep business logic in reusable utility functions/hooks.
- Avoid embedding calculation logic directly in presentation components.
- Maintain strict typing for domain models to reduce checkout/totals regressions.
