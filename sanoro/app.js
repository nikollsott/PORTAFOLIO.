/* ============================================================
   SAN ORO 18K — Catálogo digital
   app.js  ·  JavaScript Vanilla (sin frameworks ni dependencias)

   ÍNDICE
   01. CONFIGURACIÓN            ← lo que se edita a diario
   02. DATOS: PRODUCTOS
   03. FRASES EDITORIALES
   04. ESTADO Y ALMACENAMIENTO
   05. UTILIDADES
   06. HERO
   07. COLECCIONES
   08. SELECCIÓN SAN ORO
   09. CHIPS DE COLECCIÓN
   10. RENDER DE PRODUCTOS
   11. FILTRO, BÚSQUEDA Y CARGA PROGRESIVA
   12. FAVORITOS
   13. DETALLE DEL PRODUCTO
   14. WHATSAPP
   15. COMPARTIR
   16. NAVEGACIÓN, DOCK Y ENLACES
   17. EVENTOS
   18. INICIO
   ============================================================ */

'use strict';


/* ============================================================
   01. CONFIGURACIÓN
   ============================================================ */

/* WhatsApp de San Oro. Formato: país + número, sin "+", espacios ni guiones. */
var WHATSAPP_NUMBER = '573234270269';

/* Mensaje cuando se escribe sin una pieza concreta */
var WHATSAPP_GENERAL = 'Hola! Quiero información sobre las joyas de San Oro 18K.';

/* Mensaje automático al cotizar una pieza */
function whatsappMessageFor(product) {
  return 'Hola! Estoy interesad@ en ' + product.name + ' (' + product.reference + ').' +
         ' ¿Me podrían dar información sobre precio y disponibilidad?';
}

/* Fotografía protagonista del hero: id de una pieza real del catálogo */
var HERO_PRODUCT_ID = 166;

/* Piezas de la "Selección San Oro". Solo ids: los datos salen del catálogo. */
var FEATURED_PRODUCT_IDS = [13, 59, 84, 148, 189, 213];

/* Portada de cada colección. Si un id no existe se usa la primera pieza. */
var COLLECTION_COVERS = {
  'Cadenas': 13,
  'Pulseras': 49,
  'Anillos': 69,
  'Aretes': 84,
  'Dijes': 148,
  'Combos': 189,
  'Rosarios': 203,
  'Candongas': 213
};

/* Cada cuántas piezas aparece una pausa editorial dentro del catálogo */
var EDITORIAL_EVERY = 48;

/* Piezas que se pintan en cada lote (las demás se añaden al bajar) */
var PAGE_SIZE = 24;

/* Tope de piezas listadas en el mensaje de "Cotizar mis favoritos" */
var MAX_QUOTE_ITEMS = 30;

/* Colecciones, en el orden en que aparecen los chips */
var CATEGORIES = [
  'Todos',
  'Cadenas',
  'Pulseras',
  'Anillos',
  'Aretes',
  'Dijes',
  'Combos',
  'Rosarios',
  'Candongas'
];


/* ============================================================
   02. DATOS: PRODUCTOS
   ------------------------------------------------------------
   Un producto por línea. Para agregar uno, copia una línea y cambia
   sus datos. El "id" debe ser único. Nunca se muestran precios.

   Prefijos de referencia por categoría:
   Cadenas CAD · Pulseras PUL · Anillos ANI · Aretes ARE
   Dijes DIJ · Combos COM · Rosarios ROS · Candongas CAN
   ============================================================ */
