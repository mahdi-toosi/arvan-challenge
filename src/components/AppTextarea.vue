<script setup lang="ts">
// ? vue
import { defineAsyncComponent } from 'vue'
// ? components
import Textarea from 'primevue/textarea'

import type { InputErrorMessages } from '@/components/AppInputErrors.vue'

const AppLabel = defineAsyncComponent(() => import('@/components/AppLabel.vue'))
const AppInputErrors = defineAsyncComponent(() => import('@/components/AppInputErrors.vue'))

defineProps<{
	cols?: string
	rows?: string
	label?: string
	loading?: boolean
	required?: boolean
	disabled?: boolean
	placeholder?: string
	autoResize?: boolean
	loadingHeight?: string
	errors?: InputErrorMessages
}>()

const model = defineModel<string>()
</script>

<template>
	<div class="app_textarea">
		<AppLabel :label="label" :required="required" :invalid="errors?.length" />

		<Skeleton v-if="loading" class="w-full" :height="loadingHeight" />

		<Textarea
			v-else
			:id="label"
			v-model="model"
			:rows="rows"
			:cols="cols"
			class="w-full"
			autocomplete="off"
			:disabled="disabled"
			:auto-resize="autoResize"
			:placeholder="placeholder"
			:class="{
				'p-invalid': errors && errors.length,
				'cursor-not-allowed': disabled,
			}"
		/>

		<AppInputErrors :errors="errors" />
	</div>
</template>
