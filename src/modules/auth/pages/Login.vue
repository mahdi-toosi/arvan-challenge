<script setup lang="ts">
// ? vue
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
// ? utils
import useVuelidate from '@vuelidate/core'
import { useRepositoryContext } from '@/repositories'
import useStoreUser from '@/composable/useStoreUser'
import useValidation from '@/modules/auth/composable/useValidations'
// ? components
import Password from 'primevue/password'
import AppLabel from '@/components/AppLabel.vue'
import AppInput from '@/components/AppInput.vue'

const AppInputErrors = defineAsyncComponent(() => import('@/components/AppInputErrors.vue'))

// ?  define and uses
const $router = useRouter()
const { setUser } = useStoreUser()
const { auth } = useRepositoryContext()
const { password, nationalCode } = useValidation()
// ? END define and uses

const state = reactive({ nationalCode: '', password: '' })
const rules = computed(() => ({ nationalCode, password }))
const $v = useVuelidate(rules, state)

const loading = ref(false)
async function onSubmit() {
	$v.value.$touch()
	if ($v.value.$invalid) return
	loading.value = true

	const payload = {
		username: state.nationalCode,
		password: state.password,
	}
	const result = await auth.login(payload)
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
	<section class="__log_in_section">
		<form class="px-4 md:px-10 py-7" @submit.prevent="onSubmit">
			<h4>ورود به حساب کاربری</h4>

			<div class="flex flex-col gap-3 md:w-80">
				<AppInput
					v-model="state.nationalCode"
					label="نام کاربری (کد ملی)"
					icon="pi pi-user"
					number
					required
					:errors="$v.nationalCode.$errors"
					@change="$v.nationalCode.$touch()"
				/>

				<div>
					<AppLabel label="رمز عبور" required />

					<Password
						v-model="state.password"
						input-id="رمز عبور"
						toggle-mask
						class="w-full"
						:feedback="false"
						input-class="w-full"
						placeholder="وارد کنید"
						show-icon="pi pi-eye"
						hide-icon="pi pi-eye-slash"
						@change="$v.password.$touch()"
					/>

					<AppInputErrors :errors="$v.password.$errors" />
				</div>
			</div>

			<router-link to="/auth/forgot-password" class="block mt-4 text-sm text-blue-500 w-max">
				رمز ورود را فراموش کرده اید؟
			</router-link>

			<div class="flex justify-center flex-col mt-5">
				<Button type="submit" label="ورود" severity="success" :loading="loading" />

				<hr class="my-4 text-gray-300" />

				<router-link to="/auth/register">
					<Button label="ثبت نام" class="w-full" severity="secondary" />
				</router-link>
			</div>
		</form>

		<div class="__img_wrapper">
			<img src="@/assets/images/login.png" width="400" />
		</div>
	</section>
</template>

<style scoped>
:deep(.p-password-input) {
	width: 100%;
}

.__img_wrapper {
	@apply flex justify-center items-center border rounded-3xl p-4 md:p-16;
}

.__log_in_section {
	@apply flex flex-col-reverse md:flex-row;
}

.__log_in_section h4 {
	@apply text-lg text-center font-bold mb-6;
}
</style>