var products = [

  { id: 1, name: 'Cadena 01', reference: 'CAD-001', category: 'Cadenas', image: 'assets/productos/cadena-01.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 2, name: 'Cadena 02', reference: 'CAD-002', category: 'Cadenas', image: 'assets/productos/cadena-02.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 3, name: 'Cadena 03', reference: 'CAD-003', category: 'Cadenas', image: 'assets/productos/cadena-03.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 4, name: 'Cadena 04', reference: 'CAD-004', category: 'Cadenas', image: 'assets/productos/cadena-04.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 5, name: 'Cadena 05', reference: 'CAD-005', category: 'Cadenas', image: 'assets/productos/cadena-05.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 6, name: 'Cadena 06', reference: 'CAD-006', category: 'Cadenas', image: 'assets/productos/cadena-06.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 7, name: 'Cadena 07', reference: 'CAD-007', category: 'Cadenas', image: 'assets/productos/cadena-07.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 8, name: 'Cadena 08', reference: 'CAD-008', category: 'Cadenas', image: 'assets/productos/cadena-08.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 9, name: 'Cadena 09', reference: 'CAD-009', category: 'Cadenas', image: 'assets/productos/cadena-09.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 10, name: 'Cadena 10', reference: 'CAD-010', category: 'Cadenas', image: 'assets/productos/cadena-10.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 11, name: 'Cadena 11', reference: 'CAD-011', category: 'Cadenas', image: 'assets/productos/cadena-11.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 12, name: 'Cadena 12', reference: 'CAD-012', category: 'Cadenas', image: 'assets/productos/cadena-12.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 13, name: 'Cadena 13', reference: 'CAD-013', category: 'Cadenas', image: 'assets/productos/cadena-13.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 14, name: 'Cadena 14', reference: 'CAD-014', category: 'Cadenas', image: 'assets/productos/cadena-14.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 15, name: 'Cadena 15', reference: 'CAD-015', category: 'Cadenas', image: 'assets/productos/cadena-15.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 16, name: 'Cadena 16', reference: 'CAD-016', category: 'Cadenas', image: 'assets/productos/cadena-16.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 17, name: 'Cadena 17', reference: 'CAD-017', category: 'Cadenas', image: 'assets/productos/cadena-17.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 18, name: 'Cadena 18', reference: 'CAD-018', category: 'Cadenas', image: 'assets/productos/cadena-18.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 19, name: 'Cadena 19', reference: 'CAD-019', category: 'Cadenas', image: 'assets/productos/cadena-19.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 20, name: 'Cadena 20', reference: 'CAD-020', category: 'Cadenas', image: 'assets/productos/cadena-20.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 21, name: 'Cadena 21', reference: 'CAD-021', category: 'Cadenas', image: 'assets/productos/cadena-21.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 22, name: 'Cadena 22', reference: 'CAD-022', category: 'Cadenas', image: 'assets/productos/cadena-22.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 23, name: 'Cadena 23', reference: 'CAD-023', category: 'Cadenas', image: 'assets/productos/cadena-23.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 24, name: 'Cadena 24', reference: 'CAD-024', category: 'Cadenas', image: 'assets/productos/cadena-24.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 25, name: 'Cadena 25', reference: 'CAD-025', category: 'Cadenas', image: 'assets/productos/cadena-25.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 26, name: 'Cadena 26', reference: 'CAD-026', category: 'Cadenas', image: 'assets/productos/cadena-26.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 27, name: 'Cadena 27', reference: 'CAD-027', category: 'Cadenas', image: 'assets/productos/cadena-27.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 28, name: 'Cadena 28', reference: 'CAD-028', category: 'Cadenas', image: 'assets/productos/cadena-28.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 29, name: 'Cadena 29', reference: 'CAD-029', category: 'Cadenas', image: 'assets/productos/cadena-29.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 30, name: 'Cadena 30', reference: 'CAD-030', category: 'Cadenas', image: 'assets/productos/cadena-30.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 31, name: 'Cadena 31', reference: 'CAD-031', category: 'Cadenas', image: 'assets/productos/cadena-31.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 32, name: 'Cadena 32', reference: 'CAD-032', category: 'Cadenas', image: 'assets/productos/cadena-32.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 33, name: 'Cadena 33', reference: 'CAD-033', category: 'Cadenas', image: 'assets/productos/cadena-33.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 34, name: 'Cadena 34', reference: 'CAD-034', category: 'Cadenas', image: 'assets/productos/cadena-34.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 35, name: 'Cadena 35', reference: 'CAD-035', category: 'Cadenas', image: 'assets/productos/cadena-35.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 36, name: 'Cadena 36', reference: 'CAD-036', category: 'Cadenas', image: 'assets/productos/cadena-36.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 37, name: 'Cadena 37', reference: 'CAD-037', category: 'Cadenas', image: 'assets/productos/cadena-37.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 38, name: 'Cadena 38', reference: 'CAD-038', category: 'Cadenas', image: 'assets/productos/cadena-38.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 39, name: 'Cadena 39', reference: 'CAD-039', category: 'Cadenas', image: 'assets/productos/cadena-39.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 40, name: 'Cadena 40', reference: 'CAD-040', category: 'Cadenas', image: 'assets/productos/cadena-40.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 41, name: 'Cadena 41', reference: 'CAD-041', category: 'Cadenas', image: 'assets/productos/cadena-41.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 42, name: 'Cadena 42', reference: 'CAD-042', category: 'Cadenas', image: 'assets/productos/cadena-42.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 43, name: 'Cadena 43', reference: 'CAD-043', category: 'Cadenas', image: 'assets/productos/cadena-43.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 44, name: 'Cadena 44', reference: 'CAD-044', category: 'Cadenas', image: 'assets/productos/cadena-44.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 45, name: 'Cadena 45', reference: 'CAD-045', category: 'Cadenas', image: 'assets/productos/cadena-45.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 46, name: 'Cadena 46', reference: 'CAD-046', category: 'Cadenas', image: 'assets/productos/cadena-46.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 47, name: 'Cadena 47', reference: 'CAD-047', category: 'Cadenas', image: 'assets/productos/cadena-47.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 48, name: 'Cadena 48', reference: 'CAD-048', category: 'Cadenas', image: 'assets/productos/cadena-48.jpg', material: 'Oro laminado 18K', description: '' },

  { id: 49, name: 'Pulsera 01', reference: 'PUL-001', category: 'Pulseras', image: 'assets/productos/pulsera-01.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 50, name: 'Pulsera 02', reference: 'PUL-002', category: 'Pulseras', image: 'assets/productos/pulsera-02.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 51, name: 'Pulsera 03', reference: 'PUL-003', category: 'Pulseras', image: 'assets/productos/pulsera-03.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 52, name: 'Pulsera 04', reference: 'PUL-004', category: 'Pulseras', image: 'assets/productos/pulsera-04.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 53, name: 'Pulsera 05', reference: 'PUL-005', category: 'Pulseras', image: 'assets/productos/pulsera-05.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 54, name: 'Pulsera 06', reference: 'PUL-006', category: 'Pulseras', image: 'assets/productos/pulsera-06.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 55, name: 'Pulsera 07', reference: 'PUL-007', category: 'Pulseras', image: 'assets/productos/pulsera-07.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 56, name: 'Pulsera 08', reference: 'PUL-008', category: 'Pulseras', image: 'assets/productos/pulsera-08.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 57, name: 'Pulsera 09', reference: 'PUL-009', category: 'Pulseras', image: 'assets/productos/pulsera-09.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 58, name: 'Pulsera 10', reference: 'PUL-010', category: 'Pulseras', image: 'assets/productos/pulsera-10.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 59, name: 'Pulsera 11', reference: 'PUL-011', category: 'Pulseras', image: 'assets/productos/pulsera-11.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 60, name: 'Pulsera 12', reference: 'PUL-012', category: 'Pulseras', image: 'assets/productos/pulsera-12.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 61, name: 'Pulsera 13', reference: 'PUL-013', category: 'Pulseras', image: 'assets/productos/pulsera-13.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 62, name: 'Pulsera 14', reference: 'PUL-014', category: 'Pulseras', image: 'assets/productos/pulsera-14.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 63, name: 'Pulsera 15', reference: 'PUL-015', category: 'Pulseras', image: 'assets/productos/pulsera-15.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 64, name: 'Pulsera 16', reference: 'PUL-016', category: 'Pulseras', image: 'assets/productos/pulsera-16.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 65, name: 'Pulsera 17', reference: 'PUL-017', category: 'Pulseras', image: 'assets/productos/pulsera-17.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 66, name: 'Pulsera 18', reference: 'PUL-018', category: 'Pulseras', image: 'assets/productos/pulsera-18.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 67, name: 'Pulsera 19', reference: 'PUL-019', category: 'Pulseras', image: 'assets/productos/pulsera-19.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 68, name: 'Pulsera 20', reference: 'PUL-020', category: 'Pulseras', image: 'assets/productos/pulsera-20.jpg', material: 'Oro laminado 18K', description: '' },

  { id: 69, name: 'Anillo 01', reference: 'ANI-001', category: 'Anillos', image: 'assets/productos/anillo-01.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 70, name: 'Anillo 02', reference: 'ANI-002', category: 'Anillos', image: 'assets/productos/anillo-02.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 71, name: 'Anillo 03', reference: 'ANI-003', category: 'Anillos', image: 'assets/productos/anillo-03.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 72, name: 'Anillo 04', reference: 'ANI-004', category: 'Anillos', image: 'assets/productos/anillo-04.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 73, name: 'Anillo 05', reference: 'ANI-005', category: 'Anillos', image: 'assets/productos/anillo-05.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 74, name: 'Anillo 06', reference: 'ANI-006', category: 'Anillos', image: 'assets/productos/anillo-06.jpg', material: 'Oro laminado 18K', description: '' },

  { id: 75, name: 'Arete 01', reference: 'ARE-001', category: 'Aretes', image: 'assets/productos/arete-01.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 76, name: 'Arete 02', reference: 'ARE-002', category: 'Aretes', image: 'assets/productos/arete-02.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 77, name: 'Arete 03', reference: 'ARE-003', category: 'Aretes', image: 'assets/productos/arete-03.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 78, name: 'Arete 04', reference: 'ARE-004', category: 'Aretes', image: 'assets/productos/arete-04.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 79, name: 'Arete 05', reference: 'ARE-005', category: 'Aretes', image: 'assets/productos/arete-05.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 80, name: 'Arete 06', reference: 'ARE-006', category: 'Aretes', image: 'assets/productos/arete-06.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 81, name: 'Arete 07', reference: 'ARE-007', category: 'Aretes', image: 'assets/productos/arete-07.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 82, name: 'Arete 08', reference: 'ARE-008', category: 'Aretes', image: 'assets/productos/arete-08.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 83, name: 'Arete 09', reference: 'ARE-009', category: 'Aretes', image: 'assets/productos/arete-09.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 84, name: 'Arete 10', reference: 'ARE-010', category: 'Aretes', image: 'assets/productos/arete-10.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 85, name: 'Arete 11', reference: 'ARE-011', category: 'Aretes', image: 'assets/productos/arete-11.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 86, name: 'Arete 12', reference: 'ARE-012', category: 'Aretes', image: 'assets/productos/arete-12.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 87, name: 'Arete 13', reference: 'ARE-013', category: 'Aretes', image: 'assets/productos/arete-13.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 88, name: 'Arete 14', reference: 'ARE-014', category: 'Aretes', image: 'assets/productos/arete-14.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 89, name: 'Arete 15', reference: 'ARE-015', category: 'Aretes', image: 'assets/productos/arete-15.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 90, name: 'Arete 16', reference: 'ARE-016', category: 'Aretes', image: 'assets/productos/arete-16.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 91, name: 'Arete 17', reference: 'ARE-017', category: 'Aretes', image: 'assets/productos/arete-17.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 92, name: 'Arete 18', reference: 'ARE-018', category: 'Aretes', image: 'assets/productos/arete-18.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 93, name: 'Arete 19', reference: 'ARE-019', category: 'Aretes', image: 'assets/productos/arete-19.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 94, name: 'Arete 20', reference: 'ARE-020', category: 'Aretes', image: 'assets/productos/arete-20.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 95, name: 'Arete 21', reference: 'ARE-021', category: 'Aretes', image: 'assets/productos/arete-21.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 96, name: 'Arete 22', reference: 'ARE-022', category: 'Aretes', image: 'assets/productos/arete-22.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 97, name: 'Arete 23', reference: 'ARE-023', category: 'Aretes', image: 'assets/productos/arete-23.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 98, name: 'Arete 24', reference: 'ARE-024', category: 'Aretes', image: 'assets/productos/arete-24.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 99, name: 'Arete 25', reference: 'ARE-025', category: 'Aretes', image: 'assets/productos/arete-25.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 100, name: 'Arete 26', reference: 'ARE-026', category: 'Aretes', image: 'assets/productos/arete-26.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 101, name: 'Arete 27', reference: 'ARE-027', category: 'Aretes', image: 'assets/productos/arete-27.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 102, name: 'Arete 28', reference: 'ARE-028', category: 'Aretes', image: 'assets/productos/arete-28.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 103, name: 'Arete 29', reference: 'ARE-029', category: 'Aretes', image: 'assets/productos/arete-29.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 104, name: 'Arete 30', reference: 'ARE-030', category: 'Aretes', image: 'assets/productos/arete-30.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 105, name: 'Arete 31', reference: 'ARE-031', category: 'Aretes', image: 'assets/productos/arete-31.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 106, name: 'Arete 32', reference: 'ARE-032', category: 'Aretes', image: 'assets/productos/arete-32.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 107, name: 'Arete 33', reference: 'ARE-033', category: 'Aretes', image: 'assets/productos/arete-33.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 108, name: 'Arete 34', reference: 'ARE-034', category: 'Aretes', image: 'assets/productos/arete-34.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 109, name: 'Arete 35', reference: 'ARE-035', category: 'Aretes', image: 'assets/productos/arete-35.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 110, name: 'Arete 36', reference: 'ARE-036', category: 'Aretes', image: 'assets/productos/arete-36.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 111, name: 'Arete 37', reference: 'ARE-037', category: 'Aretes', image: 'assets/productos/arete-37.jpg', material: 'Oro laminado 18K', description: '' },

  { id: 112, name: 'Dije 01', reference: 'DIJ-001', category: 'Dijes', image: 'assets/productos/dije-01.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 113, name: 'Dije 02', reference: 'DIJ-002', category: 'Dijes', image: 'assets/productos/dije-02.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 114, name: 'Dije 03', reference: 'DIJ-003', category: 'Dijes', image: 'assets/productos/dije-03.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 115, name: 'Dije 04', reference: 'DIJ-004', category: 'Dijes', image: 'assets/productos/dije-04.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 116, name: 'Dije 05', reference: 'DIJ-005', category: 'Dijes', image: 'assets/productos/dije-05.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 117, name: 'Dije 06', reference: 'DIJ-006', category: 'Dijes', image: 'assets/productos/dije-06.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 118, name: 'Dije 07', reference: 'DIJ-007', category: 'Dijes', image: 'assets/productos/dije-07.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 119, name: 'Dije 08', reference: 'DIJ-008', category: 'Dijes', image: 'assets/productos/dije-08.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 120, name: 'Dije 09', reference: 'DIJ-009', category: 'Dijes', image: 'assets/productos/dije-09.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 121, name: 'Dije 10', reference: 'DIJ-010', category: 'Dijes', image: 'assets/productos/dije-10.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 122, name: 'Dije 11', reference: 'DIJ-011', category: 'Dijes', image: 'assets/productos/dije-11.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 123, name: 'Dije 12', reference: 'DIJ-012', category: 'Dijes', image: 'assets/productos/dije-12.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 124, name: 'Dije 13', reference: 'DIJ-013', category: 'Dijes', image: 'assets/productos/dije-13.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 125, name: 'Dije 14', reference: 'DIJ-014', category: 'Dijes', image: 'assets/productos/dije-14.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 126, name: 'Dije 15', reference: 'DIJ-015', category: 'Dijes', image: 'assets/productos/dije-15.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 127, name: 'Dije 16', reference: 'DIJ-016', category: 'Dijes', image: 'assets/productos/dije-16.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 128, name: 'Dije 17', reference: 'DIJ-017', category: 'Dijes', image: 'assets/productos/dije-17.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 129, name: 'Dije 18', reference: 'DIJ-018', category: 'Dijes', image: 'assets/productos/dije-18.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 130, name: 'Dije 19', reference: 'DIJ-019', category: 'Dijes', image: 'assets/productos/dije-19.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 131, name: 'Dije 20', reference: 'DIJ-020', category: 'Dijes', image: 'assets/productos/dije-20.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 132, name: 'Dije 21', reference: 'DIJ-021', category: 'Dijes', image: 'assets/productos/dije-21.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 133, name: 'Dije 22', reference: 'DIJ-022', category: 'Dijes', image: 'assets/productos/dije-22.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 134, name: 'Dije 23', reference: 'DIJ-023', category: 'Dijes', image: 'assets/productos/dije-23.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 135, name: 'Dije 24', reference: 'DIJ-024', category: 'Dijes', image: 'assets/productos/dije-24.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 136, name: 'Dije 25', reference: 'DIJ-025', category: 'Dijes', image: 'assets/productos/dije-25.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 137, name: 'Dije 26', reference: 'DIJ-026', category: 'Dijes', image: 'assets/productos/dije-26.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 138, name: 'Dije 27', reference: 'DIJ-027', category: 'Dijes', image: 'assets/productos/dije-27.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 139, name: 'Dije 28', reference: 'DIJ-028', category: 'Dijes', image: 'assets/productos/dije-28.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 140, name: 'Dije 29', reference: 'DIJ-029', category: 'Dijes', image: 'assets/productos/dije-29.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 141, name: 'Dije 30', reference: 'DIJ-030', category: 'Dijes', image: 'assets/productos/dije-30.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 142, name: 'Dije 31', reference: 'DIJ-031', category: 'Dijes', image: 'assets/productos/dije-31.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 143, name: 'Dije 32', reference: 'DIJ-032', category: 'Dijes', image: 'assets/productos/dije-32.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 144, name: 'Dije 33', reference: 'DIJ-033', category: 'Dijes', image: 'assets/productos/dije-33.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 145, name: 'Dije 34', reference: 'DIJ-034', category: 'Dijes', image: 'assets/productos/dije-34.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 146, name: 'Dije 35', reference: 'DIJ-035', category: 'Dijes', image: 'assets/productos/dije-35.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 147, name: 'Dije 36', reference: 'DIJ-036', category: 'Dijes', image: 'assets/productos/dije-36.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 148, name: 'Dije 37', reference: 'DIJ-037', category: 'Dijes', image: 'assets/productos/dije-37.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 149, name: 'Dije 38', reference: 'DIJ-038', category: 'Dijes', image: 'assets/productos/dije-38.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 150, name: 'Dije 39', reference: 'DIJ-039', category: 'Dijes', image: 'assets/productos/dije-39.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 151, name: 'Dije 40', reference: 'DIJ-040', category: 'Dijes', image: 'assets/productos/dije-40.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 152, name: 'Dije 41', reference: 'DIJ-041', category: 'Dijes', image: 'assets/productos/dije-41.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 153, name: 'Dije 42', reference: 'DIJ-042', category: 'Dijes', image: 'assets/productos/dije-42.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 154, name: 'Dije 43', reference: 'DIJ-043', category: 'Dijes', image: 'assets/productos/dije-43.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 155, name: 'Dije 44', reference: 'DIJ-044', category: 'Dijes', image: 'assets/productos/dije-44.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 156, name: 'Dije 45', reference: 'DIJ-045', category: 'Dijes', image: 'assets/productos/dije-45.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 157, name: 'Dije 46', reference: 'DIJ-046', category: 'Dijes', image: 'assets/productos/dije-46.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 158, name: 'Dije 47', reference: 'DIJ-047', category: 'Dijes', image: 'assets/productos/dije-47.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 159, name: 'Dije 48', reference: 'DIJ-048', category: 'Dijes', image: 'assets/productos/dije-48.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 160, name: 'Dije 49', reference: 'DIJ-049', category: 'Dijes', image: 'assets/productos/dije-49.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 161, name: 'Dije 50', reference: 'DIJ-050', category: 'Dijes', image: 'assets/productos/dije-50.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 162, name: 'Dije 51', reference: 'DIJ-051', category: 'Dijes', image: 'assets/productos/dije-51.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 163, name: 'Dije 52', reference: 'DIJ-052', category: 'Dijes', image: 'assets/productos/dije-52.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 164, name: 'Dije 53', reference: 'DIJ-053', category: 'Dijes', image: 'assets/productos/dije-53.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 165, name: 'Dije 54', reference: 'DIJ-054', category: 'Dijes', image: 'assets/productos/dije-54.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 166, name: 'Dije 55', reference: 'DIJ-055', category: 'Dijes', image: 'assets/productos/dije-55.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 167, name: 'Dije 56', reference: 'DIJ-056', category: 'Dijes', image: 'assets/productos/dije-56.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 168, name: 'Dije 57', reference: 'DIJ-057', category: 'Dijes', image: 'assets/productos/dije-57.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 169, name: 'Dije 58', reference: 'DIJ-058', category: 'Dijes', image: 'assets/productos/dije-58.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 170, name: 'Dije 59', reference: 'DIJ-059', category: 'Dijes', image: 'assets/productos/dije-59.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 171, name: 'Dije 60', reference: 'DIJ-060', category: 'Dijes', image: 'assets/productos/dije-60.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 172, name: 'Dije 61', reference: 'DIJ-061', category: 'Dijes', image: 'assets/productos/dije-61.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 173, name: 'Dije 62', reference: 'DIJ-062', category: 'Dijes', image: 'assets/productos/dije-62.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 174, name: 'Dije 63', reference: 'DIJ-063', category: 'Dijes', image: 'assets/productos/dije-63.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 175, name: 'Dije 64', reference: 'DIJ-064', category: 'Dijes', image: 'assets/productos/dije-64.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 176, name: 'Dije 65', reference: 'DIJ-065', category: 'Dijes', image: 'assets/productos/dije-65.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 177, name: 'Dije 66', reference: 'DIJ-066', category: 'Dijes', image: 'assets/productos/dije-66.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 178, name: 'Dije 67', reference: 'DIJ-067', category: 'Dijes', image: 'assets/productos/dije-67.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 179, name: 'Dije 68', reference: 'DIJ-068', category: 'Dijes', image: 'assets/productos/dije-68.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 180, name: 'Dije 69', reference: 'DIJ-069', category: 'Dijes', image: 'assets/productos/dije-69.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 181, name: 'Dije 70', reference: 'DIJ-070', category: 'Dijes', image: 'assets/productos/dije-70.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 182, name: 'Dije 71', reference: 'DIJ-071', category: 'Dijes', image: 'assets/productos/dije-71.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 183, name: 'Dije 72', reference: 'DIJ-072', category: 'Dijes', image: 'assets/productos/dije-72.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 184, name: 'Dije 73', reference: 'DIJ-073', category: 'Dijes', image: 'assets/productos/dije-73.jpg', material: 'Oro laminado 18K', description: '' },

  { id: 185, name: 'Combo 01', reference: 'COM-001', category: 'Combos', image: 'assets/productos/combo-01.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 186, name: 'Combo 02', reference: 'COM-002', category: 'Combos', image: 'assets/productos/combo-02.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 187, name: 'Combo 03', reference: 'COM-003', category: 'Combos', image: 'assets/productos/combo-03.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 188, name: 'Combo 04', reference: 'COM-004', category: 'Combos', image: 'assets/productos/combo-04.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 189, name: 'Combo 05', reference: 'COM-005', category: 'Combos', image: 'assets/productos/combo-05.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 190, name: 'Combo 06', reference: 'COM-006', category: 'Combos', image: 'assets/productos/combo-06.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 191, name: 'Combo 07', reference: 'COM-007', category: 'Combos', image: 'assets/productos/combo-07.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 192, name: 'Combo 08', reference: 'COM-008', category: 'Combos', image: 'assets/productos/combo-08.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 193, name: 'Combo 09', reference: 'COM-009', category: 'Combos', image: 'assets/productos/combo-09.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 194, name: 'Combo 10', reference: 'COM-010', category: 'Combos', image: 'assets/productos/combo-10.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 195, name: 'Combo 11', reference: 'COM-011', category: 'Combos', image: 'assets/productos/combo-11.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 196, name: 'Combo 12', reference: 'COM-012', category: 'Combos', image: 'assets/productos/combo-12.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 197, name: 'Combo 13', reference: 'COM-013', category: 'Combos', image: 'assets/productos/combo-13.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 198, name: 'Combo 14', reference: 'COM-014', category: 'Combos', image: 'assets/productos/combo-14.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 199, name: 'Combo 15', reference: 'COM-015', category: 'Combos', image: 'assets/productos/combo-15.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 200, name: 'Combo 16', reference: 'COM-016', category: 'Combos', image: 'assets/productos/combo-16.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 201, name: 'Combo 17', reference: 'COM-017', category: 'Combos', image: 'assets/productos/combo-17.jpg', material: 'Oro laminado 18K', description: '' },

  { id: 202, name: 'Rosario 01', reference: 'ROS-001', category: 'Rosarios', image: 'assets/productos/rosario-01.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 203, name: 'Rosario 02', reference: 'ROS-002', category: 'Rosarios', image: 'assets/productos/rosario-02.jpg', material: 'Oro laminado 18K', description: '' },

  { id: 204, name: 'Candonga 01', reference: 'CAN-001', category: 'Candongas', image: 'assets/productos/candonga-01.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 205, name: 'Candonga 02', reference: 'CAN-002', category: 'Candongas', image: 'assets/productos/candonga-02.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 206, name: 'Candonga 03', reference: 'CAN-003', category: 'Candongas', image: 'assets/productos/candonga-03.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 207, name: 'Candonga 04', reference: 'CAN-004', category: 'Candongas', image: 'assets/productos/candonga-04.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 208, name: 'Candonga 05', reference: 'CAN-005', category: 'Candongas', image: 'assets/productos/candonga-05.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 209, name: 'Candonga 06', reference: 'CAN-006', category: 'Candongas', image: 'assets/productos/candonga-06.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 210, name: 'Candonga 07', reference: 'CAN-007', category: 'Candongas', image: 'assets/productos/candonga-07.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 211, name: 'Candonga 08', reference: 'CAN-008', category: 'Candongas', image: 'assets/productos/candonga-08.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 212, name: 'Candonga 09', reference: 'CAN-009', category: 'Candongas', image: 'assets/productos/candonga-09.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 213, name: 'Candonga 10', reference: 'CAN-010', category: 'Candongas', image: 'assets/productos/candonga-10.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 214, name: 'Candonga 11', reference: 'CAN-011', category: 'Candongas', image: 'assets/productos/candonga-11.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 215, name: 'Candonga 12', reference: 'CAN-012', category: 'Candongas', image: 'assets/productos/candonga-12.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 216, name: 'Candonga 13', reference: 'CAN-013', category: 'Candongas', image: 'assets/productos/candonga-13.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 217, name: 'Candonga 14', reference: 'CAN-014', category: 'Candongas', image: 'assets/productos/candonga-14.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 218, name: 'Candonga 15', reference: 'CAN-015', category: 'Candongas', image: 'assets/productos/candonga-15.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 219, name: 'Candonga 16', reference: 'CAN-016', category: 'Candongas', image: 'assets/productos/candonga-16.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 220, name: 'Candonga 17', reference: 'CAN-017', category: 'Candongas', image: 'assets/productos/candonga-17.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 221, name: 'Candonga 18', reference: 'CAN-018', category: 'Candongas', image: 'assets/productos/candonga-18.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 222, name: 'Candonga 19', reference: 'CAN-019', category: 'Candongas', image: 'assets/productos/candonga-19.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 223, name: 'Candonga 20', reference: 'CAN-020', category: 'Candongas', image: 'assets/productos/candonga-20.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 224, name: 'Candonga 21', reference: 'CAN-021', category: 'Candongas', image: 'assets/productos/candonga-21.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 225, name: 'Candonga 22', reference: 'CAN-022', category: 'Candongas', image: 'assets/productos/candonga-22.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 226, name: 'Candonga 23', reference: 'CAN-023', category: 'Candongas', image: 'assets/productos/candonga-23.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 227, name: 'Candonga 24', reference: 'CAN-024', category: 'Candongas', image: 'assets/productos/candonga-24.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 228, name: 'Candonga 25', reference: 'CAN-025', category: 'Candongas', image: 'assets/productos/candonga-25.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 229, name: 'Candonga 26', reference: 'CAN-026', category: 'Candongas', image: 'assets/productos/candonga-26.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 230, name: 'Candonga 27', reference: 'CAN-027', category: 'Candongas', image: 'assets/productos/candonga-27.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 231, name: 'Candonga 28', reference: 'CAN-028', category: 'Candongas', image: 'assets/productos/candonga-28.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 232, name: 'Candonga 29', reference: 'CAN-029', category: 'Candongas', image: 'assets/productos/candonga-29.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 233, name: 'Candonga 30', reference: 'CAN-030', category: 'Candongas', image: 'assets/productos/candonga-30.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 234, name: 'Candonga 31', reference: 'CAN-031', category: 'Candongas', image: 'assets/productos/candonga-31.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 235, name: 'Candonga 32', reference: 'CAN-032', category: 'Candongas', image: 'assets/productos/candonga-32.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 236, name: 'Candonga 33', reference: 'CAN-033', category: 'Candongas', image: 'assets/productos/candonga-33.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 237, name: 'Candonga 34', reference: 'CAN-034', category: 'Candongas', image: 'assets/productos/candonga-34.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 238, name: 'Candonga 35', reference: 'CAN-035', category: 'Candongas', image: 'assets/productos/candonga-35.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 239, name: 'Candonga 36', reference: 'CAN-036', category: 'Candongas', image: 'assets/productos/candonga-36.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 240, name: 'Candonga 37', reference: 'CAN-037', category: 'Candongas', image: 'assets/productos/candonga-37.jpg', material: 'Oro laminado 18K', description: '' },
  { id: 241, name: 'Candonga 38', reference: 'CAN-038', category: 'Candongas', image: 'assets/productos/candonga-38.jpg', material: 'Oro laminado 18K', description: '' }
];

/* ============================================================
   03. FRASES EDITORIALES
   Tomadas del catálogo impreso de San Oro 18K.
   ============================================================ */
var editorialQuotes = [
  { text: 'Pon tus planes en las manos de Dios, y Él guiará tus pasos.', source: 'Proverbios 16:3' },
  { text: 'Lo que Dios prepara para ti siempre llegará en el momento correcto.', source: '' },
  { text: 'La verdadera riqueza está en tener a Dios en el corazón.', source: '' },
  { text: 'Dios bendice las manos que trabajan con fe y propósito.', source: '' },
  { text: 'No necesitas apresurarte; confía en el tiempo de Dios.', source: '' },
  { text: 'Que tu brillo venga de Dios, no solo de lo que llevas puesto.', source: '' },
  { text: 'Donde Dios está, nunca falta esperanza.', source: '' },
  { text: 'Sé luz, sé propósito, sé testimonio.', source: 'Mateo 5:14' },
  { text: 'Dios conoce tus sueños incluso antes de que los conviertas en palabras.', source: '' },
  { text: 'La fe hace posible lo que nuestros ojos todavía no pueden ver.', source: 'Hebreos 11:1' },
  { text: 'Que cada joya que lleves te recuerde lo mucho que Dios te ha bendecido.', source: '' },
  { text: 'No es solo una joya; es un recordatorio de que Dios ha estado contigo en cada paso.', source: '' },
  { text: 'Todo lo bueno viene de Dios.', source: 'Santiago 1:17' },
  { text: 'Cuando Dios es tu guía, cada camino tiene un propósito.', source: '' },
  { text: 'Confía en Dios, incluso cuando todavía no entiendas el camino.', source: '' },
  { text: 'Tu valor no está en lo que posees, sino en lo que Dios puso dentro de ti.', source: '' },
  { text: 'Que nunca te falte fe para comenzar ni gratitud para agradecer.', source: '' },
  { text: 'Dios transforma procesos difíciles en grandes testimonios.', source: '' },
  { text: 'Camina con fe y deja que Dios se encargue del resto.', source: '' },
  { text: 'Tu historia todavía se está escribiendo; confía en quien sostiene tu vida.', source: '' },
  { text: 'Más que adornar tu cuerpo, lleva contigo aquello que representa tu fe.', source: '' },
  { text: 'Una joya puede brillar, pero la luz de Dios brilla mucho más.', source: '' },
  { text: 'Dios no se olvida de las promesas que puso en tu corazón.', source: '' },
  { text: 'Que cada nuevo comienzo esté acompañado de fe.', source: '' },
  { text: 'Cuando Dios abre una puerta, ninguna dificultad puede detener su propósito.', source: '' },
  { text: 'Agradece lo que tienes, confía por lo que viene y deja todo en manos de Dios.', source: '' },
  { text: 'La elegancia también está en caminar con humildad y fe.', source: '' },
  { text: 'No presumas tus bendiciones; agradece a quien te las dio.', source: '' },
  { text: 'Dios puede hacer mucho más de lo que hoy eres capaz de imaginar.', source: 'Efesios 3:20' },
  { text: 'Que tu brillo exterior siempre sea reflejo de la luz que llevas dentro.', source: '' },
  { text: 'La paciencia también es una forma de confiar en Dios.', source: '' },
  { text: 'Lo que parece un retraso puede ser parte del plan perfecto de Dios.', source: '' },
  { text: 'Que nunca te falte una razón para agradecerle a Dios.', source: '' },
  { text: 'Lleva tu fe contigo, incluso en los pequeños detalles.', source: '' },
  { text: 'San Oro 18K: una joya para llevar contigo, una fe para guardar en el corazón.', source: '' },
  { text: 'Que tu brillo nunca sea más grande que la luz que Dios puso en ti.', source: '' },
  { text: 'Dios no te trajo hasta aquí para dejarte a mitad del camino.', source: '' },
  { text: 'Lo que Dios tiene preparado para ti será mucho más grande de lo que imaginas.', source: '' },
  { text: 'Que cada joya te recuerde una bendición que Dios puso en tu camino.', source: '' },
  { text: 'Tu verdadero valor no está en lo que llevas, sino en lo que Dios puso en tu corazón.', source: '' },
  { text: 'Cuando Dios guía tus pasos, hasta los caminos difíciles tienen un propósito.', source: '' },
  { text: 'No necesitas entender el plan de Dios, solo confiar en Él.', source: '' },
  { text: 'Hay bendiciones que llegan después de momentos que solo Dios sabe cuánto costaron.', source: '' },
  { text: 'Que nunca te falte fe para seguir, incluso cuando todavía no veas el resultado.', source: '' },
  { text: 'Brilla, pero recuerda siempre quién es la fuente de tu luz.', source: '' },
  { text: 'Lo que hoy parece pequeño puede convertirse mañana en una gran bendición.', source: '' },
  { text: 'Dios conoce tus sueños, tus luchas y también todo lo que has hecho para alcanzarlos.', source: '' },
  { text: 'Una joya puede adornarte, pero es tu esencia la que realmente te hace brillar.', source: '' },
  { text: 'Que lo que lleves puesto sea hermoso, pero que lo que lleves en el corazón sea aún más valioso.', source: '' },
  { text: 'Confía en los tiempos de Dios; sus planes nunca llegan tarde.', source: '' },
  { text: 'Dios puede convertir una etapa difícil en el testimonio que algún día contarás con orgullo.', source: '' },
  { text: 'No es solo oro; es un recordatorio de que las bendiciones también llegan después de esperar.', source: '' },
  { text: 'Que cada nuevo comienzo esté acompañado de fe y cada logro de gratitud.', source: '' },
  { text: 'Si Dios puso ese sueño en tu corazón, sigue caminando hacia él.', source: '' },
  { text: 'Las cosas más valiosas no siempre se pueden comprar; algunas se reciben como bendiciones.', source: '' },
  { text: 'Que tu brillo exterior sea solo un reflejo de la luz que llevas dentro.', source: '' },
  { text: 'Dios sabe exactamente cuándo entregarte aquello por lo que tanto has orado.', source: '' },
  { text: 'No compares tu camino con el de nadie; Dios tiene un tiempo diferente para cada historia.', source: '' },
  { text: 'La fe también es seguir adelante cuando todavía no puedes ver el resultado.', source: '' },
  { text: 'Que nunca te acostumbres a tus bendiciones; aprende a agradecerlas.', source: '' },
  { text: 'Hay regalos que llegan a tus manos, y otros que Dios entrega directamente a tu corazón.', source: '' },
  { text: 'Lo que Dios bendice, ningún obstáculo puede quitarlo de tu camino.', source: '' },
  { text: 'Lleva contigo algo que te recuerde lo lejos que has llegado y quién estuvo contigo.', source: '' },
  { text: 'Más que una joya, un símbolo de fe, gratitud y bendición.', source: '' }
];

/* ============================================================
   04. ESTADO Y ALMACENAMIENTO
   ============================================================ */
var STORAGE_KEY = 'sanoro18k:favoritos';

var state = {
  category: 'Todos',
  query: '',
  favorites: [],        // ids guardados
  filtered: [],         // resultado actual del filtro del catálogo
  shown: 0,             // piezas ya pintadas
  currentId: null,      // pieza abierta en el detalle
  sheetList: [],        // listado sobre el que navegan anterior/siguiente
  lastFocused: null,    // elemento que abrió el sheet
  scrollY: 0,           // posición de lectura al bloquear el scroll
  locks: 0              // sheets abiertos que bloquean el scroll
};

/* Lee favoritos de localStorage de forma segura (nunca confiar en lo guardado) */
function loadFavorites() {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(function (id) { return typeof id === 'number' && isFinite(id); })
      .filter(function (id) { return getProductById(id) !== null; });
  } catch (error) {
    return [];
  }
}

/* Guarda favoritos. Si el navegador bloquea el almacenamiento, la app sigue funcionando. */
function saveFavorites() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
  } catch (error) {
    /* modo privado o almacenamiento lleno: se ignora en silencio */
  }
}


/* ============================================================
   05. UTILIDADES
   ============================================================ */
function $(selector, context) {
  return (context || document).querySelector(selector);
}

function $$(selector, context) {
  return Array.prototype.slice.call((context || document).querySelectorAll(selector));
}

/* Escapa texto antes de insertarlo como HTML (previene inyección de HTML/XSS) */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Normaliza texto para buscar sin importar tildes ni mayúsculas */
function normalize(text) {
  return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getProductById(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i];
  }
  return null;
}

