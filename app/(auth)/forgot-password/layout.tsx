import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Forgot password",
  description:
    "Reset your Subtech Ajo Solution password. We will send a one-time code to the email on your account.",
  path: "/forgot-password",
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
