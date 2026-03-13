"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { CollateralForm } from "@/components/collateral-form";
import {
  emptyCollateralForm,
  filterOptions,
  initialFilters,
  mapFormValuesToRow,
  mapRowToCollateralRecord,
  recordToFormValues,
  type CollateralEntryRow,
  type CollateralFormErrors,
  type CollateralFormValues,
  type CollateralRecord,
  type FilterState,
  type Theme,
  type View,
} from "@/lib/collateral-data";
import { supabase } from "@/lib/supabase-client";

const THEME_STORAGE_KEY = "anzapp-theme";
const ADMIN_PASSWORD = "admin123";
const ADMIN_ACCESS_STORAGE_KEY = "anzapp-admin-access";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 64 64" fill="currentColor">
      <path d="M45,14.67l-2.76,2a1,1,0,0,1-1,.11L37.65,15.3a1,1,0,0,1-.61-.76l-.66-3.77a1,1,0,0,0-1-.84H30.52a1,1,0,0,0-1,.77l-.93,3.72a1,1,0,0,1-.53.65l-3.3,1.66a1,1,0,0,1-1-.08l-3-2.13a1,1,0,0,0-1.31.12l-3.65,3.74a1,1,0,0,0-.13,1.26l1.87,2.88a1,1,0,0,1,.1.89L16.34,27a1,1,0,0,1-.68.63l-3.85,1.06a1,1,0,0,0-.74,1v4.74a1,1,0,0,0,.8,1l3.9.8a1,1,0,0,1,.72.57l1.42,3.15a1,1,0,0,1-.05.92l-2.13,3.63a1,1,0,0,0,.17,1.24L19.32,49a1,1,0,0,0,1.29.09L23.49,47a1,1,0,0,1,1-.1l3.74,1.67a1,1,0,0,1,.59.75l.66,3.79a1,1,0,0,0,1,.84h4.89a1,1,0,0,0,1-.86l.58-4a1,1,0,0,1,.58-.77l3.58-1.62a1,1,0,0,1,1,.09l3.58-1.62a1,1,0,0,0,1.3-.15L50,45.06a1,1,0,0,0,.09-1.27l-2.08-3a1,1,0,0,1-.09-1l1.48-3.43a1,1,0,0,1,.71-.59L53.77,35a1,1,0,0,0,.8-1V29.42a1,1,0,0,0,.8-1l-3.72-.78a1,1,0,0,1-.73-.62l-1.45-3.65a1,1,0,0,1,.11-.94l2.15-3.14A1,1,0,0,0,50,18l-3.71-3.25A1,1,0,0,0,45,14.67Z"/><circle cx="32.82" cy="31.94" r="9.94"/></svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 10.5 12 4l8.25 6.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75V20h13.5V9.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-5.25h4V20" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 2.651 2.651" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5a2.121 2.121 0 1 0-3-3L5.25 12.75 3 21l8.25-2.25L22.5 7.5a2.121 2.121 0 0 0-3-3Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.14A2 2 0 0116.13 21H7.87a2 2 0 01-1.867-3.14L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1V3a1 1 0 011-1h6a1 1 0 011 1v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v2l3-3m-3 3V9" />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "dark") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M12 18.75V21M4.72 4.72l1.59 1.59M17.69 17.69l1.59 1.59M3 12h2.25M18.75 12H21M4.72 19.28l1.59-1.59M17.69 6.31l1.59-1.59" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}

function MultiFilter({
  label,
  value,
  options,
  onChange,
  optional,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  optional?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-foreground">
      {label}
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="app-select w-full rounded-2xl border border-border px-4 py-3 pr-10 text-foreground outline-none transition focus:border-accent"
        >
          <option value="">{optional ? `Any ${label.toLowerCase()}` : `Select ${label.toLowerCase()}`}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted">
          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
          </svg>
        </span>
      </div>
    </label>
  );
}

function matchesFilter(record: CollateralRecord, filters: FilterState) {
  return (
    (!filters.stage || record.stages.includes(filters.stage)) &&
    (!filters.situation || record.situations.includes(filters.situation)) &&
    (!filters.competitor || record.competitors.includes(filters.competitor)) &&
    (!filters.segment || record.segments.includes(filters.segment)) &&
    (!filters.industry || record.industries.includes(filters.industry))
  );
}