function getProductByReference(reference) {
  var target = String(reference).toUpperCase();
  for (var i = 0; i < products.length; i++) {
    if (products[i].reference.toUpperCase() === target) return products[i];
  }
  return null;
}

function getCategoryProducts(category) {
  return products.filter(function (p) { return p.category === category; });
}

function isFavorite(id) {
  return state.favorites.indexOf(id) !== -1;
}

function favoriteProducts() {
  return state.favorites.map(getProductById).filter(Boolean);
}

function pieceLabel(count) {
  return count === 1 ? '1 pieza' : count + ' piezas';
}

/* Aviso breve en la parte inferior */
var toastTimer = null;
function showToast(message) {
  var el = $('#toast');
  if (!el) return;

  el.textContent = message;
  el.hidden = false;
  window.clearTimeout(toastTimer);
  requestAnimationFrame(function () { el.classList.add('is-visible'); });

  toastTimer = window.setTimeout(function () {
    el.classList.remove('is-visible');
    window.setTimeout(function () { el.hidden = true; }, 260);
  }, 2400);
}

/* --- Imágenes: brillo mientras cargan y respaldo si faltan --- */
function setupImages(container) {
  $$('img[data-fallback]', container).forEach(function (img) {
    if (img.dataset.bound === '1') return;
    img.dataset.bound = '1';

    img.addEventListener('load', function () { markLoaded(img); });
    img.addEventListener('error', function () { markFallback(img); });

    if (img.complete) {
      if (img.naturalWidth > 0) markLoaded(img); else markFallback(img);
    }
  });
}

