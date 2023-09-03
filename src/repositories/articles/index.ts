import type { AxiosInstance } from 'axios'
import type { RArticles } from './types'
export type { RArticles }

const articlesService = '/articles'

export default (axios: AxiosInstance): RArticles => ({
	// ! articles
	getArticles() {
		return axios.get(articlesService)
	},
	insertArticle(payload) {
		return axios.post(articlesService, payload)
	},
	updateArticle(payload) {
		return axios.patch(`${articlesService}/${payload.id}`, payload)
	},
	deleteArticle(id) {
		return axios.delete(`${articlesService}/${id}`)
	},
})
