import { PROJECT_ICON_OPTIONS } from "@/lib/project-icons";

export type CmsCollectionName = "site" | "taxonomy" | "portfolio" | "policies" | "blogs" | "vlogs";

export type CmsField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "markdown" | "date" | "boolean" | "tags" | "select" | "multiselect" | "image";
  required?: boolean;
  options?: string[];
  optionsFrom?: string;
  hint?: string;
  hidden?: boolean;
};

export type CmsCollection = {
  name: CmsCollectionName;
  label: string;
  singular: string;
  directory: string;
  publicPath: string;
  singleton?: boolean;
  singletonFile?: string;
  fields: CmsField[];
};

const sharedFields: CmsField[] = [
  { label: "Title", name: "title", type: "text", required: true },
  { label: "Slug", name: "slug", type: "text", required: true, hint: "URL part, e.g. net-zero-journey" },
  { label: "Summary", name: "summary", type: "textarea", required: true },
  { label: "Publish Date", name: "date", type: "date" },
  { label: "Featured Image", name: "image", type: "image" },
  { label: "Tags", name: "tags", type: "tags" },
  { label: "Featured", name: "featured", type: "boolean" },
  { label: "Draft (hidden until ready)", name: "draft", type: "boolean" },
  { label: "Content Body", name: "body", type: "markdown", required: true },
];

