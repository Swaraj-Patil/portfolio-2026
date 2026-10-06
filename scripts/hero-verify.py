"""Verify the hero monogram mechanics for a given glyph JSON, using the prototype as the renderer.

Usage:
  python3 hero-verify.py PROTOTYPE_HTML GLYPHS_JSON [--quick] [--out DIR]

Needs: pip install playwright pillow && python -m playwright install chromium

Checks, with the pass bar each must meet:
  tokens inside the S outline        must be 100%
  S ink coverage at full growth      must leave 0 glyph pixels uncovered
  P stem + bowl pieces at identity   must match the glyph within 0.2% of its pixels
  rope end vs bowl attach point      must be 0.0 px while reeling
  motion                             no frame-to-frame jump above 35% of peak
--quick runs only the token probe and renders the finished state (for comparing fonts).
"""
import io, re, sys, json, os
from PIL import Image
from playwright.sync_api import sync_playwright

proto, gpath = sys.argv[1], sys.argv[2]
quick = "--quick" in sys.argv
outdir = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else "."
os.makedirs(outdir, exist_ok=True)
glyphs = open(gpath).read().strip()
html = re.sub(r"const GLYPHS = [^\n]*;\n", lambda m: f"const GLYPHS = {glyphs};\n", open(proto).read(), count=1)
run = os.path.join(outdir, "_hero_run.html")
open(run, "w").write(html)

CHECKS = r"""() => {
  const out = { probe: __probe(), ropeErr: __ropeErr() };
  const base = new DOMMatrix([DPR,0,0,DPR,0,0]), P = L.P;
  const mk = () => { const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height; return c; };
  const c1 = mk(), a = c1.getContext('2d');
  a.save(); a.setTransform(base); const cs = new Path2D();
  cs.rect(P.left, P.top-4, P.stemR-P.left, P.bot-P.top+8); cs.rect(P.stemR, P.bowlB, P.bowl.x1-P.stemR, P.bot-P.bowlB+4);
  a.clip(cs); a.setTransform(base.multiply(L.mP)); a.fill(L.pathP); a.restore();
  a.save(); a.setTransform(base); const cb = new Path2D(); cb.rect(P.bowl.x0, P.bowl.y0, P.bowl.x1-P.bowl.x0, P.bowl.y1-P.bowl.y0);
  a.clip(cb); a.setTransform(base.multiply(L.mP)); a.fill(L.pathP); a.restore();
  const c2 = mk(), b = c2.getContext('2d'); b.setTransform(base.multiply(L.mP)); b.fill(L.pathP);
  const d1 = a.getImageData(0,0,c1.width,c1.height).data, d2 = b.getImageData(0,0,c2.width,c2.height).data;
  let px = 0, bad = 0; for (let i = 3; i < d1.length; i += 4) { if (d2[i] > 0) px++; if (Math.abs(d1[i]-d2[i]) > 8) bad++; }
  out.pAssembly = { glyphPx: px, pxOff: bad };
  const c3 = mk(), e = c3.getContext('2d'); e.save(); e.setTransform(base.multiply(L.mS)); e.clip(L.pathS); e.setTransform(base); e.beginPath();
  const R = L.capPx*.034*2.2; for (const p of L.tokens) { e.moveTo(p.x+R, p.y); e.arc(p.x, p.y, R, 0, Math.PI*2); } e.fill(); e.restore();
  const c4 = mk(), f = c4.getContext('2d'); f.setTransform(base.multiply(L.mS)); f.fill(L.pathS);
  const d3 = e.getImageData(0,0,c3.width,c3.height).data, d4 = f.getImageData(0,0,c4.width,c4.height).data;
  let sp = 0, unc = 0; for (let i = 3; i < d3.length; i += 4) if (d4[i] > 200) { sp++; if (d3[i] < 200) unc++; }
  out.sCoverage = { glyphPx: sp, uncovered: unc };
  const w = canvas.width, h = canvas.height, st = 6; let prev = null; const energy = [];
  for (let t = 0; t <= __T.loop; t += 1000/30) { draw(t); const d = ctx.getImageData(0,0,w,h).data, g = [];
    for (let y = 0; y < h; y += st) for (let x = 0; x < w; x += st) g.push(d[(y*w+x)*4+3]);
    if (prev) { let s = 0; for (let i = 0; i < g.length; i++) s += Math.abs(g[i]-prev[i]); energy.push(s/g.length); } prev = g; }
  out.energy = energy; return out;
}"""

with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page(viewport={"width": 1100, "height": 700}, device_scale_factor=2)
    pg.goto("file://" + os.path.abspath(run)); pg.wait_for_timeout(800)
    pg.evaluate("() => __seek(0)")
    probe = pg.evaluate("() => __probe()")
    name = os.path.splitext(os.path.basename(gpath))[0]
    pg.evaluate("() => __seek(2600)")
    Image.open(io.BytesIO(pg.locator("canvas").screenshot())).save(os.path.join(outdir, f"{name}-finished.png"))
    print(f"[{name}] tokens {probe['tokens']}, inside S {probe['inside']}/{probe['tokens']}")
    if quick:
        br.close(); sys.exit(0)
    r = pg.evaluate(CHECKS)
    for t in (650, 950, 1300, 1600, 5800):
        pg.evaluate(f"() => __seek({t})")
        Image.open(io.BytesIO(pg.locator("canvas").screenshot())).save(os.path.join(outdir, f"{name}-{t}ms.png"))
    br.close()

ok = True
def check(label, passed, detail):
    global ok; ok &= passed; print(f"  {'PASS' if passed else 'FAIL'}  {label}: {detail}")
pa, sc, e = r["pAssembly"], r["sCoverage"], r["energy"]
m = max(e) or 1; jumps = sum(1 for a, b in zip(e, e[1:]) if abs(b - a) > .35 * m)
check("tokens inside S", probe["inside"] == probe["tokens"], f"{probe['inside']}/{probe['tokens']}")
check("S ink coverage", sc["uncovered"] == 0, f"{sc['uncovered']} of {sc['glyphPx']} px uncovered")
check("P assembly", pa["pxOff"] <= .002 * pa["glyphPx"], f"{pa['pxOff']} of {pa['glyphPx']} px differ (anti-aliasing noise allowed up to 0.2%)")
check("rope attachment", r["ropeErr"] < .01, f"{r['ropeErr']:.3f} px worst")
check("motion smoothness", jumps == 0, f"{jumps} frame-to-frame jumps above 35% of peak")
print("ALL PASS" if ok else "SOME CHECKS FAILED")
sys.exit(0 if ok else 1)
