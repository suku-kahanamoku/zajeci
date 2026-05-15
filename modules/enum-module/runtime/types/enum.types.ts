import type { IItem } from "@suku-kahanamoku/common-module/types";

/** PHP API – Enumeration item */
export interface IEnumItem extends IItem {
  type: string;
  syscode: string;
  label: string;
  value: string;
  position: number;
  published: 0 | 1;
}

/** PHP API – single enumeration response */
export interface IEnumResponse {
  data: IEnumItem;
  meta: { total: number };
}

/** PHP API – list enumeration response */
export interface IEnumsResponse {
  data: IEnumItem[];
  meta: { total: number; limit: number; skip: number };
}
