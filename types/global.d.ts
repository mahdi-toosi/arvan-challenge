declare module 'vue3-persian-datetime-picker'
declare module 'nprogress'

import type Button from 'primevue/button'
import type Skeleton from 'primevue/skeleton'

declare module '@vue/runtime-core' {
	export interface GlobalComponents {
		Button: typeof Button
		Skeleton: typeof Skeleton
	}
}

//  ? RouterMeta
export interface Bread {
	title: string
	name?: string
	query?: string[]
	params?: RouteParamsRaw
}

declare module 'vue-router' {
	interface RouteMeta {
		title: string
		breadcrumb?: Bread[]
		requiresAuth?: boolean
		layout: 'default' | 'none'
	}
}
//  ? ENd RouterMeta
