/**
 * Writes public/varun-dev-sharma.vcf from app/data/profile.ts.
 *
 * The card links to the static .vcf rather than a Blob because iOS Safari
 * opens a served text/vcard file straight into "Add to Contacts", while a
 * Blob download lands in Files and needs extra taps. That means the file on
 * disk has to stay in sync with the module — so it is generated, not hand-kept.
 *
 *   npm run vcard
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { vcard, VCF_FILENAME } from "../app/data/profile.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", VCF_FILENAME);

writeFileSync(out, vcard(), "utf8");
console.log(`wrote ${out}`);
