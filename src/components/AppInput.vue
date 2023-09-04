<script setup lang="ts">
// ? vue
import { defineAsyncComponent } from 'vue'
// ? components
import InputText from 'primevue/inputtext'
// ? types
import type { InputErrorMessages } from '@/components/AppInputErrors.vue'

const AppLabel = defineAsyncComponent(() => import('@/components/AppLabel.vue'))
const AppInputErrors = defineAsyncComponent(() => import('@/components/AppInputErrors.vue'))

defineProps<{
	icon?: string
	label?: string
	number?: boolean
	loading?: boolean
	required?: boolean
	disabled?: boolean
	placeholder?: string
	inputClasses?: string
	errors?: InputErrorMessages
}>()
const emit = defineEmits<{ (event: 'enter', payload: KeyboardEvent): void }>()

function onEnter(event: KeyboardEvent) {
	emit('enter', event)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model = defineModel<any>()
</script>

<template>
	<div class="app_input">
		<AppLabel :label="label" :required="required" :invalid="errors?.length" />

		<span :class="['w-full', { 'p-input-icon-right': icon }]">
			<i :class="icon"></i>
			<Skeleton v-if="loading" v-bind="$attrs" class="w-full" height="40px" />

			<InputText
				v-else
				:id="label"
				v-bind="$attrs"
				v-model="model"
				class="w-full"
				autocomplete="off"
				:disabled="disabled"
				:placeholder="placeholder"
				:dir="number ? 'ltr' : undefined"
				:type="number ? 'number' : undefined"
				:class="[
					inputClasses,
					{
						r_remove_spin_btns: number,
						'cursor-not-allowed': disabled,
						'p-invalid': errors && errors.length,
					},
				]"
				@keyup.enter="onEnter"
			/>
		</span>

		<AppInputErrors :errors="errors" />
	</div>
</template>
