# Rebuild the hero "SP" monogram

Replace the current SVG monogram with a canvas renderer ported from `hero-monogram-prototype.html`.
That prototype was verified headless and passes every check below on three different typefaces. Port
its logic verbatim; do not re-derive any numbers.

Files to put in the repo:
- `hero-monogram-prototype.html` in the repo root (the reference implementation)
- `extract_glyphs.py` and `hero-verify.py` in `scripts/`

Install the tools first: `pip3 install fonttools playwright pillow`, then
`python3 -m playwright install chromium`.

## Why the current one fails

1. **Not smooth.** The monogram is a chain of separate CSS keyframe animations: the token fly-in, the
   clip sweep, the rope's `d` keyframes, the ring keyframes and the glyph crossfade. Each starts on its
   own, so motion arrives in sudden spikes, not as one gesture. Animating SVG `d` and clip transforms
   also repaints the whole SVG on the main thread every frame.
2. **Sparse.** There are 13 hand-placed tokens.
3. **The S is misaligned.** The tokens sit at hand-typed coordinates (`S_TOKENS`), guessing where a
   `<text>` glyph renders. Real glyph placement depends on font metrics, so the solid S lands somewhere
   else.
4. **The P is misaligned.** A hand-placed rect and circle stand in for the stem and bowl, then fade
   into a `<text>` P. The two never coincide, which produces the doubled ghost P.
5. **The font isn't elegant enough.** Fraunces with SOFT and WONK gives soft, chunky terminals.

## How the prototype fixes it

- The letters become vector paths extracted from the font file, so their geometry is known exactly.
  Nothing is rendered as text, and no metrics are guessed.
- **S:** tokens are sampled inside the real S outline on a jittered grid, plus contour points pushed
  inward along the normal so thin strokes are covered. That gives 270 to 330 tokens depending on
  weight, against 13 today. Ink then grows from every token, clipped to the same outline, so the
  letter solidifies from the symbols in writing order. Fully grown, the ink leaves zero glyph pixels
  uncovered, so switching to the plain fill is invisible.
- **P:** the real glyph is cut into a stem piece and a bowl piece. The cut lines are measured from the
  glyph's own pixels: the first fully clear column after the stem, so no anti-aliased fringe travels
  with the bowl, and the first ink row above the stem-only rows. The bowl flies as a rigid clip of the
  same glyph. When it docks at the identity transform, the two pieces are the exact P, so no swap is
  needed. The rope is redrawn every frame from live geometry and grabs the top arm's cut end, so it can
  never detach.
- **Smooth:** one canvas, one `requestAnimationFrame` loop, and every value is an analytic function of
  time (damped springs and eases, no keyframes), with phases overlapping. Draw cost is about 0.3ms per
  frame, 2.5ms at p95, measured even under headless software rendering.

## Step 1: pick the font (ask me)

Render these candidates. They are all Google Fonts, in the `google/fonts` GitHub repo under `ofl/`.
If a path is wrong, find the TTF in that directory.

| font | directory | instance |
|---|---|---|
| Bodoni Moda (my default) | `ofl/bodonimoda` | `--axes wght=700,opsz=96` |
| Cormorant Garamond | `ofl/cormorantgaramond` | `--axes wght=700` |
| Libre Caslon Display | `ofl/librecaslondisplay` | static Regular |
| Gilda Display | `ofl/gildadisplay` | static Regular |
| Instrument Serif | `ofl/instrumentserif` | static Regular |

For each candidate:

```
python3 scripts/extract_glyphs.py <font.ttf> scripts/hero-glyphs/<name>.json [--axes ...]
python3 scripts/hero-verify.py hero-monogram-prototype.html scripts/hero-glyphs/<name>.json --quick --out scripts/hero-glyphs
```

`--quick` prints that font's token count and saves its finished SP render. Assemble one comparison
sheet with one row per font, showing the finished render and its token count, and show it to me.
Note in the sheet that lighter faces give fewer tokens because the strokes are thinner. Wait for my
pick before continuing.

## Step 2: verify the pick on the prototype

Run the full harness with the chosen JSON:

```
python3 scripts/hero-verify.py hero-monogram-prototype.html scripts/hero-glyphs/<pick>.json --out scripts/hero-glyphs
```

All five checks must report PASS: tokens inside the S, S ink coverage, P assembly, rope attachment,
and motion smoothness. Show me the five frame renders it saves. If any check fails, stop and report
it; do not tune numbers to force a pass. Then copy the JSON to `src/heroGlyphs.json`.

## Step 3: port into `src/HeroMonogram.jsx`

