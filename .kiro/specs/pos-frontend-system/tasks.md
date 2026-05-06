# Lista de Tareas de Implementación del POS Frontend

Esta lista de tareas está diseñada para una implementación incremental y verificable alineada con `requirements.md` y `design.md`.

## Leyenda
- [ ] Pendiente
- [x] Completado

## Fase 0: Fundación del Proyecto

### T-001 Inicializar la estructura base de la app
- [x] Crear estructura base del proyecto y contenedores del layout de la app.
- [x] Agregar secciones para catálogo, carrito, proceso de pago y barra de estado.
- [x] Configurar estilos básicos y layout responsivo.

Validación:
- [x] La app se ejecuta localmente sin errores de tiempo de ejecución.
- [x] El layout se renderiza en anchos de escritorio y móvil.

### T-002 Definir modelos de dominio y constantes
- [x] Crear tipos/interfaces para Product, CartLine, CartTotals, Payment, Receipt.
- [x] Agregar constantes para tasa de impuesto, moneda y métodos de pago.
- [x] Agregar utilidad para redondeo de dinero a 2 decimales.

Validación:
- [x] Las verificaciones de tipo pasan.
- [x] Las pruebas unitarias para redondeo pasan.

## Fase 1: Catálogo de Productos y Búsqueda

### T-003 Implementar fuente de datos de productos y bootstrap de caché
- [x] Agregar conjunto de datos de productos simulados.
- [x] Construir abstracción de repositorio/servicio de productos.
- [x] Cargar productos en el estado de la aplicación al inicio.

Validación:
- [x] La lista de productos se renderiza desde la fuente local.
- [x] La recarga mantiene el catálogo disponible sin conexión.

### T-004 Construir búsqueda por nombre
- [x] Agregar entrada de búsqueda en el panel del catálogo.
- [x] Implementar filtrado de coincidencia parcial sin distinción de mayúsculas/minúsculas.
- [x] Agregar mensaje de estado vacío para sin resultados.

Validación:
- [x] Escribir 2+ caracteres filtra los resultados correctamente.
- [x] La respuesta de búsqueda se siente inmediata para el conjunto de datos de muestra.

### T-005 Construir filtro de categoría y filtrado combinado
- [x] Agregar selector de categoría con opción "Todos".
- [x] Filtrar productos por categoría seleccionada.
- [x] Combinar filtros de nombre y categoría (intersección).

Validación:
- [x] El filtro de categoría funciona de forma independiente.
- [x] El filtro combinado devuelve solo los resultados de intersección coincidentes.

## Fase 2: Núcleo del Carrito

### T-006 Implementar store del carrito y renderizado de líneas
- [x] Crear slice/reducer/hooks del estado del carrito.
- [x] Renderizar lista de líneas del carrito con nombre, precio unitario, cantidad, subtotal de línea.
- [x] Agregar scaffold de sección de totales derivados.

Validación:
- [x] Agregar/eliminar líneas actualiza la UI.
- [x] El carrito muestra los campos requeridos correctamente.

### T-007 Implementar agregar al carrito desde la lista de productos
- [x] Agregar acción "Agregar" en cada fila/tarjeta de producto.
- [x] Agregar nueva línea si el producto no está presente.
- [x] Incrementar cantidad si el producto ya está en el carrito.

Validación:
- [x] Las adiciones de productos duplicados incrementan la cantidad.
- [x] El carrito se actualiza inmediatamente después de agregar.

### T-008 Implementar controles de cantidad y eliminar artículo
- [x] Agregar controles de incremento/decremento.
- [x] Evitar que la cantidad caiga por debajo de 1.
- [x] Agregar acción de eliminar por línea.

Validación:
- [x] Los cambios de cantidad recomputan el subtotal de línea y los totales.
- [x] La acción de eliminar actualiza los totales al instante.

## Fase 3: Escaneo de Código de Barras

### T-009 Implementar flujo de entrada manual de código de barras
- [x] Agregar entrada de código de barras + acción de envío.
- [x] Buscar producto por código de barras exacto.
- [x] Reutilizar lógica de agregar al carrito en coincidencia.
- [x] Mostrar error cuando el código de barras es desconocido.

Validación:
- [x] El código de barras válido agrega/incrementa la línea del carrito.
- [x] El código de barras desconocido muestra un error claro.
- [x] La entrada se limpia después de una adición exitosa.

### T-010 Integrar componente de escáner de cámara
- [x] Agregar controles de apertura/cierre del modal del escáner.
- [x] Integrar flujo de permiso de cámara del navegador.
- [x] Decodificar código de barras y despachar agregar al carrito.
- [x] Manejar permiso denegado y estado de UI de reintento.

Validación:
- [x] El escaneo exitoso agrega el producto al carrito.
- [x] La denegación de permiso muestra orientación accionable.
- [x] El reintento funciona sin recarga completa de la página.

## Fase 4: Descuentos y Totales

### T-011 Implementar utilidades de cálculo de totales
- [x] Construir funciones puras para subtotal, base gravable, impuesto, total general.
- [x] Aplicar redondeo determinístico a 2 decimales.
- [x] Centralizar el pipeline de recálculo en un módulo.

Validación:
- [x] Las pruebas unitarias cubren casos normales y extremos.
- [x] Los totales son estables y consistentes después de ediciones repetidas.

