<script setup lang="ts">
// ? utils
import useStoreUser from '@/composable/useStoreUser'
import useStoreTheme from '@/modules/dashboard/composable/useStoreTheme'

const { user } = useStoreUser()
const { sidebarIsCollapsed, onSidebarCollapsed } = useStoreTheme()

function onLogout() {
	localStorage.clear()
	window.location.href = window.location.origin + '/auth'
}
</script>

<template>
	<header class="__header">
		<div class="flex items-center gap-4">
			<Button
				class="md:hidden"
				severity="secondary"
				text
				:icon="`pi pi-${sidebarIsCollapsed ? 'bars' : 'times'}`"
				@click="onSidebarCollapsed(!sidebarIsCollapsed)"
			/>
			<h3>Arvan Challenge</h3>
			<h4>Welcome {{ user.first_name }} {{ user.last_name }}</h4>
		</div>

		<Button label="Logout" outlined @click="onLogout" />
	</header>
</template>

<style scoped>
.__header {
	@apply px-4 py-8 h-14 text-white bg-CharcoalGrey flex items-center justify-between relative mb-4;

	box-shadow: 0 4px 20px 0 rgb(0 0 0 / 5%);
}

@media print {
	.__header {
		@apply hidden;
	}
}
</style>
