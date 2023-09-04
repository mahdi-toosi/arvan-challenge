import type { AxiosInstance } from 'axios'
import type { RUsers } from './types'
export type { RUsers }

const usersService = '/users'

export default (axios: AxiosInstance): RUsers => ({
	login(payload) {
		return axios.post(`${usersService}/login`, payload)
	},
	register(payload) {
		return axios.post(usersService, payload)
	},
})
