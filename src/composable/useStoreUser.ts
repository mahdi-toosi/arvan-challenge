// ? vue
import { ref } from 'vue'
// ? types
import type { User, AuthResponse } from '@/repositories/users/types'

const user = ref({} as User)

export default () => {
	if (!user.value.username) {
		const _user = localStorage.getItem('user')
		if (_user) user.value = JSON.parse(_user)
	}

	return {
		user,

		setUser(payload: AuthResponse) {
			localStorage.setItem('token', 'Token ' + payload.user.token)

			delete payload.user.token
			localStorage.setItem('user', JSON.stringify(payload.user))
			user.value = payload.user
		},
	}
}
