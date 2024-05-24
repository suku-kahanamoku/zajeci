import { ImageDocument } from './image.type';

export interface WineDocument {
	_id: string;
	name: string;
	price: number;
	description?: string;
	kind?: string;
	quality?: string;
	color?: string;
	variety?: string;
	volume?: number;
	year?: number;
	image?: {
		main?: ImageDocument;
		variants?: ImageDocument[];
	};
	categories?: string[];
	published?: boolean;
	created_at?: Date;
	updated_at?: Date;
}
