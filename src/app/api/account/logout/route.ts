import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logout, CUSTOMER_COOKIE as COOKIE } from "@/lib/shopify-customer";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await logout(token);
  jar.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
