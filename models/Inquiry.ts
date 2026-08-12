import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiryDocument extends Document {
  fullName: string;
  email: string;
  phone: string;
  eventDate: Date;
  guestCount: number;
  cakeTier: string;
  flavorProfile: string;
  budgetRange: string;
  designDescription: string;
  dietaryRestrictions: string[];
  status: "pending" | "reviewed" | "quoted" | "confirmed";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema<IInquiryDocument> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    guestCount: {
      type: Number,
      required: [true, "Guest count is required"],
      min: [1, "Guest count must be at least 1"],
    },
    cakeTier: {
      type: String,
      required: [true, "Cake size/tier selection is required"],
      default: "2-Tier (Serves 30-40)",
    },
    flavorProfile: {
      type: String,
      required: [true, "Flavor profile is required"],
      default: "Signature Valrhona Chocolate & Espresso",
    },
    budgetRange: {
      type: String,
      required: [true, "Budget range is required"],
      default: "$300 - $500",
    },
    designDescription: {
      type: String,
      required: [true, "Design requirements are required"],
      trim: true,
    },
    dietaryRestrictions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "quoted", "confirmed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry: Model<IInquiryDocument> =
  mongoose.models.Inquiry || mongoose.model<IInquiryDocument>("Inquiry", InquirySchema);

export default Inquiry;
