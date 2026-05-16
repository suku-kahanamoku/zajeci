import type { ITokens } from "@suku-kahanamoku/auth-module/types";
import type { IUser } from "@/modules/user-module/runtime/types/user.interface";

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
