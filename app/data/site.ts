export const figures = [
  { n: "500,000+", label: "devices running iPrep Digital Class, used by over a million learners" },
  { n: "60,000+", label: "downloads of the iPrep mobile app on Android and iOS" },
  { n: "10,000+", label: "smart TVs and library devices running iPrep Tizen and Digital Library" },
  { n: "40%", label: "cut from a recurring AWS bill by moving to reserved capacity" },
];

type Clip = { src: string; poster: string; label: string };

export type Product = {
  slug: string;
  name: string;
  icon: string;
  hue: string;
  kind: string;
  status: string;
  wip?: boolean;
  tag: string;
  body: string;
  built: string[];
  stack: string;
  links: { label: string; href: string }[];
  promo: Clip;
  /** A phone-shaped recording of the app, or screenshots that cross-fade. */
  demo?: (Clip & { ratio: string }) | { shots: string[]; label: string; ratio: string };
  /** A wide loop shown under the promo. */
  loop?: Clip;
  play?: "prompts" | "trace" | "flex" | "sort";
};

const clip = (name: string, label: string): Clip => ({ src: `/media/${name}.mp4`, poster: `/media/${name}.webp`, label });

export const products: Product[] = [
  {
    slug: "unstill",
    name: "UnStill",
    icon: "/work/unstill.svg",
    hue: "#5ee9c9",
    kind: "AI explainer engine",
    status: "Live",
    tag: "Type a concept. Get a living, narrated explainer.",
    body: "UnStill turns a one-line prompt into an animated 3D explainer with narration and captions. The result is a small scene file played live by a purpose-built three.js engine, so it stays interactive in the browser and still exports to MP4.",
    built: [
      "A scene format that holds the scene graph, timeline and narrative in one file",
      "A generation pipeline that validates, lints and auto-repairs what the model writes before anyone sees it",
      "MP4 export through Remotion that reuses the browser engine frame by frame, plus a native Flutter player on OpenGL ES",
      "In progress: an engine rewrite that compiles a scene once and plays it identically on web, phone and render farm",
    ],
    stack: "Next.js · three.js · Remotion · Flutter · Supabase · AWS",
    links: [{ label: "gounstill.com", href: "https://gounstill.com" }],
    promo: clip("unstill-promo", "Launch film"),
    demo: { ...clip("unstill-demo", "A real explainer"), ratio: "9 / 16" },
    play: "prompts",
  },
  {
    slug: "trace",
    name: "Trace",
    icon: "/work/trace.png",
    hue: "#f5b83d",
    kind: "Rhythm game",
    status: "Live on iOS and Android",
    tag: "Every song secretly draws a picture.",
    body: "Tap on the beat at each corner and hold through each curve. When the song ends, the camera pulls back to show what you drew. 60 levels, each with its own original song.",
    built: [
      "A level generator that splits a picture into regions, turns every border into a line and covers them all in one route",
      "A beat-grid finder that snaps every tap and hold to the strongest nearby hit in the track",
      "A game clock locked to the music, with a sync slider so it lands on the beat on any phone",
      "Songs served as content-hashed files and prefetched, so the next level is ready before this one ends",
    ],
    stack: "Flutter · Flame · SoLoud · Firebase · Python",
    links: [
      { label: "App Store", href: "https://apps.apple.com/us/app/trace-draw-to-the-beat/id6823547074" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.frugalfounder.trace" },
    ],
    promo: clip("trace-promo", "Promo film"),
    demo: { ...clip("trace-demo", "Level 3, recorded"), ratio: "9 / 16" },
    play: "trace",
  },
  {
    slug: "flutter-wizard",
    name: "Flutter Wizard",
    icon: "/work/flutter-wizard.png",
    hue: "#4fc3f7",
    kind: "Learning app",
    status: "Live on iOS and Android",
    tag: "Learn Flutter by watching it move.",
    body: "A free Flutter course where the animation carries the lesson. 167 lessons in 20 tracks, 20 real apps rebuilt screen by screen, and live examples that are real widgets running in a phone frame beside their source.",
    built: [
      "A data-driven motion engine. Lesson visuals are JSON scenes, with no hand-coded painter per lesson",
      "A prerequisite graph of 161 concepts that unlocks each lesson once you know what it depends on",
      "No content backend. The whole curriculum ships in the app and works in airplane mode",
      "One codebase on iOS, Android, macOS, Windows, Linux and web",
    ],
    stack: "Flutter · BLoC · Hive · Firebase · Cloud Functions",
    links: [
      { label: "App Store", href: "https://apps.apple.com/app/id6811318944" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.frugalfounder.flutterwizard" },
    ],
    promo: clip("fw-promo", "Promo film"),
    demo: { ...clip("fw-demo", "A first lesson"), ratio: "604 / 1214" },
    play: "flex",
  },
  {
    slug: "algoplay",
    name: "Algoplay",
    icon: "/work/algoplay.png",
    hue: "#ff6b3d",
    kind: "Learning app",
    status: "Launching soon",
    wip: true,
    tag: "Data structures and algorithms, taught by showing you.",
    body: "More than 560 problems from a zero-to-hero DSA sheet, each one an animated dry run. The animation pauses before every key step and asks you to predict it.",
    built: [
      "Twelve animation kinds, from arrays and trees to graphs, grids and timelines",
      "Spaced revision on days 7, 14 and 28, arcade drills, and a scrollable feed of dry runs",
      "A narration pipeline built on open text-to-speech models",
      "Runs on the same lesson engine as Flutter Wizard",
    ],
    stack: "Flutter · Firebase · Hive · Python",
    links: [],
    promo: { src: "", poster: "", label: "" },
    demo: {
      shots: ["01-home", "02-predict", "06-sort-sprint", "09-reel"].map((n) => `/media/algoplay-${n}.webp`),
      label: "Screens from the build",
      ratio: "1170 / 2532",
    },
    play: "sort",
  },
  {
    slug: "frugaleditor",
    name: "FrugalEditor",
    icon: "/work/frugaleditor.png",
    hue: "#e8452c",
    kind: "Video editor",
    status: "In development",
    wip: true,
    tag: "Brand videos, made on the phone that posts them.",
    body: "A motion-design editor for marketers, founders and small businesses on iOS, Android, macOS and Windows. Type a few lines, drop in a logo and export an MP4 without leaving the device.",
    built: [
      "An animation engine where every frame is a pure function of time, so scrub, preview and export match pixel for pixel",
      "An AI director that runs on your own model key. The model writes the words; the library does the motion",
      "On-device logo vectorisation and native MP4 export in Swift and Kotlin",
      "573 templates across 17 trades so far",
    ],
    stack: "Flutter · Swift · Kotlin · Firebase",
    links: [],
    promo: clip("mb-promo", "Product film"),
    loop: clip("mb-demo", "Templates rendered by the app's own engine"),
  },
];

export const bench = [
  {
    name: "Frugal Billing POS",
    note: "Running in a live shop",
    body: "A networked point of sale for retail: per-unit barcodes, 80mm thermal receipts, live sync across terminals and a Pine Labs card adapter. Built for a family shop, where it has run daily for over four months.",
  },
  {
    name: "ExamForge",
    note: "Exam-prep engine",
    body: "One offline-first codebase that turns a question bank into an exam app, with spaced repetition, mock exams and a readiness score. The first app is Ham Radio Prep: Technician.",
  },
  {
    name: "Flutter Wizard AI",
    note: "Prototype",
    body: "A local Flutter app builder. The model only selects and configures reviewed feature packs and never writes free-form code, so the output is code you can read and own.",
  },
  {
    name: "Learnerbite",
    note: "In build",
    body: "A learning platform organised around a concept graph, with interactive UnStill scenes as lessons. Astro and Svelte in front of a Hono API on PostgreSQL.",
  },
];

export const studio = {
  name: "Frugal Founder",
  url: "https://www.frugalfounder.in",
  email: "vd@frugalfounder.in",
  tagline: ["Build robust tech.", "Don't burn the runway."],
  body: "Frugal Founder is my product studio for founders and enterprises who want senior engineering without a full-time salary line. I lead the technology myself, from the first architecture sketch to the release that goes to the stores.",
  services: [
    {
      name: "Fractional CTO",
      body: "A senior technical lead for your company without the full-time hire. Architecture, hiring, vendor calls and release discipline.",
    },
    {
      name: "Product development",
      body: "Web, mobile and backend built end to end, with infrastructure written as code so the bill stays predictable.",
    },
    {
      name: "Launch films",
      body: "Promo films and brand creatives for product launches, built in code and rendered frame by frame.",
      href: "https://brandcreatives.frugalfounder.in",
    },
    {
      name: "AWS Cost Teardown",
      body: "A fixed-price review of your AWS account. You get a report within 24 hours that lists what to change and what each change saves.",
    },
  ],
  clients: [
    {
      name: "Nephrocore Nexus",
      logo: "/work/nephrocore.png",
      kind: "HealthTech · Fractional CTO",
      body: "A kidney-care platform for patients, doctors and clinic staff: appointments, home lab tests, memberships, a doctor app for referrals and settlements, and the admin dashboard behind it.",
      href: "https://nephrocorenexus.com",
    },
    {
      name: "Pocketyards",
      logo: "/work/pocketyards.svg",
      kind: "PropTech",
      body: "A real-estate platform with listings, search and account flows, built as one monorepo with its own design system and shipped to production on AWS.",
      href: "https://pocketyards.com",
    },
    {
      name: "evparkings",
      logo: "/work/evparkings.svg",
      kind: "CleanTech",
      body: "The public site and the landowner lead and survey pipeline for a service that funds, installs and operates EV charging on private land across India.",
      href: "https://evparkings.com",
    },
    {
      name: "Callus+",
      logo: "/work/callus.png",
      kind: "Medical education · In beta",
      body: "A flashcard app for orthopaedics students preparing for DNB and MS exams. iOS and Android apps, the Firebase backend and in-app subscriptions.",
    },
  ],
};

export const cases = [
  {
    name: "RajDigiLibrary",
    img: "/projects/rajdigi.webp",
    href: "https://rajdigilibrary.rajasthan.gov.in/",
    body: "A hybrid edge and cloud library for the Government of Rajasthan. Three frontends in Flutter and Next.js over a dual backend that syncs across the school LAN when the internet is down.",
  },
  {
    name: "iPrep Web",
    img: "/projects/iprep-web.webp",
    href: "https://iprep.in/",
    body: "Built from an empty repository to 5,000+ daily active users, with an LRU caching layer and an adaptive video player written for low-bandwidth connections.",
  },
  {
    name: "iPrep Mobile",
    img: "/projects/iprep-mobile.webp",
    href: "https://play.google.com/store/apps/details?id=org.idreameducation.iprepapp",
    body: "A Flutter app on an event-driven BLoC architecture, with PDF rendering and Apple in-app payments. 60,000+ downloads across Android and iOS.",
  },
];

export const roles = [
  {
    when: "Now",
    title: "Founder",
    org: "Frugal Founder",
    body: "Product studio and fractional CTO practice. I design, build and ship my own products and lead technology for client companies.",
  },
  {
    when: "2023 – Present",
    title: "Manager, Tech and Solutions",
    org: "iDream Education",
    body: "Led iPrep Tizen for smart TVs and the iPrep Digital Library onto 10,000+ devices. Built the video pipeline: FFmpeg compression, MP4 segmentation, AES-256 encryption and Widevine DRM streaming. Designed a content-as-API layer for B2B partners and cut the recurring AWS bill by 40%.",
  },
  {
    when: "2022 – 2023",
    title: "Assistant Manager",
    org: "iDream Education",
    body: "Architected Project RISL for the Rajasthan government. Built iPrep Digital Class for Windows and Linux, now on 500,000+ devices, with a local Node.js server that streams to 50 devices at once inside a classroom.",
  },
  {
    when: "2021 – 2022",
    title: "Senior Software Engineer",
    org: "iDream Education",
    body: "Took the iPrep web app and the iPrep mobile app from first commit to production scale.",
  },
  {
    when: "2022",
    title: "Mobile App Development Trainer",
    org: "TechGyan, IIT Delhi",
    body: "Taught a cohort of 25 students to build mobile apps with Flutter.",
  },
  {
    when: "2020 – 2021",
    title: "Frontend Developer, React Native (intern)",
    org: "Iraitech",
    body: "Built Desi Adda, an event scheduling and e-sports app for Android and iOS, with single sign-on.",
  },
  {
    when: "2018 – 2022",
    title: "B.Tech, Computer Science Engineering",
    org: "Maharaja Agrasen Institute of Technology, Delhi",
    body: "",
  },
];

export const kit = [
  ["Languages", "TypeScript, JavaScript, Dart, Python, C++"],
  ["Web and mobile", "React, Next.js, Astro, SvelteKit, Flutter, Flame, React Native, Node.js, NestJS, Fastify"],
  ["Cloud and data", "AWS, Google Cloud, Terraform, Docker, Kubernetes, GitHub Actions, Jenkins, PostgreSQL, MongoDB, Redis, Elasticsearch, Firebase, Supabase"],
  ["Video and graphics", "FFmpeg, Widevine DRM, HLS, three.js, Remotion, Canvas, GSAP"],
  ["AI", "Generation pipelines with validation and repair, model training, text-to-speech voice pipelines, Claude and OpenAI APIs"],
];
