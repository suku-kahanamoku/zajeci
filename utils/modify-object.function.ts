import { IS_DEFINED, IS_OBJECT } from "@/utils/check.functions";
import { TRIM } from "@/utils/modify-string.functions";

/**
 * Naklonuje dany objekt
 *
 * @export
 * @param {*} item
 * @returns
 */
export function CLONE(item: any): any {
  if (item === null || typeof item !== "object") {
    return item;
  }

  if (Array.isArray(item)) {
    return item.map(CLONE);
  }

  if (item instanceof Date) {
    return new Date(item.getTime());
  }

  if (item instanceof RegExp) {
    const flags = item.flags;
    const pattern = item.source;
    return new RegExp(pattern, flags);
  }

  const clonedObject = {} as any;
  for (const key in item) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      clonedObject[key] = CLONE(item[key]);
    }
  }

  return clonedObject;
}

/**
 * Dane pole zamicha
 *
 * @export
 * @param {[any]} value
 */
export function SHUFFLE(value: any[]) {
  for (let i = value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [value[i], value[j]] = [value[j], value[i]];
  }
}

/**
 * Z daneho pole vybere nahodnou hodnotu
 *
 * @export
 * @param {any[]} value
 * @returns {*}
 */
export function RANDOM(value: any[]): any {
  return value[Math.floor(Math.random() * value.length)];
}

/**
 * Nalezne prunik
 *
 * @export
 * @param {string[]} arr1
 * @param {string[]} arr2
 * @returns {string[]}
 */
export function INTERSECTION(arr1: string[], arr2: string[]): string[] {
  return arr1.filter((value) => arr2.includes(value));
}

/**
 * Nalezne rozdil
 *
 * @export
 * @param {string[]} arr1
 * @param {string[]} arr2
 * @returns {string[]}
 */
export function DIFFERENCE(arr1: string[], arr2: string[]): string[] {
  return arr1
    .filter((element) => !arr2.includes(element))
    .concat(arr2.filter((element) => !arr1.includes(element)));
}

/**
 * Iteruje objekt
 *
 * @export
 * @param {(Record<string, any> | Record<string, any>[])} item
 * @param {(value: any, key: string, index?: number) => void} callback
 */
export function ITERATE(
  item: Record<string, any> | Record<string, any>[],
  callback: (value: any, key: string, index?: number) => void
) {
  if (item && (IS_OBJECT(item) || Array.isArray(item))) {
    let index = 0;
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        callback((item as any)[key], key);
        index++;
      }
    }
  }
}

/**
 * Vrati hodnotu z viceurovnoveho objektu
 * data: {
 *  params: {
 *   fields: {
 *    firstname: 'Jan'
 *   }
 *  }
 * }
 * GET_VALUE(data, 'firstname', 'params#fields', '#')
 *
 * @export
 * @param {Record<string, any>} item
 * @param {string} [name]
 * @param {string} [path]
 * @param {string} [delimiter='.']
 * @returns {*}  {Record<string, any>}
 */
export function GET_VALUE(
  item: Record<string, any>,
  name?: string,
  path?: string,
  delimiter: string = "."
): Record<string, any> {
  let value;
  if (item) {
    if (path) {
      value = path
        .split(delimiter)
        .reduce((accum, curr) => accum && accum[curr], item);
      if (name) {
        value = value[name];
      }
    } else {
      if (name && IS_DEFINED(item[name])) {
        value = item[name];
      }
    }
  }
  return IS_DEFINED(value) && TRIM(value.toString()).length ? value : undefined;
}

/**
 *
 *
 * @export
 * @param {*} data
 * @param {string} [path]
 * @param {string} [delimiter='.']
 * @returns {*}  {*}
 */
export function GET_OBJECT_PARAM(
  data: any,
  path?: string,
  delimiter: string = "."
): any {
  const result = GET_VALUE(data, "", path, delimiter);
  return IS_OBJECT(result) ? "" : result;
}

/**
 * Mergne dva objekty a vrati jeden
 *
 * @export
 * @param {Record<string, any>} target
 * @param {Record<string, any>} source
 * @returns {*}  {Record<string, any>}
 */
export function MERGE(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source))
    if (target && source[key] instanceof Object) {
      Object.assign(source[key], MERGE(target[key], source[key]));
    }
  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
}

/**
 * Transformuje teckovou notaci do objektu
 * napr.
 * {params.firstname:john} => {params:{firstname:john}}
 *
 * @export
 * @param {*} params
 */
