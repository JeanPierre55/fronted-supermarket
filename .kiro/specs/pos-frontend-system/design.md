# Diseño del Frontend POS

## 1. Propósito

Este documento define la arquitectura frontend y el flujo de datos para el terminal POS del supermercado, alineado con `requirements.md`.

## 2. Estilo Arquitectónico

- Tipo de aplicación: Single Page Application (SPA)
- Enfoque: Frontend modular orientado a funcionalidades
- Estrategia de estado:
  - Estado local de UI para preocupaciones solo de vista (modales, foco, entradas temporales)
  - Estado central de venta para el flujo de carrito/totales/proceso de pago
  - Persistencia local para continuidad sin conexión y recuperación tras actualización

## 3. Desglose de Módulos de Alto Nivel

1. `ProductCatalog`
- Entrada de búsqueda de productos
- Filtro de categoría
- Lista de resultados de productos
- Interacciones de agregar al carrito

2. `BarcodeScanner`
- Entrada manual de código de barras
- Lanzador/contenedor del escáner de cámara
- Manejo de errores del escáner y permisos

3. `Cart`
- Líneas de artículos del carrito
- Controles de cantidad
- Eliminar artículo
- Resumen del carrito (subtotal, descuentos, impuestos, total)

4. `Discounts`
- Editor de descuento por línea
- Editor de descuento del carrito
- Reglas de validación y conflicto

5. `Checkout`
- Selector de método de pago (efectivo, tarjeta, mixto)
- Entradas de monto de pago
- Cálculo de cambio
- Acción de confirmar pago

6. `Receipt`
- Detalle de transacción post-pago
- Acción de nueva venta

7. `OfflineSync`
- Indicador de estado en línea/sin conexión
- Persistencia de transacciones locales
- Marcador de sincronización pendiente

## 4. Árbol de Componentes Propuesto

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
    - `ReceiptModal` o `ReceiptPage`

## 5. Modelo de Datos del Dominio

### 5.1 Product

- `id: string`
- `barcode: string`
- `name: string`
- `category: string`
- `unitPrice: number`
- `taxable: boolean`
- `stock: number`

### 5.2 CartLine

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

### 5.3 CartTotals

- `subtotal: number`
- `lineDiscountTotal: number`
- `cartDiscountType: "percent" | "fixed" | null`
- `cartDiscountValue: number`
- `cartDiscountAmount: number`
- `discountTotal: number`
- `taxableBase: number`
- `taxAmount: number`
- `grandTotal: number`

### 5.4 Payment

- `method: "cash" | "card" | "mixed"`
- `cashReceived: number`
- `cardPaid: number`
- `totalPaid: number`
- `changeDue: number`

### 5.5 Receipt

- `transactionId: string`
- `createdAt: ISO string`
- `cashierLabel: string`
- `lines: CartLine[]`
- `totals: CartTotals`
- `payment: Payment`
- `pendingSync: boolean`

## 6. Diseño de Gestión de Estado

Slices del store principal:

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
- Flags de `ui` (escáner abierto, vista de recibo abierta)

Opciones de implementación sugeridas:
- React Context + reducer para simplicidad en el taller, o librería de store ligera.
- Los totales derivados deben recomputarse a través de funciones utilitarias puras, no mutados manualmente.

## 7. Flujos de Datos Principales

### 7.1 Búsqueda / Filtro de Productos

1. El cajero escribe en la barra de búsqueda.
2. `searchTerm` se actualiza.
3. El selector filtra productos por:
   - coincidencia parcial de nombre sin distinción de mayúsculas/minúsculas
   - categoría seleccionada
4. `ProductList` se re-renderiza con los artículos filtrados.

### 7.2 Agregar por Código de Barras (Manual)

1. El cajero ingresa el código de barras.
2. Búsqueda por código de barras exacto en el índice local de productos.
3. Si se encuentra:
   - agregar línea o incrementar cantidad
   - recomputar totales
   - limpiar entrada de código de barras
4. Si no se encuentra:
   - mostrar error de validación al usuario.

### 7.3 Agregar por Cámara

