// ? vue
import { ref } from 'vue'
// ? types
import type { ToastMessageOptions } from 'primevue/toast'

type TheToast = {
	life?: number
	msg?: string
	boldMsg?: string
	severity?: ToastMessageOptions['severity']
}

const toast = ref({} as TheToast)

export default () => {
	return {
		toast,

		showToast: (new_toast: TheToast) => {
			const defaultToast = { life: 3000, severity: 'error' } as TheToast
			toast.value = { ...defaultToast, ...new_toast }
		},
	}
}
