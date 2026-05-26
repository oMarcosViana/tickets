import { NextRequest, NextResponse } from "next/server";
import {
  getSiteConfig,
  isValidConfigPassword,
  saveSiteConfig,
} from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const config = await getSiteConfig();
  const isAdmin = request.nextUrl.searchParams.get("admin") === "1";

  if (isAdmin) {
    const password = request.nextUrl.searchParams.get("password") ?? "";

    if (!isValidConfigPassword(password)) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 },
      );
    }
  }

  return NextResponse.json({ config });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    config?: unknown;
    password?: string;
  };

  if (!isValidConfigPassword(body.password ?? "")) {
    return NextResponse.json(
      { message: "Invalid password" },
      { status: 401 },
    );
  }

  const config = await saveSiteConfig(
    typeof body.config === "object" && body.config ? body.config : {},
  );

  return NextResponse.json({ config });
}
