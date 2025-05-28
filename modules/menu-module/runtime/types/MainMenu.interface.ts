import type { ButtonProps } from "#ui/types";

import type { IMenuItem } from "./MenuItem.interface";

/**
 * @interface IMainMenuConfig
 * @description
 * Konfigurace pro hlavní menu (MainMenu).
 */
export interface IMainMenuConfig {
  /**
   * @property {Object} [langMenu]
   *
   */
  themeMenu?: {
    disabled?: boolean;
    aria?: string;
  } & ButtonProps;

  /**
   * @property {Object} [langMenu]
   * Konfigurace jazykového menu.
   */
  langMenu?: {
    disabled?: boolean;
    aria?: string;
  } & ButtonProps;

  /**
   * @property {Object} [hamburgerMenu]
   * Konfigurace hamburger menu.
   */
  hamburgerMenu?: {
    disabled?: boolean;
    aria?: string;
  } & ButtonProps;
}

/**
 * @interface IMainMenu
 * @description
 * Rozhraní pro hlavní menu (MainMenu).
 */
export interface IMainMenu {
  /**
   * @property {IMainMenuConfig} [config]
   * Konfigurace hlavního menu.
   */
  config?: IMainMenuConfig;

  /**
   * @property {IMenuItem[]} [menuItems]
   * Položky menu, které se zobrazí v hlavním menu.
   */
  menuItems?: IMenuItem[];

  /**
   * @property {boolean} [loading]
   * Indikuje, zda se data načítají.
   */
  loading?: boolean;

  /**
   * @property {string} [className]
   * CSS třída pro přizpůsobení vzhledu hlavního menu.
   */
  className?: string;
}
