<template>
  <div class="actions-panel">
    <h2 class="panel-title">Acciones</h2>
    <div class="actions-content">
      <button class="action-btn list-btn" @click="listarBoletas" :disabled="!hasTalonarioInfo">
        <span class="btn-icon">LISTAR BOLETAS 📋</span>
      </button>


    </div>

    <!-- Modal  listar boletas -->
    <div class="modal fade show d-block" tabindex="-1" role="dialog" v-if="mostrarModal"
      style="background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> Clientes de Boletas</h5>
            <button type="button" class="btn-close" @click="cerrarModal">x</button>
          </div>

          <div class="modal-body">
            <div class="tabla-container" ref="tablaContainer">
              <div class="tabla-header">
                <h3>Listado </h3>
              </div>

              <div class="tabla-wrapper" ref="tabla">
                <table class="tabla-boletas">
                  <thead>
                    <tr>
                      <th># </th>
                      <th>Nombre</th>
                      <th>Dirección</th>
                      <th>Telefóno</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="b in boletasConDatos" :key="b.numero">

                      <td>{{ b.numero }}</td>
                      <td>{{ b.nombre }}</td>
                      <td>{{ b.direccion }}</td>
                      <td>{{ b.celular }}</td>
                      <td>{{ formatearFecha(new Date()) }}</td>
                      <td><span :class="'estado-tag ' + b.estado">{{ capitalize(b.estado) }}</span></td>
                      
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="totales">
                <p><strong>Dinero recaudado: $ {{ formatearNumero(totalRecaudado) }}</strong></p>
                <p><strong>Deuda total: $ {{ formatearNumero(totalPendiente) }}</strong></p>
              </div>

              <div class="acciones-tabla">
                <button class="btn" @click="descargarPDF">Descargar PDF</button>
                <button class="btn" @click="cerrarModal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'

const mostrarModal = ref(false)
const tabla = ref(null)
const tablaContainer = ref(null)
const talonarioInfo = inject('talonarioInfo')

const hasTalonarioInfo = computed(() => {
  if (!talonarioInfo || typeof talonarioInfo !== 'object') return false
  const values = Object.values(talonarioInfo).filter(v => typeof v !== 'function')
  return values.some(value => value !== '' && value !== null && value !== undefined)
})

const valorBoleta = computed(() => parseFloat(talonarioInfo.valorBoleta || 0))

const boletas = computed(() => {
  return Array.isArray(talonarioInfo.boletas) ? talonarioInfo.boletas : []
})

const boletasConDatos = computed(() => {
  return boletas.value.filter(b => b.nombre && b.direccion && b.celular)
})

const totalRecaudado = computed(() => {
  return boletas.value.filter(b => b.estado === 'pagado').length * valorBoleta.value
})

const totalPendiente = computed(() => {
  return boletas.value.filter(b => b.estado === 'apartado').length * valorBoleta.value
})

function listarBoletas() {
  if (!hasTalonarioInfo.value) {
    alert('Primero debe configurar el talonario')
    return
  }
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
}


function formatearFecha(fecha) {
  return fecha.toLocaleDateString('es-CO')
}

function formatearNumero(numero) {
  return new Intl.NumberFormat('es-CO').format(numero)
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function descargarPDF() {
  if (!tablaContainer.value) return

  //  HTML para el PDF
  const contenido = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="background-color: #1e5aa8; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 2rem; letter-spacing: 2px;">Listado de Boleta</h1>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead style="background-color: #d4a574;">
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">Nombre Comprador</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">Dirección</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">Número Telefónico</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">Fecha Compra Boleta</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">Estado Boleta</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">N. Boleta</th>
          </tr>
        </thead>
        <tbody>
          ${boletasConDatos.value.map(b => `
            <tr>
              <td style="border: 1px solid #000; padding: 8px;">${b.nombre}</td>
              <td style="border: 1px solid #000; padding: 8px;">${b.direccion}</td>
              <td style="border: 1px solid #000; padding: 8px;">${b.celular}</td>
              <td style="border: 1px solid #000; padding: 8px;">${formatearFecha(new Date())}</td>
              <td style="border: 1px solid #000; padding: 8px;">${capitalize(b.estado)}</td>
              <td style="border: 1px solid #000; padding: 8px;">${b.numero}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 1.2rem;"><strong>Dinero recaudado: $ ${formatearNumero(totalRecaudado.value)}</strong></p>
        <p style="font-size: 1.2rem;"><strong>Deuda total: $ ${formatearNumero(totalPendiente.value)}</strong></p>
      </div>
    </div>
  `

  // Crear un elemento temporal para convertir a PDF
  const elementoTemporal = document.createElement('div')
  elementoTemporal.innerHTML = contenido

  // Simular la descarga (en un entorno real usarías una librería como jsPDF o html2pdf)
  const blob = new Blob([contenido], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'listado-boletas.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  // Mostrar alerta de éxito
  alert('PDF descargado exitosamente')
}
</script>

<style scoped>
/* Panel principal */
.actions-panel {
  background: linear-gradient(145deg, #fffffff2);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: fit-content;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.panel-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #2c3e50;
  text-align: center;
  position: relative;
  padding-bottom: 10px;
}

.panel-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #1e5aa8, #1e7c5a);
  border-radius: 3px;
}

/* Botones de acción */
.actions-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.list-btn {
  background: linear-gradient(135deg,  #2CA81E);
}

.list-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 90, 168, 0.2);
  background: linear-gradient(135deg, #164a94);
}

.btn-icon {
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
}

.action-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Modal */
.modal-content {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: none;
}

.modal-header {
  background: linear-gradient(135deg, #2CA81E, #11713c);
  color: white;
  padding: 18px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Tabla */


.tabla-header {
  text-align: center;
  margin-bottom: 25px;
}

.tabla-header h3 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
}

.tabla-header h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #2CA81E, #11713c);
  border-radius: 3px;
}

.tabla-wrapper {
  overflow-x: auto;
  margin-bottom: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.tabla-boletas {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.9rem;
  min-width: 800px;
}

.tabla-boletas thead {
  background: linear-gradient(135deg, #2c3e50, #4a6278);
  color: white;
}

.tabla-boletas th {
  padding: 12px 15px;
  text-align: center;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.tabla-boletas td {
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
}

.tabla-boletas tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.tabla-boletas tbody tr:hover {
  background-color: #f1f5f9;
}

/* Etiquetas de estado */
.estado-tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  min-width: 80px;
  text-align: center;
}

.estado-tag.disponible {
  background-color: #6c757d;
  color: white;
}

.estado-tag.apartado {
  background-color: #ff6b6b;
  color: white;
}

.estado-tag.pagado {
  background-color: #51cf66;
  color: white;
}

/* Totales */
.totales {
  text-align: center;
  margin: 25px 0;
  font-size: 1.1rem;
  color: #2c3e50;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.totales p {
  margin: 8px 0;
  font-weight: 600;
}

/* Botones de acciones */
.acciones-tabla {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #11713c, #2CA81E);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 90, 168, 0.2);
  background: linear-gradient(135deg, #11713c #1e7c5a);
}

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .actions-panel {
    padding: 18px;
  }
  
  .panel-title {
    font-size: 1.5rem;
  }
  
  .modal-header {
    padding: 15px 20px;
  }
  
  .tabla-container {
    padding: 15px;
  }
  
  .acciones-tabla {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
