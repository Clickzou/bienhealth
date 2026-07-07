import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateProfile, saveDefaultAddress, CUSTOMER_COOKIE, type AddressInput } from "@/lib/shopify-customer";

export async function POST(request: Request) {
  const token = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  if (!token) return NextResponse.json({ ok: false, error: "Non connecté." }, { status: 401 });

  let b: Record<string, unknown> = {};
  try {
    b = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  try {
    // 1) Profil
    const profileErrors = (
      await updateProfile(token, {
        firstName: str(b.firstName),
        lastName: str(b.lastName),
        phone: str(b.phone) || null,
      })
    ).errors;
    if (profileErrors.length) {
      return NextResponse.json({ ok: false, error: profileErrors[0].message }, { status: 400 });
    }

    // 2) Adresse (si au moins la rue est renseignée)
    if (str(b.address1)) {
      const address: AddressInput = {
        firstName: str(b.firstName),
        lastName: str(b.lastName),
        address1: str(b.address1),
        address2: str(b.address2),
        city: str(b.city),
        zip: str(b.zip),
        province: str(b.province),
        country: str(b.country) || "France",
        phone: str(b.phone),
      };
      const addrErrors = (await saveDefaultAddress(token, address, str(b.addressId) || null)).errors;
      if (addrErrors.length) {
        return NextResponse.json({ ok: false, error: addrErrors[0].message }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Mise à jour indisponible pour le moment." }, { status: 500 });
  }
}
