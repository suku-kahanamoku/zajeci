import type { z } from "zod";

declare module "#app" {
  interface NuxtApp {
    $zod: typeof z;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $zod: typeof z;
  }
}

export * from "./types/form.interface";
export * from "./types/field.interface";
