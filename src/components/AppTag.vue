<script setup lang="ts">
// ? vue
import { computed } from 'vue'
// ? components
import Tag from 'primevue/tag'
// ? types
import type { TagProps } from 'primevue/tag'

export type AppTagSeverities = TagProps['severity'] | 'secondary'

const { outlined = true, severity = 'secondary' } = defineProps<{
	icon?: string
	value?: string
	outlined?: boolean
	severity?: AppTagSeverities
}>()

const outlineClass = computed(() => {
	if (outlined) return `__outlined __${severity}_outlined`
	return ''
})
</script>

<template>
	<Tag :value="value" :severity="severity" :icon="icon" :class="['app_tag', outlineClass]" />
</template>

<style scoped>
.app_tag {
	@apply rounded-md cursor-default select-none px-4 whitespace-nowrap;
}

.__outlined {
	background-color: transparent !important;
}

.__info_outlined {
	color: #0278b8;
	border: 1px #0278b8 solid;
}

.__danger_outlined {
	color: #d32f2f;
	border: 1px #d32f2f solid;
}

.__success_outlined {
	color: #689f38;
	border: 1px #689f38 solid;
}

.__warning_outlined {
	color: #dca10e;
	border: 1px #fbc02d solid;
}

.__secondary_outlined {
	color: #607d8b;
	border: 1px #607d8b solid;
}
</style>
