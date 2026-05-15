import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface IWineData {
  year?: number;
  volume?: number;
  quality?: string;
  winery?: string;
  region?: string;
  alcohol?: number;
  serving_temp?: string;
}

export interface IWine extends IItem {
  name: string;
  sku?: string;
  stock_quantity: number;
  price: number;
  description?: string;
  kind?: string;
  color?: string;
  /** Bottle format, e.g. "0.75l", "2\u00d7 0.375l" */
  variant?: string;
  /** JSON data column with extended attributes */
  data?: IWineData;
  vat_rate?: string;
  category_ids?: number[];
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IWineResponse extends IResponse {
  data?: IWine;
}

export interface IWinesResponse extends IResponse {
  data?: IWine[];
}
