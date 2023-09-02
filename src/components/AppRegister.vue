<script setup lang="ts">
// ? vue
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// ? utils
import useVuelidate from '@vuelidate/core'
import { useRepositoryContext } from '@/repositories'
import useStoreUser from '@/composable/useStoreUser'
import useStoreToast from '@/composable/useStoreToast'
import generalUseValidation from '@/composable/useValidations'
import useValidation from '@/modules/auth/composable/useValidations'
// ? components
import AppInput from './AppInput.vue'
import AppLabel from './AppLabel.vue'
import Password from 'primevue/password'
// ? types
import type { ValidationRuleWithParams } from '@vuelidate/core'
import type { UpdatePayload, User } from '@/repositories/users/types'
import type { AuthResponse, RegisterPayload } from '@/repositories/auth/types'

const AppInputErrors = defineAsyncComponent(() => import('@/components/AppInputErrors.vue'))

// ?  define and uses
const $props = defineProps({
	updateMode: { type: Boolean, default: false },
})
const $emit = defineEmits(['registered'])

const { user, setUser } = useStoreUser()
const { auth, users } = useRepositoryContext()

const $route = useRoute()
const $router = useRouter()

const checkOtpCode = ref(false)
const isRegisterPage = $route.name === 'register'
const isProfileInfoPage = $route.name === 'ProfileInfo'

const mobileBeforeUpdate = ref(undefined as undefined | string)
// ? END define and uses

const userStage = ref({} as User)

const {
	email,
	mobile,
	password,
	nationalCode: national_code,
	rpassword: password_confirmation,
} = useValidation()
const {
	requiredField: code,
	requiredText: first_name,
	requiredText: last_name,
} = generalUseValidation()

const rules = computed(() => {
	const obj = { first_name, last_name, email, national_code, mobile } as Record<
		string,
		{ [key: string]: ValidationRuleWithParams<object> }
	>
	if (!$props.updateMode) {
		obj.password = password
		obj.password_confirmation = password_confirmation(userStage.value.password as string)
	}
	if (checkOtpCode.value) {
		obj.code = code
	}
	return obj
})
const $v = useVuelidate(rules, userStage)

function updateUserInFront(result: User) {
	if (user.value.id !== result.id) return
	user.value.first_name = result.first_name
	user.value.last_name = result.last_name
	user.value.mobile = result.mobile
	user.value.national_code = result.national_code
	user.value.avatar_url = result.avatar_url

	// * save in local storage
	const localUser = localStorage.getItem('user')
	if (localUser) {
		const parsedUser = JSON.parse(localUser)
		parsedUser.first_name = result.first_name
		parsedUser.last_name = result.last_name
		parsedUser.avatar_url = result.avatar_url
		localStorage.setItem('user', JSON.stringify(parsedUser))
	}
}

const storeLoading = ref(false)
const { showToast } = useStoreToast()
async function onStore() {
	$v.value.$touch()
	if ($v.value.$invalid) return

	storeLoading.value = true

	let result
	if ($props.updateMode) {
		if (userStage.value.id !== user.value.id) return (storeLoading.value = false)

		result = await users.updateUser(userStage.value as UpdatePayload)
		if (result) updateUserInFront(result)

		if (result && mobileBeforeUpdate.value !== result.mobile) {
			showToast({
				severity: 'success',
				detail: 'لطفا شماره موبایل خود را تایید و فعال کنید.',
				life: 10000,
			})
			$router.push({ name: 'MobileVerification' })
		}
	} else {
		if (isRegisterPage) {
			result = await auth.register(userStage.value as RegisterPayload)
		} else {
			result = await users.insertUser(userStage.value)
			result = { user: result }
		}
	}
	storeLoading.value = false

	if (!result) return

	if (!isRegisterPage) {
		$emit('registered', result)
		return
	} else setUser(result as AuthResponse)

	const redirect = localStorage.getItem('redirect')
	if (redirect) {
		localStorage.removeItem('redirect')
		$router.push(redirect)
		return
	}

	$router.push({ name: 'Dashboard' })
}

const fetchLoading = ref(false)
async function fetchUser() {
	if (!$props.updateMode) return
	let user_id

	fetchLoading.value = true
	const result = await users.getUser({ id: user_id })
	fetchLoading.value = false
	if (!result) return

	userStage.value = result as User
	mobileBeforeUpdate.value = (result as User).mobile
}

onMounted(() => {
	fetchUser()
})
</script>

