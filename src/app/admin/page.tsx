import type { Metadata } from "next";
import { SimpleCms } from "@/components/admin/simple-cms";

export const metadata: Metadata = {
  title: "Climate Assets Exchange CMS",
  description: "Climate Assets Exchange content management dashboard.",
};

export default function AdminPage() {
  return <SimpleCms />;
}
