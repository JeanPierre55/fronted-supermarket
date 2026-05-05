# POS Frontend Requirements

## 1. Overview

This document defines the functional and non-functional requirements for a supermarket Point of Sale (POS) frontend used by cashiers.

## 2. Scope

The POS frontend must allow cashiers to:
- Search products by name or category
- Scan product barcodes (manual entry and camera scan)
- Manage a real-time shopping cart
- Apply discounts and calculate taxes
- Process checkout using multiple payment methods
- Generate and display a digital receipt
- Continue core operations in offline mode

Out of scope for this phase:
- Inventory updates to central ERP
- User authentication/authorization
- Hardware printer integration

## 3. Actors

- Cashier: Main user operating the POS terminal
- Customer: Recipient of the sale and receipt

## 4. User Stories and Acceptance Criteria

### US-01 Product Search by Name
As a cashier, I want to search products by name so I can quickly add items to the cart.

Acceptance Criteria:
1. Given at least 1 product exists, when the cashier types 2 or more characters in the search input, then matching products are listed within 300 ms in normal conditions.
2. Matching is case-insensitive and supports partial text.
3. If no products match, the UI shows a clear empty-state message.
4. Search results include: product name, category, price, and stock indicator.

### US-02 Product Filter by Category
As a cashier, I want to filter products by category so I can find products faster.

Acceptance Criteria:
1. When a category is selected, only products from that category are shown.
2. When "All" is selected, products from all categories are shown.
3. Category filter works together with name search (intersection behavior).

### US-03 Barcode Scan (Manual Entry)
As a cashier, I want to input a barcode manually so I can add products when scanner hardware is unavailable.

Acceptance Criteria:
1. When a valid barcode is entered and submitted, the related product is added to cart.
2. If the product already exists in cart, quantity increments by 1.
3. If barcode is unknown, a visible error message is shown.
4. Barcode field clears after successful add.

### US-04 Barcode Scan (Camera)
As a cashier, I want to scan a barcode using the device camera so I can speed up checkout.

Acceptance Criteria:
1. Cashier can open and close the camera scanner from the UI.
2. On successful scan, the matching product is added to cart.
3. If camera permission is denied, the UI shows actionable guidance.
4. If scan fails for 3 seconds, cashier can retry without reloading page.

### US-05 Real-time Cart Updates
As a cashier, I want to see cart updates instantly so I can maintain checkout accuracy.

Acceptance Criteria:
1. Cart displays product name, unit price, quantity, line subtotal.
2. Quantity can be incremented/decremented from the cart UI.
3. Removing an item updates totals immediately.
4. Cart totals recalculate in real time after every cart action.

### US-06 Discounts
As a cashier, I want to apply discounts so promotional pricing can be reflected.

Acceptance Criteria:
1. Cashier can apply either line-item discount or whole-cart discount.
2. Discount may be percentage or fixed value.
3. Discount cannot reduce line or cart subtotal below zero.
4. Applied discounts are visibly itemized in totals section.

### US-07 Tax Calculation
As a cashier, I want taxes calculated automatically so final billing is correct.

Acceptance Criteria:
1. Tax is calculated from taxable subtotal after discounts.
2. Tax rate is configurable from app settings/constants.
3. UI displays subtotal, discount total, taxable base, tax total, grand total.
4. Monetary values are rounded to 2 decimals using standard rounding.

### US-08 Multiple Payment Methods
As a cashier, I want to process different payment methods so I can complete more transactions.

Acceptance Criteria:
1. Supported methods: cash, card, mixed.
2. For cash payments, cashier enters amount received.
3. For cash, system calculates change due.
4. Checkout is blocked until payment amount covers grand total.

### US-09 Digital Receipt
As a cashier, I want a digital receipt generated after payment so customer details are available.

Acceptance Criteria:
1. On successful checkout, receipt view is displayed.
2. Receipt includes: transaction id, date/time, cashier id/name placeholder, item list, totals, payment method, paid amount, change.
3. Cashier can start a new sale from receipt screen.

### US-10 Offline Core Operations
As a cashier, I want core operations to work offline so I can continue selling during connection loss.

Acceptance Criteria:
1. Product search (from cached data), barcode add, and cart management work without network.
2. UI clearly indicates offline mode.
3. If checkout requires online confirmation in future versions, current version still allows local completion and marks transaction as "pending sync".
4. No data loss occurs when switching between online and offline during active sale.

## 5. Non-Functional Requirements

1. Performance:
- Search response under 300 ms for dataset up to 5,000 products on target device.
- Cart interactions update UI under 100 ms for up to 100 cart lines.

2. Reliability:
- No uncaught runtime errors during normal cashier workflows.
- State persists during accidental tab refresh (active cart recovery).

3. Usability:
- Keyboard-friendly flow for cashier speed (search, add, checkout).
- Clear error messages for scan, payment, and validation issues.

4. Maintainability:
- Modular component structure with reusable business logic hooks/services.
- Unit-test coverage for core calculations (totals, discounts, taxes, change).

## 6. Constraints and Assumptions

- Frontend-first implementation with mocked/local product data source.
- Currency format is fixed to COP for workshop scope.
- Camera scanning depends on browser compatibility and permission support.

## 7. Definition of Done (Requirements Level)

This requirements document is complete when:
1. Every core workflow has at least one user story.
2. Every user story has concrete, testable acceptance criteria.
3. Offline behavior for core operations is explicitly defined.
4. Payment and totals logic is fully specified for implementation.
