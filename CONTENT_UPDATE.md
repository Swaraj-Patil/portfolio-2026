# Portfolio content update: recruiter-focused rewrite

Implementation spec for Claude Code. Rewrite all site copy for co-op recruiters, wire every real
link, and restructure the Work and Index sections. Facts come from my newest résumé and
`content-audit.md` (repo root). Where they disagree, this spec wins. All copy below is final: use
it verbatim.

## 0. Ground rules

- Preserve every mechanic exactly: CRT launch, SP monogram, Work hover hinge (`.doc-bar` stays
  flat; `.doc-clip` rotates from `rotateX(92deg)` to `rotateX(32deg)`; each `.doc` owns its
  perspective), scroll-position active-section detection, glass cursor, `AsciiField`, the 3D
  facets in `src/Facet3D.jsx`, and the thesis ("Trust is the feature." with its glyph styling).
- All CSS stays in the `styles` template string in `src/App.jsx`. No new dependencies. Leave
  `src/index.css` empty. New elements follow existing patterns (add `data-reveal` where their
  siblings have it).
- Copy rules: no em-dashes anywhere in visible copy. Use an en-dash (–) for ranges (dates,
  "3.5–6.6×") and commas, colons, or periods elsewhere. Numbers must match this spec exactly.
- Links: external links get `target="_blank" rel="noopener noreferrer"`. Every link and button
  gets `data-h` so the cursor ring reacts.
- Ask me before (a) copying a résumé PDF into `public/` and (b) running any `gh repo edit`.

## 1. `ME`

```js
const ME = {
  first: "Swaraj", last: "Patil",
  discipline: "Software Engineer",
  availability: "Co-op, Jan–Aug 2027",
  location: "Boston, MA",
  email: "patil.swaraj@northeastern.edu",
  resume: "/Swaraj_Patil_Resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/Swaraj-Patil" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/swaraj1703" },
    { label: "Résumé", href: "/Swaraj_Patil_Resume.pdf" },
  ],
};
```

## 2. Hero (00)

- Top-left: unchanged ("Swaraj" / "Patil").
- Top-right, two lines: `{ME.discipline}` / `{ME.availability}`, i.e. "Software Engineer" /
  "Co-op, Jan–Aug 2027". Remove "An Unusual".
- Tagline (`.hero-bot p`): "Five years building production software, now an MS student at
  Northeastern working on LLM and data systems you can check."
- Scroll cue: unchanged.

## 3. Hello (01)

3.1 `.weare`: keep the three headline lines ("I make AI" / "you can trust" / "in production.").
Replace the paragraph with:
"Now at Northeastern, I build the layer between language models and the people who rely on them:
cited answers, measured accuracy, and clean data."

3.2 `MANIFESTO`:

```js
const MANIFESTO = [
  "Five years shipping software: banking platforms for Fiserv, a startup team I led, and client work for Amgen.",
  "I went back to school to go deep on making AI correct, not just convincing.",
  "Next: an 8-month co-op from January 2027, shipping from day one.",
];
```

3.3 `AIM` block: label "The fit" (was "The aim"); heading "What I bring, and what I'm after."
(was "I build to:").

```jsx
const AIM = [
  { k: "I bring", t: (<>Five years of <em>production</em> habits: ownership, code review, and shipping to real users.</>) },
  { k: "I'm after", t: (<>Hard problems in <em>AI, full-stack, or data</em> systems, close to the people who use them.</>) },
];
```

3.4 `STATS`. First count my merged open-source PRs:
`gh search prs --author Swaraj-Patil --merged --limit 100 --json repository,number`
Let N = the number whose repository name starts with "MSstats". Then write literal values into the
constant (no runtime fetching):
- `["5 yrs", "shipping production software"]`
- if N ≥ 5: `["<N>", "merged PRs to open-source MSstats"]`; otherwise `["2", "research labs at Northeastern"]`
- `["3.84", "MS GPA at Northeastern"]`

