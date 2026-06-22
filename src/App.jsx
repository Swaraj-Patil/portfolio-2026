import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Plus } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════════
   CONTENT — edit freely. Presentation is in `styles` at the bottom.
   This pass focuses on completing sections 00 (hero) and 01 (Hello).
   Sections 02–07 are scaffolded and will be polished next.
   ════════════════════════════════════════════════════════════════════════ */

const ME = {
  first: "Swaraj", last: "Patil",
  discipline: "AI Engineer",
  location: "Boston, MA",
  email: "hello@swarajpatil.dev",            // ← replace
  socials: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Resume", href: "#" },
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
  "A model that can't cite its source has no business reaching a user.",
  "Most AI breaks the moment it leaves the demo — the real work is making sure it doesn't.",
  "A complex system isn't impressive until someone can actually navigate it.",
];
const AIM = [
  { k: "Challenge", t: (<>AI that dazzles in a demo but <em>falls apart</em> under real-world mess.</>) },
  { k: "Goal", t: (<>Tools people <em>trust</em> — grounded, auditable, and legible.</>) },
];
const STATS = [["4.5 yrs", "in production"], ["6+", "products shipped"], ["1", "research lab"]];
const FACETS = [
  { key: "ai", t: "AI Engineering", d: "RAG pipelines, LLM integration, grounded generation." },
  { key: "fs", t: "Full-Stack", d: "React / Next front-ends to FastAPI / Node back-ends." },
  { key: "re", t: "Research", d: "Computational tooling and systems internals." },
];
const HIGHLIGHTS = [
  { mark: "NU", org: "Vitek Lab", kind: "Research", src: "Northeastern",
    body: "Contributing to MSstatsShiny, an open-source platform used by the global proteomics research community.",
    tags: ["Research", "R Shiny"] },
  { mark: "DB", org: "MongoDB", kind: "Systems", src: "Independent",
    body: "Reproduced and root-caused a 3.5–6.6× regression in TTL deletions; correlated with OSDI '23.",
    tags: ["Systems", "Performance"] },
];

