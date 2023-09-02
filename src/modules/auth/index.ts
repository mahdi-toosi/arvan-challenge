import type { IContext } from '@/context'
const guest = true

export default function (ctx: IContext) {
	ctx.Router.registerRoutes([
		{
			path: '/auth',
			name: 'auth',
			meta: { title: '', guest, layout: 'none' },
			component: () => import('./pages/Index.vue'),
			children: [
				{
					path: '',
					name: 'login',
					meta: { guest, title: 'ورود', layout: 'none' },
					component: () => import('./pages/Login.vue'),
				},
				{
					path: 'register',
					name: 'register',
					meta: { guest, title: 'ثبت نام', layout: 'none' },
					component: () => import('@/components/AppRegister.vue'),
				},
				{
					path: 'forgot-password',
					name: 'forgotPass',
					meta: { guest, title: 'بازیابی رمز عبور', layout: 'none' },
					component: () => import('./pages/ForgotPass.vue'),
				},
			],
		},
	])
}
