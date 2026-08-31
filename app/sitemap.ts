import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const routes = [
    "",
    "/about",
    "/contact",
    "/login",
    "/signup",
    "/forgot-password",
    "/terms",
    "/privacy",
  ];

  return routes.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/signup" || path === "/about" ? 0.8 : 0.6,
  }));
}
