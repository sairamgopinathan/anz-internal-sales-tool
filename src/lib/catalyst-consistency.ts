type CollateralLike = {
  id?: string | number;
  assetName?: string;
  link?: string;
  summary?: string;
  recommendedWhen?: string;
};

const DEFAULT_RETRIES = 8;
const DEFAULT_DELAY_MS = 400;

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

export async function waitForCollateralCondition(
  fetchAll: () => Promise<unknown>,
  predicate: (records: CollateralLike[]) => boolean,
  retries = DEFAULT_RETRIES,
) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const payload = await fetchAll();
    const records = Array.isArray(payload) ? (payload as CollateralLike[]) : [];

    if (predicate(records)) {
      return records;
    }

    if (attempt < retries - 1) {
      await sleep(DEFAULT_DELAY_MS * (attempt + 1));
    }
  }

  return null;
}

export function normalizeLinkForComparison(link: string) {
  const trimmedLink = link.trim();

  if (!trimmedLink) {
    return "";
  }

  try {
    const normalizedUrl = new URL(trimmedLink);
    normalizedUrl.hash = "";

    if (normalizedUrl.pathname !== "/") {
      normalizedUrl.pathname = normalizedUrl.pathname.replace(/\/+$/, "") || "/";
    }

    return normalizedUrl.toString();
  } catch {
    return trimmedLink.replace(/\/+$/, "");
  }
}
