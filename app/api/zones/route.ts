import { NextResponse } from "next/server";
import { ZONES } from "@/lib/zones";

export async function GET() {
  return NextResponse.json({ zones: ZONES });
}
