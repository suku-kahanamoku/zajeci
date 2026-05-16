import type { IResponse } from "@suku-kahanamoku/common-module/types";

export interface IAddress {
  id?: number | string;
  user_id?: number;
  type?: "billing" | "shipping";
  company?: string;
  name?: string;
  street: string;
  city: string;
  zip: string;
  country?: string;
  is_default?: 0 | 1;
  created_at?: string;
  updated_at?: string;
}

export interface IAddressResponse extends IResponse {
  data?: IAddress;
}

export interface IAddressesResponse extends IResponse {
  data?: IAddress[];
}


export interface IAddressResponse extends IResponse {
  data?: IAddress;
}

export interface IAddressesResponse extends IResponse {
  data?: IAddress[];
}
