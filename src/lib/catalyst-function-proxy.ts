type SupportedMethod = "GET" | "POST";

const CATALYST_BASE_URL = "https://dealpilot-60064672362.development.catalystserverless.in/server";

const GET_COLLATERAL_URL =
  process.env.CATALYST_GET_COLLATERAL_URL ??
  process.env.NEXT_PUBLIC_CATALYST_GET_COLLATERAL_URL ??
  `${CATALYST_BASE_URL}/get-collateral/execute`;
const CREATE_COLLATERAL_URL =
  process.env.CATALYST_CREATE_COLLATERAL_URL ??
  process.env.NEXT_PUBLIC_CATALYST_CREATE_COLLATERAL_URL ??
  `${CATALYST_BASE_URL}/create-collateral/execute`;
const UPDATE_COLLATERAL_URL =
  process.env.CATALYST_UPDATE_COLLATERAL_URL ??
  process.env.NEXT_PUBLIC_CATALYST_UPDATE_COLLATERAL_URL ??
  `${CATALYST_BASE_URL}/update-collateral/execute`;
const DELETE_COLLATERAL_URL =
  process.env.CATALYST_DELETE_COLLATERAL_URL ??
  process.env.NEXT_PUBLIC_CATALYST_DELETE_COLLATERAL_URL ??
  `${CATALYST_BASE_URL}/delete-collateral/execute`;

function getFunctionUrl(action: "get" | "create" | "update" | "delete") {
  switch (action) {
    case "get":
      return GET_COLLATERAL_URL;
    case "create":
      return CREATE_COLLATERAL_URL;
    case "update":
      return UPDATE_COLLATERAL_URL;
    case "delete":
      return DELETE_COLLATERAL_URL;
  }
}

export async function callCatalystFunction(
  action: "get" | "create" | "update" | "delete",
  method: SupportedMethod,
  body?: unknown,
) {
  const response = await fetch(getFunctionUrl(action), {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const rawText = await response.text();

  let payload: unknown;

  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error("Invalid response from Catalyst");
  }

  const normalizedPayload =
    typeof payload === "object" &&
    payload !== null &&
    "output" in payload &&
    typeof (payload as { output?: unknown }).output === "string"
      ? JSON.parse((payload as { output: string }).output)
      : payload;

  if (!response.ok) {
    const errorMessage =
      typeof normalizedPayload === "object" &&
      normalizedPayload !== null &&
      "error" in normalizedPayload &&
      typeof (normalizedPayload as { error?: unknown }).error === "string"
        ? (normalizedPayload as { error: string }).error
        : `Request failed with status ${response.status}`;

    const error = new Error(errorMessage);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return normalizedPayload;
}
