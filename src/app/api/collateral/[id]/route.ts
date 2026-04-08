import { NextResponse } from "next/server";

import { callCatalystFunction } from "@/lib/catalyst-function-proxy";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = typeof body === "object" && body !== null && "action" in body ? (body as { action?: string }).action : undefined;
    const payload = action === "delete"
      ? await callCatalystFunction("delete", "POST", { id })
      : await callCatalystFunction("update", "POST", { id, ...body });
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
