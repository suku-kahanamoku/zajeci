import type { AddressDocument } from "./address.type";

export interface UserDocument {
  _id: string;
  email: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  password?: string;
  tempPassword?: string;
  terms?: boolean;
  newsletter?: boolean;
  role?: "admin" | "user" | "guest";
  address?: {
    main?: AddressDocument;
    variants?: AddressDocument[];
  };
  phone?: string;
  valid?: boolean;
  realm?: string;
  picture?: string;
}
