<script setup lang="ts">
// ? vue
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
// ? utils
import { useConfirm } from 'primevue/useconfirm'
import { useRepositoryContext } from '@/repositories'
import useStoreToast from '@/composable/useStoreToast'
import { formatGregoryDate } from '@/composable/useUtils'
import AppTableSplitBtn from '@/components/AppTableSplitBtn.vue'
import useStoreTableFilters from '@/composable/useStoreTableFilters'
// ? types
import type { Article } from '@/repositories/articles/types'
import type { Action } from '@/components/AppTableSplitBtn.vue'

// ? define and uses
const $router = useRouter()
const $confirm = useConfirm()
const { showToast } = useStoreToast()
const { articles } = useRepositoryContext()
const { emptyMsg, tableProps, loadingMsg, updateTableProps } = useStoreTableFilters()
// ? End define and uses

function setActions(article: Article) {
	const actions = [] as Action[]

	const editAction = {
		label: 'Edit',
		command: () => {
			$router.push({ name: 'ArticleEdit', params: { slug: article.slug } })
		},
	}

	const deleteAction = {
		label: 'Delete',
		command: () => {
			$confirm.require({
				message: 'Are you sure to delete Article?',
				header: 'Delete Article',
				acceptClass: 'p-button-danger',
				rejectClass: 'p-button-text p-button-secondary',
				acceptLabel: 'Yes',
				rejectLabel: 'No',
				accept: async () => {
					updateTableProps({ loading: true })
					const result = await articles.deleteArticle(article.slug as string)
					updateTableProps({ loading: false })
					if (!result) return

					showToast({ msg: 'Article deleted successfully', severity: 'success' })
					getArticles()
				},
			})
		},
	}

	actions.push(editAction, deleteAction)
	return actions
}

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

		<Column>
			<template #body="{ data }">
				<AppTableSplitBtn :actions="setActions(data)" />
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
