import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://velloe-finora.io";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/settings/security"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