function validateForm(values: CollateralFormValues): CollateralFormErrors {
  const errors: CollateralFormErrors = {};

  if (!values.assetName.trim()) {
    errors.assetName = "Add an asset name.";
  }
  if (!values.link.trim()) {
    errors.link = "Add a link.";
  }
  if (!values.assetType) {
    errors.assetType = "Select an asset type.";
  }
  if (!values.stages.length) {
    errors.stages = "Choose at least one stage.";
  }
  if (!values.situations.length) {
    errors.situations = "Choose at least one situation.";
  }
  if (!values.summary.trim()) {
    errors.summary = "Add a short summary.";
  }
  if (!values.recommendedWhen.trim()) {
    errors.recommendedWhen = "Add guidance for when to use it.";
  }
  return errors;
}

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={`${label}-${tag}`} className="rounded-full border border-border bg-surface-strong px-2.5 py-1 text-xs text-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DashboardShell() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  });
  const [view, setView] = useState<View>("sales");
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");
const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [collateral, setCollateral] = useState<CollateralRecord[]>([]);
  const [formValues, setFormValues] = useState<CollateralFormValues>(emptyCollateralForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<CollateralFormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dataError, setDataError] = useState("");
  const [actionError, setActionError] = useState("");
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(ADMIN_ACCESS_STORAGE_KEY) === "granted";
  });

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    async function fetchCollateral() {
      console.log("[Supabase] Fetching collateral entries", { url: SUPABASE_URL, table: "collateral_entries" });
      setIsLoading(true);
      setDataError("");

      try {
        const { data, error: fetchError } = await supabase
          .from("collateral_entries")
          .select("id, asset_name, link, asset_type, stages, situations, competitors, segments, industries, intent, summary, recommended_when, priority");

        if (fetchError) {
          console.error("[Supabase] Fetch error:", fetchError);
          setDataError(fetchError.message);
          setCollateral([]);
          setIsLoading(false);
          return;
        }

        const rows = (data ?? []) as CollateralEntryRow[];
        setCollateral(rows.map(mapRowToCollateralRecord));
      } catch (fetchException) {
        console.error("[Supabase] Fetch exception:", fetchException);
        const message = fetchException instanceof Error ? fetchException.message : String(fetchException);
        setDataError(`${message}${SUPABASE_URL ? ` (${SUPABASE_URL})` : ""}`);
        setCollateral([]);
      }

      setIsLoading(false);
    }

    void fetchCollateral();
  }, []);

  const matchingCollateral = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return collateral.filter((record) => {
      const matchesStructuredFilters = matchesFilter(record, filters);
      const matchesSearch =
        !normalizedSearch ||
        record.assetName.toLowerCase().includes(normalizedSearch) ||
        record.summary.toLowerCase().includes(normalizedSearch);

      return matchesStructuredFilters && matchesSearch;
    });
  }, [collateral, filters, searchTerm]);

  const hasActiveCriteria = useMemo(() => {
    return Boolean(
      filters.stage ||
        filters.situation ||
        filters.competitor ||
        filters.segment ||
        filters.industry ||
        searchTerm.trim(),
    );
  }, [filters, searchTerm]);

  const headerCopy = useMemo(() => {
    if (view === "admin") {
      return {
        eyebrow: "Admin View",
        title: "Manage collateral records for the recommendation tool.",
        subtitle: "Add and edit mock collateral entries with reusable structured fields and tag-based matching.",
      };
    }

    return {
      eyebrow: "Sales View",
      title: "Find the right collateral for the conversation in front of you.",
      subtitle: "Choose structured deal filters and get the best collateral matches for the current sales context.",
    };
  }, [view]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  function openPrompt() {
    if (hasAdminAccess) {
      setView("admin");
      return;
    }

    setPassword("");
    setError("");
    setIsPromptOpen(true);
  }

  function closePrompt() {
    setIsPromptOpen(false);
    setPassword("");
    setError("");
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setHasAdminAccess(true);
      window.localStorage.setItem(ADMIN_ACCESS_STORAGE_KEY, "granted");
      setView("admin");
      closePrompt();
      return;
    }

    setError("Incorrect password. Try admin123 for the prototype admin view.");
  }

  function handleFilterChange(field: keyof FilterState, value: string) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
    setSearchTerm("");
  }

  async function handleCopyLink(record: CollateralRecord) {
    try {
      await navigator.clipboard.writeText(record.link);
      setCopiedId(record.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === record.id ? null : current));
      }, 1800);
    } catch (copyError) {
      console.error("[Clipboard] Copy failed:", copyError);
    }
  }

  function startEditing(record: CollateralRecord) {
    setEditingId(String(record.id));
    setFormValues(recordToFormValues(record));
    setFormErrors({});
    setActionError("");
  }

  function stopEditing() {
    setEditingId(null);
    setFormValues(emptyCollateralForm);
    setFormErrors({});
    setActionError("");
  }

