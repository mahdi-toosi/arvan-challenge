/* eslint-disable @typescript-eslint/no-explicit-any */
import { provide, inject } from 'vue'
import axios from '@/api'
import type { AxiosInstance } from 'axios'

import auth, { type RAuth } from './auth'
import users, { type RUsers } from './users'
import articles, { type RArticles } from './articles'

function lazyBind<T>(repoFactory: any, repoInterface: T, axios: AxiosInstance) {
	return {
		...Object.keys(repoInterface as any).reduce((acc, method: any) => {
			const resolvedMethod = async (...args: any[]) => {
				const repo: any = await repoFactory()
				return repo.default(axios)[method](...args)
			}
			return {
				...acc,
				[method]: resolvedMethod,
			}
		}, {}),
	} as T
}

export default function repositoryContainer(axios: AxiosInstance) {
	return {
		get auth() {
			return lazyBind<RAuth>(() => import('./auth'), auth(axios), axios)
		},
		get users() {
			return lazyBind<RUsers>(() => import('./users'), users(axios), axios)
		},
		get articles() {
			return lazyBind<RArticles>(() => import('./articles'), articles(axios), axios)
		},
	}
}

export const RepositoryIdentifier = Symbol('api repositories')

export function useRepositoryProvider() {
	provide(RepositoryIdentifier, repositoryContainer(axios))
}

export function useRepositoryContext() {
	return inject(RepositoryIdentifier) as ReturnType<typeof repositoryContainer>
}
