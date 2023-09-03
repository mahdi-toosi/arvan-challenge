import type { Res } from '../types'

export interface Article {
	id?: number
	slug: string
	title: string
	body?: string
	createdAt?: string
	tagList?: string[]
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
	insertArticle(payload: Article): Res<Article>
	updateArticle(payload: Article): Res<Article>
	deleteArticle(id: number): Res
}
