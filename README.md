# supermarket-pos-frontend

Frontend POS (Point of Sale) for supermarket cashier workflows, built from SDD specs.

## Implemented Features

- Product search by name and category
- Manual barcode entry
- Camera barcode scanning (browser `BarcodeDetector` when available)
- Real-time cart updates
- Line and cart discounts (percent/fixed)
- Tax calculation after discounts
- Checkout with cash, card, and mixed payment methods
- Digital receipt generation
- Offline mode indicator
- Local persistence for active sale and pending offline transactions

## Project Structure

- `specs/requirements.md`
- `specs/design.md`
- `specs/tasks.md`
- `src/` frontend implementation
- `src/utils/*.test.ts` unit tests for totals and payment validation

## Run Locally

Requirements:
- Node.js 20+
- npm 10+

Commands:

```bash
npm install
npm run dev
```

Build and tests:

```bash
npm run build
npm run test
```

## Notes

- Camera scanning uses the browser camera API and `BarcodeDetector` support.
- If `BarcodeDetector` is unavailable, manual barcode entry remains fully supported.
