<template>
  <div class="pagina-inicio">
    <!-- CARRUSEL -->
    <q-carousel
      v-model="slide"
      animated
      arrows
      control-type="regular"
      height="600px"
      class="carrusel-principal"
      autoplay
      :autoplay-interval="4000"
    >
      <q-carousel-slide
        v-for="(img, index) in imagenes"
        :key="index"
        :name="index"
        :img-src="img"
        class="carrusel-slide"
      />
      <template #control-left>
        <q-btn round flat color="white" icon="chevron_left" class="bg-dark q-ml-sm" />
      </template>
      <template #control-right>
        <q-btn round flat color="white" icon="chevron_right" class="bg-dark q-mr-sm" />
      </template>
    </q-carousel>

    <!-- CATEGORÍAS MEJORADAS -->
    <div class="categorias-section q-py-xl" id="categorias">
      <!-- Título de la sección -->
      <div class="titulo-seccion q-mb-lg">
        <q-icon name="restaurant_menu" size="28px" class="q-mr-sm" color="brown-8" />
        <span class="titulo-texto">Nuestro menú</span>
      </div>
      
      <!-- Grid de categorías con navegación mejorada -->
      <div class="categorias-grid">
        <q-card
          v-for="item in categorias"
          :key="item.label"
          class="categoria-card cursor-pointer"
          @click="navegarACategoria(item.to)"
          flat
        >
          <div class="categoria-img-container">
            <q-img :src="item.img" class="categoria-img" />
            <div class="categoria-overlay">
              <q-icon name="arrow_forward" color="white" size="md" />
            </div>
          </div>
          <div class="categoria-boton">
            {{ item.label }}
          </div>
        </q-card>
      </div>
    </div>

    <!-- PROMOCIONES DESTACADAS -->
    <div class="promociones-container" id="promociones">
      <div class="titulo-seccion q-mb-lg q-mt-xl">
        <q-icon name="local_offer" size="28px" class="q-mr-sm" color="red-8" />
        <span class="titulo-texto">Promociones destacadas</span>
      </div>

      <div class="row q-col-gutter-md q-mb-xl justify-center">
        <div
          class="col-xs-12 col-sm-6 col-md-3"
          v-for="promo in promocionesDestacadas"
          :key="promo.id"
        >
          <q-card class="promo-card shadow-3 cursor-pointer" @click="abrirModal(promo)">
            <div class="promo-img-container">
              <img
                :src="promo.imagen"
                alt="Imagen de promoción"
                class="promo-img"
              />
              <div class="promo-overlay">
                <q-icon name="visibility" color="white" size="md" />
                <div class="promo-precio-overlay">{{ formatPrecio(promo.precio) }}</div>
              </div>
            </div>
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-dark promo-nombre">
                {{ promo.nombre }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs promo-descripcion-corta">
                {{ promo.descripcion.substring(0, 80) }}...
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      
      
    </div>

    <!-- MODAL DE PROMOCIÓN -->
    <q-dialog v-model="modalAbierto" persistent transition-show="scale" transition-hide="scale">
      <q-card class="modal-card text-dark">
        <q-card-section class="row items-center justify-between modal-header">
          <div class="text-h6">{{ promocionSeleccionada?.nombre }}</div>
          <q-btn icon="close" flat round dense @click="modalAbierto = false" />
        </q-card-section>

        <q-img
          :src="promocionSeleccionada?.imagen"
          alt="Imagen"
          class="modal-img"
          fit="cover"
        />

        <q-separator />

        <q-card-section>
          <div class="text-subtitle1 text-bold">{{ promocionSeleccionada?.nombre }}</div>
          <div class="text-body2 q-mt-sm">{{ promocionSeleccionada?.descripcion }}</div>
          <div class="modal-total text-h6 q-mt-md">Total: {{ precioTotal() }}</div>
        </q-card-section>

        <!-- Adicionales -->
        <q-card-section>
          <div class="text-subtitle2 text-bold q-mb-sm">¿Desea adicionar algo?</div>
          <q-separator class="q-mb-md" color="grey-4" />
          <div
            v-for="(item, index) in adicionales"
            :key="index"
            class="row items-center justify-between q-pa-sm q-mb-sm bg-grey-2 rounded-borders shadow-1"
          >
            <div>
              {{ item.nombre }}
              <span class="text-positive text-caption">(+{{ formatPrecio(item.precio) }})</span>
            </div>
            <div class="row items-center">
              <q-btn icon="remove" flat round @click="item.cantidad > 0 && item.cantidad--" />
              <div class="q-mx-sm text-weight-medium">{{ item.cantidad }}</div>
              <q-btn icon="add" flat round @click="item.cantidad++" />
            </div>
          </div>
        </q-card-section>

        <!-- Especificaciones -->
        <q-card-section>
          <div class="text-subtitle2 text-bold q-mb-xs">Especificaciones adicionales</div>
          <q-input
            v-model="especificaciones"
            filled
            type="textarea"
            placeholder="Ej: Sin cebolla, extra salsa, etc."
            autogrow
            dense
          />
        </q-card-section>

        <!-- Botón de agregar al carrito -->
        <q-card-actions align="center" class="q-mt-md">
          <q-btn 
            round 
            :style="{ backgroundColor: '#600000', color: 'white' }" 
            icon="shopping_cart" 
            size="lg" 
            @click="agregarAlCarrito"
          >
            <q-tooltip>Agregar al carrito</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL DE CARRITO -->
    <q-dialog v-model="carritoAbierto" persistent transition-show="fade" transition-hide="fade">
      <q-card class="modal-carrito">
        <q-card-section>
          <div class="text-h6 text-center text-primary q-mb-md">🛒 Tu carrito</div>

          <div v-if="carrito.items.length === 0" class="text-center text-grey q-mt-md">
            No has agregado productos todavía.
          </div>

          <div v-for="(item, i) in carrito.items" :key="i" class="item-carrito">
            <div class="row items-center justify-between">
              <div class="text-bold text-dark">{{ item.nombre }}</div>
              <div>
                <q-btn 
                  icon="edit" 
                  flat 
                  round 
                  dense 
                  color="primary" 
                  @click="editarItem(i)"
                  class="q-mr-sm"
                />
                <q-btn 
                  icon="delete" 
                  flat 
                  round 
                  dense 
                  color="negative" 
                  @click="eliminarItem(i)"
                />
              </div>
            </div>
            <div class="text-subtitle2 text-positive">Total: {{ formatPrecio(item.total) }}</div>

            <div v-if="item.adicionales.length > 0" class="text-caption q-mt-xs">
              <q-icon name="add_circle" color="green" size="14px" class="q-mr-xs" />
              <strong>Adicionales:</strong>
              <ul class="q-ml-md q-mt-xs">
                <li v-for="a in item.adicionales" :key="a.nombre">
                  {{ a.nombre }} x{{ a.cantidad }} (+{{ formatPrecio(a.precio * a.cantidad) }})
                </li>
              </ul>
            </div>

            <div v-if="item.especificaciones" class="text-caption text-grey-8 q-mt-xs">
              <q-icon name="edit_note" size="16px" class="q-mr-xs" />
              {{ item.especificaciones }}
            </div>

            <q-separator class="q-my-sm" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" class="btn-cerrar-carrito" @click="carritoAbierto = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Botón flotante único -->
    <q-btn
      round
      size="xl"
      icon="shopping_cart"
      class="text-white"
      :style="{ backgroundColor: '#600000', position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }"
      @click="carritoAbierto = true"
    >
      <q-badge
        v-if="carrito.items.length > 0"
        color="red"
        floating
        transparent
        class="text-white"
        :label="carrito.items.length"
      />
    </q-btn>

    <!-- FOOTER ESTILO EL CORRAL -->
    <footer class="footer-elcorral">
      <div class="footer-contenido q-py-xl row justify-between items-start">
        <!-- Logo y redes -->
        <div class="col-12 col-md-3 column items-center items-md-start q-gutter-md">
          <img src="/img/logo.png" alt="Logo El Corral" class="footer-logo" />
          <div class="row q-gutter-sm">
            <q-icon name="mdi-instagram" size="24px" />
            <q-icon name="mdi-tiktok" size="24px" />
            <q-icon name="mdi-facebook" size="24px" />
            <q-icon name="mdi-twitter" size="24px" />
            <q-icon name="mdi-youtube" size="24px" />
          </div>
        </div>

        <!-- Enlaces informativos -->
        <div class="col-12 col-md-8 row q-gutter-md justify-between text-white">
          <div class="column q-gutter-xs">
            <div class="footer-titulo">Sobre BDC</div>
            <div class="footer-link">Quiénes somos</div>
            <div class="footer-link">Sostenibilidad</div>
            <div class="footer-link">Domicilios corporativos</div>
            <div class="footer-link">Superintendencia de Industria y Comercio</div>
            <div class="footer-link">Certificados</div>
            <div class="footer-link">Contáctanos - PQRS</div>
          </div>

          <div class="column q-gutter-xs">
            <div class="footer-titulo">Legales</div>
            <div class="footer-link">Política de tratamiento de datos</div>
            <div class="footer-link">Autorización de tratamiento</div>
            <div class="footer-link">Términos y condiciones</div>
            <div class="footer-link">Términos de campañas</div>
            <div class="footer-link">Gestión de cookies</div>
          </div>
        </div>
      </div>

      <!-- Pie de página -->
      <div class="footer-bottom text-center q-pt-lg">
        <div class="footer-text-sm">El gramaje de cada proteína corresponde a su peso en crudo. Todos nuestros precios incluyen impuestos.</div>
        <div class="footer-text-sm">Fotos de referencia publicitaria. Sujeto a disponibilidad y cobertura del punto de venta.</div>
        <div class="footer-text-sm q-mt-sm">notifica@alimentosalconsumidor.com</div>
        <div class="footer-text-md q-mt-md">Copyright © El Corral. Todos los derechos reservados.</div>
        <div class="footer-text-md q-mt-sm">Desarrollado por <strong>TRD</strong></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const carrito = inject('carrito')

const slide = ref(0)

const imagenes = [
  '/img/1.png',
  '/img/2.png',
  '/img/3.png',
  '/img/4.png'
]

const categorias = [
  { label: 'Hamburguesas', to: '/hamburguesas', img: '/img/icono1.png' },
  { label: 'Perros', to: '/perros', img: '/img/icono2.png' },
  { label: 'Salchipapas', to: '/salchipapas', img: '/img/icono3.png' },
  { label: 'Extras', to: '/extras', img: '/img/icono5.png' },
  { label: 'Bebidas', to: '/bebidas', img: '/img/icono4.png' },
]


const promocionesDestacadas = ref([
  { id: 1, nombre: 'Combo 1', imagen: '/img/combo1.png', descripcion: 'Hamburguesa con doble carne con pollo apanado, doble queso chedar, vegetales frescos + porción pequeña de papas a la francesa + una refrescante Pepsi personal', precio: 25000 },
  { id: 2, nombre: 'Combo 2', imagen: '/img/combo2.png', descripcion: 'Perro sencillo + porción pequeña de papas a la francesa + lata personal de pony malta', precio: 28000 },
  { id: 3, nombre: 'Combo 3', imagen: '/img/combo3.png', descripcion: 'Porción doble de papas a la francesa + coca cola personal + una deliciosa hamburguesa doble carne, doble queso y vegetales frescos', precio: 35000 },
  { id: 4, nombre: 'Combo 4', imagen: '/img/combo4.png', descripcion: 'Porción de Nuggets de pollo + porción de papas a la francesa + lata personal de Sprite + una deliciosa hamburguesa sencilla', precio: 31000 },
  { id: 5, nombre: 'Combo 5', imagen: '/img/combo5.png', descripcion: 'Hamburguesa con doble carne con pollo apanado, doble queso chedar, vegetales frescos + porción pequeña de papas a la francesa + una refrescante Pepsi personal', precio: 25000 },
  { id: 6, nombre: 'Combo 6', imagen: '/img/combo6.png', descripcion: 'Perro sencillo + porción pequeña de papas a la francesa + lata personal de pony malta', precio: 28000 },
  { id: 7, nombre: 'Combo 7', imagen: '/img/combo7.png', descripcion: 'Porción doble de papas a la francesa + coca cola personal + una deliciosa hamburguesa doble carne, doble queso y vegetales frescos', precio: 35000 },
  { id: 8, nombre: 'Combo 8', imagen: '/img/combo8.png', descripcion: 'Porción de Nuggets de pollo + porción de papas a la francesa + lata personal de Sprite + una deliciosa hamburguesa sencilla', precio: 31000 }
])

const adicionales = ref([
  { nombre: 'Tocineta', cantidad: 0, precio: 4000 },
  { nombre: 'Lonjas de queso', cantidad: 0, precio: 2500 },
  { nombre: 'Carne de hamburguesa', cantidad: 0, precio: 9000 },
  { nombre: 'Pechuga apanada', cantidad: 0, precio: 8000 },
  { nombre: 'Huevo', cantidad: 0, precio: 1000 },
  { nombre: 'Vegetales', cantidad: 0, precio: 800 },
])

const modalAbierto = ref(false)
const promocionSeleccionada = ref(null)
const especificaciones = ref('')
const carritoAbierto = ref(false)
const editandoIndex = ref(null)

function navegarACategoria(ruta) {
  router.push(ruta)
}

function scrollToPromos() {
  document.getElementById('promociones')?.scrollIntoView({ behavior: 'smooth' })
}

function abrirModal(promo, index = null) {
  promocionSeleccionada.value = promo
  editandoIndex.value = index
  modalAbierto.value = true
  
  // Resetear adicionales
  adicionales.value.forEach(a => a.cantidad = 0)
  especificaciones.value = ''
  
  // Si estamos editando, cargar los datos existentes
  if (index !== null && carrito.items[index]) {
    const item = carrito.items[index]
    especificaciones.value = item.especificaciones || ''
    
    // Cargar adicionales
    item.adicionales.forEach(adicional => {
      const addIndex = adicionales.value.findIndex(a => a.nombre === adicional.nombre)
      if (addIndex !== -1) {
        adicionales.value[addIndex].cantidad = adicional.cantidad
      }
    })
  }
}

function agregarAlCarrito() {
  if (!promocionSeleccionada.value) return

  const adicionalesSeleccionados = adicionales.value.filter(a => a.cantidad > 0)

  const total = promocionSeleccionada.value.precio +
    adicionalesSeleccionados.reduce((sum, a) => sum + a.precio * a.cantidad, 0)

  const nuevoItem = {
    ...promocionSeleccionada.value,
    adicionales: adicionalesSeleccionados,
    especificaciones: especificaciones.value,
    total
  }

  if (editandoIndex.value !== null) {
    // Reemplazar el item existente
    carrito.items[editandoIndex.value] = nuevoItem
  } else {
    // Agregar nuevo item
    carrito.items.push(nuevoItem)
  }

  modalAbierto.value = false
  editandoIndex.value = null
}

function editarItem(index) {
  const item = carrito.items[index]
  const promo = promocionesDestacadas.value.find(p => p.id === item.id) || item
  abrirModal(promo, index)
}

function eliminarItem(index) {
  carrito.items.splice(index, 1)
}

function precioTotal() {
  const base = promocionSeleccionada.value?.precio || 0
  const adicionalesTotal = adicionales.value.reduce(
    (sum, item) => sum + item.cantidad * item.precio, 0
  )
  return formatPrecio(base + adicionalesTotal)
}

function formatPrecio(valor) {
  return `$${valor.toLocaleString('es-CO')}`
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Fredoka+One:wght@400&display=swap');

.pagina-inicio {
  margin: 0;
  padding: 0;
  background: #fff;
}

/* Carrusel mejorado */
.carrusel-principal {
  border-radius: 0;
  margin: 0;
  padding: 0;
  position: relative;
}

.carrusel-slide::v-deep(.q-carousel__slide) {
  object-fit: cover;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

/* SECCIÓN DE CATEGORÍAS MEJORADA */
.categorias-section {
  background-color: #f8f6f3;
  padding: 60px 80px;
}

.titulo-seccion {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 40px;
  margin-left: 20px;
}

.titulo-texto {
  font-family: 'Open Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #5D4E37;
  letter-spacing: -0.5px;
}

.categorias-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.categoria-card {
  background: transparent;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.categoria-card:hover {
  transform: translateY(-5px);
}

.categoria-img-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
}

.categoria-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.categoria-card:hover .categoria-img {
  transform: scale(1.1);
}

.categoria-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(96, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.categoria-card:hover .categoria-overlay {
  opacity: 1;
}

.categoria-boton {
  background: transparent;
  color: #5D4E37;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: lowercase;
  text-align: center;
  line-height: 1.2;
  transition: all 0.3s ease;
}

.categoria-card:hover .categoria-boton {
  color: #8B4513;
  transform: scale(1.05);
}

/* Banner mejorado */
.banner-promos {
  width: 100%;
  height: auto;
  border-radius: 0;
  margin: 0;
  padding: 0;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.banner-promos:hover {
  transform: scale(1.02);
}

/* Promociones mejoradas */
.promociones-container {
  padding: 60px 80px;
  background: #fff;
}

.promo-card {
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.promo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}

.promo-img-container {
  height: 220px;
  overflow: hidden;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: relative;
}

.promo-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.promo-card:hover .promo-img {
  transform: scale(1.08);
}

.promo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(96, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.promo-card:hover .promo-overlay {
  opacity: 1;
}

.promo-precio-overlay {
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 12px;
}

.promo-nombre {
  font-size: 17px;
  color: #600000;
}

.promo-descripcion-corta {
  line-height: 1.3;
}

.btn-ver-mas {
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  padding: 12px 32px;
  transition: all 0.3s ease;
}

.btn-ver-mas:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(139, 69, 19, 0.3);
}

/* Modal mejorado */
.modal-card {
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: #fff;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.modal-header {
  background: linear-gradient(135deg, #f8f8f8, #eeeeee);
  border-bottom: 1px solid #e0e0e0;
}

.modal-img {
  border-bottom: 4px solid #600000;
  max-height: 300px;
}

.modal-total {
  color: #600000;
  font-weight: bold;
  background: #fff4f4;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
}

.rounded-borders {
  border-radius: 8px;
}

/* ESTILOS DEL CARRITO */
.modal-carrito {
  max-width: 500px;
  width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: fadeInModal 0.3s ease;
}

.modal-carrito h6 {
  font-size: 20px;
  font-weight: bold;
  color: #600000;
  margin-bottom: 16px;
}

.item-carrito {
  border-bottom: 1px solid #ddd;
  padding: 12px 0;
}

.item-carrito:last-child {
  border-bottom: none;
}

.item-carrito strong {
  font-size: 16px;
  color: #333;
}

.item-carrito span {
  display: block;
  margin-top: 4px;
  font-size: 15px;
  color: #444;
}

.btn-cerrar-carrito {
  color: #600000;
  font-weight: bold;
  margin-top: 20px;
  text-align: right;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-cerrar-carrito:hover {
  color: #a00000;
}

@keyframes fadeInModal {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* FOOTER */
.footer-elcorral {
  background-color: #430000;
  color: #fff;
  padding: 60px 80px 30px;
  font-family: 'Open Sans', sans-serif;
}

.footer-logo {
  width: 540px;
  margin-bottom: 16px;
}

.footer-titulo {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 16px;
}

.footer-link {
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ffb300;
}

.footer-text-sm {
  font-size: 12px;
  color: #ddd;
}

.footer-text-md {
  font-size: 14px;
  color: #eee;
}

@media (max-width: 768px) {
  .footer-elcorral {
    padding: 40px 20px 20px;
  }

  .footer-logo {
    width: 100px;
  }

  .footer-titulo {
    font-size: 14px;
  }

  .footer-link {
    font-size: 13px;
  }

  .footer-text-sm,
  .footer-text-md {
    font-size: 12px;
  }
}
</style>