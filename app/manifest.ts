import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_PRODUCT } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_PRODUCT,
    short_name: SITE_PRODUCT,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#1A35D4",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "128x128",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        sizes: "128x128",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
