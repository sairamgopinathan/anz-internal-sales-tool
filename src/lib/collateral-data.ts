export type Theme = "dark" | "light";
export type View = "sales" | "admin";

export type CollateralRecord = {
  id: string | number;
  assetName: string;
  link: string;
  assetType: string;
  stages: string[];
  situations: string[];
  competitors: string[];
  segments: string[];
  industries: string[];
  tags: string[];
  intent: string;
  summary: string;
  recommendedWhen: string;
  priority: number | null;
};

export type FilterState = {
  stage: string;
  situation: string;
  competitor: string;
  segment: string;
  industry: string;
};

export type CollateralFormValues = {
  assetName: string;
  link: string;
  assetType: string;
  stages: string[];
  situations: string[];
  competitors: string[];
  segments: string[];
  industries: string[];
  tags: string[];
  intent: string;
  summary: string;
  recommendedWhen: string;
};

export type CollateralFormErrors = Partial<
  Record<
    | "assetName"
    | "link"
    | "assetType"
    | "stages"
    | "situations"
    | "summary"
    | "recommendedWhen",
    string
  >
>;

export type CollateralEntryRow = {
  id: string | number;
  asset_name: string;
  link: string;
  asset_type: string;
  stages: string[] | null;
  situations: string[] | null;
  competitors: string[] | null;
  segments: string[] | null;
  industries: string[] | null;
  tags: string[] | null;
  intent: string;
  summary: string;
  recommended_when: string;
  priority: number | null;
};

export const filterOptions = {
  stages: ["Discovery", "Demo", "Evaluation", "Decision"],
  assetTypes: [
    "Deck",
    "One-pager",
    "Sales guide",
    "Battlecard",
    "Case study",
    "PDF",
    "Web link",
    "Video",
    "Podcast",
    "Comics",
    "AI Comparison",
    "Pricing doc",
    "ROI calculator",
  ],
  intents: ["Educate", "Compare", "Objection handling", "De-risk", "Close"],
  competitors: [
    "Salesforce",
    "HubSpot",
    "Dynamics",
    "Infor CRM",
    "Leadsquared",
    "Odoo",
    "Monday",
    "Simple CRM",
    "Sugar CRM",
    "Apptivo",
    "Agile CRM",
    "Insightly",
    "Bitrix24",
    "Pipeliner",
    "Creatio",
    "Freshsales",
    "None",
  ],
  segments: ["All", "SMB", "Mid-market", "Enterprise"],
  situations: [
    "First intro call",
    "Product overview needed",
    "Demo follow-up",
    "Competitor comparison",
    "Pricing objection",
    "CX asks about AI",
    "Migration concern",
    "Security concern",
    "Need proof / case study",
  ],
  industries: [
    "Generic",
    "Legal",
    "SaaS",
    "Automotive",
    "Media",
    "Real Estate",
    "Manufacturing",
    "Healthcare",
    "Education",
    "Financial Services",
  ],
  tags: [
    "AI Confidence Builder",
    "Price Objection Slayer",
    "Competitive Knockout",
    "CFO Approved",
    "Executive Friendly",
    "Enterprise Proof",
    "Customer Story Gold",
    "Two-Minute Win",
    "Demo Booster",
    "Discovery Helper",
    "Last-Mile Closer",
    "Budget Saver",
    "Buyer Confidence Builder",
    "Deal Accelerator",
    "Objection Crusher",
    "Security Reassurance",
    "Migration Myth Buster",
    "ROI Heavy Hitter",
    "Feature Showstopper",
    "Sales Rep Favorite",
    "Trust Builder",
  ],
};

export const initialFilters: FilterState = {
  stage: "",
  situation: "",
  competitor: "",
  segment: "",
  industry: "",
};

export const emptyCollateralForm: CollateralFormValues = {
  assetName: "",
  link: "",
  assetType: filterOptions.assetTypes[0],
  stages: [],
  situations: [],
  competitors: [],
  segments: [],
  industries: [],
  tags: [],
  intent: filterOptions.intents[0],
  summary: "",
  recommendedWhen: "",
};

export function recordToFormValues(record: CollateralRecord): CollateralFormValues {
  return {
    assetName: record.assetName,
    link: record.link,
    assetType: record.assetType,
    stages: record.stages,
    situations: record.situations,
    competitors: record.competitors,
    segments: record.segments,
    industries: record.industries,
    tags: record.tags,
    intent: record.intent,
    summary: record.summary,
    recommendedWhen: record.recommendedWhen,
  };
}

export function mapRowToCollateralRecord(row: CollateralEntryRow): CollateralRecord {
  return {
    id: row.id,
    assetName: row.asset_name,
    link: row.link,
    assetType: row.asset_type,
    stages: row.stages ?? [],
    situations: row.situations ?? [],
    competitors: row.competitors ?? [],
    segments: row.segments ?? [],
    industries: row.industries ?? [],
    tags: row.tags ?? [],
    intent: row.intent,
    summary: row.summary,
    recommendedWhen: row.recommended_when,
    priority: row.priority,
  };
}

export function mapFormValuesToRow(
  values: CollateralFormValues,
  existingPriority: number | null = 0,
): Omit<CollateralEntryRow, "id"> {
  return {
    asset_name: values.assetName.trim(),
    link: values.link.trim(),
    asset_type: values.assetType,
    stages: values.stages,
    situations: values.situations,
    competitors: values.competitors,
    segments: values.segments,
    industries: values.industries,
    tags: values.tags,
    intent: values.intent.trim(),
    summary: values.summary.trim(),
    recommended_when: values.recommendedWhen.trim(),
    priority: existingPriority,
  };
}
