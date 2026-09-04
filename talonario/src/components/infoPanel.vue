<template>
  <div class="info-panel">
    <h2 class="panel-title">Información del Sorteo</h2>
    <div class="info-content" v-if="talonarioInfo.cantidadBoletas">
      <div class="info-item">
        <span class="info-icon">🏆</span>
        <div class="info-text">
          <p class="info-label">Premio mayor</p>
          <p class="info-value">$ {{ formatNumber(talonarioInfo.premio) }}</p>
        </div>
      </div>

      <div class="info-item">
        <span class="info-icon">💲</span>
        <div class="info-text">
          <p class="info-label">Valor boleta</p>
          <p class="info-value">$ {{ formatNumber(talonarioInfo.valorBoleta) }}</p>
        </div>
      </div>

      <div class="info-item">
        <span class="info-icon">🎰</span>
        <div class="info-text">
          <p class="info-label">Lotería</p>
          <p class="info-value">{{ talonarioInfo.loteria }}</p>
        </div>
      </div>

      <div class="info-item">
        <span class="info-icon">📅</span>
        <div class="info-text">
          <p class="info-label">Fecha del sorteo</p>
          <p class="info-value">{{ formatDate(talonarioInfo.fecha) }}</p>
        </div>
      </div>

      <button class="edit-button" @click="handleEdit">
        <span class="edit-icon">✍🏻</span>
        <span class="edit-text">Editar información</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const talonarioInfo = inject('talonarioInfo')
const showForm = inject('showForm')

const formatNumber = (number) => {
  return new Intl.NumberFormat('es-CO').format(number)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleEdit = () => {
  showForm()
}
</script>

<style scoped>
.info-panel {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  padding: 1.8rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.info-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.panel-title {
  font-size: 1.6rem;
  color: #2c3e50;
  margin-bottom: 1.8rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  position: relative;
  padding-bottom: 0.8rem;
}

.panel-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #2CA81E 0%, #1e7c5a 100%);
  border-radius: 3px;
}

.info-content {
  background-color: white;
  padding: 1.8rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  font-size: 1.8rem;
  min-width: 40px;
  text-align: center;
  background: linear-gradient(135deg, #2CA81E 0%, #1e7c5a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.info-text {
  flex: 1;
}

.info-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0 0 0.2rem 0;
  font-weight: 500;
}

.info-value {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.edit-button {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #2CA81E 0%, #1e7c5a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #299E1C 0%, #1a6d4f 100%);
}

.edit-icon {
  font-size: 1.2rem;
}

.edit-text {
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .info-panel {
    padding: 1.5rem;
  }
  
  .panel-title {
    font-size: 1.4rem;
    margin-bottom: 1.2rem;
  }
  
  .info-content {
    padding: 1.2rem;
    gap: 1rem;
  }
  
  .info-item {
    gap: 1rem;
  }
  
  .info-icon {
    font-size: 1.5rem;
    min-width: 35px;
  }
  
  .info-value {
    font-size: 1.1rem;
  }
  
  .edit-button {
    padding: 0.7rem 1.2rem;
  }
}
</style>