export const CMS_COLLECTIONS: CmsCollection[] = [
  {
    name: "site",
    label: "Site & Homepage",
    singular: "Site Settings",
    directory: "site",
    publicPath: "/",
    singleton: true,
    singletonFile: "home.md",
    fields: [
      { label: "Title", name: "title", type: "text", required: true, hidden: true },
      { label: "Slug", name: "slug", type: "text", required: true, hidden: true },
      { label: "Main Nav Label", name: "navMainLabel", type: "text", required: true },
      { label: "Knowledge Nav Label", name: "navKnowledgeLabel", type: "text", required: true },
      { label: "Portfolio Nav Label", name: "navPortfolioLabel", type: "text", required: true },
      { label: "Supplier Nav Label", name: "navSupplierLabel", type: "text", required: true },
      { label: "Buyer Nav Label", name: "navBuyerLabel", type: "text", required: true },
      { label: "Contact Nav Label", name: "navContactLabel", type: "text", required: true },
      { label: "Hero Eyebrow", name: "heroEyebrow", type: "text", required: true },
      { label: "Hero Title Start", name: "heroTitleStart", type: "text", required: true },
      { label: "Hero Title Emphasis", name: "heroTitleEmphasis", type: "text", required: true },
      { label: "Hero Title End", name: "heroTitleEnd", type: "text", required: true },
      { label: "Hero Caption", name: "heroCaption", type: "textarea", required: true },
      { label: "Hero Primary CTA Label", name: "heroPrimaryCtaLabel", type: "text", required: true },
      { label: "Hero Primary CTA Link", name: "heroPrimaryCtaHref", type: "text", required: true },
      { label: "Hero Secondary CTA Label", name: "heroSecondaryCtaLabel", type: "text", required: true },
      { label: "Hero Secondary CTA Link", name: "heroSecondaryCtaHref", type: "text", required: true },
      { label: "Journey Eyebrow", name: "journeyEyebrow", type: "text", required: true },
      { label: "Journey Heading Start", name: "journeyHeadingStart", type: "text", required: true },
      { label: "Journey Heading Emphasis", name: "journeyHeadingEmphasis", type: "text", required: true },
      { label: "Journey Description", name: "journeyDescription", type: "textarea", required: true },
      { label: "Definition 1 Number", name: "definition1Number", type: "text", required: true },
      { label: "Definition 1 Title", name: "definition1Title", type: "text", required: true },
      { label: "Definition 1 Body", name: "definition1Body", type: "textarea", required: true },
      { label: "Definition 2 Number", name: "definition2Number", type: "text", required: true },
      { label: "Definition 2 Title", name: "definition2Title", type: "text", required: true },
      { label: "Definition 2 Body", name: "definition2Body", type: "textarea", required: true },
      { label: "Definitions Eyebrow", name: "definitionsEyebrow", type: "text", required: true },
      { label: "Definitions Heading", name: "definitionsHeading", type: "text", required: true },
      { label: "Project Section Eyebrow", name: "projectSectionEyebrow", type: "text", required: true },
      { label: "Project Section Heading", name: "projectSectionHeading", type: "text", required: true },
      { label: "Project Section Description", name: "projectSectionDescription", type: "textarea", required: true },
      { label: "Project Section CTA Label", name: "projectSectionCtaLabel", type: "text", required: true },
      { label: "Project Section CTA Link", name: "projectSectionCtaHref", type: "text", required: true },
      { label: "Project Type 1 Title", name: "projectType1Title", type: "text", required: true },
      { label: "Project Type 1 Note", name: "projectType1Note", type: "textarea", required: true },
      { label: "Project Type 1 Image", name: "projectType1Image", type: "image" },
      { label: "Project Type 1 Link", name: "projectType1Href", type: "text" },
      { label: "Project Type 2 Title", name: "projectType2Title", type: "text", required: true },
      { label: "Project Type 2 Note", name: "projectType2Note", type: "textarea", required: true },
      { label: "Project Type 2 Image", name: "projectType2Image", type: "image" },
      { label: "Project Type 2 Link", name: "projectType2Href", type: "text" },
      { label: "Project Type 3 Title", name: "projectType3Title", type: "text", required: true },
      { label: "Project Type 3 Note", name: "projectType3Note", type: "textarea", required: true },
      { label: "Project Type 3 Image", name: "projectType3Image", type: "image" },
      { label: "Project Type 3 Link", name: "projectType3Href", type: "text" },
      { label: "Project Type 4 Title", name: "projectType4Title", type: "text", required: true },
      { label: "Project Type 4 Note", name: "projectType4Note", type: "textarea", required: true },
      { label: "Project Type 4 Image", name: "projectType4Image", type: "image" },
      { label: "Project Type 4 Link", name: "projectType4Href", type: "text" },
      { label: "Project Type 5 Title", name: "projectType5Title", type: "text", required: true },
      { label: "Project Type 5 Note", name: "projectType5Note", type: "textarea", required: true },
      { label: "Project Type 5 Image", name: "projectType5Image", type: "image" },
      { label: "Project Type 5 Link", name: "projectType5Href", type: "text" },
      { label: "Project Type 6 Title", name: "projectType6Title", type: "text", required: true },
      { label: "Project Type 6 Note", name: "projectType6Note", type: "textarea", required: true },
      { label: "Project Type 6 Image", name: "projectType6Image", type: "image" },
      { label: "Project Type 6 Link", name: "projectType6Href", type: "text" },
      { label: "Who We Are Eyebrow", name: "whoEyebrow", type: "text", required: true },
      { label: "Who We Are Heading Start", name: "whoHeadingStart", type: "text", required: true },
      { label: "Who We Are Heading Emphasis", name: "whoHeadingEmphasis", type: "text", required: true },
      { label: "Who We Are Intro", name: "whoIntro", type: "textarea", required: true },
      { label: "Who We Are CTA Label", name: "whoCtaLabel", type: "text", required: true },
      { label: "Who We Are CTA Link", name: "whoCtaHref", type: "text", required: true },
      { label: "Value 1 Title", name: "value1Title", type: "text", required: true },
      { label: "Value 1 Text", name: "value1Text", type: "textarea", required: true },
      { label: "Value 2 Title", name: "value2Title", type: "text", required: true },
      { label: "Value 2 Text", name: "value2Text", type: "textarea", required: true },
      { label: "Value 3 Title", name: "value3Title", type: "text", required: true },
      { label: "Value 3 Text", name: "value3Text", type: "textarea", required: true },
      { label: "Value 4 Title", name: "value4Title", type: "text", required: true },
      { label: "Value 4 Text", name: "value4Text", type: "textarea", required: true },
    ],
  },
  {
    name: "taxonomy",
    label: "Filters & Tags",
    singular: "Filter Options",
    directory: "site",
    publicPath: "/portfolio",
    singleton: true,
    singletonFile: "filters.md",
    fields: [
      { label: "Title", name: "title", type: "text", required: true, hidden: true },
      { label: "Slug", name: "slug", type: "text", required: true, hidden: true },
      {
        label: "Location options (Continents)",
        name: "locationOptions",
        type: "tags",
        hint: "Continents shown in the Location filter, e.g. Africa, Asia, Europe.",
      },
      {
        label: "Eligibility options",
        name: "eligibilityOptions",
        type: "tags",
        hint: "e.g. CORSIA, CCP, Article 6, CRCF.",
      },
      {
        label: "Standard options",
        name: "standardOptions",
        type: "tags",
        hint: "e.g. Isometric, Puro, CSI, Rainbow, Verra, Gold Standard.",
      },
      {
        label: "Type options",
        name: "typeOptions",
        type: "tags",
        hint: "e.g. Biochar, DACCS, BECCS, ARR, NBS, Renewable Energy, Cookstove.",
      },
    ],
  },
  {
    name: "portfolio",
    label: "Portfolio Projects",
    singular: "Project",
    directory: "portfolio",
    publicPath: "/portfolio",
    fields: [
      { label: "Title", name: "title", type: "text", required: true },
      { label: "Slug", name: "slug", type: "text", required: true, hint: "URL part, e.g. biochar-soil-carbon" },
      { label: "Image", name: "image", type: "image" },
      { label: "Basic Info / Short Description", name: "summary", type: "textarea", required: true },
      {
        label: "Project Icon",
        name: "projectIcon",
        type: "select",
        options: [...PROJECT_ICON_OPTIONS],
        required: true,
        hint: "Choose the icon shown in the portfolio table.",
      },
      {
        label: "Type of Project",
        name: "projectType",
        type: "text",
        required: true,
        hint: "Compact table label, e.g. Industrial Biochar or Agroforestry.",
      },
      {
        label: "Project Location",
        name: "location",
        type: "text",
        required: true,
        hint: "Specific country or region shown in the table, e.g. Denmark or South Asia.",
      },
      {
        label: "Permanence / Durability",
        name: "permanence",
        type: "text",
        required: true,
        hint: "Short value shown in the table, e.g. 1,000+ years or Durable storage.",
      },
      {
        label: "Location (Continents)",
        name: "filterLocations",
        type: "multiselect",
        optionsFrom: "locationOptions",
        hint: "Pick one or more continents. Edit the list in Filters & Tags, then Refresh.",
      },
      {
        label: "Eligibility",
        name: "filterEligibility",
        type: "multiselect",
        optionsFrom: "eligibilityOptions",
        hint: "Pick all that apply. Edit the list in Filters & Tags, then Refresh.",
      },
      {
        label: "Standard",
        name: "filterStandards",
        type: "multiselect",
        optionsFrom: "standardOptions",
        hint: "Pick all that apply. Edit the list in Filters & Tags, then Refresh.",
      },
      {
        label: "Type",
        name: "filterTypes",
        type: "multiselect",
        optionsFrom: "typeOptions",
        hint: "Pick all that apply. Edit the list in Filters & Tags, then Refresh.",
      },
      {
        label: "Status",
        name: "status",
        type: "select",
        options: ["Early Origination", "Supplier Screening", "Readiness Review", "Buyer Ready", "Active"],
      },
      {
        label: "Registry ID",
        name: "registryId",
        type: "text",
        hint: "Shown on portfolio cards, e.g. VERRA ID 4448 or Puro ID 23456DC4.",
      },
      { label: "Publish Date", name: "date", type: "date" },
      { label: "Featured Project", name: "featured", type: "boolean" },
      { label: "Draft (hidden until ready)", name: "draft", type: "boolean" },
      { label: "Tags", name: "tags", type: "tags" },
      { label: "Full Description", name: "body", type: "markdown", required: true },
    ],
  },
  {
    name: "policies",
    label: "Policies",
    singular: "Policy",
    directory: "policies",
    publicPath: "/policies",
    fields: [
      { label: "Policy Name", name: "title", type: "text", required: true },
      { label: "Slug", name: "slug", type: "text", required: true },
      { label: "Region / Country", name: "region", type: "text" },
      { label: "Summary", name: "summary", type: "textarea", required: true },
      { label: "Publish Date", name: "date", type: "date" },
      { label: "Featured Image", name: "image", type: "image" },
      { label: "Tags", name: "tags", type: "tags" },
      { label: "Featured", name: "featured", type: "boolean" },
      { label: "Draft (hidden until ready)", name: "draft", type: "boolean" },
      { label: "Content Body", name: "body", type: "markdown", required: true },
    ],
  },
  {
    name: "blogs",
    label: "Blogs",
    singular: "Blog Post",
    directory: "blogs",
    publicPath: "/blogs",
    fields: [
      ...sharedFields.slice(0, 4),
      { label: "Category", name: "category", type: "text" },
      { label: "Featured Image", name: "image", type: "image" },
      { label: "Author", name: "author", type: "text" },
      ...sharedFields.slice(5),
    ],
  },
  {
    name: "vlogs",
    label: "Vlogs",
    singular: "Vlog",
    directory: "vlogs",
    publicPath: "/vlogs",
    fields: [
      ...sharedFields.slice(0, 3),
      { label: "Video URL (YouTube)", name: "videoUrl", type: "text", required: true },
      { label: "Publish Date", name: "date", type: "date" },
      { label: "Category", name: "category", type: "text" },
      { label: "Poster Image", name: "image", type: "image" },
      { label: "Author", name: "author", type: "text" },
      ...sharedFields.slice(5),
    ],
  },
];

export function getCmsCollection(name: string) {
  return CMS_COLLECTIONS.find((collection) => collection.name === name);
}

export function isCmsCollectionName(value: string): value is CmsCollectionName {
  return CMS_COLLECTIONS.some((collection) => collection.name === value);
}
