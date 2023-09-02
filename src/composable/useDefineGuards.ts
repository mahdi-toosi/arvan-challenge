// ? vue
import { ref } from 'vue'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
// ? utils
import NProgress from 'nprogress'

// caches the JWT status
const hasToken = ref(false)

function authGuard(to: RouteLocationNormalized, next: NavigationGuardNext): void {
	const authenticationPages = ['auth', 'login', 'register']

	if (to.meta.guest) {
		if (localStorage.getItem('token') && authenticationPages.includes(to.name as string))
			return next({ name: 'Dashboard' })
		else return next()
	} else if (hasToken.value) {
		return next()
	} else {
		localStorage.setItem('redirect', to.fullPath)
		return next({ path: '/auth' })
	}
}

async function globalStartupGuard(to: RouteLocationNormalized): Promise<void> {
	if (to.path) NProgress.start()
	if (!hasToken.value) hasToken.value = localStorage.getItem('token') ? true : false
}

export async function beforeEach(
	to: RouteLocationNormalized,
	_from: RouteLocationNormalized,
	next: NavigationGuardNext
) {
	return globalStartupGuard(to).then(() => authGuard(to, next))
	// .catch(() => NProgress.done())
}

export function afterEach(to: RouteLocationNormalized) {
	NProgress.done()
	if (to.meta.title) document.title += ` | ${to.meta.title}`
}
