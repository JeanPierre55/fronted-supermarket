import { useEffect, useMemo, useReducer } from "react";
import "./styles.css";
import { TAX_RATE, STORAGE_KEYS } from "./constants";
import { BarcodeSection } from "./components/BarcodeSection";
import { CartPanel } from "./components/CartPanel";
import { CatalogPanel } from "./components/CatalogPanel";
import { CheckoutPanel } from "./components/CheckoutPanel";
import { ReceiptView } from "./components/ReceiptView";
import { StatusBar } from "./components/StatusBar";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { buildInitialState } from "./state/initialState";
import { posReducer } from "./state/posReducer";
import type { PosState, Receipt } from "./types";
import { getPaymentValidation } from "./utils/payment";
import { loadJSON, saveJSON } from "./utils/storage";
import { calculateTotals } from "./utils/totals";

interface ActiveSaleStorage {
  searchTerm: string;
  selectedCategory: string;
  cartLines: PosState["cartLines"];
  cartDiscountType: PosState["cartDiscountType"];
  cartDiscountValue: number;
  paymentDraft: PosState["paymentDraft"];
}

export default function App() {
  const [state, dispatch] = useReducer(posReducer, undefined, buildInitialState);
  const isOnline = useOnlineStatus();

  const totals = useMemo(
    () => calculateTotals(state.cartLines, state.cartDiscountType, state.cartDiscountValue, TAX_RATE),
    [state.cartLines, state.cartDiscountType, state.cartDiscountValue]
  );

  const paymentValidation = useMemo(
    () => getPaymentValidation(state.paymentDraft, totals.grandTotal),
    [state.paymentDraft, totals.grandTotal]
  );

  useEffect(() => {
    dispatch({ type: "set-offline", payload: !isOnline });
  }, [isOnline]);

  useEffect(() => {
    const activeSale = loadJSON<ActiveSaleStorage | null>(STORAGE_KEYS.activeSale, null);
    const pending = loadJSON<Receipt[]>(STORAGE_KEYS.pendingTransactions, []);

    if (activeSale) {
      dispatch({ type: "restore-active-sale", payload: activeSale });
    }

    if (Array.isArray(pending)) {
      dispatch({ type: "restore-pending", payload: pending });
    }
  }, []);

  useEffect(() => {
    const payload: ActiveSaleStorage = {
      searchTerm: state.searchTerm,
      selectedCategory: state.selectedCategory,
      cartLines: state.cartLines,
      cartDiscountType: state.cartDiscountType,
      cartDiscountValue: state.cartDiscountValue,
      paymentDraft: state.paymentDraft
    };

    saveJSON(STORAGE_KEYS.activeSale, payload);
  }, [state.searchTerm, state.selectedCategory, state.cartLines, state.cartDiscountType, state.cartDiscountValue, state.paymentDraft]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.pendingTransactions, state.pendingTransactions);
  }, [state.pendingTransactions]);

  return (
    <div className="app-shell">
      <StatusBar isOffline={state.isOffline} pendingTransactions={state.pendingTransactions.length} />

      <main className="layout-grid">
        <div className="left-column">
          <CatalogPanel
            products={state.products}
            searchTerm={state.searchTerm}
            selectedCategory={state.selectedCategory}
            onSearchTermChange={(value) => dispatch({ type: "set-search-term", payload: value })}
            onCategoryChange={(value) => dispatch({ type: "set-category", payload: value })}
            onAddProduct={(product) => dispatch({ type: "add-product", payload: product })}
          />

          <BarcodeSection
            value={state.manualBarcode}
            error={state.barcodeError}
            isScannerOpen={state.isScannerOpen}
            cameraError={state.cameraError}
            onValueChange={(value) => dispatch({ type: "set-manual-barcode", payload: value })}
            onSubmit={() => {
              if (!state.manualBarcode.trim()) {
                dispatch({ type: "set-barcode-error", payload: "Please enter a barcode first." });
                return;
              }
              dispatch({ type: "add-by-barcode", payload: state.manualBarcode });
            }}
            onOpenScanner={() => dispatch({ type: "toggle-scanner", payload: true })}
            onCloseScanner={() => dispatch({ type: "toggle-scanner", payload: false })}
            onDetected={(barcode) => dispatch({ type: "add-by-barcode", payload: barcode })}
            onCameraError={(error) => dispatch({ type: "set-camera-error", payload: error })}
          />
        </div>

        <div className="right-column">
          <CartPanel
            lines={state.cartLines}
            totals={totals}
            cartDiscountType={state.cartDiscountType}
            cartDiscountValue={state.cartDiscountValue}
            onSetQuantity={(productId, quantity) => dispatch({ type: "set-line-quantity", payload: { productId, quantity } })}
            onRemove={(productId) => dispatch({ type: "remove-line", payload: productId })}
            onSetLineDiscount={(productId, type, value) =>
              dispatch({ type: "set-line-discount", payload: { productId, type, value } })
            }
            onSetCartDiscount={(type, value) => dispatch({ type: "set-cart-discount", payload: { type, value } })}
          />

          <CheckoutPanel
            payment={state.paymentDraft}
            grandTotal={totals.grandTotal}
            isValid={paymentValidation.isValid}
            changeDue={paymentValidation.changeDue}
            onMethodChange={(method) => dispatch({ type: "set-payment-method", payload: method })}
            onPaymentChange={(payload) => dispatch({ type: "set-payment-values", payload })}
            onComplete={() => dispatch({ type: "complete-checkout", payload: { taxRate: TAX_RATE } })}
          />
        </div>
      </main>

      {state.lastReceipt ? <ReceiptView receipt={state.lastReceipt} onNewSale={() => dispatch({ type: "start-new-sale" })} /> : null}
    </div>
  );
}
