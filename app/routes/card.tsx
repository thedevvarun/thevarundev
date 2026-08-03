import type { Route } from "./+types/card";
import VisitingCard from "../components/card/VisitingCard";
import { company, product, profile } from "../data/profile";

const title = `${profile.fullName} — ${profile.title}`;
const description = `Digital visiting card for ${profile.fullName}, ${profile.vcardTitle} at ${company.name}, building ${product.name}. Save the contact, call, or message in one tap.`;
const url = `${profile.website}/card`;

export function meta({}: Route.MetaArgs) {
  return [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: "#07070b" },
    { property: "og:type", content: "profile" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function Card() {
  return <VisitingCard />;
}
