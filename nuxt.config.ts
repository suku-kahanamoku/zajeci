import en from './assets/locales/en.json';
import cs from './assets/locales/cs.json';
import theme from './assets/css/theme.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: true,
	devtools: { enabled: true },
	modules: [
		'@vue-email/nuxt',
		'@nuxtjs/i18n',
		'@nuxt/ui',
		'@nuxtjs/seo',
		'@nuxt/image',
		'@pinia/nuxt',
		'nuxt-auth-utils',
		'nuxt-gtag',
		'nuxt-rating',
	],
	css: ['@/assets/css/main.css'],
	nitro: {
		compressPublicAssets: true,
		minify: true,
	},
	runtimeConfig: {
		session: {
			maxAge: 60 * 60 * 24,
			enableRefreshOnWindowFocus: true,
		},
	},
	router: {
		options: {
			scrollBehaviorType: 'smooth',
		},
	},
	pinia: {
		storesDirs: ['./stores/**'],
	},
	i18n: {
		lazy: true,
		defaultLocale: 'cs',
		langDir: './assets/locales',
		strategy: 'prefix_except_default',
		locales: [
			{ code: 'cs', iso: 'cs-CZ', icon: 'emojione:flag-for-czechia', file: 'cs.json' },
			{ code: 'en', iso: 'en-UK', icon: 'emojione:flag-for-united-kingdom', file: 'en.json' },
		],
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_locale',
		},
		experimental: {
			localeDetector: './server/composables/localeDetector.ts',
		},
	},
	gtag: {
		id: process.env.NUXT_PUBLIC_GTAG_ID,
	},
	vueEmail: {
		baseUrl: process.env.FRONTEND_HOST,
		autoImport: true,
		i18n: {
			defaultLocale: 'cs',
			translations: {
				cs: { $: cs.$ as any },
				en: { $: en.$ as any },
			},
		},
		tailwind: {
			theme: {
				extend: {
					colors: theme.colors,
				},
			},
		},
	},
});
