import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Plus } from "lucide-react";
import Facet3D from "./Facet3D";

/* ════════════════════════════════════════════════════════════════════════
   CONTENT — edit freely. Presentation is in `styles` at the bottom.
   This pass focuses on completing sections 00 (hero) and 01 (Hello).
   Sections 02–07 are scaffolded and will be polished next.
   ════════════════════════════════════════════════════════════════════════ */

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

const SECTIONS = [
  { id: "home", n: "00", label: ME.first, bg: "#ffffff", ink: "#0a0a09" },
  { id: "hello", n: "01", label: "Hello", bg: "#fe3b00", ink: "#ffffff" },
  { id: "approach", n: "02", label: "Approach", bg: "#5a12e8", ink: "#ffffff" },
  { id: "work", n: "03", label: "Work", bg: "#0a0a09", ink: "#ffffff" },
  { id: "about", n: "04", label: "About", bg: "#2433f2", ink: "#ffffff" },
  { id: "experience", n: "05", label: "Experience", bg: "#fb0f3e", ink: "#ffffff" },
  { id: "contact", n: "06", label: "Contact", bg: "#ffee00", ink: "#0a0a09" },
  { id: "index", n: "07", label: "Index", bg: "#12e33c", ink: "#0a0a09" },
];

/* ── 01 HELLO content ── */
const MANIFESTO = [
  "Five years shipping software: banking platforms for Fiserv, a startup team I led, and client work for Amgen.",
  "I went back to school to go deep on making AI correct, not just convincing.",
  "Next: an 8-month co-op from January 2027, shipping from day one.",
];
const AIM = [
  { k: "I bring", t: (<>Five years of <em>production</em> habits: ownership, code review, and shipping to real users.</>) },
  { k: "I'm after", t: (<>Hard problems in <em>AI, full-stack, or data</em> systems, close to the people who use them.</>) },
];
const STATS = [["5 yrs", "shipping production software"], ["2", "research labs at Northeastern"], ["3.84", "MS GPA at Northeastern"]];
const FACETS = [
  { key: "ai", t: "AI Engineering", d: "RAG with enforced citations, LLM evaluation harnesses, and tracing for retrieval pipelines." },
  { key: "fs", t: "Full-Stack", d: "React and Next.js front-ends on FastAPI, NestJS, and Node back-ends, deployed to AWS and Google Cloud." },
  { key: "re", t: "Research", d: "Open-source proteomics software, LLM benchmarks on GPU clusters, and federal healthcare data pipelines." },
];
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

/* ── 02–07 content ── */
const AP_AIM = [
  { k: "Challenge", t: (<>Most AI fails <em>quietly</em>: confident output, wrong answer, no error.</>) },
  { k: "Goal", t: (<>Systems that <em>show their work</em>, so the people relying on them can check it.</>) },
];
const PRINCIPLE_BARS = ["Cited.", "Measured.", "Shipped."];
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
const CAPABILITIES = [
  { g: "AI / LLM", items: ["LLM APIs: Claude, Gemini, Groq, Ollama", "Retrieval-Augmented Generation", "LLM Evaluation & Benchmarking", "Prompt Engineering", "Embeddings & Vector Search", "LLM Observability", "Document Parsing & Extraction", "Agentic Coding: Claude Code"] },
  { g: "Software", items: ["Python", "TypeScript & JavaScript", "React & Next.js", "Node.js & NestJS", "FastAPI", "REST & GraphQL", "Redux", "Java, SQL, R"] },
  { g: "Data & Cloud", items: ["PostgreSQL, MongoDB, Redis", "ChromaDB", "AWS: ECS Fargate, ALB, CDK, CodePipeline", "Google Cloud", "Docker & CI/CD", "pandas & statsmodels", "HPC: Slurm, GPU nodes", "Git & Code Review"] },
];
const PROJECTS = [
  { key: "policylens", title: "PolicyLens", cat: "RAG Application",
    line: "Cited Q&A over Northeastern, BU, and Harvard faculty handbooks. An ungrounded answer fails instead of rendering.",
    stack: "React, FastAPI, ChromaDB, Docker",
    files: {
      front: { src: "/work/policylens-front.jpg", pos: "50% 28%" },
      mid: { src: "/work/policylens-mid.jpg", pos: "50% 50%" },
      back: { src: "/work/policylens-back.jpg", pos: "50% 30%" },
    },
    links: [
      { label: "Live", href: "https://policylens-black.vercel.app/" },
      { label: "Video", href: "https://youtu.be/L08XwNNI8zs" },
      { label: "Code", href: "https://github.com/Swaraj-Patil/PolicyLens" },
    ] },
  { key: "mscllm", title: "MSstatsConvertLLM", cat: "LLM Evaluation",
    line: "An LLM infers how to map lab data files into a standard schema. I built the metric and benchmark that test when it's right.",
    stack: "Python, R, Ollama, Slurm GPU cluster",
    files: {
      front: { src: "/work/mscllm-front.jpg", pos: "50% 50%" },
      mid: { src: "/work/trial-back.jpg", pos: "50% 50%" },
      back: { src: "/work/trial-mid.jpg", pos: "50% 50%" },
    },
    note: "Paper in preparation", links: [] },
  { key: "retrace", title: "Retrace", cat: "LLM Observability", status: "Pre-alpha",
    line: "Self-hostable tracing for RAG apps, built to show what retrieval returned: chunks, scores, and whether the answer stayed grounded.",
    stack: "FastAPI, ClickHouse, PostgreSQL, Next.js",
    files: {
      front: { src: "/work/retrace-front.jpg", pos: "50% 30%" },
      mid: { src: "/work/retrace-mid.jpg", pos: "50% 50%" },
      back: { src: "/work/retrace-back.jpg", pos: "50% 50%" },
    },
    links: [{ label: "Code", href: "https://github.com/Swaraj-Patil/retrace" }] },
  { key: "msstats", title: "MSstatsShiny", cat: "Open Source",
    line: "Peer-reviewed features for a proteomics platform used by research groups worldwide, including a five-PR arc that added metabolomics support.",
    stack: "R, Shiny, Bioconductor",
    files: {
      front: { src: "/work/msstats-front.jpg", pos: "50% 35%" },
      mid: { src: "/work/msstats-mid.jpg", pos: "50% 40%" },
      back: { src: "/work/msstats-back.jpg", pos: "50% 30%" },
    },
    links: [
      { label: "Site", href: "https://msstats.org/msstatsshiny/" },
      { label: "Repo", href: "https://github.com/Vitek-Lab/MSstatsShiny" },
    ] },
  { key: "mongo", title: "MongoDB TTL", cat: "Systems Research",
    line: "Traced a 3.5–6.6× TTL deletion slowdown through the query planner into the storage engine, and proposed a forward-scan fix.",
    stack: "MongoDB internals, cursor-level instrumentation",
    files: {
      front: { src: "/work/mongo-front.jpg", pos: "50% 22%" },
      mid: { src: "/work/policylens-back.jpg", pos: "50% 50%" },
      back: { src: "/work/policylens-mid.jpg", pos: "50% 50%" },
    },
    links: [{ label: "Report", href: "https://docs.google.com/document/d/1XBmWJ42q9-u04TiIN-oxP5gkxYSVcTlcN0pD1SWEpkY/edit?usp=sharing" }] },
  { key: "trial", title: "TrialCompanion AI", cat: "LLM Application",
    line: "Turns 50-page clinical-trial protocols into patient-friendly summaries behind a coordinator review gate. MIT Frontier Hackathon, team of three.",
    stack: "Gemini, FastAPI, React, Cloud Run",
    files: {
      front: { src: "/work/trial-front.jpg", pos: "50% 50%" },
      mid: { src: "/work/trial-mid.jpg", pos: "50% 30%" },
      back: { src: "/work/trial-back.jpg", pos: "50% 50%" },
    },
    links: [
      { label: "Video", href: "https://youtu.be/e0fk5fH48WY" },
      { label: "Code", href: "https://github.com/Swaraj-Patil/TrialCompanion" },
    ] },
];
const EDUCATION = [
  { school: "Northeastern University", deg: "M.S. in Computer and Information Science", when: "Jan 2026 – Dec 2027", note: "Khoury College, GPA 3.84 / 4.0" },
  { school: "VES Institute of Technology", deg: "Bachelor of Engineering", when: "2017 – 2021", note: "Mumbai" },
];
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

/* ── 00 hero monogram: symbols that trace the "S" then fuse into it. Coords are in the SVG
   viewBox (0 0 600 340): (tx,ty) = resting spot ON the S outline, (sx,sy) = scattered start
   offset, r/s = start tumble + scale, d = stagger (ordered top->bottom so they draw, then get
   absorbed, in order). */
