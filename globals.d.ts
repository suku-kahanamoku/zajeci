import type { UserDocument } from './server/types/user.type';

// auth.d.ts
declare module '#auth-utils' {
	interface User extends UserDocument {}

	interface UserSession {
		loggedInAt?: Date | string;
	}
}

export {};
