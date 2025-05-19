import { Schema, model } from "mongoose";

import { AddressModel } from "./address.schema";
import type { AddressDocument } from "../types/address.interface";
import type { UserDocument } from "../types/user.type";

export const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    surname: {
      type: String,
      trim: true,
    },
    givenName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    tempPassword: {
      type: String,
      trim: true,
    },
    terms: {
      type: Boolean,
    },
    newsletter: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "guest",
      trim: true,
    },
    address: {
      main: {
        type: Schema.Types.ObjectId,
        ref: "addresses",
      },
      variants: [
        {
          type: Schema.Types.ObjectId,
          ref: "addresses",
        },
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.post("find", async function (docs, next) {
  await fetchUsersWithAddresses(docs);
  next();
});

UserSchema.pre("findOne", function () {
  this.populate("address.main").populate("address.variants");
});

export const UserModel = model<UserDocument>("users", UserSchema);

async function fetchUsersWithAddresses(users: UserDocument[]) {
  if (!users || users.length === 0) return;

  // Collect all address IDs
  const addressIds = new Set();
  users.forEach((user) => {
    if (user.address?.main) {
      addressIds.add(user.address.main);
    }
    if (user.address?.variants) {
      user.address.variants.forEach((variantId) => addressIds.add(variantId));
    }
  });

  // Fetch all addresses using $in
  const addresses = await AddressModel.find({
    _id: { $in: Array.from(addressIds) },
  }).lean();
  const addressMap = new Map(
    addresses.map((address) => [address._id.toString(), address])
  );

  // Map addresses back to users
  users.forEach((user) => {
    if (user.address?.main) {
      user.address.main = addressMap.get(user.address.main.toString());
    }
    if (user.address?.variants) {
      user.address.variants = user.address?.variants?.map((variantId) =>
        addressMap.get(variantId.toString())
      ) as AddressDocument[];
    }
  });
}
