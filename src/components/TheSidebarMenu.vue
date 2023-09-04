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
	{ title: 'All Articles', href: '/articles' },
	{ title: 'New Article', href: '/articles/create' },
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
		<template #header>
			<div class="__sidebar_header">
				<h3>Post</h3>
			</div>
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
	background: #1c7cd5;

	z-index: 20;
}

.__sidebar_mask {
	@apply fixed w-screen h-screen md:hidden;

	z-index: 10;
}

.__sidebar_header {
	@apply my-4  text-white;

	margin-left: 1.25rem;
}

.__sidebar_header h3 {
	@apply text-xl;
}

:deep(.vsm--link_active[aria-current='page']) {
	background-color: rgba(255, 255, 255, 0.15) !important;
	pointer-events: none;
}

:deep(.vsm--title) {
	@apply text-lg text-white;
	margin-left: 1.25rem;
}

:deep(.vsm--link_hover) {
	background-color: rgba(255, 255, 255, 0.15) !important;
}

.v-sidebar-menu {
	@apply h-screen;

	max-height: calc(100vh - 64px) !important; /* reduce header */
}

.v-sidebar-menu.vsm_collapsed {
	max-width: 0 !important;
	overflow: hidden;
}

:deep(.vsm--toggle-btn) {
	@apply hidden;
}

:deep(.vsm--arrow_default::before) {
	@apply w-2 h-2;
}

:deep(.vsm--link_level-1.vsm--link_open) {
	background: #f3f6fc !important;
	box-shadow: inset -3px 0 0 0 #8b94a7 !important;
}

:deep(.vsm--link_active) {
	box-shadow: unset !important;
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
