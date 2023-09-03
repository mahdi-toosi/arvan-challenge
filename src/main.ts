// ? vue
import { createApp } from 'vue'
import router, { registerRoutes } from './router'
// ? prime
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
// ? init
import context from '@/context'
import bootstrap from '@/bootstrap'
import registerGlobalComponents from '@/component'
import App from '@/App.vue'

// ? styles
import '@/assets/styles/tailwind.css'
import '@/assets/fonts/fontawesome-pro-5.15.3-web/css/all.min.css'
// ? prime styles
import '@/assets/styles/themes/lara/lara-light/blue/theme.scss'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
// ? END prime styles
import '@/assets/styles/main.css'

const app = createApp(App)

registerGlobalComponents(app, context)

async function init() {
	await bootstrap(context)

	registerRoutes(context.Router.routes)

	app.use(router).use(PrimeVue).use(ToastService).use(ConfirmationService)

	app.mount('#app')
}

init()
