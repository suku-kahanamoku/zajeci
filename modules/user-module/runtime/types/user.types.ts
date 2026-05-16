import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface IAdminUser extends IItem {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: { id: number; name: string };
}

export interface IUserResponse extends IResponse {
  data?: IAdminUser;
}

export interface IUsersResponse extends IResponse {
  data?: IAdminUser[];
}

export interface IRole extends IItem {
  name: string;
  label: string;
  position?: number;
}

export interface IRoleResponse extends IResponse {
  data?: IRole;
}

export interface IRolesResponse extends IResponse {
  data?: IRole[];
}
