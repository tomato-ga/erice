// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				rank: {
					gold: '#FFD700',
					silver: '#C0C0C0',
					bronze: '#CD7F32',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				myGradient: {
					// キーフレーム名を変更
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				myGradient: 'myGradient 10s ease infinite', // アニメーション名を変更
			},
		},
	},
	plugins: [
		// ({ addUtilities }) => {
		// 	const newUtilities = {
		// 		'.bg-custom-gradient-exbutton': {
		// 			backgroundImage: 'linear-gradient(-45deg, var(--tw-gradient-stops))',
		// 			backgroundSize: '400% 400%',
		// 			animation: 'gradientAnimation 13s linear infinite',
		// 		},
		// 		'.bg-custom-gradient-exbutton--dmm': {
		// 			'--tw-gradient-stops': '#f66946, #f8a76a, #fb5274, #f8788f',
		// 		},
		// 		'.bg-custom-gradient-exbutton--doujin': {
		// 			'--tw-gradient-stops': '#ec4899, #f43f5e, #e11d48, #be185d',
		// 		},
		// 		'.bg-custom-gradient-exbutton--var3': {
		// 			'--tw-gradient-stops': '#f92f79, #ffe15d, #2770ef, #37fbe4',
		// 		},
		// 	}
		// 	addUtilities(newUtilities, ['responsive', 'hover'])
		// },
	],
} satisfies Config

export default config
