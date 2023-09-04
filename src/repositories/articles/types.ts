import type { Res } from '../types'

export interface Article {
	body: string
	slug?: string
	title: string
	tagList?: string[]
	createdAt?: string
	favorited: boolean
	description: string
	favoritesCount: number
	author?: {
		bio: string
		image: string
		username: string
		following: boolean
	}
}

export interface RArticles {
	// ! articles
	getArticles(): Res<{ articles: Article[]; articlesCount: number }>
	getArticle(slug: string): Res<{ article: Article }>
	putArticle(payload: { article: Article }): Res
	deleteArticle(slug: string): Res

	// ! articles
	getTags(): Res<{ tags: string[] }>
}
