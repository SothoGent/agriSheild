import { NextRequest, NextResponse } from "next/server";
import { getSession, saveSession, clearSession } from "@/lib/ussd-store";
import { ZONES } from "@/lib/zones";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const phone = String(form.get("phoneNumber") || "");
  const text = String(form.get("text") || "").trim();
  const parts = text.split("*").filter(Boolean);
  const session = getSession(phone);
  const input = parts[parts.length - 1] || "";
  let response = "";

  if (parts.length === 0 || session.step === 0) {
    session.step = 1; saveSession(session);
    response = "CON AGRISHIELD\n1. Register this device\n2. Check policy status\n3. Zone drought risk\n4. Payout history\n0. Exit";
  } else if (session.step === 1) {
    if (input === "1") { session.step = 2; saveSession(session); response = "CON Enter your National ID\n(e.g. 63-1234567A12)"; }
    else if (input === "2") { clearSession(phone); response = "END Policy status: ACTIVE\nZone: Chiwundura\nPremium: US$5.00\nCover: US$300"; }
    else if (input === "3") { session.step = 10; saveSession(session); response = "CON Select your zone\n" + ZONES.map((z, i) => (i + 1) + ". " + z.name).join("\n"); }
    else if (input === "4") { clearSession(phone); response = "END Last payout: none this season."; }
    else if (input === "0") { clearSession(phone); response = "END Thank you."; }
    else response = "CON Invalid option. Try again.";
  } else if (session.step === 2) {
    session.nationalId = input; session.step = 3; saveSession(session);
    response = "CON Full name";
  } else if (session.step === 3) {
    session.farmerName = input; session.step = 4; saveSession(session);
    response = "CON Select your zone\n" + ZONES.map((z, i) => (i + 1) + ". " + z.name).join("\n");
  } else if (session.step === 4) {
    const idx = parseInt(input, 10) - 1;
    const zone = ZONES[idx];
    if (!zone) { response = "CON Invalid zone. Try again."; }
    else {
      session.zoneId = zone.id; session.step = 5; saveSession(session);
      response = "CON Confirm\nName: " + session.farmerName + "\nZone: " + zone.name + "\n1. Yes\n2. Cancel";
    }
  } else if (session.step === 5) {
    if (input === "1") {
      clearSession(phone);
      response = "END Registration received.\nReference: AS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    } else { clearSession(phone); response = "END Cancelled."; }
  } else {
    clearSession(phone);
    response = "END Session ended.";
  }

  return new NextResponse(response, { headers: { "Content-Type": "text/plain" } });
}
