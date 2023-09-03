<script setup lang="ts">
// ? vue
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// ? utils
import useVuelidate from '@vuelidate/core'
import useStoreUser from '@/composable/useStoreUser'
import { useRepositoryContext } from '@/repositories'
import useStoreToast from '@/composable/useStoreToast'
import useValidation from '@/composable/useValidations'
// ? components
import Password from 'primevue/password'
import AppInput from '@/components/AppInput.vue'
import AppLabel from '@/components/AppLabel.vue'
// ? types
import type { User } from '@/repositories/users/types'
import type { AuthResponse, RegisterPayload } from '@/repositories/auth/types'

const AppInputErrors = defineAsyncComponent(() => import('@/components/AppInputErrors.vue'))

// ?  define and uses
const { showToast } = useStoreToast()
const { setUser } = useStoreUser()
const { auth } = useRepositoryContext()

const $router = useRouter()

const userStage = ref({} as User)
const { requiredField: password, requiredField: username, requiredField: email } = useValidation()
const rules = computed(() => ({ username, password, email }))
const $v = useVuelidate(rules, userStage)
// ? END define and uses

const storeLoading = ref(false)
async function onStore() {
	$v.value.$touch()
	if ($v.value.$invalid) return

	storeLoading.value = true

	const result = await auth.register(userStage.value as RegisterPayload)
	storeLoading.value = false

	if (!result) return

	setUser(result as AuthResponse)

	const redirect = localStorage.getItem('redirect')
	if (redirect) {
		localStorage.removeItem('redirect')
		$router.push(redirect)
		return
	}

	$router.push({ name: 'Dashboard' })
}
</script>

<template>
	<form class="flex flex-col gap-6" @submit.prevent="onStore">
		<h4>Register</h4>

		<AppInput v-model="userStage.username" label="User" :errors="$v.username.$errors" />

		<AppInput v-model="userStage.email" label="Email" :errors="$v.email.$errors" />

		<div>
			<AppLabel label="Password" :invalid="$v.password.$errors.length" />

			<Password
				v-model="userStage.password"
				input-id="Password"
				:feedback="false"
				input-class="w-full"
				:class="['w-full', { 'p-invalid': $v.password.$errors.length }]"
			/>

			<AppInputErrors :errors="$v.password.$errors" />
		</div>

		<div>
			<Button label="Register" class="w-full" type="submit" :loading="storeLoading" />

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
