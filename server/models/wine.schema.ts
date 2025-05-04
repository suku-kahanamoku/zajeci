import { Schema, model } from "mongoose";

import { ImageModel } from "./image.schema";
import { WineDocument } from "../types/wine.type";
import { ImageDocument } from "../types/image.type";

export const WineSchema = new Schema<WineDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    kind: {
      type: String,
      trim: true,
    },
    quality: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    variety: {
      type: String,
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

export const WineModel = model<WineDocument>("wines", WineSchema);

/**
 * Pro dana vina nacte jednim dotazem vsechny obrazky a pak je namapuje na dana vina
 *
 * @param {WineDocument[]} wines
 * @return {*}  {Promise<void>}
 */
async function fetchWinesWithImages(wines: WineDocument[]): Promise<void> {
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
      ) as ImageDocument[];
    }
  });
}
