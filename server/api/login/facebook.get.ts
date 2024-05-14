import { UserSchema } from '@/server/models/user.schema';

export default oauth.facebookEventHandler({
	async onSuccess(event, { user, tokens }) {
		// pokud uzivatel v db neexistuje, vytvori ho
		if (user?.email) {
			let dbUser = await UserSchema.findOne({ email: user.email });
			if (!dbUser?._id) {
				dbUser = await new UserSchema(user).save();
			}
			user = { ...user, ...dbUser.toObject() };
		}
		// nastavi user session
		await setUserSession(event, {
			user,
			loggedInAt: new Date().toISOString(),
		});
		const locale = tryCookieLocale(event, { lang: '', name: 'i18n_locale' })?.toString();
		return await sendRedirect(event, locale === 'cs' ? '/admin' : `/${locale}/admin`);
	},
	async onError(event, error) {
		const locale = tryCookieLocale(event, { lang: '', name: 'i18n_locale' })?.toString();
		return await sendRedirect(event, locale === 'cs' ? '/login' : `/${locale}/login`);
	},
});
