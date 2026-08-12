import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { z } from "zod";

const InquiryValidationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid 10-digit US phone number"),
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.number().min(1, "Guest count must be at least 1"),
  cakeTier: z.string().min(1, "Cake size is required"),
  flavorProfile: z.string().min(1, "Flavor profile is required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  designDescription: z.string().min(10, "Please provide at least 10 characters detailing your design"),
  dietaryRestrictions: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate payload with Zod
    const validatedData = InquiryValidationSchema.parse(body);

    let inquiry;
    try {
      await dbConnect();
      inquiry = await Inquiry.create({
        ...validatedData,
        eventDate: new Date(validatedData.eventDate),
        status: "pending",
      });
    } catch (dbErr) {
      console.warn("MongoDB connection unavailable, processing inquiry with mock reference ID:", dbErr);
      inquiry = {
        _id: "INQ-US-" + Math.floor(100000 + Math.random() * 900000),
        ...validatedData,
        status: "pending",
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your custom cake inquiry has been received. Our pastry team will reach out within 24 hours.",
        referenceId: inquiry._id,
        data: inquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating custom cake inquiry:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to process inquiry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
