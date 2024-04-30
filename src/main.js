import './assets/scss/main.scss'
import 'amfe-flexible/index.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupStore } from '@/stores'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from '@/router'
import { setupRouter } from '@/router'
import 'es-drager/lib/style.css'

const app = createApp(App)

// app.use(createPinia())
setupStore(app)
await setupRouter(app)
// app.use(router)

app.mount('#app')
