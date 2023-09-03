import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	important: true,
	content: ['./public/**/*.html', './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontSize: {
				xl: '1.375rem',
			},
			colors: {
				Red: '#d9534f',
				Blue: '#1c7cd5',
				Green: '#5cb85c',
				warmGrey: '#707070',
				CharcoalGrey: '#373a3c',
			},
		},
		fontFamily: {
			sans: ['Roboto', ...defaultTheme.fontFamily.sans],
		},
	},
}
