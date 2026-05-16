import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

/** PHP API – Enumeration item */
export interface IEnumItem extends IItem {
  type: string;
  syscode: string;
  label: string;
  value: string | null;
  position: number;
  published: 0 | 1;
  data?: Record<string, any> | null;
}

export interface IEnumResponse extends IResponse {
  data?: IEnumItem;
}

export interface IEnumsResponse extends IResponse {
  data?: IEnumItem[];
}