function imageBox(img) {
  return img.closest('.card-media, .sheet-media, .related-media, .collection-cover, .featured-media, .hero-photo');
}

function markLoaded(img) {
  var box = imageBox(img);
  if (box) box.classList.remove('is-loading');
  img.classList.add('is-ready');
}

function markFallback(img) {
  var box = imageBox(img);
  if (box) {
    box.classList.remove('is-loading');
    box.classList.add('is-fallback');
  }
}

/* Marca de imagen reutilizable dentro de una superficie */
function mediaImageHTML(product, altText, lazy) {
  return '<img src="' + escapeHtml(product.image) + '"' +
         ' alt="' + escapeHtml(altText) + '"' +
         ' width="800" height="800" decoding="async"' +
         (lazy ? ' loading="lazy"' : '') +
         ' data-fallback>' +
         '<span class="media-fallback" aria-hidden="true"><span class="media-mark">&#10022;</span></span>';
}


/* ============================================================
   06. HERO
   ============================================================ */
function renderHero() {
  var product = getProductById(HERO_PRODUCT_ID) || products[0];
  if (!product) return;

  var photo = $('#heroPhoto');
  var img = $('#heroImg');

  img.src = product.image;
  img.alt = product.name + ', ' + product.material;
  photo.dataset.id = product.id;
  photo.setAttribute('aria-label', 'Ver ' + product.name);
  $('#heroCaption').textContent = product.category + ' · Ref. ' + product.reference;

  setupImages(photo);
}


