import type { ITokens, IUser } from "@suku-kahanamoku/auth-module/types";

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