/* ── 02–07 content ── */
const AP_AIM = [
  { k: "Challenge", t: (<><em>Rigor and resourcefulness</em> in equal measure — MNC discipline, startup speed.</>) },
  { k: "Goal", t: (<>Make the <em>hard part legible</em> — for the people who actually have to act on it.</>) },
];
const PRINCIPLE_BARS = ["Built for", "Production", "& People"];
const PRINCIPLES = [
  { k: "Source-Grounded", t: (<>Every answer is tied to a retrieved source. <em>No source, no answer.</em></>) },
  { k: "Human-in-Loop", t: (<>The model proposes; <em>people decide.</em> Validation lives inside the flow, not bolted on after.</>) },
  { k: "Production-First", t: (<>Built for the messy real world, <em>not the happy-path demo.</em></>) },
  { k: "Eval-Driven", t: (<>If I can't measure whether it got better, <em>I don't ship it.</em></>) },
];
const CAPABILITIES = [
  { g: "AI / ML", items: ["LLM Integration", "Retrieval-Augmented Generation", "Vector Stores — ChromaDB", "Prompt Engineering", "Document Parsing", "Entity Extraction", "Human-in-the-Loop", "Grounded Generation"] },
  { g: "Engineering", items: ["React", "Next.js", "TypeScript", "FastAPI", "NestJS", "Node / Express", "GraphQL & REST", "PostgreSQL / MongoDB"] },
  { g: "Foundations", items: ["Data Structures & Algorithms", "Systems & DB Internals", "R / Shiny", "Docker", "Git / CI", "Performance Profiling", "Cloud — Vercel"] },
];
const PROJECTS = [
  { key: "policylens", title: "PolicyLens", cat: "RAG · Governance Docs", tag: "ChromaDB · Groq", year: "2026" },
  { key: "trial", title: "TrialCompanion AI", cat: "LLM · Clinical Trials", tag: "FastAPI · Gemini", year: "2025" },
  { key: "msstats", title: "MSstatsShiny", cat: "Research · Vitek Lab", tag: "R Shiny · Proteomics", year: "2026" },
  { key: "mongo", title: "MongoDB TTL", cat: "Systems · Independent", tag: "Root-Cause Analysis", year: "2026" },
  { key: "license", title: "License Service", cat: "Backend · REST API", tag: "Express · Supabase", year: "2025" },
  { key: "amazone", title: "Amazone", cat: "Full-Stack · MERN", tag: "React · Stripe", year: "2024" },
];
const EDUCATION = [
  { school: "Northeastern University", deg: "M.S. Computer & Information Science", when: "Jan 2026 — May 2028", note: "Khoury College · GPA 3.84 / 4.0" },
  { school: "VES Institute of Technology", deg: "B.E. Engineering", when: "2017 — 2021", note: "Mumbai · CGPA 7.7 / 10" },
];
const EXPERIENCE = [
  { role: "Research Assistant", org: "Northeastern · Vitek Lab", when: "Jan 2026 — Now",
    points: ["Contributing to MSstatsShiny, an open-source proteomics platform used by the global research community.", "Extended Metamorpheus file-format support and improved the dose-response analysis module.", "Co-coordinating the May Institute computational-proteomics program."],
    stack: "R Shiny · Python · Proteomics" },
  { role: "Full-Stack Developer", org: "KPMG (ZS / Amgen)", when: "Sep — Dec 2025",
    points: ["Led the front-end build of Amgen's ASM Work-Centre dashboard visualizing SQDIP metrics.", "Designed a three-tier hierarchical drill-down filtering system for site-level analytics."],
    stack: "React · FastAPI · PostgreSQL" },
  { role: "Technical Lead", org: "Beelogical", when: "Aug 2023 — Aug 2025",
    points: ["Led front-end engineering on IRYS Cloud — published a custom UI & icon library, built dynamic validated forms.", "Delivered IncBuddy (OTA): Google Maps, XLSX uploads, dynamic PDF generation, Razorpay, SendGrid email."],
    stack: "Next.js · React · NestJS" },
  { role: "Senior Software Engineer", org: "Capgemini", when: "Jul 2021 — Aug 2023",
    points: ["Built React UIs for Fiserv banking accounts using custom hooks, HOCs and Context API.", "Implemented dynamic data filtering and API integrations across production financial platforms."],
    stack: "React · JavaScript · REST" },
];
const INDEX_ITEMS = ["OSDI '23 — TTL & storage-engine internals", "Evaluating RAG — retrieval metrics that matter", "R Shiny for reproducible science", "Prompt patterns for grounded generation"];

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
              <span className="ar">An Unusual<br />{ME.discipline}</span>
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
              <p>I build LLM- &amp; RAG-powered systems that turn dense source material into clear, auditable insight.</p>
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
              <p className="weare-desc">Half researcher, half engineer — I build the reliability layer between large language models and the people who depend on their answers.</p>
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
            <div className="aim-head"><span className="aim-label">The aim</span><h3>I build to:</h3></div>
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

          <Strip a="↓  FIVE YEARS MAKING PRODUCTS" b="NOW BUILDING THE AI LAYER  ↓" />

          <div className="block b-cream facets">
            {FACETS.map((f) => (
              <div className="facet" data-reveal key={f.key}>
                <div className={`facet-img facet--${f.key}`}><span className="facet-grid" aria-hidden /></div>
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
            <span className="thesis-lead">Good AI is</span>
            <h3 className="thesis-word">Grounded.</h3>
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
            <span>GROUNDED FROM PIPELINE TO INTERFACE</span>
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
              <p className="prin-t">{PRINCIPLES[prin].t}</p>
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
                <div className="doc-clip">
                  <div className={`pv pv--${p.key}`}>
                    <span className="pv-grid" aria-hidden />
                    <span className="pv-num">{p.title.slice(0, 2).toUpperCase()}</span>
                    <span className="pv-tag">{p.cat}</span>
                  </div>
                </div>
                <div className="doc-bar">
                  <h3 className="doc-name">{p.title}</h3>
                  <span className="doc-cat">{p.cat}</span>
                  <span className="doc-tag">{p.tag} <ArrowUpRight size={16} strokeWidth={1.5} /></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Strip a={'You are now entering "About" section'} b="04 / 01" />
        {/* ── 04 ABOUT ──────────────────────────────── */}
        <section id="about" className="sec about">
          <SecHead n="04" t="About" tone="light" />
          <h3 className="paren" data-reveal>An <span>(</span>A<span>)</span>I Engineer who makes complex systems <em>legible</em>.</h3>
          <p className="lead lead--blue" data-reveal>
            Master's student at Northeastern researching computational tooling in the Vitek Lab. Five years building production
            web systems before turning to the AI layer. I like the problems where the hard part is making complexity navigable.
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
          <div className="bar-pill" data-reveal>ROLES — CLICK TO EXPAND</div>
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
          <a className="mail" href={`mailto:${ME.email}`} data-h data-reveal>{ME.email}<ArrowUpRight size={40} strokeWidth={1} /></a>
          <div className="foot">
            <div className="socials">{ME.socials.map((s) => <a key={s.label} href={s.href} data-h>{s.label}<ArrowUpRight size={13} strokeWidth={1.6} /></a>)}</div>
            <span>{ME.location} · {time} EST · © {new Date().getFullYear()}</span>
          </div>
        </section>

        <Strip a={'You are now entering "Index" section'} b="07 / 01" />
        {/* ── 07 INDEX ──────────────────────────────── */}
        <section id="index" className="sec index">
          <SecHead n="07" t="Index" tone="ink" />
          <p className="lead lead--ink" data-reveal>A running index of the papers, tools and ideas shaping how I build. <em>Placeholder — to be populated.</em></p>
          <ul className="idx" data-reveal>{INDEX_ITEMS.map((x, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{x}</li>)}</ul>
          <div className="sub" data-reveal>
            <input placeholder="you@email.com" aria-label="email" />
            <button data-h onClick={(e) => e.preventDefault()}>Notify me</button>
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
  --mut:#8a867d; --line:rgba(10,10,9,.18); --nav-w:196px; --gap:8px; --ease:cubic-bezier(.22,.61,.36,1);
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

.grain{position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.055;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}

/* ── SIDEBAR ──────────────────────────────────── */
.nav{position:fixed;top:0;left:0;bottom:0;width:var(--nav-w);z-index:100;display:flex;flex-direction:column;padding:var(--gap);gap:6px;animation:navIn .7s .82s var(--ease) both}
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
.screen{margin-left:var(--nav-w);padding:var(--gap) var(--gap) var(--gap) 0;display:flex;flex-direction:column;gap:var(--gap)}

/* 00 HERO */
.hero{height:calc(100vh - var(--gap)*2)}
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
}
.hero-bot{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap;position:relative;z-index:2}
.hero-bot p{max-width:430px;font-size:16px;line-height:1.5}
.cue{display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.1em;padding:13px 20px;border:1px solid var(--ink);border-radius:999px;transition:background .35s,color .35s}
.cue:hover{background:var(--ink);color:var(--cream)}

/* connector strips */
.strip{display:flex;justify-content:space-between;background:var(--ink);color:var(--cream);border-radius:12px;padding:13px 26px;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.12em}

/* ── 01 HELLO ─────────────────────────────────── */
.hello-group{display:flex;flex-direction:column;gap:var(--gap)}
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
.approach-group{display:flex;flex-direction:column;gap:var(--gap)}
.b-purple{background:var(--purple);color:#fff}
.ap-head{min-height:90vh;display:flex;flex-direction:column;justify-content:space-between}
.card-foot{display:flex;justify-content:space-between;align-items:flex-end;font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.06em;color:rgba(255,255,255,.7)}
.card-foot.oc{color:var(--mut)}
.card-foot.oc span:first-child{color:var(--purple)}

.thesis{min-height:90vh;display:flex;flex-direction:column;justify-content:space-between}
.thesis-lead{font-size:clamp(22px,3.2vw,40px);font-weight:500;opacity:.92}
.thesis-word{font-size:clamp(80px,18vw,280px);font-weight:800;letter-spacing:-.05em;line-height:.82;color:var(--cream)}

.cg{min-height:90vh;display:flex;flex-direction:column;justify-content:center}
.cg-row{display:grid;grid-template-columns:210px 1fr;gap:34px;padding:clamp(34px,5vw,64px) 0;align-items:start}
.cg-row + .cg-row{border-top:1px solid rgba(10,10,9,.18)}
.cg-tag{display:flex;flex-direction:column;gap:16px}
.cg-pill{align-self:start;border:1px solid rgba(10,10,9,.4);border-radius:999px;padding:7px 18px;font-family:'JetBrains Mono',monospace;font-size:13px}
.cg-k{font-size:clamp(22px,2.6vw,34px);font-weight:500;letter-spacing:-.01em}
.cg-t{font-size:clamp(34px,6.2vw,94px);font-weight:700;letter-spacing:-.03em;line-height:1.0}
.cg-t em{font-style:normal;color:var(--purple)}
.cg .card-foot{margin-top:40px}

.pbars{display:flex;flex-direction:column;gap:var(--gap)}
.pbar{background:var(--purple);color:var(--cream);border-radius:18px;min-height:25vh;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:20px;padding:30px clamp(24px,4vw,56px)}
.pbar-s{font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(10,10,9,.5)}
.pbar-s.end{text-align:right}
.pbar-t{justify-self:center;text-align:center;font-size:clamp(40px,8vw,112px);font-weight:800;letter-spacing:-.04em;line-height:.9}

.cult{background:var(--purple);color:var(--cream);border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 28px;font-family:'JetBrains Mono',monospace;font-size:13px;text-transform:uppercase;letter-spacing:.14em}
.cult span:nth-child(2){flex:1;text-align:center}
.cult .arr{color:#27e07a;letter-spacing:.22em;font-weight:600}

.prin{background:var(--cream);border-radius:18px;min-height:90vh;display:flex;flex-direction:column;border:1px solid var(--line);overflow:hidden}
.prin-tabs{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid rgba(10,10,9,.16)}
.prin-tab{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:clamp(20px,2.4vw,30px) clamp(18px,2.4vw,30px);border-right:1px solid rgba(10,10,9,.16);text-align:left;transition:background .3s,color .3s}
.prin-tab:last-child{border-right:none}
.prin-tab:hover{background:rgba(90,18,232,.06)}
.prin-tab>span:first-child{font-size:clamp(14px,1.5vw,19px);font-weight:600;letter-spacing:-.01em}
.prin-num{font-family:'JetBrains Mono',monospace;font-size:12px;border:1px solid rgba(10,10,9,.35);border-radius:999px;padding:5px 11px}
.prin-tab.on{color:var(--purple)}
.prin-tab.on .prin-num{border-color:var(--purple);color:var(--purple)}
.prin-panel{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(40px,5vw,72px) clamp(28px,4vw,60px)}
.prin-t{font-size:clamp(34px,6vw,84px);font-weight:700;letter-spacing:-.03em;line-height:1.04;color:var(--ink)}
.prin-t em{font-style:normal;color:var(--purple)}

.cap-head{background:var(--purple);color:var(--cream);border-radius:18px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:clamp(26px,3vw,44px) clamp(24px,4vw,50px);min-height:22vh}
.cap-head h3{font-size:clamp(44px,9vw,128px);font-weight:800;letter-spacing:-.04em;line-height:.9;flex:1;text-align:center}
.cap-side{font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(10,10,9,.5);white-space:nowrap}
.cap-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gap)}
.cap-col{background:var(--cream);border-radius:18px;border:1px solid var(--line);padding:clamp(28px,3vw,44px)}
.cap-col-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.cap-col-h h4{font-size:clamp(22px,2.4vw,32px);font-weight:700;letter-spacing:-.01em}
.cap-col-n{font-family:'JetBrains Mono',monospace;font-size:12px;border:1px solid rgba(10,10,9,.35);border-radius:999px;padding:5px 11px}
.cap-col ul{list-style:none}
.cap-col li{font-size:clamp(15px,1.5vw,18px);padding:13px 0;border-bottom:1px solid rgba(10,10,9,.12)}
.cap-col li:last-child{border-bottom:none}

.work-group{display:flex;flex-direction:column;gap:var(--gap)}
.b-ink{background:var(--ink);color:var(--cream)}
.docs{display:flex;flex-direction:column;gap:14px}
/* each row owns the perspective for its own lifting preview; the bar itself stays flat */
.doc{position:relative;perspective:1300px;perspective-origin:50% 100%}
.doc:hover{z-index:20}
.doc-bar{position:relative;z-index:2;background:var(--char);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:clamp(30px,3.8vw,52px) clamp(26px,3vw,44px);display:grid;grid-template-columns:1.2fr auto 1fr;align-items:center;gap:24px;transition:background .4s,box-shadow .5s,transform .5s var(--ease)}
.doc:hover .doc-bar{background:#1d1c19;transform:translateY(-3px);box-shadow:0 36px 70px -28px rgba(0,0,0,.8)}
.doc-name{font-size:clamp(30px,4.6vw,56px);font-weight:600;letter-spacing:-.03em;line-height:1}
.doc-cat{justify-self:center;font-family:'JetBrains Mono',monospace;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:rgba(236,231,223,.5)}
.doc-tag{justify-self:end;display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:rgba(236,231,223,.8)}
/* preview hinged at the bar's top edge: folded flat (hidden) → stands up leaning back, like lifting a photo off the stack */
.doc-clip{position:absolute;left:18px;right:18px;bottom:calc(100% - 14px);height:clamp(210px,30vw,360px);border-radius:18px 18px 6px 6px;overflow:hidden;z-index:1;pointer-events:none;transform-origin:50% 100%;transform:rotateX(92deg);opacity:0;transition:transform .62s var(--ease),opacity .35s;box-shadow:0 24px 50px -18px rgba(0,0,0,.6)}
.doc:hover .doc-clip{transform:rotateX(32deg);opacity:1}
.pv{position:absolute;inset:0;display:flex;align-items:flex-end;padding:24px;transform:scale(1.06);transition:transform .8s var(--ease)}
.doc:hover .pv{transform:scale(1)}
.pv-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px);background-size:30px 30px}
.pv-num{position:absolute;top:14px;right:20px;font-size:clamp(64px,10vw,110px);font-weight:800;line-height:1;color:rgba(255,255,255,.16)}
.pv-tag{position:relative;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.92)}
.pv--policylens{background:linear-gradient(120deg,#3a1bd6,#7b2ff7 55%,#c084fc)}
.pv--trial{background:linear-gradient(120deg,#0a8f6e,#14b8a6 55%,#5eead4)}
.pv--msstats{background:linear-gradient(120deg,#c2410c,#f59e0b 55%,#fcd34d)}
.pv--mongo{background:linear-gradient(120deg,#04140d,#0b3d24 60%,#10b981)}
.pv--license{background:linear-gradient(120deg,#1e293b,#475569 55%,#94a3b8)}
.pv--amazone{background:linear-gradient(120deg,#9f1239,#ef4444 55%,#fb923c)}

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
.mail{display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:clamp(30px,7vw,112px);font-weight:700;letter-spacing:-.04em;line-height:1;padding:clamp(34px,5vw,56px) 0;border-top:1px solid rgba(10,10,9,.25);border-bottom:1px solid rgba(10,10,9,.25);transition:color .35s}
.mail:hover{color:#fff}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:40px;flex-wrap:wrap;gap:18px;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:rgba(10,10,9,.7)}
.socials{display:flex;gap:22px}
.socials a{display:inline-flex;align-items:center;gap:6px}

.index{background:var(--green);color:var(--ink)}
.lead--ink{margin-top:0}
.idx{list-style:none;margin-top:clamp(40px,5vw,64px);border-top:1px solid rgba(10,10,9,.2)}
.idx li{display:flex;gap:22px;align-items:baseline;font-size:clamp(20px,3vw,34px);font-weight:500;letter-spacing:-.02em;padding:22px 0;border-bottom:1px solid rgba(10,10,9,.2)}
.idx li span{font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(10,10,9,.55)}
.sub{display:flex;gap:8px;margin-top:40px;max-width:480px}
.sub input{flex:1;background:rgba(255,255,255,.55);border:1px solid rgba(10,10,9,.25);border-radius:999px;padding:15px 22px;font-size:15px;color:var(--ink);cursor:none}
.sub input::placeholder{color:rgba(10,10,9,.5)}
.sub button{background:var(--ink);color:var(--green);border-radius:999px;padding:15px 26px;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.08em}

/* ── RESPONSIVE ───────────────────────────────── */
@media (max-width:880px){
  :root{--nav-w:0px}
  .nav{flex-direction:row;left:0;right:0;bottom:auto;top:0;height:56px;padding:7px;gap:5px;background:var(--cream);box-shadow:0 1px 0 rgba(10,10,9,.12);overflow-x:auto}
  .tab{flex:0 0 auto;min-width:78px;padding:9px 13px;border-radius:10px}
  .tab.active{flex-grow:0}
  .tab-l{font-size:13px}.tab-n,.tab-bar{display:none}
  .screen{margin-left:0;padding:7px;padding-top:62px}
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
  .doc-bar{grid-template-columns:1fr;gap:10px}.doc-cat,.doc-tag{justify-self:start}.doc:hover .doc-clip{transform:rotateX(22deg)}
}
`;