### T-012 Implementar descuentos por línea
- [x] Agregar controles de descuento por línea (porcentaje/fijo).
- [x] Validar resultados no negativos.
- [x] Reflejar el monto de descuento de línea en los totales.

Validación:
- [x] El descuento no puede reducir la línea por debajo de cero.
- [x] El subtotal de línea con descuento se muestra correctamente.

### T-013 Implementar descuentos a nivel de carrito
- [x] Agregar controles de descuento del carrito (porcentaje/fijo).
- [x] Aplicar después de los descuentos a nivel de línea.
- [x] Aplicar subtotal de carrito no negativo.

Validación:
- [x] El descuento del carrito aparece detallado.
- [x] Las matemáticas de descuento combinado coinciden con los valores esperados.

### T-014 Aplicar cálculo de impuesto después de descuentos
- [x] Calcular impuesto sobre la base gravable después de todos los descuentos.
- [x] Usar tasa de impuesto configurable.
- [x] Mostrar subtotal, descuentos, base gravable, impuesto, total general.

Validación:
- [x] Los valores de impuesto coinciden con los fixtures de prueba.
- [x] Los totales mostrados coinciden con las salidas de las utilidades.

## Fase 5: Proceso de Pago y Recibo

### T-015 Implementar selección de método de pago
- [x] Agregar opciones de pago: efectivo, tarjeta, mixto.
- [x] Mostrar entradas contextuales según el método seleccionado.
- [x] Persistir el estado del borrador de pago mientras se edita.

Validación:
- [x] El cambio de método actualiza las entradas visibles correctamente.
- [x] Ningún valor obsoleto causa totales inválidos.

### T-016 Implementar validación de pago y cálculo de cambio
- [x] Validar que el total pagado cubra el total general.
- [x] Para efectivo y mixto, calcular el cambio a devolver.
- [x] Deshabilitar confirmar pago hasta que sea válido.

Validación:
- [x] El pago insuficiente bloquea el proceso de pago.
- [x] El cambio a devolver es correcto para el pago en exceso.

### T-017 Implementar finalización del proceso de pago y generación de recibo
- [x] Crear id de transacción y marca de tiempo al confirmar.
- [x] Construir objeto de recibo desde carrito + totales + pago.
- [x] Limpiar carrito activo y mostrar vista de recibo.

Validación:
- [x] El recibo incluye todos los campos requeridos.
- [x] La acción de nueva venta restablece el estado de la UI limpiamente.

## Fase 6: Sin Conexión y Persistencia

### T-018 Agregar detección de estado sin conexión e indicador de UI
- [x] Escuchar eventos online/offline del navegador.
- [x] Almacenar `isOffline` en el estado de la app.
- [x] Mostrar insignia de sin conexión persistente.

Validación:
- [x] La insignia de sin conexión aparece/desaparece con los cambios de conectividad.
- [x] La UI principal permanece utilizable en modo sin conexión.

### T-019 Persistir carrito activo y recuperar al recargar
- [x] Guardar borrador del carrito en almacenamiento local en los cambios.
- [x] Rehidratar el borrador del carrito al inicio de la app.
- [x] Proteger contra cargas de almacenamiento corruptas.

Validación:
- [x] La recarga restaura la venta activa.
- [x] El payload almacenado inválido falla de forma segura.

### T-020 Marcar pagos sin conexión como sincronización pendiente
- [x] Persistir transacciones sin conexión completadas localmente.
- [x] Marcar recibos con flag `pendingSync` cuando está sin conexión.
- [x] Mostrar etiqueta de sincronización pendiente en la vista de recibo/estado.

Validación:
- [x] El pago sin conexión se completa y se retiene.
- [x] El marcador de sincronización pendiente es visible.

## Fase 7: Robustez y Calidad

### T-021 Mejoras de flujo de trabajo con teclado primero
- [x] Agregar gestión de foco para búsqueda, entrada de código de barras y controles de proceso de pago.
- [x] Soportar flujos de tecla Enter para acciones de agregar/buscar/enviar.
- [x] Asegurar que el orden de tabulación sea lógico.

Validación:
- [x] El cajero puede completar una venta básica sin ratón.
- [x] Sin trampas de teclado.

### T-022 Pulido de estados de error y mensajes
- [x] Estandarizar componentes de validación en línea.
- [x] Agregar mensajes de error del escáner y del pago.
- [x] Agregar UI de respaldo para fallos inesperados de componentes.

Validación:
- [x] Los mensajes de error son claros y accionables.
- [x] Sin errores de tiempo de ejecución no capturados en flujos normales.

### T-023 Cobertura de pruebas unitarias e integración
- [x] Agregar pruebas unitarias para totales, descuentos, impuesto y validación de pago.
- [ ] Agregar prueba de integración para el flujo de venta de extremo a extremo.
- [ ] Agregar prueba de integración para venta sin conexión y sincronización pendiente.

Validación:
- [x] La suite de pruebas pasa localmente.
- [x] Los cálculos críticos están cubiertos por pruebas.

## Fase 8: Verificación Final

### T-024 Revisión de criterios de aceptación
- [x] Mapear cada historia de usuario de `requirements.md` al comportamiento implementado.
- [x] Ejecutar lista de verificación de QA manual para todos los criterios de aceptación.
- [ ] Registrar cualquier brecha y corregir antes de la finalización.

Validación:
- [x] Todos los criterios de aceptación satisfechos o explícitamente documentados.
- [x] El flujo POS está listo para demostración para la evaluación del taller.