3.5 The `<Strip>` after Track Record: `a` = "↓  FROM BANKING PLATFORMS TO RESEARCH LABS",
`b` = "NOW BUILDING AI YOU CAN VERIFY  ↓".

3.6 `FACETS` descriptions (titles unchanged):
- ai: "RAG with enforced citations, LLM evaluation harnesses, and tracing for retrieval pipelines."
- fs: "React and Next.js front-ends on FastAPI, NestJS, and Node back-ends, deployed to AWS and Google Cloud."
- re: "Open-source proteomics software, LLM benchmarks on GPU clusters, and federal healthcare data pipelines."

3.7 `HIGHLIGHTS` (four cards, this order):

```js
const HIGHLIGHTS = [
  { mark: "NU", org: "Vitek Lab", kind: "Open Source", src: "Northeastern",
    body: "Shipping peer-reviewed, tested features to MSstatsShiny, a proteomics platform used by research groups worldwide. Went from zero R and mass spectrometry to merged code in one semester.",
    tags: ["R", "Shiny", "Open source"] },
  { mark: "AI", org: "Master's Project", kind: "LLM Evaluation", src: "Vitek Lab",
    body: "First-author paper in preparation on LLM-inferred data conversion, with a correctness metric benchmarked across local and frontier models.",
    tags: ["Python", "LLM eval", "Slurm / GPU"] },
  { mark: "SC", org: "Supply Chain & Information Management Group", kind: "Data Engineering", src: "D'Amore-McKim",
    body: "Reconciled 5 federal healthcare datasets into a reproducible 47,000-row panel, and rebuilt a variable that prior work had used at face value.",
    tags: ["Python", "pandas", "statsmodels"] },
  { mark: "DB", org: "MongoDB", kind: "Systems", src: "Independent",
    body: "Root-caused a 3.5–6.6× regression in TTL deletions to backward index traversal in the storage engine, and proposed a forward-scan fix.",
    tags: ["Systems", "Performance"] },
];
```

## 4. Approach (02)

4.1 Thesis: do not touch.

4.2 `AP_AIM`:

```jsx
const AP_AIM = [
  { k: "Challenge", t: (<>Most AI fails <em>quietly</em>: confident output, wrong answer, no error.</>) },
  { k: "Goal", t: (<>Systems that <em>show their work</em>, so the people relying on them can check it.</>) },
];
```

4.3 `PRINCIPLE_BARS = ["Cited.", "Measured.", "Shipped."]` (side labels unchanged).

4.4 Culture strip middle text: "FROM RAW DATA TO ANSWERS YOU CAN CHECK".

4.5 `PRINCIPLES` gains a `proof` field. Render it inside `.prin-panel`, directly under `.prin-t`,
as `<p className="prin-proof"><span>In practice</span>{proof}</p>`. Style: margin-top about 28px,
max-width 62ch, font-size clamp(15px,1.3vw,18px), line-height 1.5, color var(--ink). The span is a
block-level mono label (12px, color var(--purple), margin-bottom 8px). The proof swaps with its tab.

```jsx
const PRINCIPLES = [
  { k: "Source-Grounded", t: (<>No source, <em>no answer.</em></>),
    proof: "PolicyLens enforces citations at the prompt and parser layers, so an ungrounded answer fails instead of rendering." },
  { k: "Eval-Driven", t: (<>If I can't measure it, <em>I don't ship it.</em></>),
    proof: "For my Master's Project I built the correctness metric first, then benchmarked four models across three file formats and eight prompts against hand-written ground truth." },
  { k: "Integrity-First", t: (<>Check the data <em>before the model.</em></>),
    proof: "In MSstatsShiny I caught a unit fallback that silently made results 1000× off. In a federal dataset, I caught a variable that didn't measure what its name said." },
  { k: "Production-Ready", t: (<>Built for real users, <em>not the demo.</em></>),
    proof: "I designed MSstatsShiny's move off a single server to AWS ECS Fargate behind a load balancer, with CDK and CI/CD, sized for 50 concurrent users." },
];
```

4.6 `CAPABILITIES` (three columns):

