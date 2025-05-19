import type { UserDocument } from "@/types/user.type";

declare module "#auth-utils" {
  interface User extends UserDocument {}

  interface UserSession {
    loggedInAt?: Date | string;
    tokens?: ITokens;
  }
}

export * from "./address.type";
export * from "./user.type";
export * from "./auth.interface";
