import type { Composer } from "vue-i18n";

import type { UserDocument } from "./server/types/user.type";

declare module "#app" {
  interface NuxtApp {
    $colorMode: ReturnType<typeof useColorMode>;
    $tt: Composer["t"];
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $colorMode: ReturnType<typeof useColorMode>;
    $tt: Composer["t"];
  }
}

// auth.d.ts
declare module "#auth-utils" {
  interface User extends UserDocument {}

  interface UserSession {
    loggedInAt?: Date | string;
  }
}

export {};
