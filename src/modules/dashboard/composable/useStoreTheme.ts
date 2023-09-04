import { ref } from 'vue'

const sidebarIsCollapsed = ref(window.innerWidth < 640) // tailwind mobile breakpoint
export default () => ({
	sidebarIsCollapsed,
	onSidebarCollapsed: (status: boolean) => {
		sidebarIsCollapsed.value = status
	},
})
