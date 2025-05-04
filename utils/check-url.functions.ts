/**
 * Kotrola na absolutni url
 *
 * @export
 * @param {string} url
 * @returns {boolean}
 */
export function IS_ABSOLUTE_URL(url: string): boolean {
  return /^((f|ht)tps?:)?\/\//gm.test(url);
}
