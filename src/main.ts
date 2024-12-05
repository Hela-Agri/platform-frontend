import { createApp } from 'vue'

// eslint-disable-next-line import/order
import App from '@/App.vue'
// eslint-disable-next-line import/order
import { registerPlugins } from '@core/utils/plugins'
// eslint-disable-next-line import/no-named-as-default
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import Vue3Toastify, { type ToastContainerOptions, toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import ElementPlus from 'element-plus'
import Popper from "vue3-popper";



// Styles
import 'element-plus/dist/index.css'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

app.use(
  Vue3Toastify,
  {

    autoClose: 6000,
    type: toast.TYPE.INFO,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,

    // ...
  } as ToastContainerOptions,
)
app.component('Popper', Popper)
app.use(VueTelInput)
app.use(ElementPlus)

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
