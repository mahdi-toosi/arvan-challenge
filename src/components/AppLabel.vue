<script setup lang="ts">
defineProps<{ label?: string; required?: boolean; tooltip?: string }>()
</script>

<template>
	<label v-if="label" :for="label" class="app_label">
		<span v-text="label" />

		<span v-if="required" class="__required">*</span>

		<Button
			v-if="tooltip"
			v-tooltip.top="tooltip"
			icon="pi pi-question-circle"
			severity="secondary"
			text
			class="p-0 cursor-help"
		/>
	</label>
</template>

<style scoped>
.app_label {
	@apply block mb-1 text-sm;
}

.__required {
	@apply text-red-600 mr-1 font-bold;
}
</style>
