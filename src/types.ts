export type DiscountType = "percent" | "fixed" | null;

export type PaymentMethod = "cash" | "card" | "mixed";

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  unitPrice: number;
  taxable: boolean;
  stock: number;
}

export interface CartLine {
  productId: string;
  name: string;
  barcode: string;
  unitPrice: number;
  quantity: number;
  taxable: boolean;
  lineDiscountType: DiscountType;
  lineDiscountValue: number;
}

export interface PaymentDraft {
  method: PaymentMethod;
  cashReceived: number;
  cardPaid: number;
}

export interface CartTotals {
  subtotal: number;
  lineDiscountTotal: number;
  cartDiscountAmount: number;
  discountTotal: number;
  taxableBase: number;
  taxAmount: number;
  grandTotal: number;
}

export interface Receipt {
  transactionId: string;
  createdAt: string;
  cashierLabel: string;
  lines: CartLine[];
  totals: CartTotals;
  payment: {
    method: PaymentMethod;
    cashReceived: number;
    cardPaid: number;
    totalPaid: number;
    changeDue: number;
  };
  pendingSync: boolean;
}

export interface PosState {
  products: Product[];
  searchTerm: string;
  selectedCategory: string;
  cartLines: CartLine[];
  cartDiscountType: DiscountType;
  cartDiscountValue: number;
  paymentDraft: PaymentDraft;
  manualBarcode: string;
  barcodeError: string | null;
  isScannerOpen: boolean;
  cameraError: string | null;
  isOffline: boolean;
  pendingTransactions: Receipt[];
  lastReceipt: Receipt | null;
}
