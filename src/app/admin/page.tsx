import type { Metadata } from "next";
import { SimpleCms } from "@/components/admin/simple-cms";

export const metadata: Metadata = {
  title: "Triochar CMS",
  description: "Triochar content management dashboard.",
};

export default function AdminPage() {
  return <SimpleCms />;
}
