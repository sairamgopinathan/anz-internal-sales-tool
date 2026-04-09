import { NextResponse } from "next/server";

import { normalizeLinkForComparison, waitForCollateralCondition } from "@/lib/catalyst-consistency";
import { callCatalystFunction } from "@/lib/catalyst-function-proxy";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = typeof body === "object" && body !== null && "action" in body ? (body as { action?: string }).action : undefined;

    if (action === "delete") {
      const payload = await callCatalystFunction("delete", "POST", { id });

      await waitForCollateralCondition(
        () => callCatalystFunction("get", "GET"),
        (records) => !records.some((record) => String(record.id) === String(id)),
      );

      return NextResponse.json(payload, { status: 200 });
    }

    const payload = await callCatalystFunction("update", "POST", { id, ...body });
    const updatedRecord = typeof payload === "object" && payload !== null ? payload as { id?: string; link?: string; assetName?: string } : null;

    if (updatedRecord?.id) {
      const normalizedLink = normalizeLinkForComparison(String(updatedRecord.link ?? body.link ?? ""));
      const normalizedName = String(updatedRecord.assetName ?? body.asset_name ?? "").trim();
      const syncedRecords = await waitForCollateralCondition(
        () => callCatalystFunction("get", "GET"),
        (records) =>
          records.some(
            (record) =>
              String(record.id) === String(updatedRecord.id) &&
              normalizeLinkForComparison(String(record.link ?? "")) === normalizedLink &&
              String(record.assetName ?? "").trim() === normalizedName,
          ),
      );

      const syncedRecord = syncedRecords?.find((record) => String(record.id) === String(updatedRecord.id));

      if (syncedRecord) {
        return NextResponse.json(syncedRecord, { status: 200 });
      }
    }

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
