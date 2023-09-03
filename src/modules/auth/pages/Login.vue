<script setup lang="ts">
// ? vue
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
// ? utils
import useVuelidate from '@vuelidate/core'
import { useRepositoryContext } from '@/repositories'
import useStoreUser from '@/composable/useStoreUser'
import useValidation from '@/composable/useValidations'
// ? components
import Password from 'primevue/password'
import AppLabel from '@/components/AppLabel.vue'
import AppInput from '@/components/AppInput.vue'

const AppInputErrors = defineAsyncComponent(() => import('@/components/AppInputErrors.vue'))

// ?  define and uses
const $router = useRouter()
const { setUser } = useStoreUser()
const { auth } = useRepositoryContext()
const { requiredField: password, requiredField: email } = useValidation()
// ? END define and uses

const state = ref({ email: '', password: '' })
const rules = computed(() => ({ email, password }))
const $v = useVuelidate(rules, state)

const loading = ref(false)
async function onSubmit() {
	$v.value.$touch()
	if ($v.value.$invalid) return

	loading.value = true
	const result = await auth.login(state.value)
	loading.value = false
	if (!result) return

	setUser(result)

	const redirect = localStorage.getItem('redirect')
	if (!redirect) return $router.push({ name: 'Dashboard' })

	$router.push(redirect)
	localStorage.removeItem('redirect')
}
</script>

<template>
	<form @submit.prevent="onSubmit">
		<h4>LOGIN</h4>

		<div class="flex flex-col gap-6">
			<AppInput v-model="state.email" label="Email" type="email" :errors="$v.email.$errors" />

			<div>
				<AppLabel label="Password" :invalid="$v.password.$errors.length" />

				<Password
					v-model="state.password"
					input-id="Password"
					:feedback="false"
					input-class="w-full"
					:class="['w-full', { 'p-invalid': $v.password.$errors.length }]"
					@change="$v.password.$touch()"
				/>

				<AppInputErrors :errors="$v.password.$errors" />
			</div>
		</div>

		<div class="flex justify-center flex-col mt-5">
			<Button type="submit" label="Login" :loading="loading" />

			<div class="mt-4">
				<span>Don’t have account?</span>
				<router-link :to="{ name: 'Register' }">
					<Button
						label="Register Now"
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
