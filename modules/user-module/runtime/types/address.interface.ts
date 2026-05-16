import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface IAddress extends IItem {
  user_id?: number;
  type?: "billing" | "shipping";
  company?: string;
  name?: string;
  street: string;
  city: string;
  zip: string;
  country?: string;
  is_default?: 0 | 1;
}

export interface IAddressResponse extends IResponse {
  data?: IAddress;
}

export interface IAddressesResponse extends IResponse {
  data?: IAddress[];
}
