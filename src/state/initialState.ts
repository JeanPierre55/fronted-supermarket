import { products } from "../data/products";
import type { PosState } from "../types";

export function buildInitialState(): PosState {
  return {
    products,
    searchTerm: "",
    selectedCategory: "All",
    cartLines: [],
    cartDiscountType: null,
    cartDiscountValue: 0,
    paymentDraft: {
      method: "cash",
      cashReceived: 0,
      cardPaid: 0
    },
    manualBarcode: "",
    barcodeError: null,
    isScannerOpen: false,
    cameraError: null,
    isOffline: !navigator.onLine,
    pendingTransactions: [],
    lastReceipt: null
  };
}
