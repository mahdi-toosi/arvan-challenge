import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import analyze from 'rollup-plugin-analyzer'

// We should come up with a sensible number later!
const limitBytes = 5e6

export default defineConfig({
	plugins: [
		vue({
			reactivityTransform: true,
			script: { propsDestructure: true, defineModel: true },
		}),
		process.env.NODE_ENV === 'development' && eslintPlugin(),
	],
	server: {
		port: 3002,
		host: true,
	},
	resolve: {
		alias: [{ find: '@', replacement: '/src' }],
		mainFields: ['browser', 'module', 'main', 'jsnext:main', 'jsnext'],
	},
	optimizeDeps: {
		include: ['ckeditor5-custom-build'],
	},
	build: {
		// commonjsOptions: { exclude: ['ckeditor5-custom-build'], include: [] },
		rollupOptions: {
			plugins: [
				analyze({
					skipFormatted: true,
					onAnalysis({ bundleSize }) {
						if (bundleSize < limitBytes) return
						// eslint-disable-next-line
						console.log(`Bundle siz‍e exceeds ${limitBytes} bytes: ${bundleSize} bytes`)
						return // process.exit(1)
					},
				}),
				visualizer({
					gzipSize: true,
					brotliSize: true,
				}),
			],
		},
	},
})
