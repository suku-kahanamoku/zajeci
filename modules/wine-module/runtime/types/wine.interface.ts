import type { IImage } from "@/server/types/image.type";
import type { IItem, IResponse } from "@/modules/common-module/runtime/types";

export enum WineKind {
  Dry = "dry",
  SemiDry = "semiDry",
  Sweet = "sweet",
  SemiSweet = "semiSweet",
  ExtraDry = "extraDry",
  OffDry = "offDry",
  MediumDry = "mediumDry",
  MediumSweet = "mediumSweet",
  VerySweet = "verySweet",
  Dessert = "dessert",
}

export enum WineQuality {
  Kabinett = "kabinett",
  LateHarvest = "late_harvest",
  SelectionOfGrapes = "selection_of_grapes",
  SelectionOfBerries = "selection_of_berries",
  IceWine = "ice_wine",
  StrawWine = "straw_wine",
  QualityWine = "quality_wine",
  ArchiveWine = "archive_wine",
  TableWine = "table_wine",
}

export enum WineColor {
  White = "white",
  Red = "red",
  Rose = "rose",
  Orange = "orange",
}

export enum WineVariety {
  CabernetSauvignon = "cabernet_sauvignon",
  Chardonnay = "chardonnay",
  Frankovka = "frankovka",
  GrunerVeltliner = "gruner_veltliner",
  Merlot = "merlot",
  ModryPortugal = "modry_portugal",
  MuellerThurgau = "mueller_thurgau",
  Muscat = "muscat",
  PinotBlanc = "pinot_blanc",
  PinotGris = "pinot_gris",
  PinotNoir = "pinot_noir",
  Riesling = "riesling",
  SauvignonBlanc = "sauvignon_blanc",
  StLaurent = "st_laurent",
  Traminer = "traminer",
  Welschriesling = "welschriesling",
  Zweigelt = "zweigelt",
  Other = "other",
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
