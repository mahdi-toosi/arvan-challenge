import type { IContext } from '@/context'

export default function (ctx: IContext) {
	ctx.Router.registerRoutes([
		{
			path: '/',
			name: 'Dashboard',
			redirect: { name: 'Articles' },
		},
		{
			path: '/forbidden',
			name: 'Forbidden',
			meta: { title: 'forbidden', layout: 'none' },
			component: () => import('./pages/403.vue'),
		},
	])
}