/* ============================================================
   07. COLECCIONES
   ============================================================ */
function renderCollectionRail() {
  var rail = $('#collectionRail');
  if (!rail) return;

  var list = CATEGORIES.filter(function (category) { return category !== 'Todos'; });

  rail.innerHTML = list.map(function (category) {
    var items = getCategoryProducts(category);
    if (items.length === 0) return '';

    var cover = getProductById(COLLECTION_COVERS[category]) || items[0];
    var name = escapeHtml(category);

    return '' +
      '<button type="button" class="collection-card" data-action="open-category"' +
        ' data-category="' + name + '" aria-label="Ver ' + name + ', ' + pieceLabel(items.length) + '">' +
        '<span class="collection-cover is-loading">' + mediaImageHTML(cover, '', true) + '</span>' +
        '<span class="collection-name">' + name + '</span>' +
        '<span class="collection-count">' + pieceLabel(items.length) + '</span>' +
      '</button>';
  }).join('');

  setupImages(rail);
}


/* ============================================================
   08. SELECCIÓN SAN ORO
   ============================================================ */
function featuredProducts() {
  return FEATURED_PRODUCT_IDS.map(getProductById).filter(Boolean);
}

function renderFeatured() {
  var rail = $('#featuredRail');
  if (!rail) return;

  var list = featuredProducts();
  if (list.length === 0) {
    $('#seleccion').hidden = true;
    return;
  }

  rail.innerHTML = list.map(function (product) {
    var name = escapeHtml(product.name);
    return '' +
      '<article class="featured-card">' +
        '<button type="button" class="featured-media is-loading" data-action="open-featured"' +
          ' data-id="' + product.id + '" aria-label="Ver ' + name + '">' +
          mediaImageHTML(product, product.name + ', ' + product.material, true) +
        '</button>' +
        '<div class="featured-info">' +
          '<span class="featured-name">' + name + '</span>' +
          '<span class="featured-ref">' + escapeHtml(product.reference) + '</span>' +
        '</div>' +
      '</article>';
  }).join('');

  setupImages(rail);
}