async function submitForm() {
  const errors = validateForm(formValues);

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setFormErrors({});
  setActionError("");
  setIsSaving(true);

  if (editingId) {
    const existingRecord = collateral.find((record) => String(record.id) === editingId);
    const updatePayload = mapFormValuesToRow(formValues, existingRecord?.priority ?? 0);

    console.log("[Supabase] Updating collateral entry", { id: existingRecord?.id ?? editingId, payload: updatePayload });

    try {
      const { data, error: updateError } = await supabase
        .from("collateral_entries")
        .update(updatePayload)
        .eq("id", existingRecord?.id ?? editingId)
        .select("id, asset_name, link, asset_type, stages, situations, competitors, segments, industries, intent, summary, recommended_when, priority")
        .single();

      if (updateError) {
        console.error("[Supabase] Update error:", updateError);
        setActionError(updateError.message);
        setIsSaving(false);
        return;
      }

      setCollateral((current) =>
        current.map((record) => (String(record.id) === editingId ? mapRowToCollateralRecord(data as CollateralEntryRow) : record)),
      );
    } catch (updateException) {
      console.error("[Supabase] Update exception:", updateException);
      const message = updateException instanceof Error ? updateException.message : String(updateException);
      setActionError(`${message}${SUPABASE_URL ? ` (${SUPABASE_URL})` : ""}`);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    stopEditing();
    return;
  }

  const insertPayload = mapFormValuesToRow(formValues, 0);

  console.log("[Supabase] Inserting collateral entry", insertPayload);

  try {
    const { data, error: insertError } = await supabase
      .from("collateral_entries")
      .insert(insertPayload)
      .select("id, asset_name, link, asset_type, stages, situations, competitors, segments, industries, intent, summary, recommended_when, priority")
      .single();

    if (insertError) {
      console.error("[Supabase] Insert error:", insertError);
      setActionError(insertError.message);
      setIsSaving(false);
      return;
    }

    setCollateral((current) => [mapRowToCollateralRecord(data as CollateralEntryRow), ...current]);
  } catch (insertException) {
    console.error("[Supabase] Insert exception:", insertException);
    const message = insertException instanceof Error ? insertException.message : String(insertException);
    setActionError(`${message}${SUPABASE_URL ? ` (${SUPABASE_URL})` : ""}`);
    setIsSaving(false);
    return;
  }

  setFormValues(emptyCollateralForm);
  setIsSaving(false);
}

async function deleteCollateral(id: string | number) {
  try {
    console.log("[Supabase] Deleting collateral entry", { id });
    const { error: deleteError } = await supabase
      .from("collateral_entries")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Supabase] Delete error:", deleteError);
      setActionError(deleteError.message);
      return;
    }

    setCollateral((current) => current.filter((record) => String(record.id) !== String(id)));

    if (editingId && String(editingId) === String(id)) {
      stopEditing();
    }
  } catch (deleteException) {
    console.error("[Supabase] Delete exception:", deleteException);
    const message = deleteException instanceof Error ? deleteException.message : String(deleteException);
    setActionError(`${message}${SUPABASE_URL ? ` (${SUPABASE_URL})` : ""}`);
  }
}

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="panel rounded-[28px] px-5 py-5 sm:px-7 sm:py-6">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div className="max-w-3xl">
            <span className="mb-3 inline-flex rounded-full border border-border bg-surface-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {headerCopy.eyebrow}
            </span>
            <h1 className="title-font max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {headerCopy.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {headerCopy.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-soft px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
            >
              <ThemeIcon theme={theme} />
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </button>

            {view === "sales" ? (
              <button
                type="button"
                onClick={openPrompt}
                aria-label="Open admin settings"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-soft text-foreground transition hover:border-accent hover:text-accent"
              >
                <SettingsIcon />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setView("sales")}
                aria-label="Go to home"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-soft text-foreground transition hover:border-accent hover:text-accent"
              >
                <HomeIcon />
              </button>
            )}
          </div>
        </header>

