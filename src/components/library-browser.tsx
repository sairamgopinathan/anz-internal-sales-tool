import { useEffect, useMemo, useRef } from "react";

import {
  getLibraryAssetTypeLabel,
  getLibraryAssetTypeOptions,
  normalizeAssetType,
  type CollateralRecord,
} from "@/lib/collateral-data";

export const LIBRARY_ALL_ASSETS = "__all_assets__";

export type LibrarySortOption = "recent" | "az";

type LibraryBrowserProps = {
  collateral: CollateralRecord[];
  isLoading: boolean;
  dataError: string;
  selectedAssetType: string;
  onSelectAssetType: (value: string) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  sortBy: LibrarySortOption;
  onSortByChange: (value: LibrarySortOption) => void;
  copiedId: string | number | null;
  onCopyLink: (record: CollateralRecord) => Promise<void>;
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
      <circle cx="11" cy="11" r="6.5" />
    </svg>
  );
}

export function LibraryBrowser({
  collateral,
  isLoading,
  dataError,
  selectedAssetType,
  onSelectAssetType,
  searchTerm,
  onSearchTermChange,
  sortBy,
  onSortByChange,
  copiedId,
  onCopyLink,
}: LibraryBrowserProps) {
  const resultsContainerRef = useRef<HTMLDivElement | null>(null);

  const assetTypeOptions = useMemo(() => {
    return getLibraryAssetTypeOptions();
  }, []);

  const assetCounts = useMemo(() => {
    const counts = collateral.reduce<Record<string, number>>((current, record) => {
      const normalizedAssetType = normalizeAssetType(record.assetType);
      current[normalizedAssetType] = (current[normalizedAssetType] ?? 0) + 1;
      return current;
    }, {});

    return counts;
  }, [collateral]);

  const filteredAssets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const scopedAssets = selectedAssetType === LIBRARY_ALL_ASSETS
      ? collateral
      : collateral.filter((record) => normalizeAssetType(record.assetType) === selectedAssetType);

    const searchFilteredAssets = normalizedSearch
      ? scopedAssets.filter((record) => {
          return [
            record.assetName,
            record.summary,
            record.recommendedWhen,
            record.intent,
            normalizeAssetType(record.assetType),
            record.link,
            ...record.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);
        })
      : scopedAssets;

    if (sortBy === "az") {
      return [...searchFilteredAssets].sort((left, right) => left.assetName.localeCompare(right.assetName, undefined, { sensitivity: "base" }));
    }

    return searchFilteredAssets;
  }, [collateral, searchTerm, selectedAssetType, sortBy]);

  const selectedHeading = selectedAssetType === LIBRARY_ALL_ASSETS ? "All Assets" : getLibraryAssetTypeLabel(selectedAssetType);
  const searchPlaceholder = selectedAssetType === LIBRARY_ALL_ASSETS ? "Search all assets..." : `Search ${selectedHeading.toLowerCase()}...`;

  useEffect(() => {
    resultsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchTerm, selectedAssetType, sortBy]);

  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <aside className="rounded-[24px] border border-border bg-surface-strong p-3 sm:p-4 lg:flex lg:w-[300px] lg:min-w-[300px] lg:flex-col lg:self-stretch lg:overflow-hidden">
        <div className="border-b border-border/80 pb-3">
          <h2 className="title-font text-lg font-semibold text-foreground">Library</h2>
          <p className="mt-1 text-sm text-muted">Browse collateral directly by format.</p>
        </div>

        <nav className="mt-3 space-y-1.5 lg:max-h-[calc(100vh-260px)] lg:flex-1 lg:overflow-y-auto lg:pr-1" aria-label="Asset type categories">
          {[
            { value: LIBRARY_ALL_ASSETS, label: "All Assets", count: collateral.length },
            ...assetTypeOptions.map((option) => ({ value: option.value, label: option.label, count: assetCounts[option.value] ?? 0 })),
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelectAssetType(option.value)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                selectedAssetType === option.value ? "bg-accent/12 text-foreground" : "text-muted hover:bg-surface-soft hover:text-foreground"
              }`}
            >
              <span className="font-medium">{option.label}</span>
              <span className="rounded-full border border-border/80 bg-surface-soft px-2 py-0.5 text-xs text-muted">{option.count}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="rounded-[24px] border border-border bg-surface-strong lg:flex lg:min-h-[680px] lg:min-w-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
        <div className="border-b border-border/80 p-4 sm:p-5 lg:shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="title-font text-2xl font-semibold text-foreground">{selectedHeading}</h2>
              <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent-strong">
                {filteredAssets.length} results
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">Direct access for when you already know the format you want.</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr),180px] xl:max-w-[720px]">
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-border bg-surface-soft px-10 py-2.5 text-sm text-foreground outline-none transition focus:border-accent"
              />
            </label>

            <label className="relative block">
              <select
                value={sortBy}
                onChange={(event) => onSortByChange(event.target.value as LibrarySortOption)}
                className="app-select w-full rounded-xl border border-border bg-surface-soft px-3.5 py-2.5 pr-10 text-sm text-foreground outline-none transition focus:border-accent"
              >
                <option value="recent">Recently added</option>
                <option value="az">A-Z</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
                </svg>
              </span>
            </label>
          </div>
        </div>

        <div ref={resultsContainerRef} className="results-group m-3 rounded-[22px] p-3 sm:m-4 sm:p-4 lg:flex-1 lg:overflow-y-auto">
          {dataError ? (
            <div className="rounded-[20px] border border-danger/60 bg-surface-soft p-5 text-sm text-danger">
              Failed to load assets: {dataError}
            </div>
          ) : isLoading ? (
            <div className="rounded-[20px] border border-border bg-surface-soft p-5 text-sm text-muted">
              Loading library...
            </div>
          ) : filteredAssets.length ? (
            <div className="space-y-3">
              {filteredAssets.map((record) => (
                <article key={record.id} className="rounded-[20px] border border-border bg-surface-soft p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="title-font text-lg font-semibold text-foreground">{record.assetName}</h3>
                        <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent-strong">
                          {record.assetType}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{record.summary}</p>
                    </div>
                    <p className="shrink-0 text-sm text-muted sm:pl-4 sm:text-right">
                      <span className="font-semibold text-accent-warm">Intent:</span> {record.intent}
                    </p>
                  </div>

                  <p className="mt-2 text-[12px] text-muted"><span className="font-semibold text-foreground">Recommended when:</span> {record.recommendedWhen}</p>

                  {record.tags.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[12px] text-muted">
                      {record.tags.slice(0, 6).map((tag) => (
                        <span key={`${record.id}-${tag}`} className="rounded-full border border-border/60 bg-surface-contrast px-2 py-0.5 text-foreground/85">
                          {tag}
                        </span>
                      ))}
                      {record.tags.length > 6 ? (
                        <span className="rounded-full border border-border/60 bg-surface-contrast px-2 py-0.5 text-foreground/70">
                          +{record.tags.length - 6} more
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={record.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-strong"
                      >
                        Open link
                      </a>
                      <button
                        type="button"
                        onClick={() => void onCopyLink(record)}
                        className="inline-flex rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
                      >
                        Copy link
                      </button>
                    </div>
                    {copiedId === record.id ? <span className="text-sm text-accent">Link copied</span> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-border bg-surface-soft p-6 text-center">
              <h3 className="title-font text-lg font-semibold text-foreground">No assets found</h3>
              <p className="mt-2 text-sm leading-7 text-muted">Try a different category or search term.</p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
