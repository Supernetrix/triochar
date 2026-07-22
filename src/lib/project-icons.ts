export const PROJECT_ICONS = [
  {
    value: "Biochar Production",
    src: "/project-icons/biochar-production.webp",
  },
  {
    value: "Afforestation",
    src: "/project-icons/afforestation.webp",
  },
  {
    value: "Agroforestry",
    src: "/project-icons/agroforestry.webp",
  },
  {
    value: "Clean Cookstove",
    src: "/project-icons/clean-cookstove.webp",
  },
  {
    value: "Renewable Energy",
    src: "/project-icons/renewable-energy.webp",
  },
  {
    value: "Bioenergy Carbon Capture and Storage",
    src: "/project-icons/bioenergy-carbon-capture-and-storage.webp",
  },
  {
    value: "Direct Air Carbon Capture and Storage",
    src: "/project-icons/direct-air-carbon-capture-and-storage.webp",
  },
  {
    value: "Enhanced Rock Weathering",
    src: "/project-icons/enhanced-rock-weathering.webp",
  },
  {
    value: "Sustainable Agriculture",
    src: "/project-icons/sustainable-agriculture.webp",
  },
] as const;

export const PROJECT_ICON_OPTIONS = PROJECT_ICONS.map((icon) => icon.value);

export function getProjectIcon(iconName?: string) {
  return PROJECT_ICONS.find((icon) => icon.value === iconName);
}
