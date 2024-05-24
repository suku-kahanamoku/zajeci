export interface ImageDocument {
	_id: string;
	src: string;
	width: number;
	height: number;
	type: string;
	name?: string;
	description?: string;
	created_at?: Date;
	updated_at?: Date;
}
