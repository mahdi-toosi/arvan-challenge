<script setup lang="ts">
// ? components
import Checkbox from 'primevue/checkbox'
// ? types

const {
	binary = true,
	trueValue = true,
	falseValue = false,
} = defineProps<{
	label: string
	binary?: boolean
	disabled?: boolean
	trueValue?: string | number | boolean
	falseValue?: string | number | boolean
}>()

const $emit = defineEmits<{
	(event: 'input'): void
	(event: 'click'): void
	(event: 'change'): void
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model = defineModel<any>()
</script>

<template>
	<div class="app_checkbox flex gap-2 items-center">
		<Checkbox
			v-bind="$attrs"
			v-model="model"
			:binary="binary"
			:input-id="label"
			:disabled="disabled"
			:true-value="trueValue"
			:false-value="falseValue"
			@input="$emit('input')"
			@click="$emit('click')"
			@change="$emit('change')"
		/>

		<label v-if="label" :for="label" class="cursor-pointer select-none">
			{{ label }}
		</label>
	</div>
</template>
