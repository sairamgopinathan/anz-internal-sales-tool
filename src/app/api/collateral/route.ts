import { NextResponse } from "next/server";

import { callCatalystFunction } from "@/lib/catalyst-function-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await callCatalystFunction("get", "GET");
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    const status = typeof error === "object" && error !== null && "status" in error && typeof (error as { status?: unknown }).status === "number"
      ? (error as { status: number }).status
      : 500;

    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = await callCatalystFunction("create", "POST", body);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    const status = typeof error === "object" && error !== null && "status" in error && typeof (error as { status?: unknown }).status === "number"
      ? (error as { status: number }).status
      : 500;

    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status },
    );
  }
}
