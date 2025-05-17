import { type DefineComponent } from "vue";

import type { IMainMenu } from "./types/MainMenu.interface";
import type { ISlideMenu } from "./types/SlideMenu.interface";

declare module "vue" {
  export interface GlobalComponents {
    CmpMainMenu: DefineComponent<IMainMenu>;
    CmpSlideMenu: DefineComponent<ISlideMenu>;
  }
}

export * from "./types/MenuItems.interface";
