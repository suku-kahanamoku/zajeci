export interface IImage {
  _id: string;
  src: string;
  width: number;
  height: number;
  type: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
