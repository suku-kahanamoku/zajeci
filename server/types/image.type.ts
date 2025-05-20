import { IResponse } from "~/modules/common-module/runtime/types";

export interface IImage {
  _id: string;
  src: string;
  width: number;
  height: number;
  type: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IImageResponse extends IResponse {
  data?: IImage;
}

export interface IImageesResponse extends IResponse {
  data?: IImage[];
}
