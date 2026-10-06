import { useEffect, useRef } from "react";
import GLYPHS from "./heroGlyphs.json";

/* ═══ Hero "SP" monogram: canvas renderer ported from hero-monogram-prototype.html.
   Letters are vector paths from heroGlyphs.json (extracted with scripts/extract_glyphs.py).
   S tokens are sampled inside the real outline; ink grows from them clipped to it. The P is cut
   from the real glyph into stem + bowl along measured lines; the bowl docks at identity, so there
   is no glyph swap. Every value is an analytic function of time. Re-verify with scripts/hero-verify.py
   before changing the font or the timing. ═══ */

/* timeline (ms). One loop: assemble -> hold -> disassemble, seamless. */
const T = {
  loop: 6600,
  tokIn: [80, 700, 900],          // first delay, stagger spread, flight duration
  ink:   [1150, 600, 260],        // first blob start, stagger spread, growth duration
  stemIn: [120, 620],
  bowlIn: [250, 650],
  throw: [420, 760],
  reel:  [800, 1100],             // start, duration
  retract: [1650, 1900],
  out:   [5200, 6400],            // disassembly window
};

export default function HeroMonogram() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, DPR = 1, L = null;     // L = layout
    let INK = "#0a0a09", ACCENT = "#fe3b00"; // read from CSS vars at layout time

    /* ═══ easing: analytic springs, no keyframes, so velocity is continuous ═══ */
    const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
    const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const easeOutCubic = (t) => 1 - Math.pow(1 - clamp01(t), 3);
    const easeInCubic = (t) => Math.pow(clamp01(t), 3);
    const easeOutQuart = (t) => 1 - Math.pow(1 - clamp01(t), 4);
    const easeInOut = (t) => { t = clamp01(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    function spring(t, zeta = .68, settle = 1) {           // 0 -> 1 with a small overshoot, settles at t=settle
      if (t <= 0) return 0; if (t >= settle * 1.6) return 1;
      const w = 4.6 / (zeta * settle), wd = w * Math.sqrt(1 - zeta * zeta);
      return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta * w / wd) * Math.sin(wd * t));
    }

    /* ═══ seeded RNG so the layout is identical on every load and resize ═══ */
    function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

    function layout() {
      const root = getComputedStyle(document.documentElement);
      INK = root.getPropertyValue("--ink").trim() || "#0a0a09";
      ACCENT = root.getPropertyValue("--orange").trim() || "#fe3b00";
      // layout box, not getBoundingClientRect: the hero-frame's CRT scale animation transforms the
      // canvas visually, and the transformed rect would corrupt the layout (ResizeObserver won't re-fire,
      // since the border-box size never actually changes). clientWidth/Height are transform-immune.
      W = canvas.clientWidth; H = canvas.clientHeight; DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);

      const G = GLYPHS, S = G.glyphs.S, P = G.glyphs.P;
      const capPx = H * 0.66, s = capPx / G.capHeight;                 // font units -> css px
      const gap = G.kern.SP + G.upm * 0.06;                             // optical gap between letters
      const pX = S.adv + gap;                                           // P origin, font units
      const left = S.bbox[0], right = pX + P.bbox[2];
      const ox = (W - (right - left) * s) / 2 - left * s;               // centre the pair
      const base = H / 2 + capPx / 2;                                   // baseline, css px
      const mS = new DOMMatrix([s, 0, 0, -s, ox, base]);
      const mP = new DOMMatrix([s, 0, 0, -s, ox + pX * s, base]);
      const pathS = new Path2D(S.d), pathP = new Path2D(P.d);
      L = { s, capPx, mS, mP, pathS, pathP };
      L.tokens = sampleS(L);
      L.P = splitP(L);
    }

    /* ── point-in-glyph using the same Path2D + matrix the renderer uses ── */
    function inside(path, m, x, y) {
      ctx.setTransform(new DOMMatrix([DPR, 0, 0, DPR, 0, 0]).multiply(m));
      return ctx.isPointInPath(path, x * DPR, y * DPR);
    }

    /* ── S: fill the glyph interior with a jittered grid + inset contour points ── */
    function sampleS(L) {
      const R = rng(7), pitch = L.capPx * 0.034, pts = [];
      const bb = GLYPHS.glyphs.S.bbox;
      const p0 = L.mS.transformPoint({ x: bb[0], y: bb[3] }), p1 = L.mS.transformPoint({ x: bb[2], y: bb[1] });
      const cell = new Map(), key = (x, y) => `${Math.floor(x / pitch)},${Math.floor(y / pitch)}`;
      const tooClose = (x, y) => {
        const cx = Math.floor(x / pitch), cy = Math.floor(y / pitch);
        for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++)
          for (const q of cell.get(`${cx + i},${cy + j}`) || []) if (Math.hypot(q.x - x, q.y - y) < pitch * .78) return true;
        return false;
      };
      const add = (x, y) => { if (tooClose(x, y)) return; const q = { x, y }; pts.push(q); const k = key(x, y); (cell.get(k) || cell.set(k, []).get(k)).push(q); };
      // 1) contour points inset along the inward normal, so thin strokes and terminals are covered
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
      svg.setAttribute("d", GLYPHS.glyphs.S.d);
      const len = svg.getTotalLength(), step = (pitch * .9) / L.s;
      for (let l = 0; l < len; l += step) {
        const a = svg.getPointAtLength(l), b = svg.getPointAtLength(Math.min(len, l + 2));
        let nx = -(b.y - a.y), ny = b.x - a.x; const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
        const pa = L.mS.transformPoint({ x: a.x, y: a.y });
        const ins = pitch * .5;
        for (const sg of [1, -1]) {
          const q = L.mS.transformPoint({ x: a.x + sg * nx * ins / L.s, y: a.y + sg * ny * ins / L.s });
          if (inside(L.pathS, L.mS, q.x, q.y)) { add(q.x, q.y); break; }
        }
      }
      // 2) jittered interior grid
      for (let y = p0.y; y <= p1.y; y += pitch) for (let x = p0.x; x <= p1.x; x += pitch) {
        const jx = x + (R() - .5) * pitch * .36, jy = y + (R() - .5) * pitch * .36;
        if (inside(L.pathS, L.mS, jx, jy)) add(jx, jy);
      }
      // writing order: around the upper bowl counter-clockwise, then the lower bowl clockwise
      const cx = (p0.x + p1.x) / 2, cyU = p0.y + (p1.y - p0.y) * .27, cyL = p0.y + (p1.y - p0.y) * .73, mid = (p0.y + p1.y) / 2;
      const POOL = ["{", "}", "(", ")", "[", "]", "<", ">", "/", ";", ":", "=", "+", "*", "&", "|", "#", "$", "_", "0", "1", ".", "!", "?",
                    "=>", "==", "&&", "||", "::", "//", "{}", "()", "</>", "def", "py", "js", "ts", "fn"];
      return pts.map((q) => {
        let order;
        if (q.y < mid) { const a = Math.atan2(-(q.y - cyU), q.x - cx) * 180 / Math.PI; order = .5 * clamp01((((a - 20) % 360) + 360) % 360 / 250); }
        else { const a = Math.atan2(-(q.y - cyL), q.x - cx) * 180 / Math.PI; order = .5 + .5 * clamp01((((90 - a) % 360) + 360) % 360 / 290); }
        const roll = R(), str = roll < .74 ? POOL[Math.floor(R() * 24)] : roll < .95 ? POOL[24 + Math.floor(R() * 10)] : POOL[34 + Math.floor(R() * 4)];
        const ang = R() * Math.PI * 2, dist = L.capPx * (.45 + R() * .7);
        return {
          x: q.x, y: q.y, order, str, accent: R() < .05,
          size: pitch * (str.length === 1 ? .95 : str.length === 2 ? .66 : .5),
          sx: q.x + Math.cos(ang) * dist, sy: q.y + Math.sin(ang) * dist * .7,
          r0: (R() < .5 ? -1 : 1) * (30 + R() * 120) * Math.PI / 180, s0: .35 + R() * .45,
          jit: R() * 90,
        };
      });
    }

    /* ── P: cut the real glyph into stem + bowl along lines measured from its own pixels ── */
    function splitP(L) {
      const bb = GLYPHS.glyphs.P.bbox;
      const a = L.mP.transformPoint({ x: bb[0], y: bb[3] }), b = L.mP.transformPoint({ x: bb[2], y: bb[1] });
      const off = document.createElement("canvas"); off.width = Math.ceil(W); off.height = Math.ceil(H);
      const o = off.getContext("2d"); o.setTransform(L.mP); o.fill(L.pathP);
      const img = o.getImageData(0, 0, off.width, off.height).data, A = (x, y) => img[(y * off.width + x) * 4 + 3];
      const top = Math.floor(a.y), bot = Math.ceil(b.y), hgt = bot - top;
      const clearAfterStem = (y) => { let x = Math.floor(a.x) - 2; while (x < b.x && A(x, y) === 0) x++; while (x < b.x && A(x, y) > 0) x++; return x; };
      const med = (v) => { v.sort((p, q) => p - q); return v[v.length >> 1]; };
      const stemRows = []; for (let y = Math.round(bot - hgt * .35); y <= Math.round(bot - hgt * .2); y++) stemRows.push(clearAfterStem(y));
      const cutLow = med(stemRows);
      const counterRows = [];
      for (let y = Math.round(top + hgt * .12); y < Math.round(top + hgt * .4); y++) {
        const x = clearAfterStem(y); let again = false; for (let k = x; k < b.x; k++) if (A(k, y) > 0) { again = true; break; }
        if (again) counterRows.push(x);                       // empty gap then ink again = a row through the counter
      }
      const stemR = Math.max(cutLow, counterRows.length ? med(counterRows) : cutLow);
      // bowl bottom: scanning up from stem-only rows, first row with any ink right of the cut
      let bowlB = top + hgt * .5;
      for (let y = Math.round(bot - hgt * .36); y > top; y--) {
        let hit = false; for (let x = stemR; x < Math.ceil(b.x); x++) if (A(x, y) > 0) { hit = true; break; }
        if (hit) { bowlB = y + 1; break; }
      }
      const bowl = { x0: stemR, y0: top - 4, x1: Math.ceil(b.x) + 4, y1: bowlB };           // whole-pixel cut, no overlap: pieces tile exactly
      const cx = (stemR + bowl.x1) / 2, cy = (top + bowlB) / 2;
      // the rope grabs real ink: middle of the top arm's run in the first column past the cut
      let armY = top + (bowlB - top) * .12;
      for (let x = stemR; x < stemR + 6; x++) {
        let y = top; while (y < bowlB && A(x, y) < 128) y++; let y2 = y; while (y2 < bowlB && A(x, y2) >= 128) y2++;
        if (y2 > y) { armY = (y + y2) / 2; break; }
      }
      return {
        stemR, bowlB, top, bot, bowl, cx, cy,
        anchor: { x: stemR - 3, y: armY },                      // on the stem, level with the arm
        attach: { x: stemR + 1, y: armY },                      // on solid ink: the top arm's cut end
        left: Math.floor(a.x) - 4, right: bowl.x1,
        dx0: (b.x - a.x) * .62, dy0: -L.capPx * .06,
      };
    }

    /* ═══ per-frame state, pure function of time ═══ */
    function bowlXform(t) {
      const P = L.P, k = t % T.loop;
      let q = 0, rot = -28, breathe = 0, alpha = smooth(T.bowlIn[0], T.bowlIn[1], k);
      if (k >= T.reel[0]) q = spring((k - T.reel[0]) / T.reel[1], .78);
      const tug = k > T.throw[1] ? .05 * Math.sin(clamp01((k - T.throw[1]) / 140) * Math.PI) : 0;
      breathe = .06 * Math.sin(k / 210) * (1 - clamp01(q));
      const bob = 4 * Math.sin(k / 260) * (1 - clamp01(q));
      let dx = P.dx0 * (1 - q) - P.dx0 * tug, dy = P.dy0 * (1 - q), r = (rot + bob) * (1 - q);
      if (k >= T.out[0]) {                                     // released: tossed back out, ease-in
        const u = easeInOut((k - T.out[0] - 100) / (T.out[1] - T.out[0] - 100));
        dx = P.dx0 * u; dy = P.dy0 * u - Math.sin(u * Math.PI) * L.capPx * .12; r = rot * u; alpha = 1 - smooth(.55, 1, u);
      }
      return { dx, dy, r: r * Math.PI / 180, sc: 1 + breathe, alpha, docked: k >= T.retract[1] && k < T.out[0] };
    }
    function applyBowl(m, P, bx) {          // rotate/scale around the bowl centre, then translate
      return m.translate(bx.dx + P.cx, bx.dy + P.cy).rotate(bx.r * 180 / Math.PI).scale(bx.sc).translate(-P.cx, -P.cy);
    }

    function draw(t) {
      const k = t % T.loop, base = new DOMMatrix([DPR, 0, 0, DPR, 0, 0]);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* ── S ── */
      const outU = k >= T.out[0] ? (k - T.out[0]) / (T.out[1] - T.out[0]) : 0;
      const inkDone = k >= T.ink[0] + T.ink[1] + T.ink[2] && k < T.out[0];
      if (inkDone) { ctx.setTransform(base.multiply(L.mS)); ctx.fillStyle = INK; ctx.fill(L.pathS); }
      else {
        // ink blobs, clipped to the exact glyph
        ctx.save(); ctx.setTransform(base.multiply(L.mS)); ctx.clip(L.pathS); ctx.setTransform(base); ctx.fillStyle = INK; ctx.beginPath();
        const Rmax = L.capPx * .034 * 2.2;
        for (const p of L.tokens) {
          let g = easeOutQuart((k - (T.ink[0] + T.ink[1] * p.order)) / T.ink[2]);
          if (k >= T.out[0]) g = 1 - easeInCubic((k - T.out[0] - 250 * (1 - p.order)) / 380);
          if (g > 0) { ctx.moveTo(p.x + g * Rmax, p.y); ctx.arc(p.x, p.y, g * Rmax, 0, Math.PI * 2); }
        }
        ctx.fill(); ctx.restore();
      }
      // tokens
      if (!inkDone) {
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        for (const p of L.tokens) {
          let u = (k - (T.tokIn[0] + T.tokIn[1] * p.order + p.jit)) / T.tokIn[2];
          let pos = spring(u), alpha = smooth(0, .35, u), sc = p.s0 + (1 - p.s0) * pos, rot = p.r0 * (1 - pos);
          let g = easeOutQuart((k - (T.ink[0] + T.ink[1] * p.order)) / T.ink[2]);
          if (k >= T.out[0]) {
            g = 1 - easeInCubic((k - T.out[0] - 250 * (1 - p.order)) / 380);
            const v = easeInCubic((k - T.out[0] - 300 - 300 * (1 - p.order)) / 700);
            pos = 1 - v; alpha = 1 - smooth(.4, 1, v); sc = 1 - (1 - p.s0) * v; rot = p.r0 * v;
          }
          alpha *= 1 - smooth(.15, .85, g); sc *= 1 - .35 * g;
          if (alpha <= .01) continue;
          const x = p.sx + (p.x - p.sx) * pos, y = p.sy + (p.y - p.sy) * pos;
          ctx.setTransform(base.translate(x, y).rotate(rot * 180 / Math.PI).scale(sc));
          ctx.globalAlpha = alpha; ctx.fillStyle = p.accent ? ACCENT : INK;
          ctx.font = `600 ${p.size.toFixed(2)}px "JetBrains Mono", "DejaVu Sans Mono", ui-monospace, monospace`;
          ctx.fillText(p.str, 0, 0);
        }
        ctx.globalAlpha = 1;
      }

      /* ── P ── */
      const P = L.P, bx = bowlXform(t);
      const stemA = k >= T.out[0] ? 1 - smooth(T.out[0] + 600, T.out[1], k) : smooth(T.stemIn[0], T.stemIn[1] - 100, k);
      const stemY = k >= T.out[0] ? 0 : 14 * (1 - easeOutCubic((k - T.stemIn[0]) / (T.stemIn[1] - T.stemIn[0])));
      if (bx.docked) {                                             // assembled: one exact glyph, no seam
        ctx.setTransform(base.multiply(L.mP)); ctx.fillStyle = INK; ctx.fill(L.pathP);
      } else {
        // stem piece: everything except the bowl rectangle
        ctx.save(); ctx.globalAlpha = stemA; ctx.setTransform(base.translate(0, stemY));
        const clipS = new Path2D(); clipS.rect(P.left, P.top - 4, P.stemR - P.left, P.bot - P.top + 8);
        clipS.rect(P.stemR, P.bowlB, P.bowl.x1 - P.stemR, P.bot - P.bowlB + 4); ctx.clip(clipS);
        ctx.setTransform(base.translate(0, stemY).multiply(L.mP)); ctx.fillStyle = INK; ctx.fill(L.pathP); ctx.restore();
        // bowl piece: the same glyph, clipped to the bowl rectangle, moved as one rigid part
        if (bx.alpha > .01) {
          ctx.save(); ctx.globalAlpha = bx.alpha; const mb = applyBowl(base, P, bx); ctx.setTransform(mb);
          const clipB = new Path2D(); clipB.rect(P.bowl.x0, P.bowl.y0, P.bowl.x1 - P.bowl.x0, P.bowl.y1 - P.bowl.y0); ctx.clip(clipB);
          ctx.setTransform(mb.multiply(L.mP)); ctx.fillStyle = INK; ctx.fill(L.pathP); ctx.restore();
        }
      }
      // rope: drawn from live geometry every frame, so its end is always on the bowl
      const end = rope(t); if (end) {
        ctx.setTransform(base); ctx.globalAlpha = end.alpha; ctx.strokeStyle = INK; ctx.lineCap = "round";
        ctx.lineWidth = L.capPx * .028; ctx.beginPath(); ctx.moveTo(end.ax, end.ay); ctx.quadraticCurveTo(end.cx, end.cy, end.x, end.y); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    function attachAt(t) {                     // the bowl's attach point under its current transform
      const P = L.P, m = applyBowl(new DOMMatrix(), P, bowlXform(t));
      return m.transformPoint(P.attach);
    }
    function rope(t) {
      const k = t % T.loop, P = L.P, A = P.anchor;
      if (k < T.throw[0] || k >= T.retract[1] || k >= T.out[0]) return null;
      const B = attachAt(t);
      let x = B.x, y = B.y, alpha = 1;
      if (k < T.throw[1]) { const u = easeOutCubic((k - T.throw[0]) / (T.throw[1] - T.throw[0])); x = A.x + (B.x - A.x) * u; y = A.y + (B.y - A.y) * u; }
      if (k >= T.retract[0]) { const u = easeInOut((k - T.retract[0]) / (T.retract[1] - T.retract[0])); x = B.x + (A.x - B.x) * u; y = B.y + (A.y - B.y) * u; alpha = 1 - smooth(.6, 1, u); }
      const d = Math.hypot(x - A.x, y - A.y), sag = d * (k < T.throw[1] ? .32 : .16 * (1 - clamp01((k - T.reel[0]) / T.reel[1])) + .02);
      return { ax: A.x, ay: A.y, x, y, cx: (A.x + x) / 2, cy: (A.y + y) / 2 + sag, alpha, Bx: B.x, By: B.y };
    }

    /* ═══ run: one rAF loop; accumulate time only while running, so pausing never jumps ═══ */
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const START_DELAY = 1200;                  // begin the build after the CRT flash
    let raf = 0, last = 0, elapsed = 0, mountT = performance.now(), inView = true, started = false, cancelled = false;
    let ro = null, io = null;

    function tick(now) {
      raf = requestAnimationFrame(tick);
      const dt = now - last; last = now;
      if (now - mountT >= START_DELAY) elapsed += dt;   // accumulate only after the start delay
      draw(elapsed);
    }
    function play() { if (raf || reduced) return; last = performance.now(); raf = requestAnimationFrame(tick); }
    function pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    function sync() { if (!started) return; (inView && !document.hidden) ? play() : pause(); }  // pause off-screen / hidden
    const onVis = () => sync();

    async function begin() {
      try { await document.fonts.load('600 16px "JetBrains Mono"'); } catch (e) {}
      if (cancelled || !canvasRef.current) return;
      layout();
      ro = new ResizeObserver(() => { layout(); if (reduced) draw(T.retract[1] + 50); else if (!raf) draw(elapsed); });
      ro.observe(canvas);
      if (reduced) { draw(T.retract[1] + 50); return; }   // static finished frame
      io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0 });
      io.observe(wrap);
      document.addEventListener("visibilitychange", onVis);
      started = true;
      sync();
    }
    begin();

    if (import.meta.env.DEV) {
      window.__hero = {
        seek: (t) => { pause(); draw(t); },
        probe: () => { const toks = L.tokens, ins = toks.filter((p) => inside(L.pathS, L.mS, p.x, p.y)).length; return { tokens: toks.length, inside: ins, pitch: L.capPx * .034, stemR: L.P.stemR, bowlB: L.P.bowlB, top: L.P.top, bot: L.P.bot }; },
        ropeErr: () => { let worst = 0; for (let t = T.throw[1]; t < T.retract[0]; t += 8) { const r = rope(t); if (r) worst = Math.max(worst, Math.hypot(r.x - r.Bx, r.y - r.By)); } return worst; },
        T,
      };
    }

    return () => {
      cancelled = true; pause();
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (import.meta.env.DEV && window.__hero) delete window.__hero;
    };
  }, []);

  return (
    <div className="mono-canvas-wrap" ref={wrapRef}>
      <canvas ref={canvasRef} className="mono-canvas" role="img" aria-label="SP monogram" />
    </div>
  );
}
