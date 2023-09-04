<script setup lang="ts">
import { defineComponent } from 'vue'
defineComponent({ name: 'Auth' })
</script>

<template>
	<div class="__auth_wrapper">
		<section class="__auth_box">
			<router-view />
		</section>
	</div>
</template>

<style>
.__auth_wrapper {
	@apply flex justify-center items-center w-full py-4 h-screen;
}

.__auth_box {
	@apply rounded;

	width: 450px;
	padding: 37px 20px 20px;
	background-color: #eceeef;
}
</style>
