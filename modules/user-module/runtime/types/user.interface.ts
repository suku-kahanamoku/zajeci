import type { IResponse } from "@suku-kahanamoku/common-module/types";

import type { IAddress } from "./address.interface";

export interface IUser {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  role_id?: number;
  role?: { id: number; name: string };
  status?: "active" | "inactive" | "banned";
  deleted?: 0 | 1;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
  // client-side helpers (cashdesk)
  password?: string;
  terms?: boolean;
  newsletter?: boolean;
  address?: {
    main?: IAddress;
    shipping?: IAddress;
  };
  valid?: boolean;
}

export interface IUserResponse extends IResponse {
  data?: IUser;
}

export interface IUsersResponse extends IResponse {
  data?: IUser[];
}
