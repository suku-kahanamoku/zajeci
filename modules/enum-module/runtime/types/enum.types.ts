import type { IItem } from "@suku-kahanamoku/common-module/types";

/** PHP API – Enumeration item */
export interface IEnumItem extends IItem {
  type: string;
  syscode: string;
  label: string;
  value: string;
  position: number;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string | null;
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
