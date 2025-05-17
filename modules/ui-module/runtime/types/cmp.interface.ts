import type { ButtonVariant, ButtonColor, ButtonSize } from "#ui/types";

/**
 * @interface IBtn
 * @description
 * Rozhraní pro tlačítko (Button).
 */
export interface IBtn {
  /**
   * @property {string} [label]
   * Popisek tlačítka.
   */
  label?: string;

  /**
   * @property {ButtonColor} [color]
   * Barva tlačítka.
   */
  color?: ButtonColor;

  /**
   * @property {ButtonVariant} [variant]
   * Varianta tlačítka.
   */
  variant?: ButtonVariant;

  /**
   * @property {ButtonSize} [size]
   * Velikost tlačítka.
   */
  size?: ButtonSize;

  /**
   * @property {string} [link]
   * Odkaz, na který tlačítko směřuje.
   */
  link?: string;

  /**
   * @property {string} [icon]
   * Ikona tlačítka.
   */
  icon?: string;
}
