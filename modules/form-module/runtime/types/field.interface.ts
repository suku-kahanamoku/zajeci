/**
 * @interface IFormField
 * @description
 * Rozhraní definující atributy jednotlivých polí formuláře.
 */
export interface IFormField {
  /**
   * @property {string} name
   * Název pole.
   */
  name: string;

  /**
   * @property {string} [type]
   * Typ pole (např. text, number, email, atd.).
   */
  type?:
    | "text"
    | "number"
    | "email"
    | "datetime"
    | "password"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio"
    | "file"
    | "url"
    | "image"
    | "search"
    | "url"
    | "hidden"
    | "range"
    | "button"
    | "color"
    | "html"
    | string;

  /**
   * @property {string} [label]
   * Popisek pole.
   */
  label?: string;

  /**
   * @property {string} [placeholder]
   * Placeholder pole.
   */
  placeholder?: string;

  /**
   * @property {boolean} [required]
   * Indikuje, zda je pole povinné.
   */
  required?: boolean;

  /**
   * @property {number} [maxLength]
   * Maximální počet znaků.
   */
  maxLength?: number;

  /**
   * @property {number} [minLength]
   * Minimální počet znaků.
   */
  minLength?: number;

  /**
   * @property {*} [value]
   * Výchozí hodnota pole.
   */
  value?: any;

  /**
   * @property {[{ pattern?: string; msg: string }]} [validation]
   * Validace pole.
   */
  validation?: [{ pattern?: string; msg: string }];

  /**
   * @property {({
   *     position: "prepend" | "append";
   *     value: string;
   *   })} [icon]
   * Ikona pole.
   */
  icon?: {
    position: "prepend" | "append";
    value: string;
  };

  /**
   * @property {boolean} [multiple]
   * Indikuje, zda hodnoty budou v poli.
   */
  multiple?: boolean;

  /**
   * @property {boolean} [disabled]
   * Indikuje, zda je pole zakázané.
   */
  disabled?: boolean;

  /**
   * @property {boolean} [readonly]
   * Indikuje, zda je pole pouze pro čtení.
   */
  readonly?: boolean;

  /**
   * @property {boolean} [ignore]
   * Indikuje, zda se pole nemá odesílat na backend.
   */
  ignore?: boolean;

  /**
   * @property {string} [autocomplete]
   * Nastavení pro browser autocomplete.
   */
  autocomplete?:
    | "on"
    | "off"
    | "honorific-prefix"
    | "given-name"
    | "additional-name"
    | "family-name"
    | "honorific-suffix"
    | "nickname"
    | "email"
    | "username"
    | "new-password"
    | "current-password"
    | "organization"
    | "street-address"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "country"
    | "postal-code"
    | "sex"
    | "tel"
    | "tel-country-code"
    | "tel-local"
    | "url"
    | "photo"
    | "bday"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "cc-name"
    | "cc-given-name"
    | "cc-additional-name"
    | "cc-family-name"
    | "cc-number"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-csc"
    | "cc-type"
    | "transaction-currency"
    | "transaction-amount"
    | string;

  /**
   * @property {IDefinitionField[]} [definition]
   * Dynamické úpravy jiných polí na základě nastavení.
   */
  definition?: IDefinitionField[];

  /**
   * @property {IOperator} [operator]
   * Operátor pole.
   */
  operator?: IOperator;

  /**
   * @property {boolean} [autofocus]
   * Indikuje, zda má být pole automaticky zaostřeno.
   */
  autofocus?: boolean;

  /**
   * @property {string} [hint]
   * Pomocný text pod polem.
   */
  hint?: string;

  /**
   * @property {("outline" | "none")} [variant]
   * Varianta zobrazení pole.
   */
  variant?: "outline" | "none";

  /**
   * @property {("md" | "2xs" | "xs" | "sm" | "lg" | "xl")} [size]
   * Velikost pole.
   */
  size?: "md" | "xs" | "sm" | "lg" | "xl";

  /**
   * @property {boolean} [clearable]
   * Indikuje, zda má být pole vymazatelné.
   */
  clearable?: boolean;

  /**
   * @property {("String" | "Integer" | "Double" | "Boolean" | "Date" | "Timestamp" | string)} [dbType]
   * Typ v databázi.
   */
  dbType?:
    | "String"
    | "Integer"
    | "Double"
    | "Boolean"
    | "Date"
    | "Timestamp"
    | string;

  /**
   * @property {string} [colName]
   * Název ve sloupci.
   */
  colName?: string;

  /**
   * @property {string} [colLabel]
   * Popisek ve sloupci.
   */
  colLabel?: string;

  /**
   * @property {string} [group]
   * Skupina, do které pole patří.
   */
  group?: string;

  /**
   * @property {{ size: number; label?: string }} [print]
   * Nastavení pro export do PDF, Excel, CSV.
   */
  print?: {
    size: number;
    label?: string;
  };

  /**
   * @property {*} [propName]
   * Ostatní vlastnosti.
   */
  [propName: string]: any;
}

/**
 * @interface IFormFieldNumber
 * @description
 * Rozhraní pro pole typu number.
 * @extends {IFormField}
 */
