import type { UserDocument } from "./types/user.interface";

declare module "#auth-utils" {
  interface User extends UserDocument {}

  interface UserSession {
    loggedInAt?: Date | string;
    tokens?: ITokens;
  }
}

export * from "./types/address.type";
export * from "./types/user.type";
export * from "./types/auth.interface";
