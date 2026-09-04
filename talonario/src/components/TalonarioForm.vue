<template>
  <div class="form-container">
    <div class="form-header">
      <h2 class="form-title">CONFIGURA TU TALONARIO</h2>
      <button class="close-btn" @click="resetForm">×</button>
    </div>

    <form @submit.prevent="handleSubmit" class="talonario-form">
      <div class="form-group">
        <input v-model="formData.premio" type="number" min="1" placeholder="Ingrese el premio de la rifa"
          class="form-input" required />
      </div>

      <div class="form-group">
        <input v-model="formData.valorBoleta" type="number" min="1" placeholder="Ingrese valor de la boleta"
          class="form-input" required />
      </div>

      <div class="form-group">
        <select v-model="formData.loteria" class="form-select" required>
          <option value="">Seleccione la lotería</option>
          <option value="Lotería de Boyacá">Lotería de Boyacá</option>
          <option value="Lotería de Cundinamarca">Lotería de Cundinamarca</option>
          <option value="Lotería de Antioquia">Lotería de Antioquia</option>
          <option value="Lotería de Quindio">Lotería del Quindio</option>
          <option value="Lotería de Santander">Lotería de Santander</option>
        </select>
      </div>

      <div class="form-group">
        <select v-model="formData.cantidadBoletas" class="form-select" required>
          <option value="">Cantidad de Boletas</option>
          <option value="0-99">0-99</option>
          <option value="0-999">0-999</option>
        </select>
      </div>

      <div class="form-group">
        <input v-model="formData.fecha" type="date" class="form-input date-input" :min="today" required />
      </div>

      <button type="submit" class="submit-btn">
        {{ talonarioInfo.cantidadBoletas ? 'Actualizar' : 'Guardar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, inject, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'

const talonarioInfo = inject('talonarioInfo')
const updateTalonarioInfo = inject('updateTalonarioInfo')

// Fecha mínima (hoy)
const today = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const formData = reactive({
  premio: '',
  valorBoleta: '',
  loteria: '',
  cantidadBoletas: '',
  fecha: ''
})

const showAlert = (title, icon = 'success') => {
  Swal.fire({
    title,
    icon,
    confirmButtonColor: '#1e5aa8',
    confirmButtonText: 'OK'
  })
}

// Cargar datos si estamos editando
onMounted(() => {
  if (talonarioInfo.premio) {
    formData.premio = talonarioInfo.premio
    formData.valorBoleta = talonarioInfo.valorBoleta
    formData.loteria = talonarioInfo.loteria
    formData.cantidadBoletas = talonarioInfo.cantidadBoletas
    formData.fecha = talonarioInfo.fecha
  }
})

const handleSubmit = () => {
  if (!formData.premio || !formData.valorBoleta || !formData.loteria || !formData.cantidadBoletas || !formData.fecha) {
    showAlert('Todos los campos son obligatorios.', 'warning')
    return
  }

  if (formData.fecha < today.value) {
    showAlert('La fecha no puede ser anterior a hoy.', 'error')
    return
  }

  if (Number(formData.valorBoleta) > Number(formData.premio)) {
    showAlert('El valor de la boleta no puede ser mayor al premio.', 'error')
    return
  }

  try {
    const datos = {
      ...formData,
      premio: Number(formData.premio),
      valorBoleta: Number(formData.valorBoleta)
    }

    updateTalonarioInfo(datos)
    showAlert(talonarioInfo.premio ? 'Datos guardados correctamente' : 'Talonario guardado exitosamente', 'success')
  } catch (error) {
    showAlert('Error al procesar los datos', 'error')
  }
}

// Función para resetear el formulario
const resetForm = () => {
  Object.assign(formData, {
    premio: '',
    valorBoleta: '',
    loteria: '',
    cantidadBoletas: '',
    fecha: ''
  })
}
</script>

<style scoped>
.form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.form-header {
  background: linear-gradient(135deg, #299E1C 0%, #1e7c5a 100%);
  color: white;
  padding: 18px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.5px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 50%;
  line-height: 1;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.talonario-form {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-input,
.form-select {
  padding: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  font-family: 'Inter', sans-serif;
}

.form-input::placeholder {
  color: #999;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #1e5aa8;
  box-shadow: 0 0 0 3px rgba(30, 90, 168, 0.1);
  background-color: white;
}

.date-input {
  color: #555;
}

.submit-btn {
  background: linear-gradient(to right, #185D10 0%, #299E1C 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Poppins', sans-serif;
  margin-top: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.submit-btn:hover {
  background: linear-gradient(to right, #134a0d 0%, #1e7c15 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Animación para los campos del formulario */
.form-group {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .form-container {
    border-radius: 0;
  }
  
  .form-header {
    padding: 15px 20px;
  }
  
  .form-title {
    font-size: 1.1rem;
  }
  
  .talonario-form {
    padding: 20px 15px;
    gap: 15px;
  }
  
  .form-input,
  .form-select {
    padding: 12px;
  }
}
</style>
