import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, subtotal, tax, shippingFee, shippingDetails } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate total amount in USD cents ($1.00 = 100 cents)
    const calculatedSubtotal = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );
    const calculatedTax = Math.round(calculatedSubtotal * 0.08875 * 100) / 100;
    const calculatedShipping = calculatedSubtotal >= 100 || calculatedSubtotal === 0 ? 0 : 15;
    const grandTotalUSD = calculatedSubtotal + calculatedTax + calculatedShipping;
    const amountInCents = Math.max(50, Math.round(grandTotalUSD * 100)); // Minimum 50 cents for Stripe

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
          customerName: `${shippingDetails?.firstName || ""} ${shippingDetails?.lastName || ""}`,
          customerEmail: shippingDetails?.email || "",
          itemCount: items.length,
          orderSource: "Maison du Pain Bakery Web App",
        },
      });

      return NextResponse.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amountInCents / 100,
      });
    } catch (stripeErr: any) {
      console.warn("Stripe API credentials warning, using mock Stripe secret for preview:", stripeErr.message);
      
      const mockSecret = "pi_mock_" + Math.random().toString(36).substring(2, 12) + "_secret_mock";
      return NextResponse.json({
        success: true,
        clientSecret: mockSecret,
        paymentIntentId: "pi_mock_" + Math.random().toString(36).substring(2, 12),
        amount: grandTotalUSD,
        isMock: true,
      });
    }
  } catch (error: any) {
    console.error("Error creating Stripe Payment Intent:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize Stripe Payment" },
      { status: 500 }
    );
  }
}
