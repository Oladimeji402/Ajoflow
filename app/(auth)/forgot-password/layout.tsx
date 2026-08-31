import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Forgot password",
  description:
    "Reset your AjoFlow password. We will send a one-time code to the email on your account.",
  path: "/forgot-password",
  index: false,
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
