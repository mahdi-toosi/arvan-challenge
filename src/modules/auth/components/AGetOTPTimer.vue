<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

const $emit = defineEmits(['sendAgain'])

const initTime = 2 * 60

const state = reactive({
	minutes: 0,
	secondes: 0,
	time: initTime,
})
let timer: number | undefined = 0

function start() {
	if (timer) return
	timer = window.setInterval(() => {
		if (state.time > 0) state.time--
		else reset()
	}, 1000)
}

function reset() {
	clearInterval(timer)
	timer = undefined
	state.time = 0
	state.secondes = 0
	state.minutes = 0
}

const prettyTime = computed(() => {
	const time = state.time / 60
	const minutes = parseInt(String(time))
	const secondes = Math.round((time - minutes) * 60)
	return minutes + ':' + secondes
})

function sendAgain() {
	if (state.time !== 0) return
	state.time = initTime
	start()
	$emit('sendAgain', {})
}

onMounted(() => {
	start()
})
</script>

<template>
	<p class="mt-6 text-sm">
		کد را دریافت نکرده اید؟
		<button
			class="transition"
			style="padding-right: 0.25rem !important"
			:class="state.time === 0 ? 'cursor-pointer  text-blue-500' : 'cursor-not-allowed'"
			type="button"
			@click="sendAgain()"
		>
			<span class="underline">ارسال دوباره کد</span>

			<span
				v-if="state.time"
				:class="{ 'text-red-600': state.time < 10 }"
				style="padding-right: 0.25rem !important"
				v-text="prettyTime"
			/>
		</button>
	</p>
</template>
