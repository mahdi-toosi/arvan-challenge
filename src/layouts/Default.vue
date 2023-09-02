<script setup lang="ts">
// ? utils
import useStoreTheme from '@/modules/dashboard/composable/useStoreTheme'
// ? components
import TheHeader from '@/components/TheHeader.vue'
import TheSidebarMenu from '@/components/TheSidebarMenu.vue'
// ? types

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
	max-height: calc(100vh - 5.5rem); /* reduce header */
	width: 100vw;
	scroll-behavior: smooth;
}

.__content {
	@apply p-2 md:mr-4 md:ml-2 md:p-6 bg-white rounded-lg;

	box-shadow: 0 4px 20px 0 rgb(0 0 0 / 5%);
	min-height: calc(100vh - 6rem);
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
