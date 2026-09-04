import { createApp, reactive, provide } from 'vue'
import App from './App.vue'

const app = createApp(App)


app.config.globalProperties.$talonarioInfo = reactive({
  premio: '',
  valorBoleta: '',
  loteria: '',
  cantidadBoletas: '',
  fecha: ''
})


app.provide('talonarioInfo', app.config.globalProperties.$talonarioInfo)

app.provide('updateTalonarioInfo', (newInfo) => {
  Object.assign(app.config.globalProperties.$talonarioInfo, newInfo)
})

app.mount('#app')