/* ============================================================
   09. CHIPS DE COLECCIÓN
   ============================================================ */
function renderCategories() {
  var container = $('#categoryChips');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(function (category) {
    var active = category === state.category;
    return '<button type="button" class="chip' + (active ? ' is-active' : '') + '"' +
           ' data-action="category" data-category="' + escapeHtml(category) + '"' +
           ' aria-pressed="' + (active ? 'true' : 'false') + '">' +
           escapeHtml(category) +
           '</button>';
  }).join('');
}

function updateCategoryChips() {
  $$('.chip').forEach(function (chip) {
    var active = chip.dataset.category === state.category;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (active && typeof chip.scrollIntoView === 'function') {
      chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  });
}


/* ============================================================
   10. RENDER DE PRODUCTOS
   ============================================================ */
function productCardHTML(product) {
  var name = escapeHtml(product.name);
  var favorite = isFavorite(product.id);

  return '' +
    '<article class="card" data-id="' + product.id + '">' +
      '<div class="card-media is-loading">' +
        '<button type="button" class="fav-btn" data-action="fav" data-id="' + product.id + '"' +
          ' aria-pressed="' + (favorite ? 'true' : 'false') + '"' +
          ' aria-label="' + (favorite ? 'Quitar ' : 'Guardar ') + name + ' de favoritos">' +
          '<svg class="icon icon-heart" aria-hidden="true"><use href="#i-heart"></use></svg>' +
        '</button>' +
        '<button type="button" class="card-open" data-action="open" data-id="' + product.id + '"' +
          ' aria-label="Ver detalle de ' + name + '">' +
          '<img class="card-img" src="' + escapeHtml(product.image) + '"' +
          ' alt="' + name + ', ' + escapeHtml(product.material) + '"' +
          ' width="800" height="800" loading="lazy" decoding="async" data-fallback>' +
          '<span class="media-fallback" aria-hidden="true"><span class="media-mark">&#10022;</span></span>' +
        '</button>' +
      '</div>' +
      '<div class="card-info">' +
        '<h3 class="card-name"><button type="button" data-action="open" data-id="' + product.id + '">' +
          name +
        '</button></h3>' +
        '<p class="card-ref">Ref. ' + escapeHtml(product.reference) + '</p>' +
        '<button type="button" class="card-quote" data-action="quote" data-id="' + product.id + '"' +
          ' aria-label="Cotizar ' + name + ' por WhatsApp">' +
          'Cotizar' +
          '<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>' +
        '</button>' +
      '</div>' +
    '</article>';
}

function editorialHTML(index) {
  var quote = editorialQuotes[index % editorialQuotes.length];
  var source = quote.source
    ? '<p class="editorial-source">&mdash; ' + escapeHtml(quote.source) + '</p>'
    : '';

  return '' +
    '<aside class="editorial">' +
      '<span class="editorial-mark" aria-hidden="true">&#10022;</span>' +
      '<p class="editorial-quote">&ldquo;' + escapeHtml(quote.text) + '&rdquo;</p>' +
      source +
      '<p class="editorial-sign">San Oro 18K</p>' +
    '</aside>';
}

/* Cuántas pausas editoriales lleva un listado de "total" piezas */
function editorialCount(total) {
  var count = 0;
  for (var k = 1; k * EDITORIAL_EVERY <= total; k++) {
    if (total - k * EDITORIAL_EVERY >= 2) count++;
  }
  return count;
}

/* HTML de un tramo del listado.
   offset = posición de la primera pieza dentro del listado completo. */
function productsHTML(list, offset, total, withEditorial) {
  var html = '';

  list.forEach(function (product, i) {
    var position = offset + i;
    html += productCardHTML(product);

    // Una pausa nunca se inserta si detrás quedan menos de 2 piezas
    var remaining = total - (position + 1);
    if (withEditorial && remaining >= 2 && (position + 1) % EDITORIAL_EVERY === 0) {
      html += editorialHTML((position + 1) / EDITORIAL_EVERY - 1);
    }
  });

  return html;
}

/* Pinta una lista completa dentro de un contenedor */
function renderProducts(list, container, withEditorial) {
  if (!container) return;
  container.innerHTML = productsHTML(list, 0, list.length, withEditorial);
  setupImages(container);
}


/* ============================================================
   11. FILTRO, BÚSQUEDA Y CARGA PROGRESIVA
   ============================================================ */

/* Filtro puro: piezas que cumplen colección + texto */
function filterProducts(list, category, query) {
  var term = normalize(query).trim();

  return list.filter(function (product) {
    var matchCategory = (category === 'Todos') || (product.category === category);
    if (!matchCategory) return false;
    if (!term) return true;

    var haystack = normalize(
      product.name + ' ' + product.reference + ' ' + product.category + ' ' + product.material
    );
    return haystack.indexOf(term) !== -1;
  });
}

/* Rehace el catálogo con los filtros actuales (vuelve al primer lote) */
function renderCatalog() {
  state.filtered = filterProducts(products, state.category, state.query);
  state.shown = 0;

  var grid = $('#productGrid');
  var meta = $('#resultsMeta');
  var hasResults = state.filtered.length > 0;

  grid.innerHTML = '';
  grid.hidden = !hasResults;
  $('#emptyCatalog').hidden = hasResults;
  $('#loadMore').hidden = true;
  meta.hidden = !hasResults;
  meta.textContent = pieceLabel(state.filtered.length);

  if (hasResults) showMoreProducts();
}

/* Añade el siguiente lote al final de la cuadrícula */
function showMoreProducts() {
  var grid = $('#productGrid');
  var total = state.filtered.length;
  var batch = state.filtered.slice(state.shown, state.shown + PAGE_SIZE);
  if (batch.length === 0) return;

  grid.insertAdjacentHTML('beforeend', productsHTML(batch, state.shown, total, true));
  state.shown += batch.length;
  setupImages(grid);

  var finished = state.shown >= total;
  $('#loadMore').hidden = finished;

  // La frase de cierre va de últimas, después de la última pieza
  if (finished && total > EDITORIAL_EVERY) {
    grid.insertAdjacentHTML('beforeend', editorialHTML(editorialCount(total)));
  }
}

/* Pinta de una vez todas las piezas que falten.
   Se usa antes de saltar al cierre: si el catálogo siguiera creciendo
   durante el desplazamiento, el destino se movería y no se llegaría. */
function loadAllProducts() {
  var guard = 0;
  while (state.shown < state.filtered.length && guard++ < 200) showMoreProducts();
}

/* Carga automática al acercarse al final */
function setupInfiniteScroll() {
  if (!('IntersectionObserver' in window)) return;   // queda el botón "Ver más"

  $('#loadMoreBtn').hidden = true;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && state.shown < state.filtered.length) showMoreProducts();
    });
  }, { rootMargin: '600px 0px' });

  observer.observe($('#loadSentinel'));
}

function searchProducts(term) {
  state.query = term;
  $('#searchClear').hidden = term.length === 0;
  renderCatalog();
}

