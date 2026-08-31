import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site";

export type Crumb = {
  name: string;
  href?: string;
};

export function Breadcrumbs({
  items,
  light = false,
}: {
  items: Crumb[];
  light?: boolean;
}) {
  const siteUrl = getSiteUrl();
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...items];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
          })),
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-[13px]">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            const color = light
              ? isLast
                ? "text-white"
                : "text-white/60 hover:text-white"
              : isLast
                ? "text-brand-navy"
                : "text-slate-500 hover:text-brand-navy";

            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight
                    size={14}
                    className={light ? "text-white/35" : "text-slate-300"}
                    aria-hidden
                  />
                )}
                {item.href && !isLast ? (
                  <Link href={item.href} className={`font-medium transition-colors ${color}`}>
                    {item.name}
                  </Link>
                ) : (
                  <span className={`font-semibold ${color}`} aria-current={isLast ? "page" : undefined}>
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
