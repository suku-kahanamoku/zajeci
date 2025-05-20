import type { IImage } from "@/server/types/image.type";
import type { IResponse } from "~/modules/common-module/runtime/types";

export interface IWine {
  _id: string;
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

export interface IWineesResponse extends IResponse {
  data?: IWine[];
}
