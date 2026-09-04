<template>
  <div id="app">
    <header class="header">
      <h1 class="header-title">TALONARIO</h1>
    </header>

    <main class="main-container">
      <!-- Bootstrap Alert (sin cambios) -->
      <div v-if="alert.show"
        :class="`alert alert-${alert.type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`"
        role="alert" style="z-index: 1050;">
        {{ alert.message }}
        <button type="button" class="btn-close" @click="alert.show = false" aria-label="Close"></button>
      </div>

      <div class="layout">
        <InfoPanel />
        <div class="content-section">
          <TalonarioForm v-if="!talonarioInfo.cantidadBoletas || showingForm" />
          <BoletoGrid v-else />
        </div>
        <ActionsPanel />
      </div>
    </main>

    <footer class="footer">
      <p>© 2024 Todos los derechos reservados</p>
    </footer>
  </div>
</template>

<script setup>
/* Script original sin cambios */
import { reactive, provide, ref, watch } from 'vue'
import InfoPanel from './components/InfoPanel.vue'
import TalonarioForm from './components/TalonarioForm.vue'
import ActionsPanel from './components/ActionsPanel.vue'
import BoletoGrid from './components/BoletoGrid.vue'

const talonarioInfo = reactive({
  premio: '',
  valorBoleta: '',
  loteria: '',
  cantidadBoletas: '',
  fecha: '',
  boletas: []
})

const alert = reactive({
  show: false,
  message: '',
  type: 'success'
})

const showAlert = (message, type = 'success') => {
  alert.message = message
  alert.type = type
  alert.show = true

  setTimeout(() => {
    alert.show = false
  }, 3000)
}

const showingForm = ref(false)

const showForm = () => {
  showingForm.value = true
}

const updateTalonarioInfo = (newInfo) => {
  Object.assign(talonarioInfo, newInfo)

  if (newInfo.cantidadBoletas) {
    const max = newInfo.cantidadBoletas === '0-999' ? 999 : 99
    talonarioInfo.boletas = Array.from({ length: max + 1 }, (_, i) => ({
      numero: i,
      nombre: '',
      direccion: '',
      celular: '',
      contacto: '',
      estado: 'disponible'
    }))
  }

  showingForm.value = false
}

const updateBoleta = (numeroboleta, datosBoleta) => {
  const index = talonarioInfo.boletas.findIndex(b => b.numero === numeroboleta)
  if (index !== -1) {
    talonarioInfo.boletas[index] = { ...datosBoleta }
  }
}

provide('talonarioInfo', talonarioInfo)
provide('updateTalonarioInfo', updateTalonarioInfo)
provide('updateBoleta', updateBoleta)
provide('showForm', showForm)
provide('showAlert', showAlert)
</script>

<style>
/* Fuentes modernas */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* Header mejorado */
.header {
  background: linear-gradient(135deg, #2CA81E 0%, #1e7c5a 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  font-family: 'Poppins', sans-serif;
}

/* Contenedor principal */
.main-container {
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 1400px;
  margin: 2rem auto;
  width: 95%;
}

/* Layout mejorado */
.layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content-section {
  background: #ffffff;
  border-radius: 10px;
  padding: 1.8rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Footer mejorado */
.footer {
  background: linear-gradient(135deg, #1e7c5a 0%, #2CA81E 100%);
  color: white;
  text-align: center;
  padding: 1.2rem;
  font-size: 0.9rem;
  margin-top: auto;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

/* Efectos de hover para interactividad */
button, .btn {
  transition: all 0.25s ease;
}

button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

/* Responsividad mejorada */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  .header-title {
    font-size: 2rem;
  }

  .main-container {
    padding: 1.2rem;
    margin: 1rem auto;
    width: 100%;
  }

  .content-section {
    padding: 1.2rem;
  }
}

/* Bootstrap Alert (mantenido igual) */
.alert {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  min-width: 300px;
  max-width: 500px;
}

.alert-dismissible {
  padding-right: 4rem;
}

.alert-success {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}

.alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}

.alert-warning {
  color: #664d03;
  background-color: #fff3cd;
  border-color: #ffecb5;
}

.alert-info {
  color: #055160;
  background-color: #d1ecf1;
  border-color: #b8daff;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  padding: 0.375rem 0.375rem;
  margin: 0.25rem 0.25rem 0 0;
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='m.235 1.027 1.027-.235L8 7.531 14.738.792l1.027.235L9.027 8l6.738 6.973-1.027.235L8 8.469.262 15.208-.765 14.973 6.973 8-.765 1.027z'/%3e%3c/svg%3e") center/1em auto no-repeat;
  border: 0;
  border-radius: 0.375rem;
  opacity: 0.5;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 0.75;
}

.position-fixed {
  position: fixed !important;
}

.top-0 {
  top: 0 !important;
}

.start-50 {
  left: 50% !important;
}

.translate-middle-x {
  transform: translateX(-50%) !important;
}

.mt-3 {
  margin-top: 1rem !important;
}

.fade {
  transition: opacity 0.15s linear;
}

.show {
  opacity: 1;
}

@media (max-width: 480px) {
  .alert {
    min-width: 250px;
    max-width: 90vw;
    font-size: 0.9rem;
  }
}
</style>
