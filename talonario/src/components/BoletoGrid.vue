<template>
  <div class="boletos-grid">
    <button v-for="boleto in boletas" :key="boleto.numero" class="boleto-numero" :class="boleto.estado"
      @click="abrirEditor(boleto.numero)">
      {{ boleto.numero }}
    </button>
  </div>

  <!-- Modal Bootstrap Mejorado -->
  <div class="modal-overlay" v-show="mostrarEditor">
    <div class="modal-container">
      <div class="modal-card">
        <div class="modal-header">
          <h5 class="modal-title">
            <span class="modal-icon">📝</span>
            Boleta #{{ boletaSeleccionada.numero }}
            <span v-if="boletaSeleccionada.estado === 'apartado'" class="badge bg-warning ms-2">
              Apartada {{ tiempoApartado }}
            </span>
          </h5>
          <button type="button" class="modal-close-btn" @click="cancelarEdicion">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nombre completo</label>
            <input type="text" class="form-control" v-model="boletaSeleccionada.nombre"
              placeholder="Ingrese nombre y apellido" :disabled="boletaSeleccionada.estado === 'disponible'" />
          </div>

          <div class="form-group">
            <label class="form-label">Dirección</label>
            <input type="text" class="form-control" v-model="boletaSeleccionada.direccion" 
              placeholder="Ingrese dirección" :disabled="boletaSeleccionada.estado === 'disponible'" />
          </div>

          <div class="form-group">
            <label class="form-label">Número de contacto</label>
            <input type="number" class="form-control" v-model="boletaSeleccionada.celular"
              placeholder="Ingrese número celular" :disabled="boletaSeleccionada.estado === 'disponible'" />
          </div>

          <div class="form-group">
            <label class="form-label">Estado</label>
            <select class="form-select" v-model="boletaSeleccionada.estado">
              <option value="disponible">Disponible</option>
              <option value="apartado">Apartado</option>
              <option value="pagado">Pagado</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="liberarBoleta" v-if="boletaSeleccionada.estado === 'apartado'">
            Liberar Boleta
          </button>
          <button type="button" class="btn btn-secondary" @click="cancelarEdicion">
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="guardarEdicion">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref } from 'vue'

const talonarioInfo = inject('talonarioInfo')
const updateBoleta = inject('updateBoleta')
const showAlert = inject('showAlert')

const boletas = computed(() => {
  return Array.isArray(talonarioInfo.boletas) ? talonarioInfo.boletas : []
})

const mostrarEditor = ref(false)
const boletaSeleccionada = ref({
  numero: 0,
  nombre: '',
  direccion: '',
  celular: '',
  estado: 'disponible',
  fechaApartado: null
})

const tiempoApartado = computed(() => {
  if (!boletaSeleccionada.value.fechaApartado) return ''
  const fecha = new Date(boletaSeleccionada.value.fechaApartado)
  return `el ${fecha.toLocaleDateString('es-CO')}`
})

function abrirEditor(numero) {
  const boleta = boletas.value.find((b) => b.numero === numero)
  boletaSeleccionada.value = { ...boleta }
  mostrarEditor.value = true
}

function guardarEdicion() {
  // Validación de campos obligatorios para apartado/pagado
  if ((boletaSeleccionada.value.estado === 'apartado' || boletaSeleccionada.value.estado === 'pagado') && 
      (!boletaSeleccionada.value.nombre || !boletaSeleccionada.value.direccion || !boletaSeleccionada.value.celular)) {
    showAlert('Complete todos los campos para apartar/pagar', 'warning')
    return
  }

  // Si cambia a disponible, limpiamos los datos
  if (boletaSeleccionada.value.estado === 'disponible') {
    boletaSeleccionada.value = {
      ...boletaSeleccionada.value,
      nombre: '',
      direccion: '',
      celular: '',
      fechaApartado: null
    }
  }
  
  // Si cambia a apartado, registramos la fecha
  if (boletaSeleccionada.value.estado === 'apartado' && !boletaSeleccionada.value.fechaApartado) {
    boletaSeleccionada.value.fechaApartado = new Date().toISOString()
  }

  // Si cambia a pagado, limpiamos fecha de apartado
  if (boletaSeleccionada.value.estado === 'pagado') {
    boletaSeleccionada.value.fechaApartado = null
  }

  updateBoleta(boletaSeleccionada.value.numero, boletaSeleccionada.value)
  mostrarEditor.value = false
  showAlert('Cambios guardados correctamente', 'success')
}

function liberarBoleta() {
  boletaSeleccionada.value = {
    numero: boletaSeleccionada.value.numero,
    estado: 'disponible',
    nombre: '',
    direccion: '',
    celular: '',
    fechaApartado: null
  }
  updateBoleta(boletaSeleccionada.value.numero, boletaSeleccionada.value)
  showAlert('Boleta liberada correctamente', 'info')
  mostrarEditor.value = false
}

function cancelarEdicion() {
  mostrarEditor.value = false
}
</script>

<style scoped>
/* Estilos para la grilla de boletos */
.boletos-grid {
  display: grid;
  grid-template-columns: repeat(10, 45px);
  gap: 15px;
  padding: 10px;
  justify-content: center;
  max-width: 100%;
  margin: 0 auto;
}

.boleto-numero {
  background-color: #e0e0e0;
  color: #424242;
  border: 2px solid #bdbdbd;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.boleto-numero:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Colores según estado */
.boleto-numero.disponible {
  background-color: #e0e0e0;
  border-color: #bdbdbd;
  color: #424242;
}

.boleto-numero.apartado {
  background-color: #ffcdd2;
  border-color: #ef9a9a;
  color: #c62828;
}

.boleto-numero.pagado {
  background-color: #c8e6c9;
  border-color: #a5d6a7;
  color: #2e7d32;
}

/* Estilos para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-container {
  width: 100%;
  max-width: 500px;
  padding: 0 20px;
}

.modal-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  background: linear-gradient(135deg, #2CA81E 0%, #1e7c5a 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Poppins', sans-serif;
}

.modal-icon {
  font-size: 1.6rem;
}

.modal-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  transition: transform 0.3s ease;
}

.modal-close-btn:hover {
  transform: rotate(90deg);
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 0.95rem;
}

.form-control, .form-select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-control:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.form-control:focus, .form-select:focus {
  outline: none;
  border-color: #2CA81E;
  box-shadow: 0 0 0 3px rgba(44, 168, 30, 0.1);
  background-color: white;
}

.modal-footer {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.btn-primary {
  background: linear-gradient(to right, #2CA81E 0%, #1e7c5a 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(to right, #299E1C 0%, #1a6d4f 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #555;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background: linear-gradient(to right, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(to right, #c82333 0%, #bd2130 100%);
}

.badge {
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Responsividad */
@media (max-width: 768px) {
  .boletos-grid {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 10px;
    padding: 15px;
  }
  
  .boleto-numero {
    width: 50px;
    height: 50px;
    font-size: 0.9rem;
  }
  
  .modal-container {
    padding: 0 15px;
  }
  
  .modal-header {
    padding: 15px;
  }
  
  .modal-title {
    font-size: 1.2rem;
  }
  
  .modal-body, .modal-footer {
    padding: 15px;
  }
  
  .btn {
    padding: 10px 18px;
  }
}
</style>

