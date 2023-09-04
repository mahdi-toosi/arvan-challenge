/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios'
import router from './router'
import useStoreToast from '@/composable/useStoreToast'
// ? types
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const { showToast } = useStoreToast()

export const baseURL = localStorage.getItem('baseUrl') || (import.meta.env?.VITE_BASE_URL as string)

const axiosInstance = axios.create({ baseURL })

function handleRequest(config: AxiosRequestConfig) {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers!['Authorization'] = token
	}

	const workspace_uuid = localStorage.getItem('workspace_uuid')
	if (workspace_uuid) config.headers!['X-WORKSPACE-UUID'] = workspace_uuid

	return config as InternalAxiosRequestConfig
}

function handleResponse(response: AxiosResponse) {
	return response.data
}

axiosInstance.interceptors.request.use(handleRequest)

axiosInstance.interceptors.response.use(handleResponse, (error) => {
	if (!error) return

	if (error.response?.status === 403 && !error.response.config.env.doNotConsider403) {
		router.push({ name: 'Forbidden' })
	}

	if (error.response?.status === 401 && window.location.pathname !== '/auth') {
		localStorage.clear()
		localStorage.setItem('redirect', window.location.pathname + window.location.search)

		router.push({ name: 'Login' })
		return
	}

	let sended = 0
	function showError(msg: string) {
		++sended
		showToast({ msg })
	}

	if (error.response?.data) {
		const errors = error.response.data.errors

		for (const errorKey in errors) {
			showError(`${errorKey} ${errors[errorKey]}`)
		}
	}

	if (!sended) showError(error.response?.data.message || error.message)
})

export default axiosInstance