const S_TOKENS = [
  { t: "</>",    tx: 185, ty: 72,  sx: 140,  sy: -90,  r: 25,  s: .6,   d: 0,   ac: true },
  { t: "import", tx: 150, ty: 62,  sx: 40,   sy: -150, r: -18, s: .7,   d: .05 },
  { t: "{ }",    tx: 112, ty: 66,  sx: -120, sy: -110, r: 30,  s: 1.3,  d: .1 },
  { t: "def",    tx: 92,  ty: 92,  sx: -160, sy: -40,  r: -22, s: .8,   d: .16 },
  { t: "===",    tx: 98,  ty: 118, sx: -150, sy: 30,   r: 15,  s: .55,  d: .22 },
  { t: "&&",     tx: 125, ty: 140, sx: -90,  sy: 90,   r: -28, s: 1.2,  d: .28 },
  { t: "#",      tx: 150, ty: 158, sx: 0,    sy: 120,  r: 20,  s: .7,   d: .33 },
  { t: "py",     tx: 175, ty: 178, sx: 110,  sy: 90,   r: -15, s: .9,   d: .38 },
  { t: ";",      tx: 192, ty: 200, sx: 160,  sy: 30,   r: 28,  s: 1.35, d: .44 },
  { t: "js",     tx: 182, ty: 228, sx: 150,  sy: 70,   r: -20, s: .6,   d: .5 },
  { t: "ts",     tx: 148, ty: 246, sx: 30,   sy: 140,  r: 18,  s: .8,   d: .56 },
  { t: "()=>{}", tx: 108, ty: 248, sx: -110, sy: 120,  r: -25, s: .7,   d: .62 },
  { t: "/* */",  tx: 78,  ty: 230, sx: -150, sy: 60,   r: 22,  s: .9,   d: .68 },
];

/* Radial refraction map for the glass cursor — a per-pixel normal map: neutral (128,128) through the
   clear centre, ramping to full deflection at the rim, so the ring bends the text behind it only at
   its edges and leaves the centre (under the dot) undistorted. Built once via canvas → PNG data-URI,
   no deps. Drives backdrop-filter:url(#curGlass) (Chromium only; other engines keep the plain rim).
   TUNABLES: CLEAR = size of the undistorted centre (0..1); flip the lens (barrel↔pincushion) by
   negating `scale` on #curGlass below. */
const GLASS_MAP = (() => {
  if (typeof document === "undefined") return "";
  const SIZE = 96, R = SIZE / 2, CLEAR = .52;
  const cv = document.createElement("canvas"); cv.width = cv.height = SIZE;
  const ctx = cv.getContext("2d"), img = ctx.createImageData(SIZE, SIZE);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const dx = (x - R + .5) / R, dy = (y - R + .5) / R, dist = Math.min(1, Math.hypot(dx, dy));
    const edge = dist <= CLEAR ? 0 : (dist - CLEAR) / (1 - CLEAR), k = edge * edge;
    const ux = dist ? dx / dist : 0, uy = dist ? dy / dist : 0, i = (y * SIZE + x) * 4;
    img.data[i] = 128 + ux * k * 127;
    img.data[i + 1] = 128 + uy * k * 127;
    img.data[i + 2] = 128; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return cv.toDataURL();
})();

/* ════════════════════════════════════════════════════════════════════════ */

