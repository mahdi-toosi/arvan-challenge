import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	important: true,
	content: ['./public/**/*.html', './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				Red: '#d9534f',
				Blue: '#1c7cd5',
				Green: '#5cb85c',
				CharcoalGrey: '#373a3c',
			},
		},
		fontFamily: {
			sans: ['HelveticaNeue', ...defaultTheme.fontFamily.sans],
		},
	},
}
