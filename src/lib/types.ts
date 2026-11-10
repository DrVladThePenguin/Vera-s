export const INDUSTRIES = [
  "Technology",
  "Fintech",
  "Healthcare",
  "Aviation",
  "Education",
  "E-commerce",
  "Artificial Intelligence",
  "Climate Technology",
  "Consumer Products",
  "Other",
] as const;

export const STAGES = [
  "Bootstrapped",
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
] as const;

export const INVESTOR_TYPES = [
  "Angel",
  "Venture capital",
  "Corporate",
  "Family office",
  "Accelerator",
  "Syndicate",
] as const;

export const EMPLOYEE_BANDS = ["1–10", "11–50", "51–200", "201–500", "500+"] as const;

export const REVENUE_MODELS = [
  "Subscription",
  "Usage-based",
  "Transaction fee",
  "Marketplace",
  "Licensing",
  "Services",
  "Advertising",
  "Hardware",
  "Other",
] as const;

export const GEOGRAPHIES = [
  "North America",
  "United Kingdom",
  "Europe",
  "Asia Pacific",
  "Middle East",
  "Africa",
  "Latin America",
  "Global",
] as const;

export const AVATARS = [
  { id: "blue", bg: "#0066FF", fg: "#FFFFFF" },
  { id: "sky", bg: "#4D94FF", fg: "#FFFFFF" },
  { id: "mist", bg: "#E8F1FF", fg: "#0066FF" },
  { id: "ink", bg: "#171717", fg: "#FFFFFF" },
  { id: "slate", bg: "#737373", fg: "#FFFFFF" },
  { id: "cloud", bg: "#F7F8FA", fg: "#171717" },
] as const;

export type Role = "founder" | "investor";
export type FlowStatus = "draft" | "ready" | "complete";
export type FigureKind = "actual" | "estimate";
export type DocCategory = "pitch" | "financials" | "presentation" | "other";
export type RelationType = "view" | "interested" | "passed" | "connected";

export interface Session {
  role: Role;
  email: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photoDataUrl: string;
  avatarId: string;
  bio: string;
  linkedin: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  size: number;
  category: DocCategory;
}

export interface Screenshot {
  id: string;
  name: string;
  dataUrl: string;
}

export interface FounderDraft {
  status: FlowStatus;
  step: number;
  founder: {
    fullName: string;
    photoDataUrl: string;
    avatarId: string;
    jobTitle: string;
    email: string;
    linkedin: string;
    location: string;
    bio: string;
  };
  company: {
    name: string;
    logoDataUrl: string;
    website: string;
    industry: string;
    location: string;
    foundingYear: string;
    employees: string;
    description: string;
  };
  problem: {
    problem: string;
    audience: string;
    solution: string;
    differentiation: string;
  };
  product: {
    name: string;
    description: string;
    demoUrl: string;
    videoUrl: string;
    screenshots: Screenshot[];
  };
  market: {
    targetMarket: string;
    targetCustomer: string;
    marketSize: string;
    revenueModel: string;
    competitors: string;
    advantage: string;
    notes: string;
  };
  traction: {
    preRevenue: boolean;
    preLaunch: boolean;
    mrr: string;
    mrrKind: FigureKind;
    arr: string;
    arrKind: FigureKind;
    customers: string;
    customersKind: FigureKind;
    users: string;
    usersKind: FigureKind;
    growth: string;
    growthKind: FigureKind;
    retention: string;
    retentionKind: FigureKind;
    other: string;
  };
  fundraising: {
    notFundraising: boolean;
    stage: string;
    previous: string;
    target: string;
    desired: string;
    useOfFunds: string;
    investorTypes: string[];
  };
  team: TeamMember[];
  documents: UploadedDoc[];
}

export interface InvestorDraft {
  status: FlowStatus;
  step: number;
  fullName: string;
  photoDataUrl: string;
  avatarId: string;
  organisation: string;
  jobTitle: string;
  location: string;
  investorType: string;
  industries: string[];
  stages: string[];
  geographies: string[];
  ticketMin: string;
  ticketMax: string;
  history: string;
  bio: string;
  email: string;
}