export function CONVERT_DOT_TO_OBJECT(params: Record<string, any>) {
  ITERATE(params, (value, key) => {
    if (key.indexOf(".") >= 0) {
      const keys = key.split(".");
      keys.reduce((accum: any, curr: string, index: number) => {
        if (accum) {
          // pokud atribut existuje, jen posune na dalsi uroven
          if (IS_DEFINED(accum[curr])) {
            return accum[curr];
          }
          // jinak pokud neexistuje, ale neni to konecna hodnota, tak vytvori novou uroven
          else if (index < keys.length - 1) {
            return (accum[curr] = {});
          }
          // jinak pokud je to konecna hodnota, tak dosadi finalni hodnotu
          else {
            return (accum[curr] = value);
          }
        }
      }, params);
      delete params[key];
    }
  });
  //
  rm_null_id(params);
}

/**
 * Zrusi spravne _id=null
 * napr.
 * "aaa": {
    "bbb": {
      "ccc": {
        "_id": null
      }
    }
  };

  =>

  "aaa": {
    "bbb": {
      "ccc": null
    }
  };
 *
 * @param {Record<string, any>} params
 * @returns {*} 
 */
function rm_null_id(params: Record<string, any>) {
  if (typeof params === "object" && params !== null) {
    // pokud v objektu existuje jen 1 parametr a je to _id=null, vrati rodici null
    if (Object.keys(params).length < 2 && params._id === null) {
      return null;
    }
    // jinak se pokousi rekurzivne volat rm_null_id fnci na kazdem atributu
    ITERATE(params, (value, name) => (params[name] = rm_null_id(value)));
  }
  return params;
}

/**
 * Vrati nazev klice, dle hodnoty
 *
 * @export
 * @param {*} object
 * @param {*} value
 * @returns {*}  {string}
 */
export function GET_KEY_BY_VALUE(object: any, value: any): string {
  return Object.keys(object).find((key) => object[key] === value) || "";
}

export function SORT(a: any, b: any, param: string = "position"): number {
  if (a[param] === undefined || a[param] === null) {
    return 1;
  } else if (b[param] === undefined || b[param] === null) {
    return -1;
  } else {
    // je to string
    if (isNaN(a) && isNaN(b)) {
      if (a[param] < b[param]) {
        return -1;
      }
      if (a[param] > b[param]) {
        return 1;
      }
      return 0;
    }
    // je to number
    else {
      return a[param] - b[param];
    }
  }
}

export function GENERATE_DATA(
  type: "day" | "week" | "month",
  count: number,
  startDate?: string
) {
  const datasets = [];
  let date;
  if (startDate) {
    date = new Date(startDate);
  } else {
    date = new Date();
  }

  // generovani nahodneho cisla v rozmezi
  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // funkce pro pridani dne, tydne nebo mesice k datu
  function addIntervalToDate(date: Date, interval: number) {
    const newDate = new Date(date);
    switch (type) {
      case "day":
        newDate.setDate(newDate.getDate() + interval);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + interval * 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + interval);
        break;
      default:
        break;
    }
    return newDate;
  }

  // vypocet pocatecniho data, ktere by melo byt prevazne v polovine pole
  if (!startDate) {
    const halfCount = Math.floor(count / 2);
    date = addIntervalToDate(date, -halfCount);
  }

  // generovani dat prvni pole
  const xValues = [];
  for (let i = 0; i < count; i++) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // Nastavení času na půlnoc
    xValues.push(newDate.toISOString());
    date = addIntervalToDate(date, 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  //
  let todayIndex: any;
  let todayValue: any;
  const firstData = xValues.map((x, index) => {
    const result = { x, y: getRandomNumber(30000, 60000) };
    //
    if (x === today.toISOString()) {
      todayIndex = index;
      todayValue = result.y;
    }
    return result;
  });
  datasets.push(firstData);

  // generovani dat pro druhe a treti pole
  const secondData = xValues.map((x) => ({
    x,
    y: new Date(x) < today ? NaN : getRandomNumber(65000, 80000),
  }));
  const thirdData = xValues.map((x) => ({
    x,
    y: new Date(x) < today ? NaN : getRandomNumber(10000, 26000),
  }));
  datasets.push(secondData, thirdData);
  //
  if (IS_DEFINED(todayIndex) && IS_DEFINED(todayValue)) {
    datasets.forEach((item) => (item[todayIndex].y = todayValue));
  }

  return datasets;
}
