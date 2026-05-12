import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface ICategory extends IItem {
  name: string;
  syscode?: string;
  parent_id?: number | null;
  description?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ICategoryResponse extends IResponse {
  data?: ICategory;
}

export interface ICategoriesResponse extends IResponse {
  data?: ICategory[];
}
