import { Schema, model } from "mongoose";
import {
  WineKind,
  WineQuality,
  WineColor,
  WineVariety,
} from "../types/wine.interface";

// Use enum values from TypeScript enums for Mongoose enum validation
export const WineKindEnum = Object.values(WineKind);
export const WineQualityEnum = Object.values(WineQuality);
export const WineColorEnum = Object.values(WineColor);
export const WineVarietyEnum = Object.values(WineVariety);

import { ImageModel } from "@/server/models/image.schema";
import type { IImage } from "@/server/types/image.type";

import type { IWine } from "../types/wine.interface";

export const WineSchema = new Schema<IWine>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    kind: {
      type: String,
      enum: WineKindEnum,
      trim: true,
    },
    quality: {
      type: String,
      enum: WineQualityEnum,
      trim: true,
    },
    color: {
      type: String,
      enum: WineColorEnum,
      trim: true,
    },
    variety: {
      type: String,
      enum: WineVarietyEnum,
      trim: true,
    },
    volume: {
      type: Number,
    },
    year: {
      type: Number,
    },
    image: {
      main: {
        type: Schema.Types.ObjectId,
        ref: "images",
      },
      variants: [
        {
          type: Schema.Types.ObjectId,
          ref: "images",
        },
      ],
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

WineSchema.post("find", async function (docs: any[], next: Function) {
  await fetchWinesWithImages(docs);
  next();
});

WineSchema.pre("findOne", function () {
  this.populate("image.main").populate("image.variants");
});

export const WineModel = model<IWine>("wines", WineSchema);

/**
 * Pro dana vina nacte jednim dotazem vsechny obrazky a pak je namapuje na dana vina
 *
 * @param {IWine[]} wines
 * @return {*}  {Promise<void>}
 */
async function fetchWinesWithImages(wines: IWine[]): Promise<void> {
  if (!wines || wines.length === 0) return;

  // Collect all image IDs
  const imageIds = new Set();
  wines.forEach((wine) => {
    if (wine.image?.main) {
      imageIds.add(wine.image.main);
    }
    if (wine.image?.variants) {
      wine.image.variants.forEach((variantId) => imageIds.add(variantId));
    }
  });

  // Fetch all images using $in
  const images = await ImageModel.find({
    _id: { $in: Array.from(imageIds) },
  }).lean();
  const imageMap = new Map(
    images.map((image) => [image._id.toString(), image])
  );

  // Map images back to wines
  wines.forEach((wine) => {
    if (wine.image?.main) {
      wine.image.main = imageMap.get(wine.image.main.toString());
    }
    if (wine.image?.variants) {
      wine.image.variants = wine.image?.variants?.map((variantId) =>
        imageMap.get(variantId.toString())
      ) as IImage[];
    }
  });
}
