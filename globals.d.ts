import type { UserDocument } from "./server/types/user.type";

declare module "#app" {
  interface NuxtApp {
    $colorMode: ReturnType<typeof useColorMode>;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $colorMode: ReturnType<typeof useColorMode>;
  }
}

// auth.d.ts
declare module "#auth-utils" {
  interface User extends UserDocument {}

  interface UserSession {
    loggedInAt?: Date | string;
    fakturoidToken?: string;
  }
}

export {};
