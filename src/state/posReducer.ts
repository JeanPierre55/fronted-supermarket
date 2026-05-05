import { CASHIER_LABEL } from "../constants";
import type { CartLine, DiscountType, PaymentMethod, PosState, Product, Receipt } from "../types";
import { calculateTotals } from "../utils/totals";
import { getPaymentValidation } from "../utils/payment";

interface CheckoutPayload {
  taxRate: number;
}

type PosAction =
  | { type: "set-search-term"; payload: string }
  | { type: "set-category"; payload: string }
  | { type: "set-manual-barcode"; payload: string }
  | { type: "set-barcode-error"; payload: string | null }
  | { type: "toggle-scanner"; payload: boolean }
  | { type: "set-camera-error"; payload: string | null }
  | { type: "add-product"; payload: Product }
  | { type: "add-by-barcode"; payload: string }
  | { type: "remove-line"; payload: string }
  | { type: "set-line-quantity"; payload: { productId: string; quantity: number } }
  | { type: "set-line-discount"; payload: { productId: string; type: DiscountType; value: number } }
  | { type: "set-cart-discount"; payload: { type: DiscountType; value: number } }
  | { type: "set-payment-method"; payload: PaymentMethod }
  | { type: "set-payment-values"; payload: { cashReceived?: number; cardPaid?: number } }
  | { type: "set-offline"; payload: boolean }
  | { type: "restore-active-sale"; payload: Partial<PosState> }
  | { type: "restore-pending"; payload: Receipt[] }
  | { type: "complete-checkout"; payload: CheckoutPayload }
  | { type: "start-new-sale" };

function mergeProduct(lines: CartLine[], product: Product): CartLine[] {
  const index = lines.findIndex((line) => line.productId === product.id);
  if (index === -1) {
    return [
      ...lines,
      {
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        unitPrice: product.unitPrice,
        quantity: 1,
        taxable: product.taxable,
        lineDiscountType: null,
        lineDiscountValue: 0
      }
    ];
  }

  return lines.map((line) => {
    if (line.productId !== product.id) {
      return line;
    }
    return {
      ...line,
      quantity: line.quantity + 1
    };
  });
}

function findByBarcode(products: Product[], barcode: string): Product | undefined {
  return products.find((product) => product.barcode === barcode.trim());
}

function buildTransactionId(): string {
  return `TX-${Date.now()}`;
}

export function posReducer(state: PosState, action: PosAction): PosState {
  switch (action.type) {
    case "set-search-term":
      return { ...state, searchTerm: action.payload };
    case "set-category":
      return { ...state, selectedCategory: action.payload };
    case "set-manual-barcode":
      return { ...state, manualBarcode: action.payload, barcodeError: null };
    case "set-barcode-error":
      return { ...state, barcodeError: action.payload };
    case "toggle-scanner":
      return { ...state, isScannerOpen: action.payload, cameraError: null };
    case "set-camera-error":
      return { ...state, cameraError: action.payload };
    case "add-product":
      return {
        ...state,
        cartLines: mergeProduct(state.cartLines, action.payload),
        barcodeError: null
      };
    case "add-by-barcode": {
      const product = findByBarcode(state.products, action.payload);
      if (!product) {
        return {
          ...state,
          barcodeError: "Barcode not found"
        };
      }

      return {
        ...state,
        cartLines: mergeProduct(state.cartLines, product),
        manualBarcode: "",
        barcodeError: null
      };
    }
    case "remove-line":
      return {
        ...state,
        cartLines: state.cartLines.filter((line) => line.productId !== action.payload)
      };
    case "set-line-quantity":
      return {
        ...state,
        cartLines: state.cartLines
          .map((line) => {
            if (line.productId !== action.payload.productId) {
              return line;
            }
            return {
              ...line,
              quantity: Math.max(1, action.payload.quantity)
            };
          })
          .filter((line) => line.quantity > 0)
      };
    case "set-line-discount":
      return {
        ...state,
        cartLines: state.cartLines.map((line) => {
          if (line.productId !== action.payload.productId) {
            return line;
          }
          return {
            ...line,
            lineDiscountType: action.payload.type,
            lineDiscountValue: Math.max(0, action.payload.value)
          };
        })
      };
    case "set-cart-discount":
      return {
        ...state,
        cartDiscountType: action.payload.type,
        cartDiscountValue: Math.max(0, action.payload.value)
      };
    case "set-payment-method":
      return {
        ...state,
        paymentDraft: {
          method: action.payload,
          cashReceived: action.payload === "card" ? 0 : state.paymentDraft.cashReceived,
          cardPaid: action.payload === "cash" ? 0 : state.paymentDraft.cardPaid
        }
      };
    case "set-payment-values":
      return {
        ...state,
        paymentDraft: {
          ...state.paymentDraft,
          cashReceived: action.payload.cashReceived ?? state.paymentDraft.cashReceived,
          cardPaid: action.payload.cardPaid ?? state.paymentDraft.cardPaid
        }
      };
    case "set-offline":
      return {
        ...state,
        isOffline: action.payload
      };
    case "restore-active-sale":
      return {
        ...state,
        ...action.payload,
        products: state.products,
        isOffline: state.isOffline,
        pendingTransactions: state.pendingTransactions,
        lastReceipt: state.lastReceipt
      };
    case "restore-pending":
      return {
        ...state,
        pendingTransactions: action.payload
      };
    case "complete-checkout": {
      const totals = calculateTotals(state.cartLines, state.cartDiscountType, state.cartDiscountValue, action.payload.taxRate);
      const paymentCheck = getPaymentValidation(state.paymentDraft, totals.grandTotal);

      if (!paymentCheck.isValid || state.cartLines.length === 0) {
        return state;
      }

      const receipt: Receipt = {
        transactionId: buildTransactionId(),
        createdAt: new Date().toISOString(),
        cashierLabel: CASHIER_LABEL,
        lines: state.cartLines,
        totals,
        payment: {
          method: state.paymentDraft.method,
          cashReceived: state.paymentDraft.cashReceived,
          cardPaid: state.paymentDraft.cardPaid,
          totalPaid: paymentCheck.totalPaid,
          changeDue: paymentCheck.changeDue
        },
        pendingSync: state.isOffline
      };

      return {
        ...state,
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
        lastReceipt: receipt,
        pendingTransactions: receipt.pendingSync ? [...state.pendingTransactions, receipt] : state.pendingTransactions
      };
    }
    case "start-new-sale":
      return {
        ...state,
        lastReceipt: null,
        manualBarcode: "",
        barcodeError: null,
        cameraError: null,
        isScannerOpen: false
      };
    default:
      return state;
  }
}

export type { PosAction };
