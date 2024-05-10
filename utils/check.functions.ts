/**
 * Kontrola, zda dana hodnota obsahuje jenom cislo
 * napr. 0-9
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function IS_NUMERIC(value: any): boolean {
	return IS_DEFINED(value) && typeof value !== 'boolean' && value.toString().length && !isNaN(value);
}

/**
 * Kontrola, zda dana hodnota obsahuje jenom abecedu
 * je zohlednena i 1x mezera mezi kazdymi slovy
 * napr. a-z
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function IS_ALPHABET(value: string): boolean {
	return /^([A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s]*)$/.test(value);
}

/**
 * Kontrola, zda je hodnota definovana
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function IS_DEFINED(value: any): boolean {
	return typeof value !== 'undefined' && value !== null;
}

/**
 * Kontrola, zda je hodnota objekt
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function IS_OBJECT(value: any): boolean {
	return IS_DEFINED(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Kontrola, zda zada hodnota je mezi min a max
 *
 * @export
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function IS_IN_RANGE(value: number, min: number, max: number): boolean {
	return value >= min && value <= max;
}

/**
 * Kontrola, zda se jedna o id
 *
 * @export
 * @param {string} objectid
 * @returns {*}
 */
export function IS_OBJECT_ID(objectid: string) {
	return !objectid ||
		(typeof objectid !== 'string' &&
			(typeof objectid !== 'object' || Array.isArray(objectid) || typeof objectid !== 'function'))
		? false
		: /^[0-9A-Z]{24}$/i.test(objectid.toString());
}

/**
 * Kontrola, zda se jedna o html tag
 *
 * @export
 * @param {string} value
 * @returns {*}  {boolean}
 */
export function IS_HTML_TAG(value: string): boolean {
	/* return value && !/^(?!.*<\w+[^>]*>.*<\/\w+>).+$/.test(value) ? true : false; */
	return value && /<(\w+)[^>]*>.*<\/\1>/.test(value) ? true : false;
}

/**
 * Kontrola, zda se jedna o funkci
 *
 * @export
 * @param {string} value
 * @returns {*}  {boolean}
 */
export function IS_FNCE(value: string): boolean {
	return value && /^(\w+(\.\w+)*)\((\w+(?:,\s*\w+)*)?\)$/.test(value) ? true : false;
}
