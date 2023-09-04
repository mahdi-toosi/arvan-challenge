<script setup lang="ts">
// ? vue
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
// ? utils
import useVuelidate from '@vuelidate/core'
import useStoreUser from '@/composable/useStoreUser'
import { useRepositoryContext } from '@/repositories'
import useValidation from '@/composable/useValidations'
// ? components
import Password from 'primevue/password'
import AppInput from '@/components/AppInput.vue'
import AppLabel from '@/components/AppLabel.vue'
// ? types
import type { AuthResponse, RegisterPayload } from '@/repositories/users/types'

const AppInputErrors = defineAsyncComponent(() => import('@/components/AppInputErrors.vue'))

// ?  define and uses
const $router = useRouter()
const { setUser } = useStoreUser()
const { users } = useRepositoryContext()

const state = ref({} as RegisterPayload['user'])
const { requiredField: password, requiredField: username, requiredField: email } = useValidation()
const rules = computed(() => ({ username, password, email }))
const $v = useVuelidate(rules, state)
// ? END define and uses

const loading = ref(false)
async function onSubmit() {
	$v.value.$touch()
	if ($v.value.$invalid) return

	loading.value = true
	const result = await users.register({ user: state.value })
	loading.value = false
	if (!result) return

	setUser(result as AuthResponse)

	const redirect = localStorage.getItem('redirect')
	if (!redirect) return $router.push({ name: 'Dashboard' })

	$router.push(redirect)
	localStorage.removeItem('redirect')
}
</script>

<template>
	<form class="flex flex-col gap-6" @submit.prevent="onSubmit">
		<h4>Register</h4>

		<AppInput v-model="state.username" label="User" :errors="$v.username.$errors" />

		<AppInput v-model="state.email" label="Email" :errors="$v.email.$errors" />

		<div>
			<AppLabel label="Password" :invalid="$v.password.$errors.length" />

			<Password
				v-model="state.password"
				input-id="Password"
				:feedback="false"
				input-class="w-full"
				:class="['w-full', { 'p-invalid': $v.password.$errors.length }]"
			/>

			<AppInputErrors :errors="$v.password.$errors" />
		</div>

		<div>
			<Button label="Register" class="w-full" type="submit" :loading="loading" />

			<div class="mt-4">
				<span>Already Registered?</span>
				<router-link :to="{ name: 'Login' }">
					<Button
						label="Login"
						class="font-bold text-CharcoalGrey p-0 ml-2"
						severity="secondary"
						text
					/>
				</router-link>
			</div>
		</div>
	</form>
</template>

<style scoped>
h4 {
	@apply text-warmGrey text-center;

	font-size: 47px;
	margin-bottom: 1rem;
}
</style>
