export const useAuthStore = defineStore('Auth', () => {
	const { loggedIn, user, session, clear, fetch } = useUserSession();
	const localePath = useLocalePath();

	const initials = computed(
		() =>
			`${
				((user.value?.given_name && user.value?.given_name[0]) || '')?.toUpperCase() +
				((user.value?.family_name && user.value?.family_name[0]) || '')?.toUpperCase()
			}`
	);

	/**
	 * Funkce pro prihlaseni
	 *
	 * @param {Record<string, any>} data
	 * @return {*}  {Promise<void>}
	 */
	const login = async (data: Record<string, any>): Promise<void> => {
		await $fetch('/api/login', { method: 'POST', body: data });
		await fetch();
		await navigateTo(localePath('/admin'));
	};

	/**
	 * Prihlaseni pomoci google
	 */
	const loginByGoogle = () => {
		location.href = '/api/login/google';
	};

	/**
	 * Prihlaseni pomoci linkedin
	 *
	 */
	const loginByLinkedin = () => {
		location.href = '/api/login/linkedin';
	};

	/**
	 * Prihlaseni pomoci facebook
	 *
	 */
	const loginByFacebook = () => {
		location.href = '/api/login/facebook';
	};

	/**
	 * Funkce pro odhlaseni
	 *
	 * @return {*}  {Promise<void>}
	 */
	const logout = async (): Promise<void> => {
		await clear();
		await navigateTo(localePath('/login'));
	};

	/**
	 * Registrace
	 *
	 * @param {Record<string, any>} data
	 * @return {*}  {Promise<void>}
	 */
	const signup = async (data: Record<string, any>): Promise<void> => {
		await $fetch('/api/auth/signup', { method: 'POST', body: data });
		await fetch();
		await navigateTo(localePath('/admin'));
	};

	/**
	 * Resetovani hesla
	 *
	 * @param {Record<string, any>} data
	 * @return {*}  {Promise<void>}
	 */
	const resetPassword = async (data: Record<string, any>): Promise<void> => {
		await $fetch('/api/auth/reset-password', { method: 'POST', body: data });
	};

	return {
		login,
		loginByGoogle,
		loginByLinkedin,
		loginByFacebook,
		signup,
		logout,
		resetPassword,
		loggedIn,
		user,
		session,
		initials,
	};
});
