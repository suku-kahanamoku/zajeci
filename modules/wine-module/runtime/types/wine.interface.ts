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
  variant?: string;
  data?: IWineData;
  category_ids?: number[];
  vat_rate?: number;
  price_with_vat?: number;
  published?: boolean;
}

export interface IWineResponse extends IResponse {
  data?: IWine;
}

export interface IWinesResponse extends IResponse {
  data?: IWine[];
}
