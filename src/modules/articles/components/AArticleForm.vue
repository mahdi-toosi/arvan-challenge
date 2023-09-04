<script setup lang="ts">
// ? vue
import { computed, onMounted, ref } from 'vue'
// ? utils
import useVuelidate from '@vuelidate/core'
import { useRepositoryContext } from '@/repositories'
import useStoreToast from '@/composable/useStoreToast'
import useValidation from '@/composable/useValidations'
// ? components
import Checkbox from 'primevue/checkbox'
import AppInput from '@/components/AppInput.vue'
import AppTextarea from '@/components/AppTextarea.vue'
// ? types
import type { Article } from '@/repositories/articles/types'

// ?  define and uses
defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ (event: 'stored'): void }>()

const { showToast } = useStoreToast()
const { articles } = useRepositoryContext()

const newTag = ref('')
const tags = ref([] as string[])
const article = defineModel<Article>({ required: true })

const { requiredField: title, requiredField: body } = useValidation()
const rules = computed(() => ({ title, body }))
const $v = useVuelidate(rules, article)
// ?  End define and uses

const submitLoading = ref(false)
async function onSubmit() {
	$v.value.$touch()
	if ($v.value.$invalid) return

	submitLoading.value = true
	const result = await articles.putArticle({ article: article.value })
	submitLoading.value = false
	if (!result) return

	showToast({
		detail: `Well done! Article ${article.value.slug ? 'updated' : 'created'} successfully`,
		severity: 'success',
	})

	emit('stored')
}

function onAddNewTag() {
	tags.value.push(newTag.value)
	article.value.tagList?.push(newTag.value)
	newTag.value = ''
}

const getTagsLoading = ref(true)
async function getTags() {
	getTagsLoading.value = true
	const result = await articles.getTags()
	getTagsLoading.value = false

	if (result) tags.value = result.tags
}

onMounted(() => {
	getTags()
})
</script>

<template>
	<form class="flex gap-8" @submit.prevent="onSubmit">
		<div class="flex flex-col gap-5 flex-1">
			<AppInput
				v-model="article.title"
				label="Title"
				:loading="loading"
				:errors="$v.title.$errors"
			/>

			<AppInput v-model="article.description" label="Description" :loading="loading" />

			<AppTextarea
				v-model="article.body"
				label="Body"
				:loading="loading"
				rows="8"
				loading-height="208px"
				:errors="$v.body.$errors"
			/>

			<Button type="submit" label="Submit" class="w-24" :loading="submitLoading" />
		</div>

		<div style="min-width: 200px">
			<AppInput
				v-model="newTag"
				label="Tags"
				class="mb-6"
				:loading="loading"
				placeholder="New tag"
				@enter="onAddNewTag"
			/>

			<div class="__tags_container">
				<template v-if="getTagsLoading">
					<div v-for="tag in 7" :key="tag" class="flex gap-2 items-center mb-4">
						<Checkbox disabled />
						<Skeleton width="120px" />
					</div>
				</template>

				<template v-else>
					<div v-for="tag in tags.sort()" :key="tag" class="flex gap-2 items-center mb-4">
						<Checkbox v-model="article.tagList" :input-id="tag" :value="tag" />

						<label :for="tag" class="cursor-pointer select-none" v-text="tag" />
					</div>
				</template>
			</div>
		</div>
	</form>
</template>

<style scoped>
.__tags_container {
	@apply p-4 rounded overflow-auto;

	max-height: 300px;
	border: solid 1px #ddd;
}
</style>