function selectCategory(category) {
  if (CATEGORIES.indexOf(category) === -1) return;
  state.category = category;
  updateCategoryChips();
  renderCatalog();
}


/* ============================================================
   12. FAVORITOS
   ============================================================ */
function toggleFavorite(id, buttonElement) {
  var product = getProductById(id);
  if (!product) return;

  var index = state.favorites.indexOf(id);
  if (index === -1) state.favorites.push(id);
  else state.favorites.splice(index, 1);

  saveFavorites();
  syncFavoriteButtons(id);
  updateFavoriteBadge();

  if (buttonElement) {
    buttonElement.classList.remove('is-pop');
    void buttonElement.offsetWidth;      // reinicia la animación
    buttonElement.classList.add('is-pop');
  }

  if (isSheetOpen('#favoritesSheet')) renderFavorites();
}

function syncFavoriteButtons(id) {
  var product = getProductById(id);
  if (!product) return;
  var active = isFavorite(id);

  $$('.fav-btn[data-id="' + id + '"]').forEach(function (button) {
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.setAttribute('aria-label', (active ? 'Quitar ' : 'Guardar ') + product.name + ' de favoritos');
  });

  if (state.currentId === id) updateSheetFavorite();
}

function updateFavoriteBadge() {
  var count = state.favorites.length;
  [$('#favBadge'), $('#dockBadge')].forEach(function (badge) {
    if (!badge) return;
    badge.textContent = count;
    badge.hidden = count === 0;
  });
}

function renderFavorites() {
  var list = favoriteProducts();
  var grid = $('#favoritesGrid');
  var hasItems = list.length > 0;

  renderProducts(list, grid, false);

  grid.hidden = !hasItems;
  $('#emptyFavorites').hidden = hasItems;
  $('#favFoot').hidden = !hasItems;
  $('#favSheetCount').textContent = hasItems ? pieceLabel(list.length) + ' guardadas' : 'Ninguna pieza guardada';
  resetClearConfirm();
}

/* Vaciar la lista pide confirmación tocando dos veces (sin ventanas del navegador) */
var clearArmed = false;
var clearTimer = null;

function resetClearConfirm() {
  clearArmed = false;
  window.clearTimeout(clearTimer);
  var label = $('#favClearLabel');
  if (label) label.textContent = 'Vaciar lista';
}

function clearFavorites() {
  var label = $('#favClearLabel');

  if (!clearArmed) {
    clearArmed = true;
    if (label) label.textContent = 'Toca otra vez para confirmar';
    clearTimer = window.setTimeout(resetClearConfirm, 3500);
    return;
  }

  resetClearConfirm();
  state.favorites = [];
  saveFavorites();
  $$('.fav-btn').forEach(function (button) { button.setAttribute('aria-pressed', 'false'); });
  renderFavorites();
  updateFavoriteBadge();
  showToast('Lista de favoritos vaciada');
}


/* ============================================================
   13. DETALLE DEL PRODUCTO
   ============================================================ */

/* --- Bloqueo de scroll compartido por los sheets --- */
function lockScroll() {
  if (state.locks === 0) {
    state.scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = -state.scrollY + 'px';
    document.body.classList.add('is-locked');
  }
  state.locks++;
}

function unlockScroll() {
  state.locks = Math.max(0, state.locks - 1);
  if (state.locks === 0) {
    document.body.classList.remove('is-locked');
    document.body.style.top = '';
    window.scrollTo(0, state.scrollY);
  }
}

function isSheetOpen(selector) {
  var sheet = $(selector);
  return !!sheet && !sheet.hidden;
}

function openSheet(sheetSelector, backdropSelector, focusSelector) {
  var sheet = $(sheetSelector);
  var backdrop = $(backdropSelector);
  if (!sheet || !sheet.hidden) return;

  state.lastFocused = document.activeElement;
  backdrop.hidden = false;
  sheet.hidden = false;
  lockScroll();

  requestAnimationFrame(function () {
    backdrop.classList.add('is-open');
    sheet.classList.add('is-open');
  });

  var focusTarget = $(focusSelector);
  if (focusTarget) focusTarget.focus({ preventScroll: true });
}

function closeSheet(sheetSelector, backdropSelector) {
  var sheet = $(sheetSelector);
  var backdrop = $(backdropSelector);
  if (!sheet || sheet.hidden) return;

  sheet.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  unlockScroll();

  window.setTimeout(function () {
    sheet.hidden = true;
    backdrop.hidden = true;
  }, 320);

  if (state.lastFocused && typeof state.lastFocused.focus === 'function') {
    state.lastFocused.focus({ preventScroll: true });
  }
}

/* --- Favoritos como sheet --- */
function openFavorites() {
  renderFavorites();
  openSheet('#favoritesSheet', '#favBackdrop', '#favClose');
}

function closeFavorites() {
  closeSheet('#favoritesSheet', '#favBackdrop');
}

/* --- Detalle --- */
function openProduct(id, list, silent) {
  var product = getProductById(id);
  if (!product) return;

  var alreadyOpen = state.currentId !== null;

  state.sheetList = (list && list.length) ? list : getCategoryProducts(product.category);
  state.currentId = id;

  fillSheet(product);
  updateGalleryNav();
  renderRelated(product);

  if (!silent) {
    if (alreadyOpen) setHashSilently('#/pieza/' + encodeURIComponent(product.reference));
    else window.location.hash = '#/pieza/' + encodeURIComponent(product.reference);
  }

  if (alreadyOpen) {
    $('#sheetScroll').scrollTop = 0;
    return;
  }

  $('#sheetScroll').scrollTop = 0;
  openSheet('#productSheet', '#sheetBackdrop', '#sheetClose');
}

function fillSheet(product) {
  var media = $('#sheetMedia');
  var img = $('#sheetImg');

  $('#sheetCat').textContent = product.category;
  $('#sheetName').textContent = product.name;
  $('#sheetRef').textContent = 'Ref. ' + product.reference;
  $('#sheetMaterial').textContent = product.material;
  $('#sheetDesc').textContent = product.description || '';
  $('#sheetDesc').hidden = !product.description;

  media.classList.remove('is-fallback');
  media.classList.add('is-loading');
  img.classList.remove('is-ready');
  img.alt = product.name + ', ' + product.material;
  img.src = product.image;
  if (img.complete) {
    if (img.naturalWidth > 0) markLoaded(img); else markFallback(img);
  }

  updateSheetFavorite();
}

function closeProduct() {
  if (!isSheetOpen('#productSheet')) return;
  closeSheet('#productSheet', '#sheetBackdrop');
  state.currentId = null;
}

function updateSheetFavorite() {
  var button = $('#sheetFav');
  var product = getProductById(state.currentId);
  if (!button || !product) return;

  var active = isFavorite(product.id);
  button.dataset.id = product.id;
  button.setAttribute('aria-pressed', active ? 'true' : 'false');
  button.setAttribute('aria-label', (active ? 'Quitar ' : 'Guardar ') + product.name + ' de favoritos');
}

function currentSheetIndex() {
  for (var i = 0; i < state.sheetList.length; i++) {
    if (state.sheetList[i].id === state.currentId) return i;
  }
  return -1;
}

function stepProduct(direction) {
  var index = currentSheetIndex();
  if (index === -1) return;
  var next = state.sheetList[index + direction];
  if (next) openProduct(next.id, state.sheetList);
}

function updateGalleryNav() {
  var index = currentSheetIndex();
  $('.gallery-prev').disabled = index <= 0;
  $('.gallery-next').disabled = index === -1 || index >= state.sheetList.length - 1;
}

function renderRelated(product) {
  var block = $('#relatedBlock');
  var track = $('#relatedTrack');

  var list = getCategoryProducts(product.category)
    .filter(function (p) { return p.id !== product.id; })
    .slice(0, 12);

  if (list.length === 0) {
    block.hidden = true;
    track.innerHTML = '';
    return;
  }

  $('#relatedTitle').textContent = 'Más de ' + product.category;

  track.innerHTML = list.map(function (p) {
    var name = escapeHtml(p.name);
    return '' +
      '<button type="button" class="related-card" data-action="open-related" data-id="' + p.id + '"' +
        ' aria-label="Ver ' + name + '">' +
        '<span class="related-media is-loading">' + mediaImageHTML(p, '', true) + '</span>' +
        '<span class="related-name">' + name + '</span>' +
        '<span class="related-ref">' + escapeHtml(p.reference) + '</span>' +
      '</button>';
  }).join('');

  block.hidden = false;
  setupImages(track);
}

/* Mantiene el foco dentro del sheet abierto */
function trapFocus(event) {
  if (event.key !== 'Tab') return;
  var sheet = isSheetOpen('#productSheet') ? $('#productSheet')
            : isSheetOpen('#favoritesSheet') ? $('#favoritesSheet') : null;
  if (!sheet) return;

  var focusables = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', sheet)
    .filter(function (el) { return el.offsetParent !== null && !el.disabled; });
  if (focusables.length === 0) return;

  var first = focusables[0];
  var last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}


