import type { Metadata } from "next";
import { SimpleCms } from "@/components/admin/simple-cms";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Climate Assets Exchange CMS",
  description: "Climate Assets Exchange content management dashboard.",
  path: "/admin/",
  noIndex: true,
});

export default function AdminPage() {
  return <SimpleCms />;
}
