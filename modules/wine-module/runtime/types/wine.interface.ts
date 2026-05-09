import type { IImage } from "@/server/types/image.type";
import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export enum WineKind {
  white = "white",
  red = "red",
  rose = "ros\u00e9",
  sparkling = "sparkling",
  dessert = "dessert",
}

export enum WineColor {
  yellow = "yellow",
  white = "white",
  red = "red",
  rose = "ros\u00e9",
}

export interface IWineData {
  year?: number;
  volume?: number;
  quality?: string;
  winery?: string;
  region?: string;
  subregion?: string;
  village?: string;
  alcohol?: number;
  acidity?: number;
  residual_sugar?: number;
  serving_temp?: string;
  food_pairing?: string;
  awards?: string[];
  ean?: string;
}

export interface IWine extends IItem {
  /** PHP backend integer ID */
  id?: number;
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
  image?: {
    main?: IImage;
    variants?: IImage[];
  };
  vat_rate?: string;
  category_ids?: number[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IWineResponse extends IResponse {
  data?: IWine;
}

export interface IWinesResponse extends IResponse {
  data?: IWine[];
}
