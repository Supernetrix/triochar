import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type NavItem = {
  label: string;
  href: string;
};

export type DefinitionContent = {
  n: string;
  term: string;
  body: string;
};

export type ProjectTypeContent = {
  label: string;
  note: string;
  image: string;
  href: string;
};

export type ValueContent = {
  title: string;
  text: string;
};

export const defaultHomeContent = {
  title: "Site & Homepage",
  slug: "home",
  nav: [
    { label: "Main", href: "/" },
    { label: "Knowledge", href: "/knowledge" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Supplier", href: "/supplier" },
    { label: "Buyer", href: "/buyer" },
    { label: "Contact Us", href: "/contact" },
  ] satisfies NavItem[],
  hero: {
    eyebrow: "Carbon credits with diligence built in",
    titleStart: "Bankable and",
    titleEmphasis: "Trustworthy",
    titleEnd: "Carbon Credits",
    caption: "Climate Assets Exchange guides you to complete your journey from decarbonization thought to becoming net zero.",
    primaryCtaLabel: "Let us Begin the Conversation",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "View Portfolio",
    secondaryCtaHref: "/portfolio",
  },
  journey: {
    eyebrow: "The Decarbonisation Journey",
    headingStart: "Where do you",
    headingEmphasis: "stand?",
    description: "The path from first thought to net zero — Climate Assets Exchange meets you wherever you are.",
  },
  definitionsIntro: {
    eyebrow: "What we mean",
    heading: "Two words define every project we present.",
  },
  definitions: [
    {
      n: "01",
      term: "Bankable Credit",
      body: "A credit backed by project economics, documentation, registry readiness, and secure delivery logic that can stand up to buyer, financier, and stakeholder scrutiny.",
    },
    {
      n: "02",
      term: "Trustworthy",
      body: "Credits sourced through transparent project relationships, clear baselines, measurable impact, and a preference for durable decarbonisation outcomes.",
    },
  ] satisfies DefinitionContent[],
  projectSection: {
    eyebrow: "What we work on",
    heading: "Field-led carbon projects.",
    description: "Diverse project families — each presented with transparent relationships and credible diligence.",
    ctaLabel: "View Portfolio",
    ctaHref: "/portfolio",
    items: [
      {
        label: "Biochar & Other CDR Projects",
        note: "Durable carbon removal pathways with measurable co-benefits.",
        image: "/images/project-biochar.png",
        href: "/portfolio",
      },
      {
        label: "ARR & Agroforestry",
        note: "Restoration and tree-based systems with clear project boundaries.",
        image: "/images/project-mangrove.png",
        href: "/portfolio",
      },
      {
        label: "Soil Organic Carbon",
        note: "Soil health and land-use change across distributed farmer networks.",
        image: "/images/project-regenerative.png",
        href: "/portfolio",
      },
      {
        label: "Renewable Energy",
        note: "Clean power projects with practical market-readiness signals.",
        image: "/images/project-mangrove.png",
        href: "/portfolio",
      },
      {
        label: "Community Climate Projects",
        note: "Locally grounded climate action shaped around trust and benefit sharing.",
        image: "/images/project-regenerative.png",
        href: "/portfolio",
      },
      {
        label: "Industrial Decarbonisation",
        note: "Process-led reductions and removals for harder-to-abate sectors.",
        image: "/images/project-biochar.png",
        href: "/portfolio",
      },
    ] satisfies ProjectTypeContent[],
  },
  who: {
    eyebrow: "Who are we",
    headingStart: "WHO ARE",
    headingEmphasis: "WE",
    intro: "Climate Assets Exchange is a lean, trustworthy partner built around one outcome — getting your company to a credible net zero.",
    ctaLabel: "Start the Conversation",
    ctaHref: "/contact",
    values: [
      { title: "A lean process", text: "A lean process infrastructure, with a focused pathway from intent to credible credits." },
      { title: "Bankable projects", text: "We bring projects backed by integrity framework, bankability, and security." },
      { title: "Flexible with strategy", text: "Procurement and origination paths shaped around your real climate goals." },
      { title: "Built for net zero", text: "We are here, end to end, to help you reach your decarbonization goal." },
    ] satisfies ValueContent[],
  },
};

export type HomeContent = typeof defaultHomeContent;

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function projectItem(data: Record<string, unknown>, index: number): ProjectTypeContent {
  const fallback = defaultHomeContent.projectSection.items[index - 1];

  return {
    label: asString(data[`projectType${index}Title`], fallback.label),
    note: asString(data[`projectType${index}Note`], fallback.note),
    image: asString(data[`projectType${index}Image`], fallback.image),
    href: asString(data[`projectType${index}Href`], fallback.href),
  };
}

function valueItem(data: Record<string, unknown>, index: number): ValueContent {
  const fallback = defaultHomeContent.who.values[index - 1];

  return {
    title: asString(data[`value${index}Title`], fallback.title),
    text: asString(data[`value${index}Text`], fallback.text),
  };
}

function fromData(data: Record<string, unknown>): HomeContent {
  return {
    ...defaultHomeContent,
    title: asString(data.title, defaultHomeContent.title),
    slug: asString(data.slug, defaultHomeContent.slug),
    nav: [
      { label: asString(data.navMainLabel, defaultHomeContent.nav[0].label), href: "/" },
      { label: asString(data.navKnowledgeLabel, defaultHomeContent.nav[1].label), href: "/knowledge" },
      { label: asString(data.navPortfolioLabel, defaultHomeContent.nav[2].label), href: "/portfolio" },
      { label: asString(data.navSupplierLabel, defaultHomeContent.nav[3].label), href: "/supplier" },
      { label: asString(data.navBuyerLabel, defaultHomeContent.nav[4].label), href: "/buyer" },
      { label: asString(data.navContactLabel, defaultHomeContent.nav[5].label), href: "/contact" },
    ],
    hero: {
      eyebrow: asString(data.heroEyebrow, defaultHomeContent.hero.eyebrow),
      titleStart: asString(data.heroTitleStart, defaultHomeContent.hero.titleStart),
      titleEmphasis: asString(data.heroTitleEmphasis, defaultHomeContent.hero.titleEmphasis),
      titleEnd: asString(data.heroTitleEnd, defaultHomeContent.hero.titleEnd),
      caption: asString(data.heroCaption, defaultHomeContent.hero.caption),
      primaryCtaLabel: asString(data.heroPrimaryCtaLabel, defaultHomeContent.hero.primaryCtaLabel),
      primaryCtaHref: asString(data.heroPrimaryCtaHref, defaultHomeContent.hero.primaryCtaHref),
      secondaryCtaLabel: asString(data.heroSecondaryCtaLabel, defaultHomeContent.hero.secondaryCtaLabel),
      secondaryCtaHref: asString(data.heroSecondaryCtaHref, defaultHomeContent.hero.secondaryCtaHref),
    },
    journey: {
      eyebrow: asString(data.journeyEyebrow, defaultHomeContent.journey.eyebrow),
      headingStart: asString(data.journeyHeadingStart, defaultHomeContent.journey.headingStart),
      headingEmphasis: asString(data.journeyHeadingEmphasis, defaultHomeContent.journey.headingEmphasis),
      description: asString(data.journeyDescription, defaultHomeContent.journey.description),
    },
    definitionsIntro: {
      eyebrow: asString(data.definitionsEyebrow, defaultHomeContent.definitionsIntro.eyebrow),
      heading: asString(data.definitionsHeading, defaultHomeContent.definitionsIntro.heading),
    },
    definitions: [
      {
        n: asString(data.definition1Number, defaultHomeContent.definitions[0].n),
        term: asString(data.definition1Title, defaultHomeContent.definitions[0].term),
        body: asString(data.definition1Body, defaultHomeContent.definitions[0].body),
      },
      {
        n: asString(data.definition2Number, defaultHomeContent.definitions[1].n),
        term: asString(data.definition2Title, defaultHomeContent.definitions[1].term),
        body: asString(data.definition2Body, defaultHomeContent.definitions[1].body),
      },
    ],
    projectSection: {
      eyebrow: asString(data.projectSectionEyebrow, defaultHomeContent.projectSection.eyebrow),
      heading: asString(data.projectSectionHeading, defaultHomeContent.projectSection.heading),
      description: asString(data.projectSectionDescription, defaultHomeContent.projectSection.description),
      ctaLabel: asString(data.projectSectionCtaLabel, defaultHomeContent.projectSection.ctaLabel),
      ctaHref: asString(data.projectSectionCtaHref, defaultHomeContent.projectSection.ctaHref),
      items: [1, 2, 3, 4, 5, 6].map((index) => projectItem(data, index)),
    },
    who: {
      eyebrow: asString(data.whoEyebrow, defaultHomeContent.who.eyebrow),
      headingStart: asString(data.whoHeadingStart, defaultHomeContent.who.headingStart),
      headingEmphasis: asString(data.whoHeadingEmphasis, defaultHomeContent.who.headingEmphasis),
      intro: asString(data.whoIntro, defaultHomeContent.who.intro),
      ctaLabel: asString(data.whoCtaLabel, defaultHomeContent.who.ctaLabel),
      ctaHref: asString(data.whoCtaHref, defaultHomeContent.who.ctaHref),
      values: [1, 2, 3, 4].map((index) => valueItem(data, index)),
    },
  };
}

export async function getHomeContent() {
  try {
    const file = await fs.readFile(path.join(process.cwd(), "content", "site", "home.md"), "utf8");
    const parsed = matter(file);
    return fromData(parsed.data);
  } catch {
    return defaultHomeContent;
  }
}