/* ============================================================
   14. WHATSAPP
   ------------------------------------------------------------
   Abre wa.me con el mensaje ya escrito. Sin pasos intermedios.
   ============================================================ */
function openWhatsAppMessage(message) {
  var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

  // noopener/noreferrer: la pestaña nueva no puede manipular esta página
  var newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
}

function quoteProduct(id) {
  var product = getProductById(id);
  if (!product) return;
  openWhatsAppMessage(whatsappMessageFor(product));
}

/* Un solo mensaje con todas las piezas guardadas */
function quoteFavorites() {
  var list = favoriteProducts();
  if (list.length === 0) return;

  var visible = list.slice(0, MAX_QUOTE_ITEMS);
  var lines = visible.map(function (p) { return '• ' + p.name + ' (' + p.reference + ')'; });

  var message = 'Hola! Estoy interesad@ en estas piezas:\n' + lines.join('\n');
  var rest = list.length - visible.length;
  if (rest > 0) message += '\ny ' + rest + ' piezas más de mi lista.';
  message += '\n¿Me podrían dar información sobre precio y disponibilidad?';

  openWhatsAppMessage(message);
}


/* ============================================================
   15. COMPARTIR
   ============================================================ */
function shareProduct() {
  var product = getProductById(state.currentId);
  if (!product) return;

  var url = window.location.href;
  var text = product.name + ' · Ref. ' + product.reference + ' · San Oro 18K';

  if (navigator.share) {
    navigator.share({ title: 'San Oro 18K', text: text, url: url }).catch(function () {
      /* el usuario canceló */
    });
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(function () { showToast('Enlace copiado'); })
      .catch(function () { showToast('No se pudo copiar el enlace'); });
    return;
  }

  showToast('Copia el enlace desde la barra del navegador');
}


/* ============================================================
   16. NAVEGACIÓN, DOCK Y ENLACES
   ------------------------------------------------------------
   Una sola página continua. El hash se usa solo para poder
   compartir una pieza (#/pieza/CAD-001) y para que el botón
   "atrás" del teléfono cierre los sheets.
   ============================================================ */
function setHashSilently(hash) {
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', hash);
  } else {
    window.location.hash = hash;
  }
}

function scrollToTarget(selector) {
  var target = $(selector);
  if (!target) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var distance = Math.abs(target.getBoundingClientRect().top);

  // Un desplazamiento suave a través de todo el catálogo se vería como un borrón:
  // a partir de tres pantallas de distancia el salto es directo.
  var behavior = (reduce || distance > window.innerHeight * 3) ? 'auto' : 'smooth';
  target.scrollIntoView({ behavior: behavior, block: 'start' });
}

/* Lee la dirección actual y deja la interfaz en el estado que describe */
function handleHash() {
  var raw = window.location.hash.replace(/^#\/?/, '');
  var parts = raw.split('/');

  if (parts[0] === 'pieza' && parts[1]) {
    var product = getProductByReference(decodeURIComponent(parts[1]));
    if (product) {
      if (state.currentId !== product.id) openProduct(product.id, null, true);
      return;
    }
  }

  if (parts[0] === 'favoritos') {
    closeProduct();
    if (!isSheetOpen('#favoritesSheet')) openFavorites();
    return;
  }

  closeProduct();
  closeFavorites();
}

/* Estado del header, de los chips y del dock según el scroll */
var scrollScheduled = false;
function onScroll() {
  if (scrollScheduled) return;
  scrollScheduled = true;

  requestAnimationFrame(function () {
    scrollScheduled = false;

    var y = window.scrollY || window.pageYOffset || 0;
    $('#appHeader').classList.toggle('is-scrolled', y > 8);

    var headerHeight = $('#appHeader').offsetHeight;
    var chipsBar = $('#chipsBar');
    if (chipsBar) {
      chipsBar.classList.toggle('is-stuck', chipsBar.getBoundingClientRect().top <= headerHeight + 1);
    }

    // Zona activa del dock: inicio, catálogo o cierre
    var catalog = $('#catalogo');
    var closing = $('#contacto');
    var zone = 'inicio';
    if (closing && closing.getBoundingClientRect().top <= window.innerHeight * 0.6) {
      zone = 'contacto';
    } else if (catalog && catalog.getBoundingClientRect().top <= headerHeight + 40) {
      zone = 'catalogo';
    }
    $$('.dock-item[data-dock]').forEach(function (item) {
      item.classList.toggle('is-active', item.dataset.dock === zone);
    });

    if (chipsBar) chipsBar.classList.toggle('is-away', zone === 'contacto');
  });
}


/* ============================================================
   17. EVENTOS
   ============================================================ */
function bindEvents() {

  /* --- Un solo delegado de clics para toda la página --- */
  document.addEventListener('click', function (event) {

    var scrollTrigger = event.target.closest('[data-scroll]');
    if (scrollTrigger) {
      var destination = scrollTrigger.dataset.scroll;
      // El cierre está debajo del catálogo: hay que fijarlo antes de saltar
      if (destination === '#contacto') loadAllProducts();
      scrollToTarget(destination);
      return;
    }

    var trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    var action = trigger.dataset.action;
    var id = trigger.dataset.id ? parseInt(trigger.dataset.id, 10) : null;

    switch (action) {
      case 'open':
        // El listado de navegación depende de dónde se tocó la pieza
        openProduct(id, trigger.closest('#favoritesGrid') ? favoriteProducts() : state.filtered);
        break;

      case 'open-featured':
        openProduct(id, featuredProducts());
        break;

      case 'open-related':
        openProduct(id, null);
        break;

      case 'open-hero':
        openProduct(id, null);
        break;

      case 'prev-product': stepProduct(-1); break;
      case 'next-product': stepProduct(1); break;

      case 'fav': toggleFavorite(id, trigger); break;
      case 'quote': quoteProduct(id); break;
      case 'quote-current': quoteProduct(state.currentId); break;
      case 'quote-favorites': quoteFavorites(); break;
      case 'quote-general': openWhatsAppMessage(WHATSAPP_GENERAL); break;
      case 'clear-favorites': clearFavorites(); break;

      case 'open-favorites':
        window.location.hash = '#/favoritos';
        break;

      case 'close-favorites':
        setHashSilently('#/');
        closeFavorites();
        break;

      case 'category':
        selectCategory(trigger.dataset.category);
        break;

      case 'open-category':
        selectCategory(trigger.dataset.category);
        scrollToTarget('#catalogo');
        break;

      case 'load-more':
        showMoreProducts();
        break;

      case 'focus-search':
        scrollToTarget('#catalogo');
        $('#searchInput').focus({ preventScroll: true });
        break;

      case 'reset-filters':
        state.query = '';
        $('#searchInput').value = '';
        $('#searchClear').hidden = true;
        selectCategory('Todos');
        break;
    }
  });

  /* --- Hero: abre la pieza protagonista --- */
  $('#heroPhoto').addEventListener('click', function () {
    var id = parseInt(this.dataset.id, 10);
    if (id) openProduct(id, null);
  });

  /* --- Acciones de los sheets --- */
  $('#sheetFav').addEventListener('click', function () {
    if (state.currentId !== null) toggleFavorite(state.currentId, this);
  });
  $('#sheetShare').addEventListener('click', shareProduct);

  $('#sheetClose').addEventListener('click', function () {
    setHashSilently(isSheetOpen('#favoritesSheet') ? '#/favoritos' : '#/');
    closeProduct();
  });
  $('#sheetBackdrop').addEventListener('click', function () {
    setHashSilently(isSheetOpen('#favoritesSheet') ? '#/favoritos' : '#/');
    closeProduct();
  });

  $('#favClose').addEventListener('click', function () {
    setHashSilently('#/');
    closeFavorites();
  });
  $('#favBackdrop').addEventListener('click', function () {
    setHashSilently('#/');
    closeFavorites();
  });

  document.addEventListener('keydown', function (event) {
    if (isSheetOpen('#productSheet')) {
      if (event.key === 'Escape') { setHashSilently(isSheetOpen('#favoritesSheet') ? '#/favoritos' : '#/'); closeProduct(); }
      if (event.key === 'ArrowLeft') stepProduct(-1);
      if (event.key === 'ArrowRight') stepProduct(1);
    } else if (isSheetOpen('#favoritesSheet')) {
      if (event.key === 'Escape') { setHashSilently('#/'); closeFavorites(); }
    }
    trapFocus(event);
  });

  /* --- Buscador en tiempo real --- */
  $('#searchInput').addEventListener('input', function () { searchProducts(this.value); });
  $('#searchClear').addEventListener('click', function () {
    var input = $('#searchInput');
    input.value = '';
    searchProducts('');
    input.focus();
  });

  /* --- Scroll y enlaces --- */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('hashchange', handleHash);
}


/* ============================================================
   18. INICIO
   ============================================================ */
function init() {
  state.favorites = loadFavorites();

  renderHero();
  renderCollectionRail();
  renderFeatured();
  renderCategories();
  renderCatalog();
  updateFavoriteBadge();

  bindEvents();
  setupInfiniteScroll();
  onScroll();

  // Respeta la dirección con la que se abrió la página
  handleHash();
}

document.addEventListener('DOMContentLoaded', init);