export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [prog, setProg] = useState(0);
  const [prin, setPrin] = useState(0);
  const [open, setOpen] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/New_York" });
    const t = () => setTime(fmt.format(new Date())); t();
    const id = setInterval(t, 15000); return () => clearInterval(id);
  }, []);

  // active section + section-scroll progress (scroll-driven; robust for very tall sections)
  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const line = innerHeight * 0.3;            // reference line, ~30% down the viewport
        let current = SECTIONS[0].id;
        for (const s of SECTIONS) {                 // last section whose top has crossed the line wins
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top - line <= 0) current = s.id;
        }
        setActive(current);
        const el = document.getElementById(current);
        if (el) {
          const r = el.getBoundingClientRect();
          setProg(Math.min(1, Math.max(0, (0 - r.top) / Math.max(r.height - innerHeight, 1))));
        }
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // custom cursor
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const loop = () => { rx += (mx - rx) * .16; ry += (my - ry) * .16; const t = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; if (ring.current) ring.current.style.transform = t; if (dot.current) dot.current.style.transform = t; raf = requestAnimationFrame(loop); };
    const over = (e) => e.target.closest("[data-h]") && ring.current?.classList.add("g");
    const out = (e) => e.target.closest("[data-h]") && ring.current?.classList.remove("g");
    addEventListener("mousemove", move); document.addEventListener("mouseover", over); document.addEventListener("mouseout", out);
    raf = requestAnimationFrame(loop);
    return () => { removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); cancelAnimationFrame(raf); };
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="app">
      <style>{styles}</style>
      <div ref={dot} className="cur-dot" aria-hidden />
      <div ref={ring} className="cur-ring" aria-hidden />
      <svg className="glass-defs" aria-hidden width="0" height="0">
        <filter id="curGlass" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feImage href={GLASS_MAP} preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" result="gmap" />
          <feDisplacementMap in="SourceGraphic" in2="gmap" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="grain" aria-hidden />

      {/* ── SIDEBAR ──────────────────────────────────── */}
      <aside className="nav">
        {SECTIONS.map((s) => (
          <button key={s.id} data-h className={`tab ${active === s.id ? "active" : ""}`}
            style={{ background: s.bg, color: s.ink }} onClick={() => go(s.id)}>
            <span className="tab-n">{s.n}</span>
            <span className="tab-bar"><span className="tab-thumb" style={{ top: `calc(${prog} * (100% - 8px))` }} /></span>
            <span className="tab-l">{s.label}</span>
          </button>
        ))}
      </aside>

      <main className="screen">

        {/* ── 00 HERO ───────────────────────────────── */}
        <section id="home" className="hero">
          <div className="hero-frame">
            <div className="crt-flash" aria-hidden />
            <header className="hero-top">
              <span>{ME.first}<br />{ME.last}</span>
              <span className="ar">{ME.discipline}<br />{ME.availability}</span>
            </header>

            <div className="mono">
              <svg className="mono-svg" viewBox="0 0 600 340" role="img" aria-label="SP">
                {/* P — fixed stem throws a rope from its top, catches the ring off-right, reels it into the bowl */}
                <rect className="p-stem" x="338" y="54" width="32" height="208" rx="16" />
                <path className="p-rope" d="M354 58 Q354 58 354 58" />
                <circle className="p-ring" cx="402" cy="120" r="50" />
                {/* S — mono tokens arrange along the S outline, then the solid letter sweeps down and absorbs them */}
                {S_TOKENS.map((tk, i) => (
                  <text key={i} className={`s-tok${tk.ac ? " ac" : ""}`} x={tk.tx} y={tk.ty}
                    textAnchor="middle" dominantBaseline="central"
                    style={{ "--sx": `${tk.sx}px`, "--sy": `${tk.sy}px`, "--r": `${tk.r}deg`, "--s": tk.s, animationDelay: `${1.3 + tk.d}s` }}>{tk.t}</text>
                ))}
                {/* solid classic-font letters resolve on top */}
                <defs><clipPath id="sSweep"><rect className="s-sweep" x="38" y="46" width="236" height="226" /></clipPath></defs>
                <text className="ink-letter s-fill" clipPath="url(#sSweep)" x="150" y="262" textAnchor="middle">S</text>
                <text className="ink-letter p-fill" x="330" y="262" textAnchor="start">P</text>
              </svg>
            </div>

            <footer className="hero-bot">
              <p>Five years building production software, now an MS student at Northeastern working on LLM and data systems you can check.</p>
              <button className="cue" data-h onClick={() => go("hello")}>Scroll <ArrowDown size={15} strokeWidth={2} /></button>
            </footer>
          </div>
        </section>

        <Strip a={'You are now entering "Hello" section'} b="01 / 01" />

        {/* ── 01 HELLO (long) ───────────────────────── */}
        <section id="hello" className="hello-group">
          <div className="block b-head">
            <span className="b-n">01</span>
            <h2 className="b-title">Hello</h2>
          </div>

          <div className="block b-cream weare" data-reveal>
            <div className="weare-row weare-top"><span className="weare-line ink">I make AI</span></div>
            <span className="weare-rule" />
            <div className="weare-row weare-mid">
              <p className="weare-desc">Now at Northeastern, I build the layer between language models and the people who rely on them: cited answers, measured accuracy, and clean data.</p>
              <span className="weare-line orange">you can trust</span>
            </div>
            <span className="weare-rule" />
            <div className="weare-row weare-bot"><span className="weare-line orange">in production.</span></div>
            <div className="weare-foot">
              <span className="weare-tag">(Hello)</span>
              <span className="weare-count"><i className="weare-bullet" />01 / 02</span>
            </div>
          </div>

          <div className="block b-orange manifesto">
            {MANIFESTO.map((m, i) => (
              <div className="mani" data-reveal style={{ transitionDelay: `${i * 70}ms` }} key={i}>
                <span className="mani-n">0{i + 1}</span><p>{m}</p>
              </div>
            ))}
          </div>

          <div className="block b-cream aim" data-reveal>
            <div className="aim-head"><span className="aim-label">The fit</span><h3>What I bring, and what I'm after.</h3></div>
            {AIM.map((a, i) => (
              <div className="aim-row" key={i}>
                <span className="aim-pill">{String(i + 1).padStart(2, "0")} · {a.k}</span>
                <p className="aim-t">{a.t}</p>
              </div>
            ))}
          </div>

          <div className="block b-orange wins" data-reveal>
            <AsciiField />
            <span className="wins-ghost" aria-hidden>TRACK RECORD</span>
            <h3 className="wins-h">Track Record</h3>
            <div className="stats">
              {STATS.map(([a, b], i) => (
                <div className="stat" key={i}><span className="stat-a">{a}</span><span className="stat-b">{b}</span></div>
              ))}
            </div>
          </div>

          <Strip a="↓  FROM BANKING PLATFORMS TO RESEARCH LABS" b="NOW BUILDING AI YOU CAN VERIFY  ↓" />

          <div className="block b-cream facets">
            {FACETS.map((f) => (
              <div className="facet" data-reveal data-h key={f.key}>
                <div className={`facet-img facet--${f.key}`}>
                  <span className="facet-grid" aria-hidden />
                  <Facet3D kind={f.key} />
                </div>
                <span className="facet-t">{f.t}</span>
                <p className="facet-d">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="block b-cream hl">
            <span className="hl-label">Highlights</span>
            {HIGHLIGHTS.map((h, i) => (
              <div className="hl-card" data-reveal key={i}>
                <div className="hl-mark">{h.mark}</div>
                <div className="hl-main">
                  <div className="hl-top"><span className="hl-org">{h.org}</span><span className="hl-kind">{h.kind}</span></div>
                  <p className="hl-body">{h.body}</p>
                  <div className="hl-tags">{h.tags.map((t) => <span key={t}>{t}</span>)}</div>
                </div>
                <span className="hl-src">{h.src}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 02 APPROACH (multi-card) ──────────────── */}
        <Strip a={'You are now entering "Approach" section'} b="02 / 01" />
        <section id="approach" className="approach-group">

          <div className="block b-purple ap-head">
            <span className="b-n">02</span>
            <h2 className="b-title">Approach</h2>
          </div>

          {/* thesis (their "Better is different") */}
          <div className="block b-purple thesis" data-reveal>
            <span className="thesis-lead">Trust is the</span>
            <h3 className="thesis-word" aria-label="feature">
              {[
                { c: "f", pre: "{" },
                { c: "e", post: ";" },
                { c: "a", pre: "<", post: ">" },
                { c: "t", sup: "*" },
                { c: "u", pre: "(", post: ")" },
                { c: "r", post: "/" },
                { c: "e", post: "}" },
              ].map((l, i) => (
                <span className="tw" key={i}>
                  {l.pre && <span className="tw-g tw-pre" aria-hidden>{l.pre}</span>}
                  {l.c}
                  {l.sup && <span className="tw-g tw-sup" aria-hidden>{l.sup}</span>}
                  {l.post && <span className="tw-g tw-post" aria-hidden>{l.post}</span>}
                </span>
              ))}
              <span className="tw-caret" aria-hidden />
            </h3>
            <div className="card-foot"><span>( Approach )</span><span>● 02 / 02</span></div>
          </div>

          {/* challenge / goal */}
          <div className="block b-cream cg" data-reveal>
            {AP_AIM.map((a, i) => (
              <div className="cg-row" key={i}>
                <div className="cg-tag"><span className="cg-pill">{String(i + 1).padStart(2, "0")}</span><span className="cg-k">{a.k}</span></div>
                <p className="cg-t">{a.t}</p>
              </div>
            ))}
            <div className="card-foot oc"><span>( Approach )</span><span>● 02 / 03</span></div>
          </div>

          {/* principle bars */}
          <div className="pbars">
            {PRINCIPLE_BARS.map((b, i) => (
              <div className="pbar" data-reveal key={i}>
                <span className="pbar-s">{i % 2 === 0 ? "(AI)" : "(Engineer)"}</span>
                <span className="pbar-t">{b}</span>
                <span className="pbar-s end">{i % 2 === 0 ? "(Engineer)" : "(AI)"}</span>
              </div>
            ))}
          </div>

          {/* culture strip */}
          <div className="cult">
            <span className="arr">↓ ↓ ↓</span>
            <span>FROM RAW DATA TO ANSWERS YOU CAN CHECK</span>
            <span className="arr">↓ ↓ ↓</span>
          </div>

          {/* principle tabs (their "One Team / Creator Led") */}
          <div className="prin">
            <div className="prin-tabs">
              {PRINCIPLES.map((p, i) => (
                <button key={i} data-h className={`prin-tab ${prin === i ? "on" : ""}`} onClick={() => setPrin(i)}>
                  <span>{p.k}</span><span className="prin-num">{String(i + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
            <div className="prin-panel">
              <div>
                <p className="prin-t">{PRINCIPLES[prin].t}</p>
                <p className="prin-proof"><span>In practice</span>{PRINCIPLES[prin].proof}</p>
              </div>
              <div className="card-foot oc"><span>( Approach )</span><span>● 02 / 04</span></div>
            </div>
          </div>

          {/* capabilities header + 3 columns */}
          <div className="cap-head">
            <span className="cap-side">(AI)</span>
            <h3>Capabilities</h3>
            <span className="cap-side">(Engineer)</span>
          </div>
          <div className="cap-cols">
            {CAPABILITIES.map((c, i) => (
              <div className="cap-col" data-reveal key={c.g}>
                <div className="cap-col-h"><h4>{c.g.toUpperCase()}</h4><span className="cap-col-n">{String(i + 1).padStart(2, "0")}</span></div>
                <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── 03 WORK ───────────────────────────────── */}
        <Strip a={'You are now entering "Work" section'} b="03 / 01" />
        <section id="work" className="work-group">
          <div className="block b-ink ap-head">
            <span className="b-n">03</span>
            <h2 className="b-title">Work</h2>
          </div>
          <div className="docs">
            {PROJECTS.map((p) => (
              <article className="doc" data-h key={p.key}>
                <div className="doc-files" aria-hidden="true">
                  {["back", "mid", "front"].map((layer) => (
                    <img key={layer} className={`file ${layer}`} src={p.files[layer].src} alt=""
                         loading="lazy" decoding="async" style={{ objectPosition: p.files[layer].pos }} />
                  ))}
                </div>
                <div className="doc-bar">
                  {p.links[0] && <a className="doc-hit" href={p.links[0].href} target="_blank"
                                    rel="noopener noreferrer" aria-hidden="true" tabIndex={-1} />}
                  <div className="doc-main">
                    <h3 className="doc-name">{p.title}</h3>
                    <p className="doc-line">{p.line}</p>
                  </div>
                  <div className="doc-mid">
                    <span className="doc-cat">{p.cat}</span>
                    <span className="doc-stack">{p.stack}</span>
                    {p.status && <span className="doc-status">{p.status}</span>}
                  </div>
                  <div className="doc-links">
                    {p.links.length > 0
                      ? p.links.map((l) => (
                          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" data-h className="doc-link">
                            {l.label} <ArrowUpRight size={14} strokeWidth={1.6} />
                          </a>
                        ))
                      : <span className="doc-note">{p.note}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Strip a={'You are now entering "About" section'} b="04 / 01" />
        {/* ── 04 ABOUT ──────────────────────────────── */}
        <section id="about" className="sec about">
          <SecHead n="04" t="About" tone="light" />
          <h3 className="paren" data-reveal>A software engineer who makes complex systems <em>legible</em>.</h3>
          <p className="lead lead--blue" data-reveal>
            Five years of software engineering, from React interfaces for Fiserv's banking platforms to Technical Lead at a
            startup, owning architecture, hiring, and client communication. In 2026 I started an MS at Northeastern to go deep
            on AI correctness, and I now research in two labs. Next: an 8-month co-op from January 2027, then full-time from
            January 2028.
          </p>
          <div className="edu" data-reveal>
            <h4 className="col-h light">Education</h4>
            {EDUCATION.map((e, i) => (
              <div className="edu-row" key={i}>
                <span className="edu-when">{e.when}</span>
                <span className="edu-school">{e.school}</span>
                <span className="edu-deg">{e.deg}</span>
                <span className="edu-note">{e.note}</span>
              </div>
            ))}
          </div>
        </section>

        <Strip a={'You are now entering "Experience" section'} b="05 / 01" />
        {/* ── 05 EXPERIENCE ─────────────────────────── */}
        <section id="experience" className="sec experience">
          <SecHead n="05" t="Experience" tone="light" />
          <div className="bar-pill" data-reveal>CLICK A ROLE TO EXPAND</div>
          <div className="acc">
            {EXPERIENCE.map((e, i) => (
              <div className={`acc-item ${open === i ? "open" : ""}`} data-reveal key={i}>
                <button className="acc-head" data-h onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="acc-role">{e.role}</span>
                  <span className="acc-org">{e.org}</span>
                  <span className="acc-when">{e.when}</span>
                  <Plus className="acc-ic" size={22} strokeWidth={1.5} />
                </button>
                <div className="acc-body"><div className="acc-inner">
                  <ul>{e.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
                  <span className="acc-stack">{e.stack}</span>
                </div></div>
              </div>
            ))}
          </div>
        </section>

        <Strip a={'You are now entering "Contact" section'} b="06 / 01" />
        {/* ── 06 CONTACT ────────────────────────────── */}
        <section id="contact" className="sec contact">
          <SecHead n="06" t="Let's talk." tone="ink" />
          <p className="avail" data-reveal>Open to an 8-month co-op, January to August 2027. Based in Boston and open to relocating.</p>
          <a className="mail" href={`mailto:${ME.email}`} data-h data-reveal><span className="mail-txt">{ME.email}</span><ArrowUpRight size={40} strokeWidth={1} /></a>
          <div className="foot">
            <div className="socials">{ME.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" data-h>{s.label}<ArrowUpRight size={13} strokeWidth={1.6} /></a>)}</div>
            <span>{ME.location} · {time} ET · © {new Date().getFullYear()}</span>
          </div>
        </section>

        <Strip a={'You are now entering "Index" section'} b="07 / 01" />
        {/* ── 07 INDEX ──────────────────────────────── */}
        <section id="index" className="sec index">
          <SecHead n="07" t="Index" tone="ink" />
          <p className="lead lead--ink" data-reveal>Everything else, indexed: what I'm working on right now, and smaller builds that didn't make the Work list.</p>
          <h4 className="col-h ink" data-reveal>Now</h4>
          <ul className="idx" data-reveal>{INDEX_NOW.map((x, i) => (
            <li key={i}><span className="idx-t">{x.t}</span><span className="idx-m">{x.m}</span></li>
          ))}</ul>
          <h4 className="col-h ink" data-reveal>Archive</h4>
          <ul className="idx" data-reveal>{INDEX_ARCHIVE.map((x, i) => (
            <li key={i}>
              <a className="idx-link" href={x.href} target="_blank" rel="noopener noreferrer" data-h>
                <span className="idx-t">{x.t}</span>
                <span className="idx-m">{x.m} <ArrowUpRight size={15} strokeWidth={1.6} /></span>
              </a>
            </li>
          ))}</ul>
          <div className="idx-cta" data-reveal>
            <a className="idx-btn" href={ME.resume} target="_blank" rel="noopener noreferrer" data-h>View résumé</a>
            <a className="idx-btn ghost" href={`mailto:${ME.email}`} data-h>Email me</a>
          </div>
        </section>
      </main>
    </div>
  );
}

function SecHead({ n, t, tone, bare }) {
  return (
    <div className={`sec-h ${tone} ${bare ? "bare" : ""}`}>
      <span className="sec-n">({n})</span>
      <h2 className="sec-t">{t}</h2>
    </div>
  );
}
function Strip({ a, b }) { return <div className="strip"><span>{a}</span><span>{b}</span></div>; }

function AsciiField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    const RAMP = " .·:-=+*xo08%#@";            // sparse → dense
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, cell = 15, cols = 0, rows = 0, raf = 0, last = 0, running = true;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width; h = r.height;
      cell = Math.max(12, Math.min(18, Math.round(w / 80)));   // ~80 cols; tune for density/perf
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.font = `${cell}px 'JetBrains Mono', ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
    };

    const draw = (now) => {
      const t = now * 0.00016;                 // overall speed
      const scale = Math.min(w, h) || 1;
      const cs = [                             // three drifting blob centers
        { x: (0.50 + 0.30 * Math.sin(t * 0.9)) * w,       y: (0.45 + 0.26 * Math.cos(t * 1.1)) * h },
        { x: (0.42 + 0.30 * Math.cos(t * 0.7 + 1.3)) * w, y: (0.58 + 0.24 * Math.sin(t * 0.8 + 2.0)) * h },
        { x: (0.62 + 0.26 * Math.sin(t * 1.2 + 0.6)) * w, y: (0.50 + 0.28 * Math.cos(t * 0.6 + 0.9)) * h },
      ];
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(150,30,0,0.5)";    // darker-orange glyphs; tune alpha/darkness
      for (let j = 0; j < rows; j++) {
        const py = j * cell + cell / 2;
        for (let i = 0; i < cols; i++) {
          const px = i * cell + cell / 2;
          let f = 0;
          for (let k = 0; k < cs.length; k++) {
            const dx = (px - cs[k].x) / scale, dy = (py - cs[k].y) / scale;
            f += Math.exp(-(dx * dx + dy * dy) * 6);     // smooth metaball bumps
          }
          const b = Math.sin(f * 8 - t * 4) * 0.5 + 0.5; // sine banding → contour rings that flow
          const ch = RAMP[(b * b * (RAMP.length - 1)) | 0];
          if (ch !== " ") ctx.fillText(ch, px, py);
        }
      }
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      if (now - last < 40) return;             // throttle ~25fps
      last = now;
      draw(now);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0);                                 // static single frame
      return () => ro.disconnect();
    }
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);
  return <canvas ref={ref} className="ascii-field" aria-hidden="true" />;
}

/* ════════════════════════════════════════════════════════════════════════ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1&display=swap');
/* hero-monogram alternates (loaded so you can A/B by editing only the --sp-font line below) */
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@700&family=DM+Serif+Display&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
:root{
  --cream:#ece7df; --ink:#0a0a09; --char:#161514;
  --orange:#fe3b00; --purple:#5a12e8; --blue:#2433f2; --crimson:#fb0f3e; --yellow:#ffee00; --green:#12e33c;
  --mut:#8a867d; --line:#0e0c0d; --ease:cubic-bezier(.22,.61,.36,1);
  /* spacing — reference-matched gutters (24/178/28/32 at 1470px); fluid above the 880px breakpoint */
  --pad-edge:clamp(10px,1.63vw,30px);    /* top, bottom, left gutters: 24 at 1470 */
  --pad-right:clamp(14px,2.18vw,40px);   /* right gutter: 32 at 1470 */
  --nav-card:clamp(106px,12.1vw,210px);  /* sidebar card width: 178 at 1470 */
  --nav-gap:clamp(12px,1.9vw,34px);      /* sidebar card to main panel: 28 at 1470 */
  --nav-vgap:clamp(6px,.82vw,15px);      /* between sidebar cards: 12 at 1470 */
  --stack:14px;                          /* between stacked main cards */
  --col-gap:16px;                        /* between side-by-side columns */
  --nav-w:calc(var(--pad-edge) + var(--nav-card));
  /* Work drawer (section 03) — tip + perspective + corner radius; see the drawer block below */
  --doc-tilt:-48.4deg; --doc-persp:3600px; --doc-radius:18px;
  /* hero monogram face — swap this ONE line to A/B. Alternates already imported above:
     'Bodoni Moda' (dramatic, high-contrast)  ·  'DM Serif Display' (cleaner, sturdier) */
  --sp-font:'Fraunces','Bodoni Moda',Georgia,serif;
}
html,body,#root{background:var(--cream)}
.app{font-family:'Geist',system-ui,sans-serif;color:var(--ink);background:var(--cream);min-height:100vh;overflow-x:hidden;cursor:none}
.app a,.app button{cursor:none;color:inherit;text-decoration:none;border:none;background:none;font:inherit}
@media (hover:none){.app{cursor:auto}.app a,.app button{cursor:pointer}.cur-dot,.cur-ring{display:none}}

.cur-dot,.cur-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:9999;will-change:transform}
.cur-dot{width:6px;height:6px;background:#fff;border-radius:50%;mix-blend-mode:difference;z-index:10000}
/* glass ring: dilute the ink behind it (brightness↑ contrast↓) + bend it at the rim (url map, Chromium);
   no inset shadows — only an outer hairline rim and a faint drop */
.cur-ring{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.05);
  -webkit-backdrop-filter:brightness(1.28) contrast(.82) saturate(1.06);
  backdrop-filter:brightness(1.28) contrast(.82) saturate(1.06) url(#curGlass);
  box-shadow:0 0 0 .5px rgba(10,10,9,.06),0 1px 7px rgba(10,10,9,.10);
  transition:width .3s,height .3s,background .3s}
.cur-ring.g{width:62px;height:62px;background:rgba(255,255,255,.08)}

/* 0x0 filter holder — keep out of flow so its inline line box doesn't add a phantom top gutter */
.glass-defs{position:absolute;width:0;height:0}
.grain{position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.055;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}

/* ── SIDEBAR ──────────────────────────────────── */
.nav{position:fixed;top:0;left:0;bottom:0;width:var(--nav-w);z-index:100;display:flex;flex-direction:column;padding:var(--pad-edge) 0 var(--pad-edge) var(--pad-edge);gap:var(--nav-vgap);animation:navIn .7s .82s var(--ease) both}
@keyframes navIn{from{transform:translateX(-101%)}to{transform:translateX(0)}}
.tab{flex:1;border-radius:14px;position:relative;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;overflow:hidden;transition:flex-grow .6s var(--ease),filter .25s;box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}
.tab:hover{filter:brightness(1.05)}
.tab.active{flex-grow:5.5}
.tab-n{font-family:'JetBrains Mono',monospace;font-size:11px;opacity:.62;letter-spacing:.05em}
.tab-l{font-size:19px;font-weight:600;letter-spacing:-.02em}
/* section-scroll indicator */
.tab-bar{position:absolute;right:13px;top:50%;transform:translateY(-50%);width:3px;height:44%;border-radius:3px;background:currentColor;opacity:0;transition:opacity .4s}
.tab.active .tab-bar{opacity:.22}
.tab-thumb{position:absolute;left:50%;width:8px;height:8px;border-radius:50%;background:currentColor;transform:translateX(-50%);transition:top .15s linear}
.tab.active .tab-thumb{opacity:1}

/* ── SCREEN ───────────────────────────────────── */
.screen{margin-left:var(--nav-w);padding:var(--pad-edge) var(--pad-right) var(--pad-edge) var(--nav-gap);display:flex;flex-direction:column;gap:var(--stack)}

/* 00 HERO */
.hero{height:calc(100vh - var(--pad-edge) * 2)}
.hero-frame{position:relative;height:100%;background:var(--cream);border:1px solid var(--line);border-radius:18px;padding:clamp(24px,3vw,38px) clamp(28px,4vw,46px);display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;transform-origin:center center;animation:crt 1.05s cubic-bezier(.7,0,.3,1) both}
@keyframes crt{0%{transform:scaleX(.03) scaleY(.0016);filter:brightness(2.6) contrast(1.5)}16%{transform:scaleX(1) scaleY(.0016);filter:brightness(2.6) contrast(1.5)}44%{transform:scaleX(1) scaleY(1.02);filter:brightness(1.7)}60%{transform:scaleX(1) scaleY(.99);filter:brightness(1.18)}100%{transform:none;filter:none}}
.crt-flash{position:absolute;inset:0;background:#fff;mix-blend-mode:screen;opacity:0;pointer-events:none;animation:flash 1.05s ease both}
@keyframes flash{0%,15%{opacity:0}20%{opacity:.9}42%{opacity:0}100%{opacity:0}}
.hero-top{display:flex;justify-content:space-between;font-size:15px;line-height:1.25;font-weight:500;position:relative;z-index:2}
.hero-top .ar{text-align:right}
/* 00 monogram — S and P build in parallel: symbols trace an "S" then fuse into it, while the P's stem throws a rope that catches a ring and reels it into the bowl. One SVG, ~5.5s infinite loop. */
.mono{position:absolute;inset:0;z-index:1;pointer-events:none;display:flex;align-items:center;justify-content:center}
.mono-svg{width:min(86%,1000px);height:auto;overflow:visible}
/* high opsz + a little SOFT/WONK gives Fraunces its character; ignored by the alternates */
.ink-letter{font-family:var(--sp-font);font-weight:640;font-optical-sizing:auto;font-variation-settings:'opsz' 144,'wght' 640,'SOFT' 30,'WONK' 1;font-size:300px;fill:var(--ink)}
.s-tok{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:17px;fill:var(--ink);transform-box:fill-box;transform-origin:center;opacity:0;animation:sTok 5.5s var(--ease) infinite both}
.s-tok.ac{fill:var(--orange)}
.s-fill{animation:sFill 5.5s var(--ease) 1.3s infinite both}
.s-sweep{transform-box:fill-box;transform-origin:50% 0%;transform:scaleY(0);animation:sSweep 5.5s var(--ease) 1.3s infinite both}
.p-stem{fill:var(--ink);transform-box:fill-box;transform-origin:center;opacity:0;animation:pStem 5.5s var(--ease) 1.3s infinite both}
.p-rope{fill:none;stroke:var(--ink);stroke-width:7;stroke-linecap:round;opacity:0;animation:pRope 5.5s var(--ease) 1.3s infinite both}
.p-ring{fill:none;stroke:var(--ink);stroke-width:17;stroke-linecap:round;stroke-dasharray:250 110;transform-box:fill-box;transform-origin:center;opacity:0;animation:pRing 5.5s var(--ease) 1.3s infinite both}
.p-fill{transform-box:fill-box;transform-origin:center;opacity:0;animation:pFill 5.5s var(--ease) 1.3s infinite both}
/* S tokens: fly in from scattered slots to their spot on the S outline, hold, then fade as the solid letter sweeps past */
@keyframes sTok{
  0%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--r)) scale(var(--s))}
  7%{opacity:1}
  22%{opacity:1;transform:translate(0px,0px) rotate(0deg) scale(1)}
  30%{opacity:1;transform:translate(0px,0px) rotate(0deg) scale(1)}
  42%{opacity:0;transform:translate(0px,0px) rotate(0deg) scale(1)}
  90%{opacity:0;transform:translate(0px,0px) rotate(0deg) scale(1)}
  100%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--r)) scale(var(--s))}
}
/* solid S fades in under the tokens, then a top->bottom wipe reveals it fully (the "fuse") */
@keyframes sFill{ 0%{opacity:0} 4%{opacity:1} 86%{opacity:1} 96%{opacity:0} 100%{opacity:0} }
@keyframes sSweep{ 0%{transform:scaleY(0)} 28%{transform:scaleY(0)} 46%{transform:scaleY(1)} 96%{transform:scaleY(1)} 100%{transform:scaleY(0)} }
/* P stem appears in place early (alongside the S build), holds, then tucks inward (scaleX) + fades as the glyph takes over */
@keyframes pStem{
  0%{opacity:0;transform:scaleX(1) scaleY(.78)}
  6%{opacity:0;transform:scaleX(1) scaleY(.78)}
  12%{opacity:1;transform:scaleX(1) scaleY(1)}
  44%{opacity:1;transform:scaleX(1) scaleY(1)}
  52%{opacity:0;transform:scaleX(.66) scaleY(1)}
  100%{opacity:0;transform:scaleX(1) scaleY(.78)}
}
/* rope thrown from the stem top: launch -> catch (taut, with recoil) -> reel in tracking the ring -> retract & fade.
   d is keyed to the SAME % timeline as pRing's translateX so the rope end stays on the ring (now docking at 402,120). */
@keyframes pRope{
  0%{opacity:0;d:path("M354 58 Q354 58 354 58")}
  13%{opacity:0;d:path("M354 58 Q354 58 354 58")}
  15%{opacity:1;d:path("M354 58 Q452 158 545 116")}
  18%{opacity:1;d:path("M354 58 Q480 170 600 120")}
  20%{opacity:1;d:path("M354 58 Q482 116 605 120")}
  24%{opacity:1;d:path("M354 58 Q476 119 598 120")}
  30%{opacity:1;d:path("M354 58 Q453 115 552 120")}
  36%{opacity:1;d:path("M354 58 Q426 111 498 120")}
  42%{opacity:1;d:path("M354 58 Q398 105 442 120")}
  46%{opacity:1;d:path("M354 58 Q378 99 402 120")}
  50%{opacity:.4;d:path("M354 58 Q366 82 378 104")}
  52%{opacity:0;d:path("M354 58 Q354 58 354 58")}
  100%{opacity:0;d:path("M354 58 Q354 58 354 58")}
}
/* ring: waits off-right, the rope catches it (~18%, tug recoil), reels in spinning+breathing, docks at the bowl (46%),
   then CONTRACTS toward the bowl centre + fades — so it shrinks inside the glyph silhouette, never protruding */
@keyframes pRing{
  0%{opacity:0;transform:translateX(205px) rotate(0deg) scale(.7)}
  14%{opacity:0;transform:translateX(205px) rotate(0deg) scale(.7)}
  18%{opacity:1;transform:translateX(198px) rotate(40deg) scale(1.04)}
  21%{opacity:1;transform:translateX(205px) rotate(62deg) scale(.92)}
  24%{transform:translateX(196px) rotate(96deg) scale(1.14)}
  30%{transform:translateX(150px) rotate(172deg) scale(.85)}
  36%{transform:translateX(96px) rotate(250deg) scale(1.16)}
  42%{transform:translateX(40px) rotate(322deg) scale(.92)}
  46%{opacity:1;transform:translateX(0px) rotate(360deg) scale(1)}
  52%{opacity:0;transform:translateX(0px) rotate(360deg) scale(.38)}
  100%{opacity:0;transform:translateX(205px) rotate(0deg) scale(.7)}
}
/* glyph P: stays hidden under the primitives, then fades to FULL opacity by 50% (on top, covering them as they
   contract away) — full no later than the primitives finish fading (52%), so two P shapes are never visible at once */
@keyframes pFill{
  0%{opacity:0;transform:scale(.96)}
  44%{opacity:0;transform:scale(.98)}
  50%{opacity:1;transform:scale(1)}
  86%{opacity:1;transform:scale(1)}
  96%{opacity:0;transform:scale(.96)}
  100%{opacity:0;transform:scale(.96)}
}
@media (prefers-reduced-motion:reduce){
  .s-tok,.p-stem,.p-ring,.p-rope,.s-sweep{display:none}
  .s-fill,.p-fill{animation:none;opacity:1}
  .s-fill{clip-path:none}
  .tw-caret{animation:none;opacity:1}
}
.hero-bot{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap;position:relative;z-index:2}
.hero-bot p{max-width:430px;font-size:16px;line-height:1.5}
.cue{display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.1em;padding:13px 20px;border:1px solid var(--ink);border-radius:999px;transition:background .35s,color .35s}
.cue:hover{background:var(--ink);color:var(--cream)}

/* connector strips */
.strip{display:flex;justify-content:space-between;background:var(--ink);color:var(--cream);border-radius:12px;padding:13px 26px;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.12em}

/* ── 01 HELLO ─────────────────────────────────── */
.hello-group{display:flex;flex-direction:column;gap:var(--stack)}
.block{border-radius:18px;padding:clamp(40px,5vw,84px) clamp(24px,4vw,60px)}
.b-orange{background:var(--orange);color:#fff}
.b-cream{background:var(--cream);color:var(--ink);border:1px solid var(--line)}
.b-head{background:var(--orange);color:#fff;min-height:90vh;display:flex;flex-direction:column;justify-content:space-between}
.b-n{font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:.1em}
.b-title{font-size:clamp(70px,13vw,200px);font-weight:800;letter-spacing:-.05em;line-height:.8}

.weare{display:flex;flex-direction:column;min-height:90vh}
.weare-row{display:flex;align-items:center}
.weare-top{flex:1}
.weare-mid{flex:1.2;justify-content:space-between;gap:clamp(24px,5vw,80px)}
.weare-bot{flex:1;align-items:flex-end}
.weare-rule{display:block;flex:none;width:100%;height:1px;background:var(--line)}
.weare-line{font-family:'Geist',system-ui,sans-serif;font-weight:600;font-size:clamp(34px,7.8vw,134px);letter-spacing:-.04em;line-height:.9;white-space:nowrap}
.weare-line.ink{color:var(--ink)}
.weare-line.orange{color:var(--orange)}
.weare-mid .weare-line{margin-left:auto;text-align:right}
.weare-desc{flex:none;max-width:30ch;font-size:clamp(16px,1.3vw,20px);line-height:1.5;color:var(--ink);text-indent:3em}
.weare-foot{display:flex;justify-content:space-between;align-items:center;padding-top:clamp(18px,2vw,30px);font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.08em}
.weare-tag{color:var(--orange)}
.weare-count{display:inline-flex;align-items:center;gap:8px;color:var(--ink)}
.weare-bullet{width:7px;height:7px;border-radius:50%;background:var(--ink)}

.manifesto{display:flex;flex-direction:column;justify-content:center;min-height:90vh}
.mani{display:grid;grid-template-columns:54px 1fr;gap:22px;align-items:baseline;padding:24px 0;border-top:1px solid rgba(255,255,255,.32)}
.mani:last-child{border-bottom:1px solid rgba(255,255,255,.32)}
.mani-n{font-family:'JetBrains Mono',monospace;font-size:12px;opacity:.85}
.mani p{font-size:clamp(22px,3.4vw,44px);font-weight:600;letter-spacing:-.02em;line-height:1.08}

.aim{min-height:90vh;display:flex;flex-direction:column;justify-content:center}
.aim-head{display:flex;align-items:baseline;gap:20px;margin-bottom:18px}
.aim-label{font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--mut)}
.aim-head h3{font-size:clamp(24px,3vw,40px);font-weight:600;letter-spacing:-.02em}
.aim-row{display:grid;grid-template-columns:170px 1fr;gap:24px;padding:30px 0;border-top:1px solid rgba(10,10,9,.14);align-items:start}
.aim-pill{justify-self:start;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.06em;border:1px solid rgba(10,10,9,.3);border-radius:999px;padding:8px 14px}
.aim-t{font-size:clamp(26px,4vw,56px);font-weight:700;letter-spacing:-.02em;line-height:1.04}
.aim-t em{font-style:normal;color:var(--orange)}

.wins{position:relative;overflow:hidden;min-height:90vh;display:flex;flex-direction:column;justify-content:space-between}
.wins > *:not(canvas){z-index:1}
.wins-ghost{position:absolute;left:-1%;top:50%;transform:translateY(-50%);font-size:clamp(90px,19vw,280px);font-weight:800;letter-spacing:-.04em;color:rgba(255,255,255,.12);white-space:nowrap;pointer-events:none;line-height:1}
.wins-h{position:relative;font-size:clamp(48px,9vw,120px);font-weight:800;letter-spacing:-.04em;line-height:.9}
.stats{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:24px;border-top:1px solid rgba(255,255,255,.3);padding-top:30px}
.stat{display:flex;flex-direction:column;gap:6px}
.stat-a{font-size:clamp(28px,4vw,52px);font-weight:700;letter-spacing:-.02em}
.stat-b{font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.9}
.ascii-field{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;display:block}

.facets{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2vw,28px);min-height:90vh;align-content:center}
.facet{display:flex;flex-direction:column;gap:14px}
.facet-img{position:relative;aspect-ratio:4/3;border-radius:12px;overflow:hidden}
.facet--ai{background:linear-gradient(120deg,#3a1bd6,#7b2ff7 60%,#c084fc)}
.facet--fs{background:linear-gradient(120deg,#0a8f6e,#14b8a6 60%,#5eead4)}
.facet--re{background:linear-gradient(120deg,#c2410c,#f59e0b 60%,#fcd34d)}
.facet-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:26px 26px}
.facet-t{font-size:clamp(20px,2.4vw,28px);font-weight:600;letter-spacing:-.02em}
.facet-d{font-size:15px;line-height:1.45;color:var(--mut)}
/* ── WebGL facet scenes: transparent canvas filling each gradient backdrop ── */
.facet-canvas{position:absolute;inset:0;z-index:2;cursor:none;touch-action:pan-y}
.facet-canvas canvas{display:block}

.hl{display:flex;flex-direction:column;justify-content:center;gap:6px;min-height:90vh}
.hl-label{font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--mut);margin-bottom:10px}
.hl-card{display:grid;grid-template-columns:64px 1fr auto;gap:24px;align-items:start;padding:28px 0;border-top:1px solid rgba(10,10,9,.12)}
.hl-mark{width:58px;height:58px;border-radius:13px;background:var(--ink);color:var(--cream);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px}
.hl-top{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
.hl-org{font-size:21px;font-weight:600;letter-spacing:-.02em}
.hl-kind{font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--orange)}
.hl-body{margin-top:12px;font-size:17px;line-height:1.45;max-width:660px}
.hl-tags{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}
.hl-tags span{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.06em;border:1px solid rgba(10,10,9,.25);border-radius:999px;padding:6px 12px}
.hl-src{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--mut);text-align:right;white-space:nowrap}

/* ── SECTIONS (generic, 02–07) ────────────────── */
.sec{border-radius:18px;overflow:hidden;padding:clamp(48px,6vw,108px) clamp(24px,4vw,64px)}
.sec-h{margin-bottom:clamp(36px,5vw,64px)}
.sec-h.bare{margin-bottom:0}
.sec-n{display:block;font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.1em;margin-bottom:14px;opacity:.7}
.sec-t{font-size:clamp(52px,10vw,138px);font-weight:800;letter-spacing:-.045em;line-height:.86}
.sec-h.light{color:#fff}.sec-h.dark{color:var(--cream)}.sec-h.ink{color:var(--ink)}

[data-reveal]{opacity:0;transform:translateY(38px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
[data-reveal].in{opacity:1;transform:none}

.lead{font-size:clamp(19px,2.4vw,30px);max-width:920px;font-weight:400;line-height:1.4}

/* ── 02 APPROACH (multi-card) ─────────────────── */
.approach-group{display:flex;flex-direction:column;gap:var(--stack)}
.b-purple{background:var(--purple);color:#fff}
.ap-head{min-height:90vh;display:flex;flex-direction:column;justify-content:space-between}
.card-foot{display:flex;justify-content:space-between;align-items:flex-end;font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.06em;color:rgba(255,255,255,.7)}
.card-foot.oc{color:var(--mut)}
.card-foot.oc span:first-child{color:var(--purple)}

.thesis{min-height:90vh;display:flex;flex-direction:column;justify-content:space-between}
.thesis-lead{font-size:clamp(22px,3.2vw,40px);font-weight:500;opacity:.92}
/* hero word built from programming elements (their "different"): mono letters in cream,
   each with a distinct code-glyph costume in lavender, closed by a blinking caret */
.thesis-word{display:flex;flex-wrap:nowrap;align-items:flex-end;font-family:'JetBrains Mono',ui-monospace,'SFMono-Regular',monospace;font-size:clamp(38px,10vw,168px);font-weight:800;letter-spacing:-.01em;line-height:.9;color:var(--cream)}
.tw{position:relative;display:inline-flex;align-items:flex-end}
.tw-g{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.4em;font-weight:600;color:#cbb9ff;line-height:1;transition:opacity .25s ease}
.tw-pre{margin-right:.03em;align-self:center}
.tw-post{margin-left:.03em;align-self:center}
.tw-sup{position:absolute;top:.05em;right:-.14em;font-size:.34em;color:#fcd34d}
.tw-caret{display:inline-block;width:.08em;height:.72em;margin-left:.14em;background:var(--cream);align-self:center;animation:twBlink 1.1s ease-in-out infinite}
.thesis-word:hover .tw-g{opacity:1}
@keyframes twBlink{0%,100%{opacity:1}50%{opacity:0}}

.cg{min-height:90vh;display:flex;flex-direction:column;justify-content:center}
.cg-row{display:grid;grid-template-columns:210px 1fr;gap:34px;padding:clamp(34px,5vw,64px) 0;align-items:start}
.cg-row + .cg-row{border-top:1px solid rgba(10,10,9,.18)}
.cg-tag{display:flex;flex-direction:column;gap:16px}
.cg-pill{align-self:start;border:1px solid rgba(10,10,9,.4);border-radius:999px;padding:7px 18px;font-family:'JetBrains Mono',monospace;font-size:13px}
.cg-k{font-size:clamp(22px,2.6vw,34px);font-weight:500;letter-spacing:-.01em}
.cg-t{font-size:clamp(34px,6.2vw,94px);font-weight:500;letter-spacing:-.03em;line-height:1.0}
.cg-t em{font-style:normal;color:var(--purple)}
.cg .card-foot{margin-top:40px}

.pbars{display:flex;flex-direction:column;gap:var(--stack)}
.pbar{background:var(--purple);color:var(--cream);border-radius:18px;min-height:25vh;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:20px;padding:30px clamp(24px,4vw,56px)}
.pbar-s{font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(10,10,9,.5)}
.pbar-s.end{text-align:right}
.pbar-t{justify-self:center;text-align:center;font-size:clamp(40px,8vw,112px);font-weight:800;letter-spacing:-.04em;line-height:.9}

.cult{background:var(--purple);color:var(--cream);border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 28px;font-family:'JetBrains Mono',monospace;font-size:13px;text-transform:uppercase;letter-spacing:.14em}
.cult span:nth-child(2){flex:1;text-align:center}
.cult .arr{color:#27e07a;letter-spacing:.22em;font-weight:600}

.prin{background:var(--cream);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;min-height:90vh}
.prin-tabs{display:grid;grid-template-columns:repeat(4,1fr)}
/* scoped to .prin-tabs so these win over the global .app button border:none reset */
.prin-tabs .prin-tab{display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;min-height:60px;padding:0 27px;border-left:1px solid var(--line);border-bottom:1px solid var(--line);transition:background .3s,color .3s}
.prin-tabs .prin-tab:first-child{border-left:none}
.prin-tab:hover{background:rgba(90,18,232,.06)}
.prin-tab>span:first-child{font-size:clamp(14px,1.5vw,19px);font-weight:600;letter-spacing:-.01em}
.prin-num{font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1;min-width:44px;padding:7px 0;text-align:center;background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:999px}
.prin-tabs .prin-tab.on{color:var(--purple);border-bottom-color:transparent}
.prin-tab.on .prin-num{background:var(--purple);border-color:var(--purple);color:var(--cream)}
.prin-panel{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(40px,5vw,72px) clamp(28px,4vw,60px)}
.prin-t{font-size:clamp(34px,6vw,84px);font-weight:700;letter-spacing:-.03em;line-height:1.04;color:var(--ink)}
.prin-t em{font-style:normal;color:var(--purple)}
.prin-proof{margin-top:28px;max-width:62ch;font-size:clamp(15px,1.3vw,18px);line-height:1.5;color:var(--ink)}
.prin-proof span{display:block;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--purple);margin-bottom:8px}

.cap-head{background:var(--purple);color:var(--cream);border-radius:18px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:clamp(26px,3vw,44px) clamp(24px,4vw,50px);min-height:22vh}
.cap-head h3{font-size:clamp(44px,9vw,128px);font-weight:800;letter-spacing:-.04em;line-height:.9;flex:1;text-align:center}
.cap-side{font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(10,10,9,.5);white-space:nowrap}
.cap-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col-gap)}
.cap-col{background:var(--cream);border-radius:18px;border:1px solid var(--line);padding:clamp(28px,3vw,44px)}
.cap-col-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.cap-col-h h4{font-size:clamp(22px,2.4vw,32px);font-weight:700;letter-spacing:-.01em}
.cap-col-n{font-family:'JetBrains Mono',monospace;font-size:12px;border:1px solid rgba(10,10,9,.35);border-radius:999px;padding:5px 11px}
.cap-col ul{list-style:none}
.cap-col li{font-size:clamp(15px,1.5vw,18px);padding:13px 0;border-bottom:1px solid rgba(10,10,9,.12)}
.cap-col li:last-child{border-bottom:none}

.work-group{display:flex;flex-direction:column;gap:var(--stack)}
.b-ink{background:var(--ink);color:var(--cream)}
.docs{display:flex;flex-direction:column;gap:var(--stack)}
/* Work hover is a drawer: the dark bar tips toward the viewer about its bottom edge, revealing three
   image files that fan down behind it. Ported from work-drawer-prototype.html; don't re-tune by eye. */
.doc{position:relative}
.doc-files{position:absolute;left:0;right:0;top:0;height:42%;clip-path:inset(0 -40px 0 -40px);pointer-events:none}
.file{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;border-radius:var(--doc-radius) var(--doc-radius) 0 0;transform-origin:50% 0;box-shadow:inset 0 1px 0 rgba(255,255,255,.35);transition:transform 130ms cubic-bezier(.4,0,.2,1)}
.file.back{z-index:1}.file.mid{z-index:2}.file.front{z-index:3}
.doc-bar{position:relative;z-index:4;background:#0e0c0d;color:#f6f1ea;border-radius:var(--doc-radius);padding:clamp(30px,3.8vw,52px) clamp(26px,3.3vw,48px);display:grid;grid-template-columns:1.7fr auto 1fr;align-items:center;gap:24px;transform-origin:50% 100%;transform:perspective(var(--doc-persp)) rotateX(0deg);transition:transform 300ms cubic-bezier(.25,.7,.3,1) 30ms}
.doc-hit{position:absolute;inset:0;z-index:1;border-radius:inherit}
.doc-main{min-width:0}
.doc-name{font-size:clamp(30px,4.6vw,56px);font-weight:600;letter-spacing:-.03em;line-height:1;color:#f6f1ea}
.doc-line{font-family:'Geist',system-ui,sans-serif;font-size:clamp(14px,1.1vw,16px);line-height:1.45;color:rgba(246,241,234,.62);margin-top:10px;max-width:56ch;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.doc-mid{justify-self:center;display:flex;flex-direction:column;align-items:center;gap:6px}
.doc-cat{font-family:'Geist',system-ui,sans-serif;font-size:15px;color:#8b898a;text-align:center}
.doc-stack{font-family:'Geist',system-ui,sans-serif;font-size:13px;color:rgba(246,241,234,.42);text-align:center}
.doc-status{font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:rgba(246,241,234,.72);border:1px solid rgba(246,241,234,.35);border-radius:999px;padding:3px 9px}
.doc-links{justify-self:end;position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
.doc-link{display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#f6f1ea;border:1px solid rgba(246,241,234,.32);border-radius:999px;padding:8px 14px;transition:background .3s,color .3s}
.doc-link:hover,.doc-link:focus-visible{background:#f6f1ea;color:#0e0c0d}
.doc-note{display:inline-flex;align-items:center;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:rgba(246,241,234,.5);border:1px dashed rgba(246,241,234,.5);border-radius:999px;padding:8px 14px}
@media (hover:hover) and (pointer:fine){
  .doc:hover .doc-bar,.doc:has(:focus-visible) .doc-bar,.doc.is-open .doc-bar{
    transform:perspective(var(--doc-persp)) rotateX(var(--doc-tilt));
    transition:transform 420ms cubic-bezier(.3,1.35,.5,1);
    transition:transform 420ms linear(0, .17 3%, .62 11%, .87 20%, 1.01 28%, 1.08 40%, 1.06 52%, 1.02 61%, 1 68%, 1)}
  .doc:hover .file.front,.doc:has(:focus-visible) .file.front,.doc.is-open .file.front{
    transform:translateY(43.8%) scaleX(1.03);
    transition:transform 300ms cubic-bezier(.3,1.6,.5,1) 85ms;
    transition:transform 300ms linear(0, .38 9%, .62 15%, .92 26%, 1.12 36%, 1.21 48%, 1.23 56%, 1.15 70%, 1.04 84%, 1) 85ms}
  .doc:hover .file.mid,.doc:has(:focus-visible) .file.mid,.doc.is-open .file.mid{
    transform:translateY(20.2%) scaleX(1.023);
    transition:transform 380ms cubic-bezier(.3,1.7,.5,1) 115ms;
    transition:transform 380ms linear(0, .17 3%, .5 12%, 1 21%, 1.17 25%, 1.3 32%, 1.34 40%, 1.3 50%, 1.17 65%, 1.05 82%, 1) 115ms}
}
@media (hover:none),(max-width:880px){.doc-files{display:none}}
@media (prefers-reduced-motion:reduce){
  .doc-bar,.file{transition:none!important}
  .doc:hover .doc-bar,.doc:hover .file,.doc:has(:focus-visible) .doc-bar,.doc:has(:focus-visible) .file{transform:none!important}
}

.about{background:var(--blue);color:#fff}
.paren{font-size:clamp(30px,5vw,68px);font-weight:700;letter-spacing:-.03em;line-height:1.02;max-width:1100px}
.paren span{color:#9fb0ff;font-weight:400}
.paren em{font-style:italic}
.lead--blue{margin-top:32px}
.col-h{font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.12em;margin-bottom:18px;padding-bottom:12px}
.col-h.light{color:rgba(255,255,255,.65);border-bottom:1px solid rgba(255,255,255,.28)}
.edu{margin-top:clamp(48px,6vw,76px)}
.edu-row{display:grid;grid-template-columns:170px 1fr 1.2fr auto;gap:8px 24px;padding:22px 0;border-bottom:1px solid rgba(255,255,255,.2);align-items:baseline}
.edu-when{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.05em;color:rgba(255,255,255,.7)}
.edu-school{font-size:20px;font-weight:600}
.edu-deg{font-size:16px;color:rgba(255,255,255,.85)}
.edu-note{font-size:13px;color:rgba(255,255,255,.6);text-align:right}

.experience{background:var(--crimson);color:#fff}
.bar-pill{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.16em;text-align:center;padding:16px;border:1px solid rgba(255,255,255,.4);border-radius:999px;margin-bottom:18px}
.acc{display:flex;flex-direction:column;gap:10px}
.acc-item{background:var(--cream);color:var(--ink);border-radius:16px;overflow:hidden}
.acc-head{width:100%;display:grid;grid-template-columns:1.1fr 1fr auto auto;gap:20px;align-items:center;padding:clamp(20px,2.6vw,30px) clamp(22px,3vw,36px);text-align:left}
.acc-role{font-size:clamp(20px,2.6vw,30px);font-weight:600;letter-spacing:-.02em}
.acc-org{font-size:15px;color:var(--mut)}
.acc-when{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--mut);letter-spacing:.04em}
.acc-ic{transition:transform .4s var(--ease);flex:0 0 auto}
.acc-item.open .acc-ic{transform:rotate(45deg)}
.acc-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s var(--ease)}
.acc-item.open .acc-body{grid-template-rows:1fr}
.acc-inner{overflow:hidden;padding:0 clamp(22px,3vw,36px)}
.acc-item.open .acc-inner{padding-bottom:clamp(24px,3vw,34px)}
.acc-inner ul{list-style:none;border-top:1px solid rgba(10,10,9,.12)}
.acc-inner li{font-size:16px;line-height:1.5;padding:12px 0 12px 22px;position:relative;border-bottom:1px solid rgba(10,10,9,.08)}
.acc-inner li::before{content:'';position:absolute;left:0;top:21px;width:8px;height:8px;border-radius:50%;background:var(--crimson)}
.acc-stack{display:inline-block;margin-top:16px;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut)}

.contact{background:var(--yellow);color:var(--ink)}
.avail{font-size:clamp(18px,2vw,26px);font-weight:500;max-width:40ch;margin-bottom:28px}
.mail{display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:clamp(24px,5.2vw,84px);font-weight:700;letter-spacing:-.04em;line-height:1;padding:clamp(34px,5vw,56px) 0;border-top:1px solid rgba(10,10,9,.25);border-bottom:1px solid rgba(10,10,9,.25);transition:color .35s}
.mail-txt{min-width:0;overflow-wrap:anywhere}
.mail svg{flex:none}
.mail:hover{color:#fff}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:40px;flex-wrap:wrap;gap:18px;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:rgba(10,10,9,.7)}
.socials{display:flex;gap:22px}
.socials a{display:inline-flex;align-items:center;gap:6px}

.index{background:var(--green);color:var(--ink)}
.lead--ink{margin-top:0}
.index .col-h{margin-top:clamp(40px,5vw,60px)}
.col-h.ink{color:rgba(10,10,9,.6);border-bottom:1px solid rgba(10,10,9,.28)}
.idx{list-style:none;border-top:1px solid rgba(10,10,9,.2)}
.idx li{display:flex;gap:22px;align-items:baseline;justify-content:space-between;font-size:clamp(20px,3vw,34px);font-weight:500;letter-spacing:-.02em;padding:22px 0;border-bottom:1px solid rgba(10,10,9,.2)}
.idx-link{display:flex;width:100%;gap:22px;align-items:baseline;justify-content:space-between;transition:opacity .25s}
.idx-link:hover{opacity:.6}
.idx-t{flex:1;min-width:0}
.idx-m{font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(10,10,9,.55);white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
.idx-cta{display:flex;gap:12px;margin-top:40px;flex-wrap:wrap}
.idx-btn{display:inline-flex;align-items:center;background:var(--ink);color:var(--green);border-radius:999px;padding:15px 26px;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.08em;transition:filter .3s,background .3s,color .3s}
.idx-btn:hover{filter:brightness(1.12)}
.idx-btn.ghost{background:none;color:var(--ink);border:1px solid rgba(10,10,9,.4)}
.idx-btn.ghost:hover{background:var(--ink);color:var(--green)}

/* ── RESPONSIVE ───────────────────────────────── */
@media (max-width:880px){
  :root{--nav-w:0px}
  .nav{flex-direction:row;left:0;right:0;bottom:auto;top:0;width:auto;height:56px;padding:var(--pad-edge);gap:var(--nav-vgap);background:var(--cream);box-shadow:0 1px 0 rgba(10,10,9,.12);overflow-x:auto}
  .tab{flex:0 0 auto;min-width:78px;padding:9px 13px;border-radius:10px}
  .tab.active{flex-grow:0}
  .tab-l{font-size:13px}.tab-n,.tab-bar{display:none}
  .screen{margin-left:0;padding:var(--pad-edge);padding-top:calc(56px + var(--pad-edge))}
  .hero{height:auto}.hero-frame{min-height:80vh}.mono-svg{width:94%}
  .b-head,.weare,.manifesto,.aim,.wins,.facets,.hl{min-height:auto}
  .b-head,.weare,.manifesto,.aim,.wins,.facets,.hl{min-height:auto}
  .ap-head,.thesis,.cg,.prin{min-height:auto}
  .pbar{min-height:120px}
  .cg-row{grid-template-columns:1fr;gap:14px}
  .prin-tabs{grid-template-columns:1fr 1fr}
  .prin-tab{border-bottom:1px solid rgba(10,10,9,.16)}
  .cap-cols{grid-template-columns:1fr}
  .pbar-s{display:none}
  .cult{flex-direction:column;gap:8px;text-align:center}.cult .arr{display:none}
  .weare-row{flex:none;align-items:flex-start;padding:clamp(18px,6vw,30px) 0}
  .weare-mid{flex-direction:column;gap:16px}
  .weare-mid .weare-line{margin-left:0;text-align:left}
  .weare-line{white-space:normal}
  .aim-row{grid-template-columns:1fr;gap:10px}
  .stats,.facets,.cap-list{grid-template-columns:1fr}
  .stats{gap:18px}
  .hl-card{grid-template-columns:48px 1fr;gap:14px}.hl-src{grid-column:2;text-align:left}
  .mani{grid-template-columns:1fr;gap:6px}
  .edu-row{grid-template-columns:1fr;gap:4px}.edu-note{text-align:left}
  .acc-head{grid-template-columns:1fr auto;gap:6px 14px}.acc-org,.acc-when{grid-column:1}
  .doc-bar{grid-template-columns:1fr;gap:12px}.doc-main,.doc-mid,.doc-links{justify-self:start}.doc-mid{align-items:flex-start}.doc-cat,.doc-stack{text-align:left}.doc-links{justify-content:flex-start}.doc-line{max-width:none}
}
`;