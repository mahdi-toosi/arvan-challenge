<script setup lang="ts">
// ? vue
import { onMounted, ref } from 'vue'
// ? utils
import useStoreTheme from '@/modules/dashboard/composable/useStoreTheme'
// ? components
import { SidebarMenu } from 'vue-sidebar-menu'
// ? types
import type { SidebarItem } from 'vue-sidebar-menu'

const { sidebarIsCollapsed, onSidebarCollapsed } = useStoreTheme()

const menu = ref([
	{ title: 'All Articles', href: '' },
	{ title: 'New Article', href: '' },
] as SidebarItem[])

const windowWidth = ref(window.innerWidth)
window.onresize = () => {
	windowWidth.value = window.innerWidth
}

function onItemClicked(_event: Event, item: SidebarItem) {
	if (item.href && !Array.isArray(item.child) && windowWidth.value < 640) onSidebarCollapsed(true)
}

onMounted(() => {
	const sidebarStatus = localStorage.getItem('sidebarStatus')
	if (windowWidth.value > 640) onSidebarCollapsed(sidebarStatus === '1' ? true : false)
})
</script>
<template>
	<SidebarMenu
		:menu="menu"
		width="250px"
		class="__sidebar"
		theme="white-theme"
		:relative="windowWidth > 640"
		:collapsed="sidebarIsCollapsed"
		@item-click="onItemClicked"
		@update:collapsed="onSidebarCollapsed"
	>
		<template v-if="windowWidth < 640" #header>
			<div class="flex items-center mt-8">
				<h3 class="mr-4"></h3>
			</div>

			<hr
				style="margin-left: 0.75rem !important; margin-right: 0.75rem !important"
				class="mt-4 mb-2"
			/>
		</template>

		<template #toggle-icon>
			<i :class="`pi pi-angle-${sidebarIsCollapsed ? 'left' : 'right'}`"></i>
		</template>
	</SidebarMenu>

	<div v-show="!sidebarIsCollapsed" class="__sidebar_mask" @click="onSidebarCollapsed(true)"></div>
</template>

<style scoped>
.__sidebar {
	@apply shadow;

	z-index: 20;
}

.__sidebar_mask {
	@apply fixed w-screen h-screen md:hidden z-10;
}

:deep(.vsm--link_active[aria-current='page']) {
	pointer-events: none;
}

:deep(.vsm--title) {
	@apply text-sm;
}

.v-sidebar-menu {
	@apply h-screen;

	border-bottom-left-radius: 1rem !important;
	border-top-left-radius: 1rem !important;
	max-height: calc(100vh - 6rem) !important; /* reduce header */
	top: 5rem !important;
}

.v-sidebar-menu.vsm_collapsed {
	max-width: 0 !important;
	overflow: hidden;
}

:deep(.vsm--toggle-btn) {
	border-bottom-left-radius: 1rem !important;
	height: 2.75rem !important;
}

:deep(.vsm--arrow_default::before) {
	@apply w-2 h-2;
}

:deep(.vsm--link_level-1.vsm--link_open) {
	background: #f3f6fc !important;
	box-shadow: inset -3px 0 0 0 #8b94a7 !important;
}

:deep(.vsm--link_active) {
	box-shadow: inset -3px 0 0 0 #8b94a7 !important;
}

@media (min-width: 640px) {
	.v-sidebar-menu {
		top: 0 !important;
	}

	.v-sidebar-menu.vsm_collapsed {
		max-width: 65px !important;
		overflow: visible;
	}
}

@media (min-width: 768px) {
	.__sidebar {
		z-index: 1;
	}
}

@media print {
	.__sidebar {
		@apply hidden;
	}
}
</style>
