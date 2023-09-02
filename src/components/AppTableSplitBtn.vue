<script setup lang="ts">
import { ref } from 'vue'
import Menu from 'primevue/menu'
import type { PropType } from 'vue'

export interface Action {
	label: string
	icon?: string
	command?: () => void
}
defineProps({
	loading: Boolean,
	icon: { type: String, default: 'pi pi-ellipsis-v' },
	buttons: { type: Array as PropType<Action[]>, required: true },
})

const menu = ref()
const toggle = (event: MouseEvent) => {
	if (!menu.value) return
	menu.value.toggle(event)
}
</script>

<template>
	<div class="app_table_split_btn">
		<Button :icon="icon" :loading="loading" severity="secondary" text @click="toggle" />

		<Menu ref="menu" :model="buttons" popup />
	</div>
</template>

<style scoped>
:deep(.p-button .p-button-icon) {
	font-size: 1.1rem;
}
</style>
