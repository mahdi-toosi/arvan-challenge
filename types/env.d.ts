/// <reference types="vite/client" />

// declare module '*.vue' {
// 	import type { DefineComponent } from 'vue'
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
// 	const component: DefineComponent<{}, {}, any>
// 	export default component
// }

interface ImportMetaEnv {
	// see https://vitejs.dev/guide/env-and-mode.html#env-files
	// add .env variables.
	readonly VITE_BASE_URL: string
	readonly VITE_NODE_ENV: 'development' | 'staging' | 'production'
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
	readonly env: ImportMetaEnv
}
