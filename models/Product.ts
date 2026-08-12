import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: "Custom Cakes" | "Cupcakes" | "Gluten-Free" | "Artisan Breads" | "Viennoiserie" | "Pastries";
  allergens: string[];
  stock: boolean;
  stockQuantity: number;
  image: string;
  isFeatured: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProductDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Custom Cakes",
          "Cupcakes",
          "Gluten-Free",
          "Artisan Breads",
          "Viennoiserie",
          "Pastries",
        ],
        message: "{VALUE} is not a valid bakery category",
      },
      default: "Pastries",
    },
    allergens: {
      type: [String],
      default: [],
    },
    stock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 50,
      min: [0, "Stock quantity cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      default: "/images/placeholder-bakery.jpg",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for fast search queries
ProductSchema.index({ name: "text", description: "text", category: "text" });

const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);

export default Product;
