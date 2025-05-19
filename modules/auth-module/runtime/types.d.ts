import type { UserDocument } from "./types/user.interface";

declare module "#auth-utils" {
  interface User extends UserDocument {}

  interface UserSession {
    loggedInAt?: Date | string;
    tokens?: ITokens;
  }
}

export * from "./types/address.interface";
export * from "./types/user.interface";
export * from "./types/auth.interface";
