import type { RouteLocationNormalizedLoaded } from 'vue-router';

export default async function (to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded) {
	const localePath = useLocalePath();
	const auth = useAuthStore();

	// je prihlaseny
	if (auth.loggedIn) {
		// pokud jde z dashboardu do login, signup, password, zrusi navigaci
		if (from.meta?.syscode === 'admin') {
			switch (to.meta?.syscode) {
				case 'login':
				case 'signup':
				case 'forgot-password':
					return await abortNavigation();
			}
		}
		// jinak presmeruje na dashboard
		else {
			switch (to.meta?.syscode) {
				case 'login':
				case 'signup':
				case 'forgot-password':
					return await navigateTo(localePath('/admin'));
			}
		}
	}
	// neni prihlaseny, ale chce jit na zabezpecenou stranku
	else if (to.path.includes('/admin')) {
		switch (from.meta?.syscode) {
			// pokud jde z login, signup nebo password, zrusi navigaci
			case 'login':
			case 'signup':
			case 'forgot-password':
				return await abortNavigation();
			// jinak presmeruje na login
			default:
				return await navigateTo(localePath('/login'));
		}
	}
}
