import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sign up",
  description:
    "Create a free AjoFlow account. Start a target or general savings plan and track every contribution in your passbook.",
  path: "/signup",
  index: false,
});

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
