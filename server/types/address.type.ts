export interface AddressDocument {
	_id: string;
	street: string;
	city: string;
	state: string;
	postal_code: string;
	country?: string;
	created_at?: Date;
	updated_at?: Date;
}