- Create one component that renders a `<canvas role="img" aria-label="SP monogram">`. Import
  `heroGlyphs.json`.
- Port the prototype's `<script>` into the component's effect as a closure. Keep these exactly:
  - the `T` timeline
  - the easing functions and `spring`
  - the seeded RNG
  - `layout`, `sampleS`, `splitP`, `bowlXform`, `applyBowl`, `draw`, `attachAt`, `rope`
- Lifecycle:
  - Await `document.fonts.load('600 16px "JetBrains Mono"')`, then lay out and start.
  - Re-lay out on `ResizeObserver`.
  - Start the timeline 1200ms after mount, so the build begins after the CRT flash.
  - Accumulate elapsed time only while running. Pause when the hero is off-screen (IntersectionObserver)
    or `document.hidden`, so resuming continues smoothly instead of jumping.
  - Under `prefers-reduced-motion: reduce`, draw a single static frame of the finished SP.
  - Cancel the frame loop and disconnect the observers on unmount.
- Read the ink and accent colors from the `--ink` and `--orange` CSS variables at layout time, not
  hardcoded.
- Add weight 600 to the JetBrains Mono `@import` in the styles string.
- In `import.meta.env.DEV` only, expose `window.__hero = { seek, probe, ropeErr, T }`, mirroring the
  prototype's test hooks.

Mount it inside the existing `.mono` container in place of `.mono-svg`. Give the canvas wrapper
`width:min(86%,1000px); aspect-ratio:1000/568; position:relative`, with the canvas absolutely
filling it. That keeps the same footprint as today, so the corner labels and tagline do not move.

## Step 4: remove the old monogram

Delete all of the following:
- the `S_TOKENS` constant
- the SVG monogram markup (`.mono-svg` and its children)
- the `.s-tok`, `.s-fill`, `.s-sweep`, `.p-stem`, `.p-rope`, `.p-ring`, and `.p-fill` rules
- the `sTok`, `sFill`, `sSweep`, `pStem`, `pRope`, `pRing`, and `pFill` keyframes
- the monogram's reduced-motion block
- the `--sp-font` variable
- the Fraunces, Bodoni Moda, and DM Serif Display `@import` lines, unless something else still uses
  them. Grep before deleting.

## Step 5: parity check on the site

With the window exactly 1470 CSS px wide, the site's canvas comes out 1000 by 568, the same as the
prototype's. Call `__hero.probe()` and `__hero.ropeErr()`. The token count, `stemR`, and `bowlB` must
equal the prototype's values for the same font, and `ropeErr` must be 0. A mismatch means the port
changed something. Then call `__hero.seek` at 950, 1300, 1600, and 2600 and screenshot each next to
the prototype's renders at the same times. They should be identical.

## Step 6: smoothness in a real browser (my job, give me the snippet)

Headless cannot measure real frame timing. Print this snippet for me to paste into Chrome's console
while the hero is building. It samples about 4 seconds of frames:

```js
(() => { const d = []; let last = performance.now(), n = 0;
  const f = (t) => { d.push(t - last); last = t;
    if (++n < 240) requestAnimationFrame(f);
    else { d.sort((a, b) => a - b); const q = (p) => d[Math.floor(d.length * p)].toFixed(1);
      console.log(`p50 ${q(.5)}ms  p95 ${q(.95)}ms  long frames (>20ms): ${d.filter((x) => x > 20).length}/${d.length}`); } };
  requestAnimationFrame(f); })();
```

Ask me to run it three times:
1. as is
2. after `document.querySelector('.grain').style.display='none'`
3. after also running `document.querySelector('.cur-ring').style.backdropFilter='none'`

The full-screen grain overlay uses `mix-blend-mode:multiply`, and the glass cursor uses an SVG
displacement filter in `backdrop-filter`. Both force the browser to re-composite the whole viewport
whenever the hero repaints. Change either one only if my numbers show it costs frames, and tell me the
before and after figures.

## Step 7: update CLAUDE.md

Replace the hero monogram entry with this:

"Hero SP is a canvas renderer in `src/HeroMonogram.jsx`. Letters are vector paths from
`src/heroGlyphs.json`, extracted with `scripts/extract_glyphs.py`. S tokens are sampled inside the
real outline, and the ink grows from them clipped to it. The P is cut from the real glyph into stem
and bowl along measured lines, and the bowl docks at identity, so there is no glyph swap. Every value
is an analytic function of time. The reference is `hero-monogram-prototype.html`. Re-verify with
`scripts/hero-verify.py` before changing the font or the timing."

Finish with a report: the chosen font, its token count, the step 2 check results, the step 5 parity
values, and anything you could not do.