```js
const CAPABILITIES = [
  { g: "AI / LLM", items: ["LLM APIs: Claude, Gemini, Groq, Ollama", "Retrieval-Augmented Generation", "LLM Evaluation & Benchmarking", "Prompt Engineering", "Embeddings & Vector Search", "LLM Observability", "Document Parsing & Extraction", "Agentic Coding: Claude Code"] },
  { g: "Software", items: ["Python", "TypeScript & JavaScript", "React & Next.js", "Node.js & NestJS", "FastAPI", "REST & GraphQL", "Redux", "Java, SQL, R"] },
  { g: "Data & Cloud", items: ["PostgreSQL, MongoDB, Redis", "ChromaDB", "AWS: ECS Fargate, ALB, CDK, CodePipeline", "Google Cloud", "Docker & CI/CD", "pandas & statsmodels", "HPC: Slurm, GPU nodes", "Git & Code Review"] },
];
```

## 5. Work (03)

5.1 New `PROJECTS` shape: `{ key, title, cat, line, stack, stat, status?, note?, links: [{ label, href }] }`.
Six projects, in this order:

```js
const PROJECTS = [
  { key: "policylens", title: "PolicyLens", cat: "RAG Application",
    line: "Cited Q&A over Northeastern, BU, and Harvard faculty handbooks. An ungrounded answer fails instead of rendering.",
    stack: "React, FastAPI, ChromaDB, Docker", stat: "Every claim cited",
    links: [
      { label: "Live", href: "https://policylens-black.vercel.app/" },
      { label: "Video", href: "https://youtu.be/L08XwNNI8zs" },
      { label: "Code", href: "https://github.com/Swaraj-Patil/PolicyLens" },
    ] },
  { key: "mscllm", title: "MSstatsConvertLLM", cat: "LLM Evaluation",
    line: "An LLM infers how to map lab data files into a standard schema. I built the metric and benchmark that test when it's right.",
    stack: "Python, R, Ollama, Slurm GPU cluster", stat: "4 models, 3 formats, 8 prompts",
    note: "Paper in preparation", links: [] },
  { key: "retrace", title: "Retrace", cat: "LLM Observability", status: "Pre-alpha",
    line: "Self-hostable tracing for RAG apps, built to show what retrieval returned: chunks, scores, and whether the answer stayed grounded.",
    stack: "FastAPI, ClickHouse, PostgreSQL, Next.js", stat: "Retrieval, traced",
    links: [{ label: "Code", href: "https://github.com/Swaraj-Patil/retrace" }] },
  { key: "msstats", title: "MSstatsShiny", cat: "Open Source",
    line: "Peer-reviewed features for a proteomics platform used by research groups worldwide, including a five-PR arc that added metabolomics support.",
    stack: "R, Shiny, Bioconductor", stat: "5-PR feature arc",
    links: [
      { label: "Site", href: "https://msstats.org/msstatsshiny/" },
      { label: "PRs", href: "https://github.com/Vitek-Lab/MSstatsShiny/pulls?q=is%3Apr+author%3ASwaraj-Patil" },
    ] },
  { key: "mongo", title: "MongoDB TTL", cat: "Systems Research",
    line: "Traced a 3.5–6.6× TTL deletion slowdown through the query planner into the storage engine, and proposed a forward-scan fix.",
    stack: "MongoDB internals, cursor-level instrumentation", stat: "3.5–6.6×, root-caused",
    links: [{ label: "Report", href: "https://docs.google.com/document/d/1XBmWJ42q9-u04TiIN-oxP5gkxYSVcTlcN0pD1SWEpkY/edit?usp=sharing" }] },
  { key: "trial", title: "TrialCompanion AI", cat: "LLM Application",
    line: "Turns 50-page clinical-trial protocols into patient-friendly summaries behind a coordinator review gate. MIT Frontier Hackathon, team of three.",
    stack: "Gemini, FastAPI, React, Cloud Run", stat: "50+ pages, plain language",
    links: [
      { label: "Video", href: "https://youtu.be/e0fk5fH48WY" },
      { label: "Code", href: "https://github.com/Swaraj-Patil/TrialCompanion" },
    ] },
];
```

