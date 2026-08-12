import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMenuItem extends Document {
  title: string;
  description: string;
  price: number;
  category: "Breads" | "Pastries" | "Cakes" | "Beverages" | "Specialty";
  image: string;
  isAvailable: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema<IMenuItem> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Menu item title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Menu item description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Menu item price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Breads", "Pastries", "Cakes", "Beverages", "Specialty"],
        message: "{VALUE} is not a valid bakery category",
      },
      default: "Pastries",
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      default: "/images/placeholder-bakery.jpg",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model re-compilation error during Next.js Hot Module Replacement (HMR)
const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem || mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;
