<script setup lang="ts">
// ? vue
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// ? utils
import { useRepositoryContext } from '@/repositories'
// ? components
import AArticleForm from '../components/AArticleForm.vue'
import type { Article } from '@/repositories/articles/types'

const $route = useRoute()
const { articles } = useRepositoryContext()

const article = ref({} as Article)

const loading = ref(false)
async function getArticle() {
	loading.value = true
	const result = await articles.getArticle($route.params.slug as string)
	loading.value = false

	if (result) article.value = result.article
}

onMounted(() => {
	getArticle()
})
</script>

<template>
	<h1>Edit Article</h1>

	<AArticleForm v-model="article" :loading="loading" @stored="$router.push({ name: 'Articles' })" />
</template>

<style scoped>
h1 {
	font-size: 40px;
	margin-bottom: 1.5rem;
}
</style>
