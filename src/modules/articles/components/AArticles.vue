<script setup lang="ts">
// ? vue
import { onMounted } from 'vue'
// ? utils
import { useRepositoryContext } from '@/repositories'
import { formatGregoryDate } from '@/composable/useUtils'
import useStoreTableFilters from '@/composable/useStoreTableFilters'
// ? types

// ? define and uses
const { articles } = useRepositoryContext()
const { emptyMsg, tableProps, loadingMsg, updateTableProps } = useStoreTableFilters()
// ? End define and uses

async function getArticles() {
	updateTableProps({ loading: true })
	const result = await articles.getArticles()
	updateTableProps({ loading: false })
	if (!result) return

	updateTableProps({ value: result.articles, totalRecords: result.articlesCount })
}

onMounted(() => {
	getArticles()
})
</script>

<template>
	<h1>All Posts</h1>

	<DataTable v-bind="tableProps" :lazy="false" :rows="10" data-key="slug">
		<template #empty>
			<p v-text="emptyMsg" />
		</template>

		<template #loading>
			<p v-text="loadingMsg" />
		</template>

		<Column header="#" class="r_index_column">
			<template #body="{ index }">{{ index + 1 }}</template>
		</Column>

		<Column header="Title" field="title" />

		<Column field="author.username" header="Author" />

		<Column header="Tags">
			<template #body="{ data }">
				{{ data.tagList?.join(', ') }}
			</template>
		</Column>

		<Column header="Excerpt">
			<template #body="{ data }">
				{{ data.description.split(/\s+/).slice(0, 20).join(' ') }}
			</template>
		</Column>

		<Column header="Created">
			<template #body="{ data }">
				{{ formatGregoryDate(data.createdAt, 'MMM D ,YYYY') }}
			</template>
		</Column>
	</DataTable>
</template>

<style scoped>
h1 {
	font-size: 40px;
	margin-bottom: 1.75rem;
}

:deep(td) {
	@apply truncate;

	max-width: 10rem;
}
</style>