Link checks before wiring: if https://msstats.org/msstatsshiny/ does not return 200, use
https://msstatsshiny.com/app/MSstatsShiny instead. Confirm the MSstatsShiny repo owner with
`gh repo view Vitek-Lab/MSstatsShiny`. If it lives under another owner, fix the PRs URL; if you
can't find it, drop that link.

5.2 Card layout (`.doc-bar`). The bar stays flat.
- Left column: `.doc-name` (title) with a new `.doc-line` (the `line`) beneath it: Geist,
  clamp(14px,1.1vw,16px), line-height 1.45, color rgba(236,231,223,.62), margin-top 10px,
  max-width 56ch, at most two lines on desktop. Widen this column (e.g. `1.7fr auto 1fr`).
- Center: `.doc-cat` (unchanged style). If `status` is set, add a small `.doc-status` pill after it
  (mono 11px, 1px border rgba(236,231,223,.35), radius 999px, padding 3px 9px).
- Right: `.doc-links`, a right-aligned, wrapping row of pill links: label plus `ArrowUpRight`
  (14px), mono 12px uppercase, 1px border rgba(236,231,223,.28), radius 999px, padding 8px 14px.
  Hover inverts to a cream background with ink text. External links open in a new tab. If `links`
  is empty, show `note` in the same pill shape, muted and non-interactive.
- The `<article>` stays an article (no wrapping anchor, since it now contains links). Remove the
  old `.doc-tag` usage.
- Mobile (max-width 880px): stack name, line, category, then links, all left-aligned.

5.3 Hover preview (`.pv`): replace the initials in `.pv-num` with `stat` as the display text, set
top-left, weight 800, clamp(30px,4.4vw,60px), letter-spacing -.03em, line-height .95, color
rgba(255,255,255,.92), wrapping to two lines at most. `.pv-tag` shows `stack`. The hinge animation
is untouched.

5.4 Gradients: keep `.pv--policylens`, `.pv--msstats`, `.pv--mongo`, `.pv--trial`. Add:

```css
.pv--mscllm{background:linear-gradient(120deg,#4c0519,#be123c 55%,#fda4af)}
.pv--retrace{background:linear-gradient(120deg,#0f172a,#1d4ed8 55%,#7dd3fc)}
```

Delete `.pv--license` and `.pv--amazone`.

5.5 Removed from Work: License Service (moves to the Index archive) and Amazone (its live demo
returns HTTP 500).

## 6. About (04)

- Heading (`.paren`): `A software engineer who makes complex systems <em>legible</em>.` Remove the
  "(A)I" paren spans.
- Lead: "Five years of software engineering, from React interfaces for Fiserv's banking platforms to
  Technical Lead at a startup, owning architecture, hiring, and client communication. In 2026 I
  started an MS at Northeastern to go deep on AI correctness, and I now research in two labs. Next:
  an 8-month co-op from January 2027, then full-time from January 2028."
- `EDUCATION` (the undergraduate CGPA is intentionally dropped, matching my résumé):

```js
const EDUCATION = [
  { school: "Northeastern University", deg: "M.S. in Computer and Information Science", when: "Jan 2026 – Dec 2027", note: "Khoury College, GPA 3.84 / 4.0" },
  { school: "VES Institute of Technology", deg: "Bachelor of Engineering", when: "2017 – 2021", note: "Mumbai" },
];
```

## 7. Experience (05)

- Pill text: "CLICK A ROLE TO EXPAND".
- `EXPERIENCE`, in this order (the first stays open by default):

