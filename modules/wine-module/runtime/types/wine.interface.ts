import type { IImage } from "@/server/types/image.type";
import type { IItem, IResponse } from "@suku-kahanamoku/common-module/utils";

export enum WineKind {
  dry = "dry",
  semiDry = "semiDry",
  sweet = "sweet",
  semiSweet = "semiSweet",
  extraDry = "extraDry",
  offDry = "offDry",
  mediumDry = "mediumDry",
  mediumSweet = "mediumSweet",
  verySweet = "verySweet",
  dessert = "dessert",
}

export enum WineQuality {
  kabinett = "kabinett",
  late_harvest = "late_harvest",
  selection_of_grapes = "selection_of_grapes",
  selection_of_berries = "selection_of_berries",
  ice_wine = "ice_wine",
  straw_wine = "straw_wine",
  quality_wine = "quality_wine",
  archive_wine = "archive_wine",
  table_wine = "table_wine",
}

export enum WineColor {
  white = "white",
  red = "red",
  rose = "rose",
  orange = "orange",
}

export enum WineVariety {
  cabernet_sauvignon = "cabernet_sauvignon",
  chardonnay = "chardonnay",
  frankovka = "frankovka",
  gruner_veltliner = "gruner_veltliner",
  merlot = "merlot",
  modry_portugal = "modry_portugal",
  mueller_thurgau = "mueller_thurgau",
  muscat = "muscat",
  pinot_blanc = "pinot_blanc",
  pinot_gris = "pinot_gris",
  pinot_noir = "pinot_noir",
  riesling = "riesling",
  sauvignon_blanc = "sauvignon_blanc",
  st_laurent = "st_laurent",
  traminer = "traminer",
  welschriesling = "welschriesling",
  zweigelt = "zweigelt",
  other = "other",
}

export interface IWine extends IItem {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  kind?: WineKind;
  quality?: WineQuality;
  color?: WineColor;
  variety?: WineVariety;
  volume?: number;
  year?: number;
  image?: {
    main?: IImage;
    variants?: IImage[];
  };
  categories?: string[];
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IWineResponse extends IResponse {
  data?: IWine;
}

export interface IWinesResponse extends IResponse {
  data?: IWine[];
}
