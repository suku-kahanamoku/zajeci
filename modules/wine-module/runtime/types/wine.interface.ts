import type { IImage } from "@/server/types/image.type";
import type { IItem, IResponse } from "@/modules/common-module/runtime/types";

export interface IWine extends IItem {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  kind?: string;
  quality?: string;
  color?: string;
  variety?: string;
  volume?: number;
  year?: number;
  image?: {
    main?: IImage;
    variants?: IImage[];
  };
  categories?: string[];
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWineResponse extends IResponse {
  data?: IWine;
}

export interface IWinesResponse extends IResponse {
  data?: IWine[];
}
