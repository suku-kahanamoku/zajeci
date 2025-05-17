import bcrypt from "bcrypt";

import { ITERATE } from "./modify-object.functions";
import { RESOLVE_MARKS } from "./modify-string.functions";


export function RESOLVE_FACTORY(item: Record<string, any>, factory: any) {
  if (factory) {
    item.gen_data = {};
    try {
      factory = JSON.parse(factory);
    } catch (error: any) {
      factory = {};
    }
    ITERATE(
      factory,
      (value, name) => (item.gen_data[name] = RESOLVE_MARKS(value, item))
    );
  }
}

/**
 *
 *
 * @export
 * @param {number} [length=8]
 * @return {*}  {string}
 */
export function GENERATE_PASSWORD(length = 8): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

/**
 *
 *
 * @export
 * @param {string} [password]
 * @return {*}  {Promise<string>}
 */
export async function GENERATE_HASHED_PASSWORD(
  password?: string
): Promise<string> {
  password = password || GENERATE_PASSWORD();
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 *
 *
 * @export
 * @param {string} password_1
 * @param {string} password_2
 * @return {*}  {Promise<boolean>}
 */
export async function COMPARE_PASSWORD(
  password_1: string,
  password_2: string
): Promise<boolean> {
  return await bcrypt.compare(password_1, password_2);
}
