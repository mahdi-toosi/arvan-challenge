<script setup lang="ts">
// ? vue
import { watch, ref } from 'vue'
// ? utils
import useStoreToast from '@/composable/useStoreToast'
import { useToast } from 'primevue/usetoast'
// ? components
import Toast from 'primevue/toast'
// ? types
import type { ToastMessageOptions } from 'primevue/toast'

const timerId = ref(0)
const $toast = useToast()
const { toast: toastState, showToast } = useStoreToast()

watch(toastState, (value) => {
	if (!value.msg) return

	$toast.add({
		life: toastState.value.life,
		detail: toastState.value.msg,
		severity: toastState.value.severity,
		boldMsg: toastState.value.boldMsg,
	} as ToastMessageOptions)

	timerId.value = window.setTimeout(() => {
		showToast({ msg: '' })
		clearTimeout(timerId.value)
	}, toastState.value.life)
})
</script>
<template>
	<Toast position="top-right" style="top: 70px !important">
		<template #message="{ message }">
			<div><b v-text="message.boldMsg" /> {{ message.detail }}</div>
		</template>
	</Toast>
</template>

<style>
.p-toast {
	@apply w-[22rem] md:w-96;
}

.p-toast .p-toast-message .p-toast-message-content .p-toast-detail {
	@apply mt-0  !important;

	max-width: 16rem;
	word-break: break-word;
}

.p-toast-message-content {
	@apply border-0  !important;
}

.p-toast-message-icon,
.p-toast-icon-close {
	@apply hidden !important;
}

.p-toast .p-toast-message {
	border-width: 1px !important;
}
</style>