```js
const EXPERIENCE = [
  { role: "Research Assistant", org: "Northeastern University, Olga Vitek Lab", when: "Jan 2026 – Present",
    points: [
      "Ship peer-reviewed, tested features to MSstatsShiny, an open-source analysis platform used by research groups worldwide, including a five-PR arc that extended it from proteomics to metabolomics.",
      "Caught a silent unit-conversion fallback that made dose-response results 1000× off, and closed it with required fields and input validation.",
      "Designed the AWS deployment replacing a single-instance server: ECS Fargate behind an Application Load Balancer, CDK infrastructure as code, and CodePipeline CI/CD, sized for 50 concurrent users.",
      "Master's Project: an LLM-based converter that infers a JSON schema mapping from a data file's headers and sample rows, with a correctness metric benchmarked across models on Northeastern's GPU cluster.",
      "Co-coordinated May Institute 2026, the lab's annual international computational-proteomics training program.",
    ],
    stack: "R, Shiny, Python, AWS CDK, LLMs" },
  { role: "Research Assistant", org: "Northeastern University, Supply Chain & Information Management Group", when: "Jun 2026 – Present",
    points: [
      "Built a reproducible Python pipeline reconciling 5 federal healthcare datasets into a 47,000-row, 90-column panel.",
      "Proved a stored market-share variable did not measure what its name implied, and rebuilt a county-level users-per-bed measure from a ZIP-to-CBSA crosswalk.",
      "Delivered 15 publication-format tables (OLS, difference-in-differences, mediation analysis) with robustness checks and handover documentation.",
    ],
    stack: "Python, pandas, statsmodels" },
  { role: "Consultant, Full-Stack Developer", org: "KPMG (Client: ZS Associates / Amgen)", when: "Sep 2025 – Dec 2025",
    points: [
      "Led front-end development of a manufacturing operations dashboard for Amgen, tracking safety, quality, delivery, inventory, and productivity metrics for plant decision-makers.",
      "Built a three-tier hierarchical drill-down filter for site-level KPI analysis, turning loosely specified client requirements into shipped features.",
    ],
    stack: "React, FastAPI, PostgreSQL" },
  { role: "Technical Lead", org: "Beelogical Software Solutions", when: "Aug 2023 – Aug 2025",
    points: [
      "Led front-end on IRYS Cloud, a Next.js insurance platform on Google Cloud: owned architecture decisions, hiring, and client communication, and published a reusable component and icon library.",
      "Delivered IncBuddy, a travel booking platform (React, NestJS, PostgreSQL) with bulk XLSX ingestion, dynamic PDF generation, Razorpay payments, Google Maps, Redis caching, and AWS deployment.",
      "Built dynamic forms with real-time validation, plus image-cropping and address-validation utilities.",
    ],
    stack: "React, Next.js, NestJS, PostgreSQL, Redis, AWS, Google Cloud" },
  { role: "Senior Software Engineer", org: "Capgemini Technology Services", when: "Jul 2021 – Aug 2023",
    points: [
      "Built production React interfaces for Fiserv banking platforms, with dynamic data filtering and API integrations across multiple client accounts.",
      "Kept shared state manageable across large UIs with custom hooks, higher-order components, and the Context API.",
    ],
    stack: "React, JavaScript, REST" },
];
```

## 8. Contact (06)

- SecHead unchanged ("Let's talk.").
- New `.avail` paragraph above the mail link: "Open to an 8-month co-op, January to August 2027.
  Based in Boston and open to relocating." Style: clamp(18px,2vw,26px), weight 500, max-width
  40ch, margin-bottom 28px.
- Mail link: `{ME.email}`. The address is longer than the old placeholder, so make it fit from
  375px to 1440px without horizontal scroll: lower the clamp ceiling (around
  clamp(24px,5.2vw,84px)), add `min-width:0` and `overflow-wrap:anywhere` to the text, and keep
  the arrow icon from shrinking.
- Socials: render from `ME.socials` (now real). The Résumé link opens the PDF in a new tab.
- Footer: change "EST" to "ET" (the clock is America/New_York, currently on daylight time).

## 9. Index (07)

- Lead: "Everything else, indexed: what I'm working on right now, and smaller builds that didn't
  make the Work list." Remove the "Placeholder" sentence.
