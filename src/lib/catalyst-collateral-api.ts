import type { CollateralFormValues, CollateralRecord } from "@/lib/collateral-data";
import { mapFormValuesToRow, normalizeCollateralRecord } from "@/lib/collateral-data";

const COLLATERAL_API_URL = "/api/collateral";

async function parseCatalystResponse(response: Response) {
  const rawText = await response.text();

  let payload: unknown;

  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error("Invalid response from Catalyst");
  }

  if (!response.ok) {
    const errorMessage =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error?: unknown }).error === "string"
        ? (payload as { error: string }).error
        : `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return typeof payload === "object" && payload !== null && "output" in payload && typeof (payload as { output?: unknown }).output === "string"
    ? JSON.parse((payload as { output: string }).output)
    : payload;
}

function ensureCollateralRecord(payload: unknown): CollateralRecord {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "assetName" in payload &&
    typeof (payload as { assetName?: unknown }).assetName === "string"
  ) {
    return normalizeCollateralRecord(payload as CollateralRecord);
  }

  throw new Error("Unexpected collateral response from Catalyst");
}

export async function fetchCollateralFromCatalyst() {
  const response = await fetch(COLLATERAL_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const payload = await parseCatalystResponse(response);

  return Array.isArray(payload) ? (payload as CollateralRecord[]).map(normalizeCollateralRecord) : [];
}

export async function createCollateralInCatalyst(values: CollateralFormValues) {
  const payload = mapFormValuesToRow(values, 0);

  const response = await fetch(COLLATERAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return ensureCollateralRecord(await parseCatalystResponse(response));
}

export async function updateCollateralInCatalyst(id: string, values: CollateralFormValues, existingPriority: number | null) {
  const payload = {
    id,
    ...mapFormValuesToRow(values, existingPriority ?? 0),
  };

  const response = await fetch(`${COLLATERAL_API_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return ensureCollateralRecord(await parseCatalystResponse(response));
}

export async function deleteCollateralInCatalyst(id: string | number) {
  const response = await fetch(`${COLLATERAL_API_URL}/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  await parseCatalystResponse(response);
}
