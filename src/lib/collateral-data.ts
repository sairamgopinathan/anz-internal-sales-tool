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

const assetTypeAliases: Record<string, string> = {
  "AI Comparison": "Detailed comparison sheet",
  Ebooks: "Ebook",
};

const tagAliases: Record<string, string> = {
  "AI Confidence Builder": "🤖 AI Confidence Builder",
  "Price Objection Slayer": "💰 Price Objection Slayer",
  "Competitive Knockout": "🥊 Competitive Knockout",
  "CFO Approved": "📊 CFO Approved",
  "Executive Friendly": "👔 Executive Friendly",
  "Enterprise Proof": "🏢 Enterprise Proof",
  "Customer Story Gold": "🏆 Customer Story Gold",
  "Two-Minute Win": "⚡ Two-Minute Win",
  "Demo Booster": "🎬 Demo Booster",
  "Discovery Helper": "🔎 Discovery Helper",
  "Last-Mile Closer": "🏁 Last-Mile Closer",
  "Budget Saver": "💸 Budget Saver",
  "Buyer Confidence Builder": "🤝 Buyer Confidence Builder",
  "Deal Accelerator": "🚀 Deal Accelerator",
  "Objection Crusher": "🛡️ Objection Crusher",
  "Security Reassurance": "🔐 Security Reassurance",
  "Migration Myth Buster": "🔄 Migration Myth Buster",
  "ROI Heavy Hitter": "📈 ROI Heavy Hitter",
  "Feature Showstopper": "⭐ Feature Showstopper",
  "Sales Rep Favorite": "❤️ Sales Rep Favorite",
  "Trust Builder": "🤝 Trust Builder",
  "Internal use only": "🔒 Internal Use Only",
  "Internal Use Only": "🔒 Internal Use Only",
  "Created with AI": "🧠 Created with AI",
};

export const competitorDomains: Record<string, string | null> = {
  Salesforce: "salesforce.com",
  HubSpot: "hubspot.com",
  Dynamics: "dynamics.microsoft.com",
  GoHighLevel: "gohighlevel.com",
  "Infor CRM": "infor.com",
  InforCRM: "infor.com",
  Kustomer: "kustomer.com",
  Leadsquared: "leadsquared.com",
  Nutshell: "nutshell.com",
  Odoo: "odoo.com",
  Monday: "monday.com",
  "Oracle CRM": "oracle.com",
  "SAP CRM": "sap.com",
  "Simple CRM": "simple-crm.io",
  "Sugar CRM": "sugarcrm.com",
  Apptivo: "apptivo.com",
  "Agile CRM": "agilecrm.com",
  Insightly: "insightly.com",
  Bitrix24: "bitrix24.com",
  Pipeliner: "pipelinersales.com",
  Creatio: "creatio.com",
  Freshsales: "freshworks.com",
  None: null,
};

export function getCompetitorFaviconUrl(name: string) {
  const domain = competitorDomains[name];

  if (!domain) {
    return null;
  }

  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

function normalizeAssetType(value: string) {
  return assetTypeAliases[value] ?? value;
}

function normalizeSituation(value: string) {
  return value === "Demo follow-up" ? "CX asks about a specific feature" : value;
}

function normalizeSituations(values: string[]) {
  return values.map(normalizeSituation);
}

function normalizeTag(value: string) {
  return tagAliases[value] ?? value;
}

function normalizeTags(values: string[]) {
  return values.map(normalizeTag);
}

export const filterOptions = {
  stages: ["Discovery", "Demo", "Evaluation", "Decision"],
  assetTypes: [
    "Deck",
    "One-pager",
    "Ebook",
    "Sales guide",
    "Battlecard",
    "Case study",
    "Detailed comparison sheet",
    "Brief comparison sheet",
    "PDF",
    "Web link",
    "Video",
    "Webinar",
    "Podcast",
    "Screenshots",
    "Brochures",
    "Short brochures",
    "Comics",
    "Pricing doc",
    "ROI calculator",
  ],
  intents: ["Educate", "Compare", "Objection handling", "De-risk", "Close"],
  competitors: [
    "Salesforce",
    "HubSpot",
    "Dynamics",
    "GoHighLevel",
    "Infor CRM",
    "InforCRM",
    "Kustomer",
    "Leadsquared",
    "Nutshell",
    "Odoo",
    "Monday",
    "Oracle CRM",
    "SAP CRM",
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
    "CX asks about a specific feature",
    "Competitor comparison",
    "Pricing objection",
    "CX asks about AI",
    "Partner enablement",
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
    "🤖 AI Confidence Builder",
    "💰 Price Objection Slayer",
    "🥊 Competitive Knockout",
    "📊 CFO Approved",
    "👔 Executive Friendly",
    "🏢 Enterprise Proof",
    "🏆 Customer Story Gold",
    "⚡ Two-Minute Win",
    "🎬 Demo Booster",
    "🔎 Discovery Helper",
    "🏁 Last-Mile Closer",
    "💸 Budget Saver",
    "🤝 Buyer Confidence Builder",
    "🚀 Deal Accelerator",
    "🛡️ Objection Crusher",
    "🔐 Security Reassurance",
    "🔄 Migration Myth Buster",
    "📈 ROI Heavy Hitter",
    "⭐ Feature Showstopper",
    "❤️ Sales Rep Favorite",
    "🤝 Trust Builder",
    "🔒 Internal Use Only",
    "🧠 Created with AI",
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
    assetType: normalizeAssetType(record.assetType),
    stages: record.stages,
    situations: normalizeSituations(record.situations),
    competitors: record.competitors,
    segments: record.segments,
    industries: record.industries,
    tags: normalizeTags(record.tags),
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
    assetType: normalizeAssetType(row.asset_type),
    stages: row.stages ?? [],
    situations: normalizeSituations(row.situations ?? []),
    competitors: row.competitors ?? [],
    segments: row.segments ?? [],
    industries: row.industries ?? [],
    tags: normalizeTags(row.tags ?? []),
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
    asset_type: normalizeAssetType(values.assetType),
    stages: values.stages,
    situations: normalizeSituations(values.situations),
    competitors: values.competitors,
    segments: values.segments,
    industries: values.industries,
    tags: normalizeTags(values.tags),
    intent: values.intent.trim(),
    summary: values.summary.trim(),
    recommended_when: values.recommendedWhen.trim(),
    priority: existingPriority,
  };
}