{view === "sales" ? (
  <section className="space-y-4">
    <section className="rounded-[26px] border border-border bg-surface-strong p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="title-font text-lg font-semibold text-foreground">Filters</h2>
          <p className="mt-1 text-sm text-muted">
            Select criteria to find matching collateral
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-border bg-surface-soft px-3 py-1 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setIsSearchExpanded(true)}
            className="rounded-full border border-border bg-surface-soft px-3 py-1 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Search
          </button>
        </div>
        {isSearchExpanded && (
          <div className="mt-3 w-full flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by asset name or summary"
              className="flex-1 rounded-xl border border-border bg-surface-soft px-3 py-2 text-foreground outline-none transition focus:border-accent"
            />
            <button
              type="button"
              onClick={() => setIsSearchExpanded(false)}
              className="rounded-full border border-border bg-surface-soft h-10 w-10 flex-shrink-0 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
              aria-label="Close search"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MultiFilter label="Stage" value={filters.stage} options={filterOptions.stages} onChange={(value) => handleFilterChange("stage", value)} />
        <MultiFilter label="Situation" value={filters.situation} options={filterOptions.situations} onChange={(value) => handleFilterChange("situation", value)} />
        <MultiFilter label="Competitor" value={filters.competitor} options={filterOptions.competitors} onChange={(value) => handleFilterChange("competitor", value)} />
        <MultiFilter label="Segment" value={filters.segment} options={filterOptions.segments} onChange={(value) => handleFilterChange("segment", value)} />
        <MultiFilter label="Industry" value={filters.industry} options={filterOptions.industries} onChange={(value) => handleFilterChange("industry", value)} optional />
      </div>
    </section>

            <section className="rounded-[26px] border border-border bg-surface-strong p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="title-font text-xl font-semibold text-foreground">Matching collateral</h2>
                  <p className="mt-1 text-sm text-muted">Results update from the selected filters and use mock data only.</p>
                </div>
                <span className="rounded-full border border-border bg-surface-soft px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                  {matchingCollateral.length} results
                </span>
              </div>

              <div className="mt-5 max-h-[56vh] overflow-y-auto pr-1">
                <div className="grid gap-4">
                  {dataError ? (
                    <div className="rounded-[24px] border border-danger/60 bg-surface-soft p-6 text-sm text-danger">
                      Failed to load collateral: {dataError}
                    </div>
                  ) : isLoading ? (
                    <div className="rounded-[24px] border border-border bg-surface-soft p-6 text-sm text-muted">
                      Loading collateral entries...
                    </div>
                  ) : !hasActiveCriteria ? (
                    <div className="rounded-[24px] border border-dashed border-border bg-surface-soft p-8 text-center">
                      <h3 className="title-font text-lg font-semibold text-foreground">No filters selected</h3>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        Choose a stage, situation, competitor, or search term to see matching collateral.
                      </p>
                    </div>
                  ) : matchingCollateral.length ? (
                    matchingCollateral.map((record) => (
                      <article key={record.id} className="rounded-[24px] border border-border bg-surface-soft p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="title-font text-xl font-semibold text-foreground">{record.assetName}</h3>
                              <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent">
                                {record.assetType}
                              </span>
                            </div>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{record.summary}</p>
                          </div>
                          <div className="text-sm text-muted sm:text-right">
                            <p>Intent: {record.intent}</p>
                          </div>
                        </div>

<p className="mt-1 text-[12px] text-muted"><span className="font-semibold">Recommended when:</span> {record.recommendedWhen}</p>

                        <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-muted">
                          {[...record.stages, ...record.situations, ...record.competitors, ...record.segments, ...record.industries].map((tag) => (
                            <span key={`${record.id}-${tag}`} className="rounded-full border border-border/50 bg-surface-strong px-2 py-1">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
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
                            onClick={() => void handleCopyLink(record)}
                            className="inline-flex rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
                          >
                            Copy link
                          </button>
                          {copiedId === record.id ? <span className="text-sm text-accent">Link copied</span> : null}
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-border bg-surface-soft p-8 text-center">
                      <h3 className="title-font text-lg font-semibold text-foreground">No matching collateral</h3>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        Adjust one or more filters to broaden the match criteria across the mock library.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </section>
        ) : (
          <section className="space-y-6 py-6">
            <CollateralForm
              mode={editingId ? "edit" : "add"}
              values={formValues}
              errors={formErrors}
              onChange={(nextValues) => {
                setFormValues(nextValues);
                if (Object.keys(formErrors).length > 0) {
                  setFormErrors(validateForm(nextValues));
                }
              }}
              onSubmit={submitForm}
              onCancel={stopEditing}
            />

            {actionError ? (
              <div className="rounded-2xl border border-danger/60 bg-surface-soft px-4 py-3 text-sm text-danger">
                Save failed: {actionError}
              </div>
            ) : null}

            <section className="rounded-[26px] border border-border bg-surface-strong p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
<h2 className="title-font text-xl font-semibold text-foreground">Manage Existing Collateral</h2>
      <p className="mt-1 text-sm text-muted">
        Edit collateral entries.
      </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {dataError ? (
                  <div className="rounded-[24px] border border-danger/60 bg-surface-soft p-6 text-sm text-danger">
                    Failed to load collateral: {dataError}
                  </div>
                ) : isLoading ? (
                  <div className="rounded-[24px] border border-border bg-surface-soft p-6 text-sm text-muted">
                    Loading collateral entries...
                  </div>
                ) : collateral.map((record) => (
                  <article key={record.id} className="rounded-[24px] border border-border bg-surface-soft p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="title-font text-lg font-semibold text-foreground">{record.assetName}</h3>
                          <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent">
                            {record.assetType}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 xl:grid-cols-2">
                          <TagGroup label="Stages" tags={record.stages} />
                          <TagGroup label="Situations" tags={record.situations} />
                          <TagGroup label="Competitors" tags={record.competitors} />
                          <TagGroup label="Segments" tags={record.segments} />
                        </div>
                      </div>

<div className="flex items-center gap-2 lg:pl-4">
                         <button
                           type="button"
                           onClick={() => startEditing(record)}
                           aria-label={`Edit ${record.assetName}`}
                           disabled={isSaving}
                           className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-strong text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                         >
                           <EditIcon />
                         </button>
                         <button
                           type="button"
                           onClick={() => deleteCollateral(record.id)}
                           aria-label={`Delete ${record.assetName}`}
                           disabled={isSaving}
                           className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-strong text-muted transition hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
                         >
                           <TrashIcon />
                         </button>
                       </div>
                    </div>

                    <div className="mt-4 border-t border-border pt-3 text-xs text-muted">ID: {record.id}</div>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}
      </div>

      {isPromptOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-border bg-surface-strong p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Admin access</p>
                <h2 className="title-font mt-2 text-2xl font-semibold text-foreground">Enter prototype password</h2>
              </div>
              <button
                type="button"
                onClick={closePrompt}
                className="rounded-full border border-border p-2 text-muted transition hover:border-accent hover:text-accent"
                aria-label="Close password prompt"
              >
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted">
              This prompt gates the mock admin view only. No external auth is connected in this first pass.
            </p>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-foreground">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  autoFocus
                  className="mt-2 w-full rounded-2xl border border-border bg-surface-soft px-4 py-3 text-foreground outline-none transition focus:border-accent"
                  placeholder="Enter admin password"
                />
              </label>

              {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePrompt}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-strong"
                >
                  Open Admin View
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
