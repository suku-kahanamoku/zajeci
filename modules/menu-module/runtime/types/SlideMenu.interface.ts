import type { SlideoverProps } from "#ui/types";
import type { IMenuItem } from "./MenuItem.interface";

/**
 * @interface ISlideMenuConfig
 * @description
 * Konfigurace pro boční menu (SlideMenu).
 */
export interface ISlideMenuConfig extends SlideoverProps {}

/**
 * @interface ISlideMenu
 * @description
 * Rozhraní pro boční menu (SlideMenu).
 */
export interface ISlideMenu {
  /**
   * @property {ISlideMenuConfig} [config]
   * Konfigurace bočního menu.
   */
  config?: ISlideMenuConfig;

  /**
   * @property {IMenuItem[]} [menuItems]
   * Položky menu, které se zobrazí v bočním menu.
   */
  menuItems?: IMenuItem[];

  /**
   * @property {boolean} [loading]
   * Indikuje, zda se data načítají.
   */
  loading?: boolean;
}
