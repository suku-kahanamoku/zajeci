import type { UserDocument } from "./types/user.type";

declare module "#auth-utils" {
  interface User {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    nickname?: string;
    picture?: string;
    updated_at?: string;
  }
}

export * from "./address.type";
export * from "./user.type";
export * from "./auth.interface";
