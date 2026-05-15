import { IResponse } from "@suku-kahanamoku/common-module/types";

export interface IImage {
  id: number;
  src: string;
  width: number;
  height: number;
  type: string;
  name?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IImageResponse extends IResponse {
  data?: IImage;
}

export interface IImageesResponse extends IResponse {
  data?: IImage[];
}
