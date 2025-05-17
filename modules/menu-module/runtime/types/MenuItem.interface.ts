/**
 * @interface IMenuItem
 * @description
 * Rozhraní pro položku menu.
 */
export interface IMenuItem {
  /**
   * @property {string} [syscode]
   * Unikátní identifikátor položky menu.
   */
  syscode?: string;

  /**
   * @property {string} [to]
   * Cesta, na kterou položka menu odkazuje.
   */
  to?: string;

  /**
   * @property {string} [label]
   * Popisek položky menu.
   */
  label?: string;

  /**
   * @property {string} [icon]
   * Ikona spojená s položkou menu.
   */
  icon?: string;

  /**
   * @property {boolean} [active]
   * Indikuje, zda je položka menu aktivní.
   */
  active?: boolean;
}
