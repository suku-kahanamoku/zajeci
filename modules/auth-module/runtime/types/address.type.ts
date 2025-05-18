export interface AddressDocument {
  _id: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  name?: string;
  country?: string;
}
