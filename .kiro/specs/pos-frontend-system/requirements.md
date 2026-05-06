# Documento de Requisitos — Sistema POS Frontend

## 1. Descripción General

Este documento define los requisitos funcionales y no funcionales para el frontend de un punto de venta (POS) de supermercado utilizado por cajeros.

## 2. Alcance

El frontend POS debe permitir a los cajeros:
- Buscar productos por nombre o categoría
- Escanear códigos de barras de productos (entrada manual y escaneo por cámara)
- Gestionar un carrito de compras en tiempo real
- Aplicar descuentos y calcular impuestos
- Procesar el pago con múltiples métodos de pago
- Generar y mostrar un recibo digital
- Continuar operaciones principales en modo sin conexión

Fuera del alcance de esta fase:
- Actualizaciones de inventario al ERP central
- Autenticación/autorización de usuarios
- Integración con impresora de hardware

## 3. Actores

- Cajero: Usuario principal que opera el terminal POS
- Cliente: Destinatario de la venta y el recibo

## 4. Historias de Usuario y Criterios de Aceptación

### US-01 Búsqueda de Producto por Nombre
Como cajero, quiero buscar productos por nombre para poder agregar artículos al carrito rápidamente.

Criterios de Aceptación:
1. Dado que existe al menos 1 producto, cuando el cajero escribe 2 o más caracteres en el campo de búsqueda, los productos coincidentes se listan en menos de 300 ms en condiciones normales.
2. La coincidencia no distingue mayúsculas/minúsculas y admite texto parcial.
3. Si no hay productos coincidentes, la UI muestra un mensaje de estado vacío claro.
4. Los resultados de búsqueda incluyen: nombre del producto, categoría, precio e indicador de stock.

### US-02 Filtro de Producto por Categoría
Como cajero, quiero filtrar productos por categoría para encontrar productos más rápido.

Criterios de Aceptación:
1. Cuando se selecciona una categoría, solo se muestran los productos de esa categoría.
2. Cuando se selecciona "Todos", se muestran productos de todas las categorías.
3. El filtro de categoría funciona junto con la búsqueda por nombre (comportamiento de intersección).

### US-03 Escaneo de Código de Barras (Entrada Manual)
Como cajero, quiero ingresar un código de barras manualmente para agregar productos cuando el hardware del escáner no está disponible.

Criterios de Aceptación:
1. Cuando se ingresa y envía un código de barras válido, el producto relacionado se agrega al carrito.
2. Si el producto ya existe en el carrito, la cantidad se incrementa en 1.
3. Si el código de barras es desconocido, se muestra un mensaje de error visible.
4. El campo de código de barras se limpia después de una adición exitosa.

### US-04 Escaneo de Código de Barras (Cámara)
Como cajero, quiero escanear un código de barras usando la cámara del dispositivo para agilizar el proceso de pago.

Criterios de Aceptación:
1. El cajero puede abrir y cerrar el escáner de cámara desde la UI.
2. En un escaneo exitoso, el producto coincidente se agrega al carrito.
3. Si se deniega el permiso de cámara, la UI muestra orientación accionable.
4. Si el escaneo falla durante 3 segundos, el cajero puede reintentar sin recargar la página.

### US-05 Actualizaciones del Carrito en Tiempo Real
Como cajero, quiero ver las actualizaciones del carrito al instante para mantener la precisión en el proceso de pago.

Criterios de Aceptación:
1. El carrito muestra nombre del producto, precio unitario, cantidad, subtotal de línea.
2. La cantidad puede incrementarse/decrementarse desde la UI del carrito.
3. Eliminar un artículo actualiza los totales inmediatamente.
4. Los totales del carrito se recalculan en tiempo real después de cada acción.

### US-06 Descuentos
Como cajero, quiero aplicar descuentos para que los precios promocionales se reflejen.

