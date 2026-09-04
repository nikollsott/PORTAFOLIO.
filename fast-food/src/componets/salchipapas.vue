<template>
  <div class="pagina-promos q-px-xl q-py-xl">
    <!-- Categorías centradas y estilizadas -->
    <div class="categorias-section q-mb-xl">
      <div class="titulo-seccion q-mb-lg text-center">
        <q-icon name="restaurant_menu" size="28px" class="q-mr-sm" color="brown-8" />
        <span class="titulo-texto">Nuestro menú</span>
      </div>
      
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

    <!-- Grid de promociones -->
    <div class="promociones-grid">
      <div
        class="col-xs-12 col-sm-6 col-md-4"
        v-for="promo in promociones"
        :key="promo.id"
      >
        <q-card class="promo-card cursor-pointer" @click="abrirModal(promo)">
          <div class="promo-img-container">
            <q-img
              :src="promo.imagen"
              alt="Imagen de promoción"
              class="promo-img"
              fit="cover"
            />
            <div class="promo-overlay">
              <q-icon name="visibility" color="white" size="md" />
            </div>
          </div>
          <q-card-section class="q-pa-sm">
            <div class="promo-nombre">{{ promo.nombre }}</div>
            <div class="promo-precio">{{ formatPrecio(promo.precio) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Modal de producto -->
    <q-dialog v-model="modalAbierto" persistent transition-show="scale" transition-hide="scale">
      <q-card class="modal-card text-dark">
        <q-card-section class="row items-center justify-between modal-header">
          <div class="text-h6">{{ promocionSeleccionada?.nombre }}</div>
          <q-btn icon="close" flat round dense @click="modalAbierto = false" />
        </q-card-section>

        <q-img :src="promocionSeleccionada?.imagen" alt="Imagen" class="modal-img" fit="cover" />
        <q-separator />

        <q-card-section>
          <div class="text-subtitle1 text-bold">{{ promocionSeleccionada?.nombre }}</div>
          <div class="text-body2 q-mt-sm">{{ promocionSeleccionada?.descripcion }}</div>
          <div class="modal-total text-h6 q-mt-md">Total: {{ precioTotal() }}</div>
        </q-card-section>

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

        <q-card-actions align="center" class="q-mt-md">
          <q-btn round :style="{ backgroundColor: '#600000', color: 'white' }" icon="shopping_cart" size="lg" @click="agregarAlCarrito" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de carrito -->
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
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const modalAbierto = ref(false)
const promocionSeleccionada = ref(null)
const especificaciones = ref('')
const carritoAbierto = ref(false)
const editandoIndex = ref(null)

const carrito = inject('carrito')

const categorias = [
  { label: 'Hamburguesas', to: '/hamburguesas', img: '/img/icono1.png' },
  { label: 'Perros', to: '/perros', img: '/img/icono2.png' },
  { label: 'Extras', to: '/extras', img: '/img/icono5.png' },
  { label: 'Bebidas', to: '/bebidas', img: '/img/icono4.png' },
]

const promociones = ref([
  { id: 1, nombre: 'Burguer Clásica', imagen: '/img/s1.png', descripcion: 'Pan brioche, carne de res, queso americano, tocineta, vegetales frescos, papas fritas', precio: 21000 },
  { id: 2, nombre: 'Broiler', imagen: '/img/s2.png', descripcion: 'Carne 100% res, mozzarella, tocineta caramelizada, vegetales, papa casco', precio: 26500 },
  { id: 3, nombre: 'Perro Americano', imagen: '/img/s3.png', descripcion: 'Salchicha jumbo, cebolla crispy, salsas, papas ripiadas', precio: 23500 },
  { id: 4, nombre: 'Combo Pareja', imagen: '/img/s4.png', descripcion: '2 hamburguesas, papas grandes, 2 bebidas', precio: 21000 },
  { id: 5, nombre: 'Salchipollo', imagen: '/img/s5.png', descripcion: 'Salchichas, pollo frito, papas, queso rallado, salsas', precio: 30000 },
  { id: 6, nombre: 'Hamburguesa Doble Carne', imagen: '/img/s6.png', descripcion: 'Doble carne, doble queso, cebolla caramelizada, salsa especial, bebida', precio: 35000 }
  
])

const adicionales = ref([
  { nombre: 'Tocineta', cantidad: 0, precio: 4000 },
  { nombre: 'Lonjas de queso', cantidad: 0, precio: 2500 },
  { nombre: 'Carne de hamburguesa', cantidad: 0, precio: 9000 },
  { nombre: 'Pechuga apanada', cantidad: 0, precio: 8000 },
  { nombre: 'Huevo', cantidad: 0, precio: 1000 },
  { nombre: 'Vegetales', cantidad: 0, precio: 800 },
])

function navegarACategoria(ruta) {
  router.push(ruta)
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
  const promo = promociones.value.find(p => p.id === item.id) || item
  abrirModal(promo, index)
}

function eliminarItem(index) {
  carrito.items.splice(index, 1)
}

function precioTotal() {
  const base = promocionSeleccionada.value?.precio || 0
  const adicionalesTotal = adicionales.value.reduce((sum, item) => sum + item.cantidad * item.precio, 0)
  return formatPrecio(base + adicionalesTotal)
}

function formatPrecio(valor) {
  return `$${valor.toLocaleString('es-CO')}`
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Fredoka+One:wght@400&display=swap');

.pagina-promos {
  background: hsl(36, 26%, 96%);;
  border-radius: 12px;
  min-height: 100vh;
}

/* SECCIÓN DE CATEGORÍAS */
.categorias-section {
  background-color: white;
  padding: 40px 20px;
  border-radius: 16px;
  margin-bottom: 40px;
}

.titulo-seccion {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.titulo-texto {
  font-family: 'Open Sans', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #5D4E37;
  letter-spacing: -0.5px;
}

.categorias-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.categoria-card {
  background: transparent;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 120px;
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
  width: 60px;
  height: 60px;
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

/* PROMOCIONES */
.promo-card {
  max-width: 400px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
}

.promo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.promo-nombre {
  font-size: 17px;
  font-weight: bold;
  color: #600000;
}

.promo-precio {
  font-size: 15px;
  color: #600000;
  font-weight: 600;
  margin-top: 4px;
}

.promo-img-container {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.promo-img {
  height: 300px;
  width: 100%;
  object-fit: cover;
  display: block;
}

.promo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(96, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.promo-card:hover .promo-overlay {
  opacity: 1;
}

.promociones-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px 32px;
  max-width: 1300px;
  margin: 0 auto;
}

.modal-card {
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: fadeInModal 0.3s ease-in-out;
  background: #fff;
}

.modal-header {
  background: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
}

.modal-img {
  border-bottom: 4px solid #600000;
}

.modal-total {
  color: #600000;
  font-weight: bold;
}

.text-subtitle2 {
  font-size: 14px;
}

.rounded-borders {
  border-radius: 8px;
}

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

/* Responsive */
@media (max-width: 768px) {
  .categorias-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  
  .promociones-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
  
  .titulo-texto {
    font-size: 24px;
  }
  
  .categoria-img {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .categorias-grid {
    grid-template-columns: repeat(2, 1fr);
  }
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
</style>