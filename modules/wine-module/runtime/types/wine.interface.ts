import type { IImage } from "@/server/types/image.type";
import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

/**
 * @deprecated Wine kind values should be fetched from /api/enumeration?type=wine_kind
 * Use restOptions in form config instead of this enum.
 * Current DB values: dry, semi_dry, sweet, semi_sweet, extra_dry, off_dry, medium_dry, medium_sweet, very_sweet, dessert
 */
export enum WineKind {
  dry = "dry",
  semi_dry = "semi_dry",
  semi_sweet = "semi_sweet",
  sweet = "sweet",
  extra_dry = "extra_dry",
  off_dry = "off_dry",
  medium_dry = "medium_dry",
  medium_sweet = "medium_sweet",
  very_sweet = "very_sweet",
  dessert = "dessert",
}

/**
 * @deprecated Wine color values should be fetched from /api/enumeration?type=wine_color
 * Use restOptions in form config instead of this enum.
 * Current DB values: white, red, rose, orange
 */
export enum WineColor {
  white = "white",
  red = "red",
  rose = "rose",
  orange = "orange",
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
