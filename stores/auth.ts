import type { AddressDocument } from '@/server/types/address.type';

export const useAuthStore = defineStore('Auth', () => {
	const { loggedIn, user, session, clear, fetch } = useUserSession();
	const localePath = useLocalePath();

	// vytvorime adresy pro user objekt
	if (user.value) {
		user.value.address = user.value.address || {};
		user.value.address.main =
			user.value.address.main || ({ street: '', city: '', postal_code: '', state: '' } as AddressDocument);
	}

	const initials = computed(
		() =>
			`${
				((user.value?.given_name && user.value?.given_name[0]) || '')?.toUpperCase() +
				((user.value?.family_name && user.value?.family_name[0]) || '')?.toUpperCase()
			}`
	);

	const isAdmin = computed(() => user.value?.role === 'admin');

	const roles: Record<string, { value: string; label: string }> = {
		guest: { value: 'guest', label: '$.profile.role.guest' },
		user: { value: 'user', label: '$.profile.role.user' },
		admin: { value: 'admin', label: '$.profile.role.admin' },
	};

	const roleOptions = Object.values(roles);

	const fields: Record<
		string,
		{
			key: string;
			label: string;
			placeholder?: string;
			autocomplete?: string;
		}
	> = {
		email: {
			key: 'email',
			label: '$.form.email',
			placeholder: 'info@company.com',
			autocomplete: 'email',
		},
		phone: {
			key: 'phone',
			label: '$.form.phone',
			placeholder: '+420 123 456 789',
			autocomplete: 'tel',
		},
		name: {
			key: 'name',
			label: '$.form.name',
			placeholder: '$.profile.placeholder.name',
			autocomplete: 'name',
		},
		given_name: {
			key: 'given_name',
			label: '$.profile.given_name',
			placeholder: '$.profile.placeholder.given_name',
			autocomplete: 'given-name',
		},
		family_name: {
			key: 'family_name',
			label: '$.profile.family_name',
			placeholder: '$.profile.placeholder.family_name',
			autocomplete: 'family-name',
		},
		password: {
			key: 'password',
			label: '$.form.password',
			placeholder: '********',
			autocomplete: 'current-password',
		},
		terms: {
			key: 'terms',
			label: '$.signup.accept_condition',
		},
		newsletter: {
			key: 'newsletter',
			label: '$.profile.newsletter',
		},
		role: {
			key: 'role',
			label: '$.profile.role.title',
		},
		street: {
			key: 'street',
			label: '$.profile.street',
			placeholder: '$.profile.placeholder.street',
			autocomplete: 'street-address',
		},
		city: {
			key: 'city',
			label: '$.profile.city',
			placeholder: '$.profile.placeholder.city',
		},
		postal_code: {
			key: 'postal_code',
			label: '$.profile.postal_code',
			placeholder: '$.profile.placeholder.postal_code',
			autocomplete: 'postal-code',
		},
		state: {
			key: 'state',
			label: '$.profile.state',
			placeholder: '$.form.select',
			autocomplete: 'country',
		},
	};

	const fieldOptions = Object.values(fields);

	const states: Record<
		string,
		{
			value: string;
			label: string;
			icon: string;
		}
	> = {
		cz: { value: 'cz', label: '$.state.cz', icon: 'emojione:flag-for-czechia' },
		sk: { value: 'sk', label: '$.state.sk', icon: 'emojione:flag-for-slovakia' },
	};
	const stateOptions = Object.values(states);

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
		isAdmin,
		roles,
		roleOptions,
		fields,
		fieldOptions,
		states,
		stateOptions,
	};
});