Criterios de Aceptación:
1. El cajero puede aplicar descuento por línea de artículo o descuento en todo el carrito.
2. El descuento puede ser porcentaje o valor fijo.
3. El descuento no puede reducir el subtotal de línea o carrito por debajo de cero.
4. Los descuentos aplicados se detallan visiblemente en la sección de totales.

### US-07 Cálculo de Impuestos
Como cajero, quiero que los impuestos se calculen automáticamente para que la facturación final sea correcta.

Criterios de Aceptación:
1. El impuesto se calcula sobre el subtotal gravable después de los descuentos.
2. La tasa de impuesto es configurable desde la configuración/constantes de la app.
3. La UI muestra subtotal, total de descuentos, base gravable, total de impuesto, total general.
4. Los valores monetarios se redondean a 2 decimales usando redondeo estándar.

### US-08 Múltiples Métodos de Pago
Como cajero, quiero procesar diferentes métodos de pago para completar más transacciones.

Criterios de Aceptación:
1. Métodos soportados: efectivo, tarjeta, mixto.
2. Para pagos en efectivo, el cajero ingresa el monto recibido.
3. Para efectivo, el sistema calcula el cambio a devolver.
4. El proceso de pago se bloquea hasta que el monto de pago cubra el total general.

### US-09 Recibo Digital
Como cajero, quiero que se genere un recibo digital después del pago para que los detalles del cliente estén disponibles.

Criterios de Aceptación:
1. Al completar el pago, se muestra la vista del recibo.
2. El recibo incluye: id de transacción, fecha/hora, id/nombre del cajero, lista de artículos, totales, método de pago, monto pagado, cambio.
3. El cajero puede iniciar una nueva venta desde la pantalla del recibo.

### US-10 Operaciones Principales Sin Conexión
Como cajero, quiero que las operaciones principales funcionen sin conexión para poder seguir vendiendo durante una pérdida de conexión.

Criterios de Aceptación:
1. La búsqueda de productos (desde datos en caché), adición por código de barras y gestión del carrito funcionan sin red.
2. La UI indica claramente el modo sin conexión.
3. Si el proceso de pago requiere confirmación en línea en versiones futuras, la versión actual aún permite la finalización local y marca la transacción como "pendiente de sincronización".
4. No se pierden datos al cambiar entre en línea y sin conexión durante una venta activa.

## 5. Requisitos No Funcionales

1. Rendimiento:
- Respuesta de búsqueda en menos de 300 ms para un conjunto de datos de hasta 5,000 productos en el dispositivo objetivo.
- Las interacciones del carrito actualizan la UI en menos de 100 ms para hasta 100 líneas de carrito.

2. Confiabilidad:
- Sin errores de tiempo de ejecución no capturados durante los flujos normales del cajero.
- El estado persiste durante una actualización accidental de la pestaña (recuperación del carrito activo).

3. Usabilidad:
- Flujo amigable con el teclado para la velocidad del cajero (búsqueda, agregar, pagar).
- Mensajes de error claros para problemas de escaneo, pago y validación.

4. Mantenibilidad:
- Estructura de componentes modular con hooks/servicios de lógica de negocio reutilizables.
- Cobertura de pruebas unitarias para cálculos principales (totales, descuentos, impuestos, cambio).

## 6. Restricciones y Suposiciones

- Implementación frontend primero con fuente de datos de productos simulada/local.
- El formato de moneda está fijo en COP para el alcance del taller.
- El escaneo por cámara depende de la compatibilidad del navegador y el soporte de permisos.

## 7. Definición de Completado (Nivel de Requisitos)

Este documento de requisitos está completo cuando:
1. Cada flujo de trabajo principal tiene al menos una historia de usuario.
2. Cada historia de usuario tiene criterios de aceptación concretos y verificables.
3. El comportamiento sin conexión para las operaciones principales está explícitamente definido.
4. La lógica de pago y totales está completamente especificada para la implementación.
