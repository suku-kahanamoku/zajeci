import type { ITokens } from "./modules/auth-module/runtime/types/auth.interface";
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

export {};
