import type { ImageDocument } from "@/server/types/image.type";

export interface IWine {
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
