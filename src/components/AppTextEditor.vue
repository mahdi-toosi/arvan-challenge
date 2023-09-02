<script lang="ts" setup>
// ? vue
import { watch } from 'vue'
// ? utils
import { baseURL } from '@/api'
import Editor from 'ckeditor5-custom-build'
import { VERSION_1 } from '@/repositories/version'
// ? components
import AppInputErrors from '@/components/AppInputErrors.vue'
import { component as ckEditor } from '@ckeditor/ckeditor5-vue'
// ? types
import { type PropType } from 'vue'
import type { ErrorObject } from '@vuelidate/core'

defineProps({
	placeholder: { type: String },
	loading: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	errors: {
		type: Array as PropType<ErrorObject[] | { $message: string }[]>,
		required: false,
		default: () => [],
	},
})
const $emit = defineEmits(['change'])

const token = localStorage.getItem('token')
const uuid = localStorage.getItem('workspace_uuid')
const user_id = JSON.parse(localStorage.getItem('user') as string).id
const uploadImageEndpoint = `${baseURL}${VERSION_1}/cdn/file/letter`

const model = defineModel()
watch(model, (val) => {
	$emit('change', val)
})
</script>

<template>
	<div class="app_text_editor">
		<div :class="{ __error: errors.length, 'cursor-not-allowed': disabled }">
			<ckEditor
				v-model="model"
				:editor="Editor"
				:disabled="disabled"
				:config="{
					placeholder: placeholder,
					language: 'fa',
					simpleUpload: {
						// The URL that the images are uploaded to.
						uploadUrl: uploadImageEndpoint,
						// Headers sent along with the XMLHttpRequest to the upload server.
						headers: {
							user_id,
							Authorization: token,
							'X-WORKSPACE-UUID': uuid,
						},
					},
				}"
			/>

			<Skeleton v-if="loading" height="173.8px" style="position: absolute; top: 39px" />
		</div>

		<AppInputErrors :errors="errors" />
	</div>
</template>

<style scoped>
/* @import '@/assets/styles/textEditorResult.css'; /* just for tip tap */

.app_text_editor > div {
	@apply border rounded-lg relative;
}

.app_text_editor > div.__error {
	@apply border border-red-600 rounded-lg overflow-hidden;
}

:deep(.ck-toolbar) {
	@apply border-0;
}

:deep(.ck-content) {
	@apply border-x-0 border-b-0 shadow-none !important;
}

:deep(.ck-placeholder::before) {
	color: #9ca3af;
	font-size: 15px;
}

:deep(.ck.ck-toolbar > .ck-toolbar__items) {
	@apply justify-center;
}

:deep(.ck-dropdown__button .ck-button__label) {
	@apply text-left !important;
}

:deep(.ck-dropdown .ck-button__label) {
	@apply text-right !important;
}

:deep(.ck-dropdown .ck-dropdown__arrow) {
	@apply z-0;
}
</style>

<style>
.ck-content > blockquote,
.ck-content > dl,
.ck-content > dd,
.ck-content > h1,
.ck-content > h2,
.ck-content > h3,
.ck-content > h4,
.ck-content > h5,
.ck-content > h6,
.ck-content > hr,
.ck-content > figure,
.ck-content > p,
.ck-content > pre {
	margin: revert;
}

.ck-content > ol,
.ck-content > ul {
	list-style: revert;
	margin: revert;
	padding: revert;
}

.ck-content > table {
	border-collapse: revert;
}

.ck-content > h1,
.ck-content > h2,
.ck-content > h3,
.ck-content > h4,
.ck-content > h5,
.ck-content > h6 {
	font-size: revert;
	font-weight: revert;
}
</style>
