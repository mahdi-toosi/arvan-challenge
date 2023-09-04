import type { AxiosInstance } from 'axios'
import type { RArticles } from './types'
export type { RArticles }

const articlesService = '/articles'
const tagsService = '/tags'

export default (axios: AxiosInstance): RArticles => ({
	// ! articles
	getArticles() {
		return axios.get(articlesService)
	},
	getArticle(slug) {
		return axios.get(`${articlesService}/${slug}`)
	},
	putArticle(payload) {
		if (payload.slug) return axios.put(`${articlesService}/${payload.slug}`, payload)
		else return axios.post(articlesService, payload)
	},
	deleteArticle(slug) {
		return axios.delete(`${articlesService}/${slug}`)
	},

	// ! tags
	getTags() {
		return axios.get(tagsService)
	},
})
