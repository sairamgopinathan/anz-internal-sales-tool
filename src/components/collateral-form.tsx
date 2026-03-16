import type { ReactNode } from "react";

import {
  emptyCollateralForm,
  filterOptions,
  getCompetitorFaviconUrl,
  type CollateralFormErrors,
  type CollateralFormValues,
} from "@/lib/collateral-data";

type CollateralFormProps = {
  mode: "add" | "edit";
  values: CollateralFormValues;
  errors: CollateralFormErrors;
  onChange: (values: CollateralFormValues) => void;
  onSubmit: () => void;
  onCancel?: () => void;
};

type MultiSelectFieldProps = {
  label: string;
  value: string[];
  options: string[];
  error?: string;
  onChange: (nextValue: string[]) => void;
  className?: string;
  gridClassName?: string;
  allOption?: string;
  renderOption?: (option: string) => ReactNode;
};

function CompetitorOption({ option }: { option: string }) {
  const faviconUrl = getCompetitorFaviconUrl(option);

  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {faviconUrl ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 rounded-[4px] border border-border/60 bg-white bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${faviconUrl})` }}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-border/60 bg-surface-strong text-[10px] text-muted"
        >
          -
        </span>
      )}
      <span className="truncate">{option}</span>
    </span>
  );
}

function MultiSelectField({ label, value, options, error, onChange, className, gridClassName, allOption, renderOption }: MultiSelectFieldProps) {
  function handleChange(option: string, checked: boolean) {
    const baseOptions = allOption ? options.filter((item) => item !== allOption) : options;
    let nextValue: string[];

    if (allOption && option === allOption) {
      nextValue = checked ? [allOption, ...baseOptions] : [];
      onChange(nextValue);
      return;
    }

    if (checked) {
      const selectedValues = Array.from(new Set([...value.filter((item) => item !== allOption), option]));
      nextValue = allOption && baseOptions.every((item) => selectedValues.includes(item)) ? [allOption, ...baseOptions] : selectedValues;
    } else {
      nextValue = value.filter((item) => item !== option && item !== allOption);
    }

    onChange(nextValue);
  }

  return (
    <div className={className}>
      <p className="block text-sm font-medium text-foreground">{label}</p>
      <div className={`mt-2 rounded-xl border bg-surface-soft p-2.5 ${error ? "border-danger" : "border-border"}`}>
        <div className={gridClassName ?? "grid gap-2 sm:grid-cols-2"}>
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={allOption && option === allOption ? options.filter((item) => item !== allOption).every((item) => value.includes(item)) : value.includes(option)}
                onChange={(event) => handleChange(option, event.target.checked)}
                className="h-4 w-4 rounded border-border bg-surface-soft text-accent focus:ring-accent"
              />
              {renderOption ? renderOption(option) : <span>{option}</span>}
            </label>
          ))}
        </div>
      </div>
      {error ? <span className="mt-2 block text-xs text-danger">{error}</span> : null}
    </div>
  );
}

export function CollateralForm({ mode, values, errors, onChange, onSubmit, onCancel }: CollateralFormProps) {
  function updateField<K extends keyof CollateralFormValues>(field: K, value: CollateralFormValues[K]) {
    onChange({ ...values, [field]: value });
  }

  return (
    <div className="space-y-4 rounded-[26px] border border-border bg-surface-strong p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="title-font text-xl font-semibold text-foreground">
            {mode === "add" ? "Add New Collateral" : "Edit Collateral"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Manage mock collateral records with a single shared form.
          </p>
        </div>
        {mode === "edit" ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border bg-surface-soft px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 xl:grid-cols-20">
        <label className="block text-sm font-medium text-foreground xl:col-span-6">
          Asset name
          <input
            value={values.assetName}
            onChange={(event) => updateField("assetName", event.target.value)}
            className={`mt-2 w-full rounded-xl border bg-surface-soft px-4 py-3 text-foreground outline-none transition focus:border-accent ${
              errors.assetName ? "border-danger" : "border-border"
            }`}
            placeholder="Security review response pack"
          />
          {errors.assetName ? <span className="mt-2 block text-xs text-danger">{errors.assetName}</span> : null}
        </label>

        <label className="block text-sm font-medium text-foreground xl:col-span-7">
          Link
          <input
            value={values.link}
            onChange={(event) => updateField("link", event.target.value)}
            className={`mt-2 w-full rounded-xl border bg-surface-soft px-4 py-3 text-foreground outline-none transition focus:border-accent ${
              errors.link ? "border-danger" : "border-border"
            }`}
            placeholder="https://example.com/asset"
          />
          {errors.link ? <span className="mt-2 block text-xs text-danger">{errors.link}</span> : null}
        </label>

        <label className="block text-sm font-medium text-foreground sm:col-span-1 xl:col-span-3">
          Asset type
          <div className="relative mt-2">
            <select
              value={values.assetType}
              onChange={(event) => updateField("assetType", event.target.value)}
              className={`app-select w-full rounded-xl border bg-surface-soft px-4 py-3 pr-10 outline-none transition focus:border-accent ${
                errors.assetType ? "border-danger" : "border-border"
              }`}
            >
              {filterOptions.assetTypes.map((option) => (
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
          {errors.assetType ? <span className="mt-2 block text-xs text-danger">{errors.assetType}</span> : null}
        </label>

        <label className="block text-sm font-medium text-foreground sm:col-span-1 xl:col-span-4">
          Intent
          <div className="relative mt-2">
            <select
              value={values.intent}
              onChange={(event) => updateField("intent", event.target.value)}
              className="app-select w-full rounded-xl border border-border bg-surface-soft px-4 py-3 pr-10 outline-none transition focus:border-accent"
            >
              {filterOptions.intents.map((option) => (
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

      </div>

      <div className="grid gap-3 xl:grid-cols-20 xl:items-start">
        <MultiSelectField
          className="xl:col-span-4"
          label="Stages"
          value={values.stages}
          options={filterOptions.stages}
          error={errors.stages}
          onChange={(nextValue) => updateField("stages", nextValue)}
          gridClassName="grid gap-1.5 sm:grid-cols-2"
        />
        <MultiSelectField
          className="xl:col-span-3"
          label="Segments"
          value={values.segments}
          options={filterOptions.segments}
          onChange={(nextValue) => updateField("segments", nextValue)}
          gridClassName="grid gap-1.5 sm:grid-cols-1 xl:grid-cols-1"
          allOption="All"
        />
        <MultiSelectField
          className="xl:col-span-5"
          label="Industries"
          value={values.industries}
          options={filterOptions.industries}
          onChange={(nextValue) => updateField("industries", nextValue)}
          gridClassName="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-2"
        />
        <MultiSelectField
          className="xl:col-span-8"
          label="Situations"
          value={values.situations}
          options={filterOptions.situations}
          error={errors.situations}
          onChange={(nextValue) => updateField("situations", nextValue)}
          gridClassName="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3"
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-20 xl:items-start">
        <MultiSelectField
          className="xl:col-span-8"
          label="Competitors"
          value={values.competitors}
          options={filterOptions.competitors}
          onChange={(nextValue) => updateField("competitors", nextValue)}
          gridClassName="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          renderOption={(option) => <CompetitorOption option={option} />}
        />
        <MultiSelectField
          className="xl:col-span-12"
          label="Tags"
          value={values.tags}
          options={filterOptions.tags}
          onChange={(nextValue) => updateField("tags", nextValue)}
          gridClassName="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5"
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-20">
        <label className="block text-sm font-medium text-foreground xl:col-span-10">
          Summary
          <textarea
            value={values.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            rows={5}
            className={`mt-2 w-full rounded-xl border bg-surface-soft px-4 py-3 text-foreground outline-none transition focus:border-accent ${
              errors.summary ? "border-danger" : "border-border"
            }`}
          />
          {errors.summary ? <span className="mt-2 block text-xs text-danger">{errors.summary}</span> : null}
        </label>

        <label className="block text-sm font-medium text-foreground xl:col-span-10">
          Recommended when
          <textarea
            value={values.recommendedWhen}
            onChange={(event) => updateField("recommendedWhen", event.target.value)}
            rows={5}
            className={`mt-2 w-full rounded-xl border bg-surface-soft px-4 py-3 text-foreground outline-none transition focus:border-accent ${
              errors.recommendedWhen ? "border-danger" : "border-border"
            }`}
          />
          {errors.recommendedWhen ? <span className="mt-2 block text-xs text-danger">{errors.recommendedWhen}</span> : null}
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {mode === "edit" ? (
          <button
            type="button"
            onClick={() => onChange(emptyCollateralForm)}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Clear form
          </button>
        ) : null}
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accent-strong"
        >
          {mode === "add" ? "Add collateral" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
