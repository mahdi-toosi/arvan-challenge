import type { App, Component as VueComponent } from 'vue'
import type { IContext } from '@/context'

import Button from 'primevue/button'
import Column from 'primevue/column'
import Skeleton from 'primevue/skeleton'
import DataTable from 'primevue/datatable'

type IComponent = { [key: string]: VueComponent }
const generalComponents = {
	Button,
	Column,
	Skeleton,
	DataTable,
} as IComponent

function registerVueComponents(app: App<Element>, ctx: IContext) {
	for (const cmp in generalComponents) {
		ctx.Component.register(app, {
			component: generalComponents[cmp],
			name: cmp,
		})
	}
}

export default function registerGlobalComponents(app: App<Element>, ctx: IContext) {
	registerVueComponents(app, ctx)
}
