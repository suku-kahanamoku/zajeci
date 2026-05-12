import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface IAdminUser extends IItem {
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  role?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IUserResponse extends IResponse {
  data?: IAdminUser;
}

export interface IUsersResponse extends IResponse {
  data?: IAdminUser[];
}
