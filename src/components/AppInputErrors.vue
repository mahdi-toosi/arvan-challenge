<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'

export type InputErrorMessages = ErrorObject[] | { $message: string }[]

defineProps<{ errors?: InputErrorMessages }>()
</script>

<template>
	<small v-if="errors && errors.length" class="text-red-600 block" v-text="errors[0].$message" />
</template>
