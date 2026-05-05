# POS Frontend Implementation Tasks

This task list is designed for incremental, testable implementation aligned with `requirements.md` and `design.md`.

## Legend
- [ ] Pending
- [x] Completed

## Phase 0: Project Foundation

### T-001 Initialize frontend app shell
- [ ] Create base project structure and app layout containers.
- [ ] Add sections for catalog, cart, checkout, and status bar.
- [ ] Configure basic styling and responsive layout.

Validation:
- [ ] App runs locally without runtime errors.
- [ ] Layout renders on desktop and mobile widths.

### T-002 Define domain models and constants
- [ ] Create types/interfaces for Product, CartLine, CartTotals, Payment, Receipt.
- [ ] Add constants for tax rate, currency, and payment methods.
- [ ] Add utility for money rounding to 2 decimals.

Validation:
- [ ] Type checks pass.
- [ ] Utility tests for rounding pass.

## Phase 1: Product Catalog and Search

### T-003 Implement product data source and cache bootstrap
- [ ] Add mocked product dataset.
- [ ] Build product repository/service abstraction.
- [ ] Load products into application state at startup.

Validation:
- [ ] Product list renders from local source.
- [ ] Reload keeps catalog available offline.

### T-004 Build search by name
- [ ] Add search input in catalog panel.
- [ ] Implement case-insensitive partial match filtering.
- [ ] Add empty-state message for no results.

Validation:
- [ ] Typing 2+ chars filters results correctly.
- [ ] Search response feels immediate for sample dataset.

### T-005 Build category filter and combined filtering
- [ ] Add category selector with "All" option.
- [ ] Filter products by selected category.
- [ ] Combine name and category filters (intersection).

Validation:
- [ ] Category filter works independently.
- [ ] Combined filter returns only matching intersection results.

## Phase 2: Cart Core

### T-006 Implement cart store and cart line rendering
- [ ] Create cart state slice/reducer/hooks.
- [ ] Render cart line list with name, unit price, qty, line subtotal.
- [ ] Add derived totals section scaffold.

Validation:
- [ ] Adding/removing lines updates UI.
- [ ] Cart displays required fields correctly.

### T-007 Implement add-to-cart from product list
- [ ] Add "Add" action on each product row/card.
- [ ] Add new line if product absent.
- [ ] Increment quantity if product already in cart.

Validation:
- [ ] Duplicate product adds increase quantity.
- [ ] Cart updates immediately after add.

### T-008 Implement quantity controls and remove item
- [ ] Add increment/decrement controls.
- [ ] Prevent quantity from dropping below 1 (or remove on decrement-at-1 if chosen behavior).
- [ ] Add remove action per line.

Validation:
- [ ] Quantity changes recompute line subtotal and totals.
- [ ] Remove action updates totals instantly.

## Phase 3: Barcode Scanning

### T-009 Implement manual barcode input flow
- [ ] Add barcode input + submit action.
- [ ] Lookup product by exact barcode.
- [ ] Reuse add-to-cart logic on match.
- [ ] Show error when barcode is unknown.

Validation:
- [ ] Valid barcode adds/increments cart line.
- [ ] Unknown barcode displays clear error.
- [ ] Input clears after successful add.

### T-010 Integrate camera scanner component
- [ ] Add scanner modal open/close controls.
- [ ] Integrate browser camera permission flow.
- [ ] Decode barcode and dispatch add-to-cart.
- [ ] Handle denied permission and retry UI state.

Validation:
- [ ] Successful scan adds product to cart.
- [ ] Permission denial shows actionable guidance.
- [ ] Retry works without full page reload.

## Phase 4: Discounts and Totals

### T-011 Implement totals calculation utilities
- [ ] Build pure functions for subtotal, taxable base, tax, grand total.
- [ ] Apply deterministic rounding to 2 decimals.
- [ ] Centralize recalculation pipeline in one module.

Validation:
- [ ] Unit tests cover normal and edge cases.
- [ ] Totals are stable and consistent after repeated edits.

### T-012 Implement line discounts
- [ ] Add line discount controls (percent/fixed).
- [ ] Validate non-negative outcomes.
- [ ] Reflect line discount amount in totals.

