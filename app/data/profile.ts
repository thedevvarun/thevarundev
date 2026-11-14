/**
 * Single source of truth for the digital visiting card (/card).
 *
 * Everything the card renders — and every field written into the downloadable
 * vCard — comes from here. `public/varun-dev-sharma.vcf` is the static twin of
 * `vcard()` below; if you edit one, edit the other (see the note in that file).
 */

export const profile = {
  firstName: "Varun Dev",
  lastName: "Sharma",
  fullName: "Varun Dev Sharma",
  title: "Founder · Multi-stack Engineer",
  vcardTitle: "Founder",
  location: "New Delhi, India",
  tagline:
    "I build and scale products end to end — from the first line of code to the thing people actually use.",
  phoneDisplay: "+91 87005 06796",
  phoneE164: "+918700506796",
  emailWork: "vd@frugalfounder.in",
  emailPersonal: "varundev1007@gmail.com",
  website: "https://thevarundev.com",
  websiteLabel: "thevarundev.com",
  linkedin: "https://www.linkedin.com/in/thedevvarun/",
  linkedinLabel: "thedevvarun",
  github: "https://github.com/thedevvarun",
  githubLabel: "thedevvarun",
  whatsapp: "https://wa.me/918700506796",
  resume: "/VarunResumev5.pdf",
} as const;

export const company = {
  name: "Frugal Founder",
  domain: "frugalfounder.in",
  url: "https://www.frugalfounder.in",
  tagline: "Build robust tech. Don't burn the runway.",
  description:
    "A technical product studio for pragmatic founders and enterprises — fractional CTO, end-to-end product development, and in-house tool integration.",
  services: ["Fractional CTO", "Product development", "Tool integration"],
} as const;

export const product = {
  name: "Unstill",
  url: "https://gounstill.com",
  domainLabel: "gounstill.com",
  tagline: "Concepts, unstilled.",
  description:
    "Type a concept, get an animated explainer video — real 3D scenes, narration and captions, rendered to MP4. Built by Frugal Founder.",
} as const;

/**
 * vCard 3.0 — deliberately not 4.0. iOS, Android and Outlook all parse 3.0
 * cleanly; 4.0 still trips up older Android contact importers.
 *
 * Per RFC 2426 the line break is CRLF, and commas/semicolons inside a value
 * have to be escaped or the field silently truncates at the separator.
 */
const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1");

export function vcard(): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(profile.lastName)};${esc(profile.firstName)};;;`,
    `FN:${esc(profile.fullName)}`,
    `ORG:${esc(company.name)}`,
    `TITLE:${esc(profile.vcardTitle)}`,
    `TEL;TYPE=CELL,VOICE:${profile.phoneE164}`,
    `EMAIL;TYPE=INTERNET,WORK,PREF:${profile.emailWork}`,
    `EMAIL;TYPE=INTERNET,HOME:${profile.emailPersonal}`,
    `URL:${profile.website}`,
    `URL;TYPE=WORK:${company.url}`,
    `ADR;TYPE=WORK:;;;${esc("New Delhi")};;;${esc("India")}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${profile.github}`,
    // Kept ASCII-only: vCard 3.0 predates a universal charset assumption, and
    // some older importers garble non-ASCII in NOTE rather than reading UTF-8.
    `NOTE:${esc(
      `${company.name} - ${company.tagline} Building ${product.name} (${product.domainLabel}). Card: ${profile.websiteLabel}/card`
    )}`,
    "END:VCARD",
  ];
  return lines.join("\r\n") + "\r\n";
}

/** Filename used for the download on desktop/Android. */
export const VCF_FILENAME = "varun-dev-sharma.vcf";

/** Static copy served by GitHub Pages — the iOS-friendly path (see SaveContact). */
export const VCF_URL = `/${VCF_FILENAME}`;