export interface IFormFieldNumber extends IFormField {
  /**
   * @property {number} [max]
   * Maximální počet čísel.
   */
  max?: number;

  /**
   * @property {number} [min]
   * Minimální počet čísel.
   */
  min?: number;

  /**
   * @property {number} [precision]
   * Přesnost hodnoty (počet desetinných míst).
   */
  precision?: number;
}

/**
 * @interface IFormFieldTextarea
 * @description
 * Rozhraní pro pole typu textarea.
 * @extends {IFormField}
 */
export interface IFormFieldTextarea extends IFormField {
  /**
   * @property {number} rows
   * Počet řádků.
   */
  rows: number;

  /**
   * @property {number} maxRows
   * Maximální počet řádků, pak se objeví scrollbar.
   */
  maxRows: number;
}

/**
 * @interface IFormFieldSelect
 * @description
 * Rozhraní pro pole typu select.
 * @extends {IFormField}
 */
export interface IFormFieldSelect extends IFormField {
  /**
   * @property {IFormFieldOption[]} [options]
   * Seznam možností (např. <option></option>).
   */
  options?: IFormFieldOption[];

  /**
   * @property {IRestOption} [restOptions]
   * Způsob načítání možností (např. <option></option>).
   */
  restOptions?: IRestOption;
}

/**
 * @interface IRestOption
 * @description
 * Rozhraní pro načítání možností z REST API.
 */
export interface IRestOption {
  /**
   * @property {string} url
   * URL pro načítání možností.
   */
  url: string;

  /**
   * @property {string} value
   * Hodnota možnosti.
   */
  value: string;

  /**
   * @property {string} label
   * Popisek možnosti.
   */
  label: string;

  /**
   * @property {string} description
   * Popisek možnosti.
   */
  description: string;

  /**
   * @property {string} [searchValue]
   * Hodnota pro vyhledávání.
   */
  searchValue?: string;
}

/**
 * @interface IFormFieldOption
 * @description
 * Rozhraní pro jednotlivé možnosti pole.
 */
export interface IFormFieldOption {
  /**
   * @property {*} value
   * Hodnota možnosti (např. true/false, ano/ne, ...).
   */
  value: any;

  /**
   * @property {string} label
   * Popisek možnosti.
   */
  label: string;

  /**
   * @property {string} description
   * Popisek možnosti.
   */
  description?: string;

  /**
   * @property {boolean} [disabled]
   * Indikuje, zda je možnost zakázaná.
   */
  disabled?: boolean;

  /**
   * @property {Record<string, any>} item
   * Celý objekt možnosti (např. pro ukládání dalších dodatečných věcí).
   */
  item: Record<string, any>;

  /**
   * @property {string} [tooltip]
   * Tooltip možnosti.
   */
  tooltip?: string;
}

/**
 * @interface IFormFieldRadio
 * @description
 * Rozhraní pro pole typu radio.
 * @extends {IFormFieldSelect}
 */
export interface IFormFieldRadio extends IFormFieldSelect {
  /**
   * @property {boolean} [inline]
   * Indikuje, zda mají být možnosti zobrazeny inline.
   */
  inline?: boolean;
}

/**
 * @interface IFormFieldDatetime
 * @description
 * Rozhraní pro pole typu datetime.
 * @extends {IFormField}
 */
export interface IFormFieldDatetime extends IFormField {
  /**
   * @property {(string | Date)} [maxDate]
   * Maximální datum.
   */
  maxDate?: string | Date;

  /**
   * @property {(string | Date)} [minDate]
   * Minimální datum.
   */
  minDate?: string | Date;

  /**
   * @property {string} [format]
   * Formát data.
   */
  format?: string;
}

/**
 * @interface IOperator
 * @description
 * Rozhraní pro operátory polí.
 */
export interface IOperator {
  /**
   * @property {string} value
   * Hodnota operátoru.
   */
  value: string;

  /**
   * @property {boolean} enabled
   * Indikuje, zda je operátor povolen.
   */
  enabled: boolean;

  /**
   * @property {string[]} [options]
   * Možnosti operátoru.
   */
  options?: string[];
}

/**
 * @interface IDefinitionField
 * @description
 * Rozhraní pro dynamické úpravy jiných polí na základě nastavení.
 */
export interface IDefinitionField {
  /**
   * @property {*} value
   * Hodnota pro match.
   */
  value: any | any[];

  /**
   * @property {string} operation
   * Operace pro match (např. $gte).
   */
  operation: string;

  /**
   * @property {Record<string, ISetter[]>} [set]
   * Nastavení pro úpravy jiných polí.
   */
  set?: Record<string, ISetter[]>;
}

/**
 * @interface ISetter
 * @description
 * Rozhraní pro úpravy hodnot nebo atributů polí.
 */
export interface ISetter {
  /**
   * @property {string} type
   * Typ atributu, který se má upravit (např. type, value).
   */
  type: string;

  /**
   * @property {*} value
   * Hodnota, na kterou se má atribut upravit.
   */
  value: any;
}