Validation:
- [ ] Discount cannot reduce line below zero.
- [ ] Discounted line subtotal is shown correctly.

### T-013 Implement cart-level discounts
- [ ] Add cart discount controls (percent/fixed).
- [ ] Apply after line-level discounts.
- [ ] Enforce non-negative cart subtotal.

Validation:
- [ ] Cart discount appears itemized.
- [ ] Combined discount math matches expected values.

### T-014 Apply tax calculation after discounts
- [ ] Calculate tax on taxable base after all discounts.
- [ ] Use configurable tax rate.
- [ ] Display subtotal, discounts, taxable base, tax, grand total.

Validation:
- [ ] Tax values match test fixtures.
- [ ] Displayed totals match utility outputs.

## Phase 5: Checkout and Receipt

### T-015 Implement payment method selection
- [ ] Add payment options: cash, card, mixed.
- [ ] Show contextual inputs based on selected method.
- [ ] Persist payment draft state while editing.

Validation:
- [ ] Method switch updates visible inputs correctly.
- [ ] No stale values cause invalid totals.

### T-016 Implement payment validation and change calculation
- [ ] Validate that total paid covers grand total.
- [ ] For cash and mixed, compute change due.
- [ ] Disable confirm checkout until valid.

Validation:
- [ ] Underpayment blocks checkout.
- [ ] Change due is correct for overpayment.

### T-017 Implement checkout finalization and receipt generation
- [ ] Create transaction id and timestamp on confirm.
- [ ] Build receipt object from cart + totals + payment.
- [ ] Clear active cart and show receipt view.

Validation:
- [ ] Receipt includes all required fields.
- [ ] New sale action resets UI state cleanly.

## Phase 6: Offline and Persistence

### T-018 Add offline status detection and UI indicator
- [ ] Listen to online/offline browser events.
- [ ] Store `isOffline` in app state.
- [ ] Show persistent offline badge.

Validation:
- [ ] Offline badge appears/disappears with connectivity changes.
- [ ] Core UI remains usable in offline mode.

### T-019 Persist active cart and recover on refresh
- [ ] Save cart draft to local storage on changes.
- [ ] Rehydrate cart draft at app startup.
- [ ] Guard against corrupted storage payloads.

Validation:
- [ ] Refresh restores active sale.
- [ ] Invalid stored payload fails safely.

### T-020 Mark offline checkouts as pending sync
- [ ] Persist completed offline transactions locally.
- [ ] Mark receipts with `pendingSync` flag when offline.
- [ ] Show pending sync label in receipt/status view.

Validation:
- [ ] Offline checkout completes and is retained.
- [ ] Pending sync marker is visible.

## Phase 7: Hardening and Quality

### T-021 Keyboard-first workflow improvements
- [ ] Add focus management for search, barcode input, and checkout controls.
- [ ] Support Enter key flows for add/search/submit actions.
- [ ] Ensure tab order is logical.

Validation:
- [ ] Cashier can complete basic sale without mouse.
- [ ] No keyboard traps.

### T-022 Error states and messaging polish
- [ ] Standardize inline validation components.
- [ ] Add scanner error and payment error messages.
- [ ] Add fallback UI for unexpected component failures.

Validation:
- [ ] Error messages are clear and actionable.
- [ ] No uncaught runtime errors in normal flows.

### T-023 Unit and integration test coverage
- [ ] Add unit tests for totals, discounts, tax, and payment validation.
- [ ] Add integration test for end-to-end sale flow.
- [ ] Add integration test for offline sale and pending sync.

Validation:
- [ ] Test suite passes locally.
- [ ] Critical calculations are covered by tests.

## Phase 8: Final Verification

### T-024 Acceptance criteria walkthrough
- [ ] Map each user story from `requirements.md` to implemented behavior.
- [ ] Execute manual QA checklist for all acceptance criteria.
- [ ] Log any gaps and fix before completion.

Validation:
- [ ] All acceptance criteria satisfied or explicitly documented.
- [ ] POS flow is demo-ready for workshop evaluation.