export interface Interaction {
  id: string;
  startupId: string;
  investorEmail: string;
  investorName: string;
  organisation: string;
  type: RelationType;
  at: string;
}

export interface Note {
  id: string;
  startupId: string;
  investorEmail: string;
  author: Role;
  body: string;
  at: string;
}

export interface Database {
  session: Session | null;
  founders: Record<string, FounderDraft>;
  investors: Record<string, InvestorDraft>;
  actions: Interaction[];
  notes: Note[];
}

export interface PublicStartup {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  industry: string;
  location: string;
  foundingYear: string;
  employees: string;
  description: string;
  founder: {
    name: string;
    title: string;
    photo: string;
    avatarId: string;
    bio: string;
    linkedin: string;
    location: string;
    email: string;
  };
  problem: FounderDraft["problem"];
  product: {
    name: string;
    description: string;
    demoUrl: string;
    videoUrl: string;
    screenshots: Screenshot[];
  };
  market: FounderDraft["market"];
  traction: FounderDraft["traction"];
  fundraising: FounderDraft["fundraising"];
  team: TeamMember[];
  documents: UploadedDoc[];
}

export const FOUNDING_YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, index) =>
  String(2026 - index),
);

export function emptyFounder(email: string): FounderDraft {
  return {
    status: "draft",
    step: 1,
    founder: {
      fullName: "",
      photoDataUrl: "",
      avatarId: "",
      jobTitle: "",
      email,
      linkedin: "",
      location: "",
      bio: "",
    },
    company: {
      name: "",
      logoDataUrl: "",
      website: "",
      industry: "",
      location: "",
      foundingYear: "",
      employees: "",
      description: "",
    },
    problem: { problem: "", audience: "", solution: "", differentiation: "" },
    product: { name: "", description: "", demoUrl: "", videoUrl: "", screenshots: [] },
    market: {
      targetMarket: "",
      targetCustomer: "",
      marketSize: "",
      revenueModel: "",
      competitors: "",
      advantage: "",
      notes: "",
    },
    traction: {
      preRevenue: false,
      preLaunch: false,
      mrr: "",
      mrrKind: "actual",
      arr: "",
      arrKind: "actual",
      customers: "",
      customersKind: "actual",
      users: "",
      usersKind: "actual",
      growth: "",
      growthKind: "actual",
      retention: "",
      retentionKind: "actual",
      other: "",
    },
    fundraising: {
      notFundraising: false,
      stage: "",
      previous: "",
      target: "",
      desired: "",
      useOfFunds: "",
      investorTypes: [],
    },
    team: [],
    documents: [],
  };
}

export function emptyInvestor(email: string): InvestorDraft {
  return {
    status: "draft",
    step: 1,
    fullName: "",
    photoDataUrl: "",
    avatarId: "",
    organisation: "",
    jobTitle: "",
    location: "",
    investorType: "",
    industries: [],
    stages: [],
    geographies: [],
    ticketMin: "",
    ticketMax: "",
    history: "",
    bio: "",
    email,
  };
}

export function founderStartupId(email: string) {
  return `founder:${email}`;
}

export function toPublicStartup(email: string, draft: FounderDraft): PublicStartup {
  return {
    id: founderStartupId(email),
    name: draft.company.name || "Untitled startup",
    logoUrl: draft.company.logoDataUrl,
    website: draft.company.website,
    industry: draft.company.industry,
    location: draft.company.location,
    foundingYear: draft.company.foundingYear,
    employees: draft.company.employees,
    description: draft.company.description,
    founder: {
      name: draft.founder.fullName,
      title: draft.founder.jobTitle,
      photo: draft.founder.photoDataUrl,
      avatarId: draft.founder.avatarId,
      bio: draft.founder.bio,
      linkedin: draft.founder.linkedin,
      location: draft.founder.location,
      email: draft.founder.email,
    },
    problem: draft.problem,
    product: draft.product,
    market: draft.market,
    traction: draft.traction,
    fundraising: draft.fundraising,
    team: draft.team,
    documents: draft.documents,
  };
}
