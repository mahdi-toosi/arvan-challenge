<script setup lang="ts">
// ? vue
import { ref } from 'vue'
// ? components
import AArticleForm from '../components/AArticleForm.vue'
import type { Article } from '@/repositories/articles/types'

const article = ref({} as Article)
</script>

<template>
	<h1>Create Article</h1>

	<AArticleForm v-model="article" @stored="$router.push({ name: 'Articles' })" />
</template>

<style scoped>
h1 {
	font-size: 40px;
	margin-bottom: 1.5rem;
}
</style>
