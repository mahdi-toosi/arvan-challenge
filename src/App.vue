<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRepositoryProvider } from '@/repositories'
import TheToast from '@/components/TheToast.vue'
import ConfirmDialog from 'primevue/confirmdialog'

useRepositoryProvider()

const DefaultLayout = defineAsyncComponent(() => import('@/layouts/Default.vue'))
</script>
<template>
	<template v-if="$route.meta.layout === 'default'">
		<DefaultLayout :class="`__page_${$route.name as string}`">
			<router-view />
		</DefaultLayout>
	</template>

	<template v-if="$route.meta.layout === 'none'">
		<router-view />
	</template>

	<TheToast />
	<ConfirmDialog />
</template>
