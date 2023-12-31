import type { IContext } from '@/context'

export default function (ctx: IContext) {
	ctx.Router.registerRoutes([
		{
			path: '/articles',
			name: 'Articles',
			meta: { title: 'Articles', layout: 'default' },
			component: () => import('./pages/Articles.vue'),
		},
		{
			path: '/articles/create',
			name: 'ArticleCreate',
			meta: { title: 'Create Articles', layout: 'default' },
			component: () => import('./pages/ArticlesCreate.vue'),
		},
		{
			path: '/articles/edit/:slug',
			name: 'ArticleEdit',
			meta: { title: 'Edit Articles', layout: 'default' },
			component: () => import('./pages/ArticlesEdit.vue'),
		},
	])
}
