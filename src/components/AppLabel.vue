<script setup lang="ts">
defineProps<{ label?: string; required?: boolean; invalid?: boolean | number }>()
</script>

<template>
	<label v-if="label" :for="label" class="app_label">
		<span :class="{ 'text-red-600': invalid }" v-text="label" />

		<span v-if="required" class="__required">*</span>
	</label>
</template>

<style scoped>
.app_label {
	@apply block mb-1;
}

.__required {
	@apply text-red-600 font-bold;

	margin-right: 0.25rem;
}
</style>