<template>
	<form :class="{ 'md:px-36 ': isRegisterPage }" @submit.prevent="onStore">
		<h4 :class="['text-xl font-bold mb-4', { 'text-center mb-10': isRegisterPage }]">
			<slot name="header">ایجاد حساب کاربری جدید</slot>
		</h4>
		<slot name="subHeader"> </slot>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<AppInput
				v-model="userStage.first_name"
				label="نام"
				style="min-width: 15rem"
				icon="pi pi-user"
				required
				:errors="$v.first_name.$errors"
				:loading="fetchLoading"
			/>

			<AppInput
				v-model="userStage.last_name"
				label="نام خانوادگی"
				icon="pi pi-user"
				required
				:errors="$v.last_name.$errors"
				:loading="fetchLoading"
			/>

			<AppInput
				v-model="userStage.national_code"
				v-persian-digits="{ block: 12, delimiter: '' }"
				label="کد ملی"
				icon="fas fa-barcode"
				required
				number
				:loading="fetchLoading"
				:disabled="isProfileInfoPage"
				:errors="$v.national_code.$errors"
			/>

			<AppInput
				v-model="userStage.mobile"
				label="شماره همراه"
				icon="pi pi-mobile"
				number
				:disabled="checkOtpCode"
				:errors="
					updateMode && !fetchLoading
						? [{ $message: 'در صورت تغییر باید تایید و فعال سازی انجام گیرد.' }]
						: $v.mobile.$errors
				"
			/>

			<template v-if="!updateMode">
				<div>
					<AppLabel label="رمز عبور" required />

					<Password
						v-model="userStage.password"
						input-id="رمز عبور"
						toggle-mask
						placeholder="وارد کنید"
						hide-icon="pi pi-eye-slash"
						show-icon="pi pi-eye"
						:class="['w-full', { 'p-invalid': $v.password.$errors.length }]"
						input-class="w-full"
					/>

					<AppInputErrors :errors="$v.password.$errors" />
				</div>

				<div>
					<AppLabel label="تکرار رمز عبور" required />

					<Password
						v-model="userStage.password_confirmation"
						input-id="تکرار رمز عبور"
						toggle-mask
						placeholder="وارد کنید"
						hide-icon="pi pi-eye-slash"
						show-icon="pi pi-eye"
						:class="['w-full', { 'p-invalid': $v.password.$errors.length }]"
						input-class="w-full"
					/>

					<AppInputErrors :errors="$v.password_confirmation.$errors" />
				</div>

				<AppInput
					v-model="userStage.email"
					label="ایمیل"
					placeholder="example@domain.com"
					icon="pi pi-at"
					type="email"
					dir="ltr"
					:errors="$v.email.$errors"
					:loading="fetchLoading"
				/>

				<AppInput
					v-if="checkOtpCode"
					v-model="userStage.code"
					v-persian-digits="{ block: 10, delimiter: '' }"
					label="کد پیامک شده"
					icon="fas fa-mobile"
					:errors="$v.code?.$errors"
				/>
			</template>
		</div>

		<div v-if="isRegisterPage" class="__register_button" dir="ltr">
			<Skeleton v-if="fetchLoading" height="2.6rem" />

			<Button
				v-if="!fetchLoading && !updateMode && ($route.name !== 'register' || checkOtpCode)"
				label="ثبت نام"
				type="submit"
				:loading="storeLoading"
			/>

			<router-link to="/auth">
				<Button
					label="قبلا ثبت نام کرده اید؟ از اینجا وارد شوید"
					class="p-button-outlined w-full"
				/>
			</router-link>
		</div>

		<div v-else class="__register_button" dir="ltr">
			<Button :label="updateMode ? 'بروزرسانی' : 'ثبت نام'" type="submit" :loading="storeLoading" />
		</div>
	</form>
</template>

<style scoped>
:deep(.p-password-input) {
	width: 100%;
}

.__register_button {
	@apply grid grid-cols-1 md:grid-cols-2 gap-4 mt-8;
}

:deep(.__documents_section) {
	@apply bg-white p-5 py-10 rounded-lg my-4;
}

#app {
	text-align: center;
	color: #2c3e50;
	margin-top: 100px;
}

.button-wrapper {
	display: flex;
	justify-content: center;
	margin-top: 17px;
}

.__complex {
	@apply bg-white rounded-2xl text-center px-4 py-1 text-sm;
}
</style>
