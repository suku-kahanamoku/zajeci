import type { UserModel } from '@/server/models/user.schema';

// auth.d.ts
declare module '#auth-utils' {
	interface User extends UserModel {}

	interface UserSession {
		loggedInAt?: Date | string;
	}
}

export {};