1. El cajero abre el modal del escáner.
2. El navegador solicita permiso de cámara.
3. En escaneo exitoso:
   - parsear valor del código de barras
   - ejecutar el mismo flujo que la adición manual por código de barras
   - cerrar escáner (configurable)
4. En permiso denegado / tiempo de espera de escaneo:
   - mostrar estado de reintento/ayuda
   - mantener el carrito actual sin cambios.

### 7.4 Recálculo del Carrito y Totales

Cualquiera de estos desencadena el recomputo de totales:
- agregar línea
- eliminar línea
- cambio de cantidad
- cambio de descuento de línea
- cambio de descuento del carrito

Orden de recálculo:
1. Calcular subtotal de línea antes del descuento.
2. Aplicar descuento de línea con piso en 0.
3. Agregar líneas con descuento en subtotal.
4. Aplicar descuento del carrito con piso en 0.
5. Calcular base gravable.
6. Calcular impuesto desde la tasa de impuesto configurable.
7. Redondear salidas a 2 decimales.

### 7.5 Proceso de Pago

1. El cajero selecciona el método de pago.
2. Ingresa los montos de pago.
3. La validación verifica `totalPaid >= grandTotal`.
4. Al confirmar:
   - crear id de transacción y marca de tiempo
   - construir objeto de recibo
   - persistir transacción localmente
   - marcar `pendingSync` si está sin conexión
   - limpiar carrito activo
   - mostrar pantalla de recibo.

## 8. Estrategia de Sin Conexión y Persistencia

Datos a persistir localmente:
- catálogo de productos en caché
- borrador del carrito activo
- transacciones sin conexión pendientes
- configuración de la app (tasa de impuesto, etiqueta de moneda)

Almacenamiento:
- `localStorage` para el alcance del taller
- ruta de migración opcional a IndexedDB para conjuntos de datos más grandes

Comportamiento sin conexión:
- Los flujos principales (búsqueda desde caché, adición por código de barras, carrito, pago, recibo) continúan sin red.
- `isOffline` detectado mediante eventos online del navegador + fallback de heartbeat opcional.

Comportamiento de recuperación:
- Al recargar, restaurar el carrito activo si el pago no se completó.
- Al reconectarse, mantener las transacciones pendientes marcadas para el pipeline de sincronización futuro.

## 9. Validación y Manejo de Errores

Reglas de validación:
- La entrada de código de barras no puede estar vacía al enviar.
- La cantidad mínima es 1 para líneas activas.
- Los valores de descuento no pueden producir montos negativos de línea/carrito.
- El proceso de pago se bloquea hasta que el pago sea suficiente.

Visualización de errores:
- Errores de formulario en línea para problemas de entrada.
- Alerta/toast no bloqueante para problemas de escáner/cámara.
- Insignia de estado persistente para el modo sin conexión.

## 10. Consideraciones de Rendimiento y UX

- Memoizar selectores de productos filtrados para hasta 5,000 productos.
- Debounce de entrada de búsqueda (100-150 ms) para reducir renders innecesarios.
- Mantener ruta de teclado primero:
  - el foco comienza en la búsqueda
  - Enter agrega el producto resaltado
  - envío de entrada de código de barras mediante Enter
  - confirmación de pago alcanzable sin ratón

## 11. Estrategia de Pruebas (Nivel de Diseño)

1. Pruebas unitarias
   - utilidades de cálculo de totales
   - casos extremos de descuento e impuesto
   - validación de pago y cálculo de cambio

2. Pruebas de componentes
   - comportamiento de filtrado del catálogo
   - actualizaciones de cantidad/línea del carrito
   - estados de validación del proceso de pago

3. Pruebas de integración
   - flujo de venta completo desde búsqueda hasta recibo
   - venta sin conexión marcada como sincronización pendiente

## 12. Notas de Implementación para Kiro

- Construir funcionalidad por funcionalidad siguiendo la secuencia de `tasks.md`.
- Mantener la lógica de negocio en funciones/hooks utilitarios reutilizables.
- Evitar incrustar lógica de cálculo directamente en componentes de presentación.
- Mantener tipado estricto para modelos de dominio para reducir regresiones en pago/totales.
