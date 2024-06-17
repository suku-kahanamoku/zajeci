import { ImageDocument } from './image.type';

export interface WineDocument {
	_id: string;
	name: string;
	price: number;
	quantity: number;
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
	createdAt?: Date;
	updatedAt?: Date;
}
