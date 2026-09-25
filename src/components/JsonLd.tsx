import { CONTACT_EMAIL } from "@/lib/env";
import { SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * Site-wide structured data: the Organization behind the site and the WebSite itself.
 * Rendered once in the root layout. "<" is escaped so no markup can break out of the script.
 */
export function JsonLd() {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/icon.svg"),
        },
        email: CONTACT_EMAIL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: CONTACT_EMAIL,
          availableLanguage: "en",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: `${SITE_TAGLINE}. A diagnostic for lifters who stopped progressing.`,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
    ],
  };
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