- Replace `INDEX_ITEMS` with two lists, each under a small label in the existing `.col-h` style
  ("Now" and "Archive"), reusing the `.idx` row styling with the meta text right-aligned:

```js
const INDEX_NOW = [
  { t: "Writing a first-author paper from my Master's Project on LLM-based data conversion", m: "Fall 2026" },
  { t: "Building Retrace, open-source observability for RAG pipelines", m: "Pre-alpha" },
  { t: "Co-writing a research paper from the federal healthcare data analysis", m: "Fall 2026" },
  { t: "Taking CS 5800 Algorithms, with a searchable reference I built for it", m: "Fall 2026" },
];
const INDEX_ARCHIVE = [
  { t: "SectorStress: MATLAB stress metrics served through FastAPI to a React dashboard", m: "2026", href: "https://www.youtube.com/watch?v=AZLlDVpRSx4" },
  { t: "Algorithms Cheatsheet: a searchable CS 5800 reference with zero dependencies", m: "2026", href: "https://swaraj-patil.github.io/algorithms-cheatsheet/" },
  { t: "License Service: REST licensing API with tiered plans and multi-account activations", m: "2025", href: "https://wtc-licensing.vercel.app" },
  { t: "SMS Verification: an Android phone turned into an SMS gateway with a dashboard and API", m: "2025", href: "https://sms-verification-ten.vercel.app" },
  { t: "Longitudinal Sensor Dashboard: time-series views of passive sensor data", m: "2025", href: "https://longitudinal-sensor.onrender.com/" },
  { t: "Reporter Dashboard: a feedback dashboard for civic reporting", m: "2025", href: "https://reporter-dashboard2.vercel.app/" },
];
```

  Archive rows are whole-row links (new tab, `data-h`) with an `ArrowUpRight` icon after the year.
- Replace the fake subscribe box with two buttons styled like the old ones: "View résumé" (filled,
  opens `ME.resume` in a new tab) and "Email me" (outlined, `mailto:`).

## 10. Outside the page

10.1 `index.html`: set the meta description, `og:description`, and `twitter:description` to:
"Software engineer with 5 years of experience in full-stack, cloud, and LLM systems. MS student at
Northeastern, seeking an 8-month co-op from January 2027."
Keep the title. In `<noscript>`, add that availability sentence and a link to
`/Swaraj_Patil_Resume.pdf`.

10.2 Résumé PDF (ask me first): list my newest résumé PDFs (see `content-audit.md` section 4) and
ask which one to publish. Remind me it contains my phone number and will be public. Copy my choice
to `public/Swaraj_Patil_Resume.pdf`. Don't modify the original.

10.3 `README.md`: replace the Vite boilerplate with a short project README (under 30 lines): name,
one-line description, live URL https://swarajpatil.vercel.app/, stack (Vite, React,
react-three-fiber), `npm install` and `npm run dev`, and a note that all content and styles live
in `src/App.jsx`.

10.4 GitHub metadata (ask me first):
`gh repo edit Swaraj-Patil/portfolio-2026 --homepage https://swarajpatil.vercel.app --description "Personal portfolio: software engineer building LLM and data systems"`

## 11. Verify, then report

- `npm run build` passes; no console errors or warnings in `npm run dev`.
- Grep `src/` and `index.html` for leftovers and report any hit: `hello@swarajpatil.dev`,
  `href="#"`, `Placeholder`, `4.5 yrs`, `May 2028`, `7.7`, `Amazone`, `EST`, `An Unusual`,
  `(A)I`, and any em-dash inside a rendered string.
- curl every external href now on the page
  (`curl -sL -o /dev/null --max-time 15 -w "%{http_code}"`). None may return 404, 500, or 000.
  LinkedIn's 999 is expected.
- Check at 1440px, 1280px, and 375px: the Contact email fits; Work cards show name, line, and
  links without overlap; the hover hinge behaves exactly as before; links inside cards are
  clickable while the preview is lifted.
- Finish with a short summary: what changed per section, the PR count N you used, which résumé file
  was published, and anything you couldn't do.
