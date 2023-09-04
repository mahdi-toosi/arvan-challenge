<script setup lang="ts">
import { ref } from 'vue'
import Menu from 'primevue/menu'

export interface Action {
	label: string
	icon?: string
	command?: () => void
}

defineProps<{ loading?: boolean; actions: Action[] }>()

const menu = ref()
const toggle = (event: MouseEvent) => {
	if (!menu.value) return
	menu.value.toggle(event)
}
</script>

<template>
	<div class="app_table_split_btn">
		<Button :loading="loading" severity="info " class="shadow-none gap-3 h-10 px-3" @click="toggle">
			<i class="pi pi-ellipsis-h"></i>
			<i class="pi pi-angle-down"></i>
		</Button>

		<Menu ref="menu" :model="actions" popup />
	</div>
</template>
