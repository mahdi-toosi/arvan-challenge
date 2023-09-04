import type { IContext } from '@/context'
const guest = true

export default function (ctx: IContext) {
	ctx.Router.registerRoutes([
		{
			path: '/auth',
			name: 'Auth',
			meta: { title: '', guest, layout: 'none' },
			component: () => import('./pages/Index.vue'),
			children: [
				{
					path: '',
					name: 'Login',
					meta: { guest, title: 'login', layout: 'none' },
					component: () => import('./pages/Login.vue'),
				},
				{
					path: 'register',
					name: 'Register',
					meta: { guest, title: 'register', layout: 'none' },
					component: () => import('./pages/Register.vue'),
				},
			],
		},
	])
}
