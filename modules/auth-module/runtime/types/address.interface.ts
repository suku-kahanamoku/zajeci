export interface IAddress {
  _id: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  name?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
