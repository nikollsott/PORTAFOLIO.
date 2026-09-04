
import home from '../components/home.vue'
import bebidas from "../components/bebidas.vue"
import extras from"../components/extras.vue"
import hamburguesas from "../components/hamburguesas.vue"
import perros from "../components/perros.vue"
import salchipapas from "../components/salchipapas.vue"


import { createRouter, createWebHistory } from "vue-router"

const routes=[
    { path: '/', component: home },  
    {path:"/bebidas",component:bebidas},
    {path:"/extras", component:extras},
    {path:"/hamburguesas", component:hamburguesas},
    {path:"/perros", component:perros},
    {path:"/salchipapas", component:salchipapas},
    
    
    
]

export const router = createRouter({
    history:createWebHistory(),routes
})