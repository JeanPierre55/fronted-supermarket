import type { Product } from "../types";

export const products: Product[] = [
  { id: "1", barcode: "770100100001", name: "Arroz Premium 1kg", category: "Pantry", unitPrice: 5200, taxable: false, stock: 80 },
  { id: "2", barcode: "770100100002", name: "Aceite Vegetal 1L", category: "Pantry", unitPrice: 13900, taxable: true, stock: 60 },
  { id: "3", barcode: "770100100003", name: "Leche Entera 1L", category: "Dairy", unitPrice: 4300, taxable: false, stock: 120 },
  { id: "4", barcode: "770100100004", name: "Queso Campesino 500g", category: "Dairy", unitPrice: 12100, taxable: true, stock: 45 },
  { id: "5", barcode: "770100100005", name: "Manzana Roja x Kg", category: "Produce", unitPrice: 6900, taxable: false, stock: 95 },
  { id: "6", barcode: "770100100006", name: "Banano x Kg", category: "Produce", unitPrice: 3900, taxable: false, stock: 110 },
  { id: "7", barcode: "770100100007", name: "Pechuga de Pollo 1kg", category: "Meat", unitPrice: 18900, taxable: true, stock: 55 },
  { id: "8", barcode: "770100100008", name: "Jabon Liquido 900ml", category: "Home Care", unitPrice: 10400, taxable: true, stock: 38 },
  { id: "9", barcode: "770100100009", name: "Papel Higienico x12", category: "Home Care", unitPrice: 17300, taxable: true, stock: 70 },
  { id: "10", barcode: "770100100010", name: "Gaseosa Cola 1.5L", category: "Beverages", unitPrice: 5600, taxable: true, stock: 90 },
  { id: "11", barcode: "770100100011", name: "Agua Mineral 600ml", category: "Beverages", unitPrice: 2200, taxable: true, stock: 200 },
  { id: "12", barcode: "770100100012", name: "Huevos AA x30", category: "Dairy", unitPrice: 16800, taxable: false, stock: 75 }
];
