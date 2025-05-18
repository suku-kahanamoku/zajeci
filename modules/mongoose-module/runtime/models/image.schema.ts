import { Schema, model } from "mongoose";
import type { ImageDocument } from "../types/image.type";

const ImageSchema = new Schema(
  {
    src: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    width: {
      type: Number,
      required: true,
      default: 0,
    },
    height: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ImageModel = model<ImageDocument>("images", ImageSchema);
