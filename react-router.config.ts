import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // SPA mode for static GitHub Pages deployment
  ssr: false,

  // GitHub Pages serves plain files — there is no rewrite rule to fall back on,
  // so a cold hit on /card (the QR-code / NFC entry point) would 404 unless the
  // path is emitted as its own index.html at build time.
  prerender: ["/", "/card"],
} satisfies Config;
