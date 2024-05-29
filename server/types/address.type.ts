export interface AddressDocument {
	_id: string;
	street: string;
	city: string;
	postal_code: string;
	state: string;
	name?: string;
	country?: string;
	created_at?: Date;
	updated_at?: Date;
}
