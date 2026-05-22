export type CmsCollectionName = "portfolio" | "policies" | "blogs" | "vlogs";

export type CmsField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "markdown" | "date" | "boolean" | "tags" | "select" | "image";
  required?: boolean;
  options?: string[];
  hint?: string;
};

export type CmsCollection = {
  name: CmsCollectionName;
  label: string;
  singular: string;
  directory: string;
  publicPath: string;
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
      { label: "Project Type", name: "projectType", type: "text" },
      { label: "Location / Country", name: "location", type: "text" },
      { label: "Carbon Credit Type", name: "carbonCreditType", type: "text" },
      {
        label: "Status",
        name: "status",
        type: "select",
        options: ["Early Origination", "Supplier Screening", "Readiness Review", "Buyer Ready", "Active"],
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
