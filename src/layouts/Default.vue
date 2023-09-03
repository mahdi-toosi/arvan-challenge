<script setup lang="ts">
// ? utils
import useStoreTheme from '@/modules/dashboard/composable/useStoreTheme'
// ? components
import TheHeader from '@/components/TheHeader.vue'
import TheSidebarMenu from '@/components/TheSidebarMenu.vue'

const { sidebarIsCollapsed } = useStoreTheme()
</script>

<template>
	<div>
		<TheHeader />

		<div class="flex overflow-hidden">
			<TheSidebarMenu />

			<div
				:class="['__content_wrapper overflow-auto', { __sidebar_collapsed: sidebarIsCollapsed }]"
			>
				<div class="__content">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.__content_wrapper {
	max-height: calc(100vh - 64px); /* reduce header */
	width: 100vw;
	scroll-behavior: smooth;
}

.__content {
	@apply p-2 md:px-8 md:py-6 bg-white;

	box-shadow: 0 4px 20px 0 rgb(0 0 0 / 5%);
	min-height: calc(100vh - 64px);
}

@media (min-width: 640px) {
	.__content_wrapper {
		max-width: calc(100vw - 250px);
	}

	.__content_wrapper.__sidebar_collapsed {
		max-width: calc(100vw - 65px);
	}
}
</style>
