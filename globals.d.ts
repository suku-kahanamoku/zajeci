import type { ITokens } from "@/modules/auth-module/runtime/types/auth.interface";
import type { IUser } from "@/modules/auth-module/runtime/types/user.interface";

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
