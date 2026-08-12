import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Service worker not configured", {
    status: 404,
    headers: { "Content-Type": "text/plain" },
  });
}
