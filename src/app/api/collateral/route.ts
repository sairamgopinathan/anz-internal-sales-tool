import { NextResponse } from "next/server";

import { normalizeLinkForComparison, waitForCollateralCondition } from "@/lib/catalyst-consistency";
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

    const createdRecord = typeof payload === "object" && payload !== null ? payload as { id?: string; link?: string; assetName?: string } : null;

    if (createdRecord?.id) {
      const syncedRecords = await waitForCollateralCondition(
        () => callCatalystFunction("get", "GET"),
        (records) => records.some((record) => String(record.id) === String(createdRecord.id)),
      );

      const syncedRecord = syncedRecords?.find((record) => String(record.id) === String(createdRecord.id));

      if (syncedRecord) {
        return NextResponse.json(syncedRecord, { status: 200 });
      }
    }

    if (createdRecord?.link) {
      const normalizedLink = normalizeLinkForComparison(createdRecord.link);
      const syncedRecords = await waitForCollateralCondition(
        () => callCatalystFunction("get", "GET"),
        (records) => records.some((record) => normalizeLinkForComparison(String(record.link ?? "")) === normalizedLink),
      );

      const syncedRecord = syncedRecords?.find(
        (record) => normalizeLinkForComparison(String(record.link ?? "")) === normalizedLink,
      );

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
