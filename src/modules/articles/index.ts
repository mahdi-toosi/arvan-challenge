import type { IContext } from '@/context'

export default function (ctx: IContext) {
	ctx.Router.registerRoutes([
		{
			path: '/articles',
			name: 'Articles',
			meta: { title: 'Articles', layout: 'default' },
			component: () => import('./pages/Articles.vue'),
		},
	])
}