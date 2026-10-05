# Work section fix: text contrast and the real drawer hover

Two problems in the Work rows: the titles and link pills are nearly invisible, and the hover mechanic is
wrong. This spec fixes both.

`work-drawer-prototype.html` (repo root) is a standalone replica of the reference hover. It was frozen
at 20 timestamps and pixel-measured against the reference video, matching within 0.7px on average (6px
max). Port its CSS exactly. Do not re-tune numbers by eye.

This replaces the Work hover described in CLAUDE.md ("bar stays flat, preview hinged at its top
edge"). That description was wrong; step 7 updates it.

## What the reference does (measured)

- Each row is a drawer. On hover, the dark front panel tips toward the viewer around its bottom edge:
  `rotateX(-48.4deg)` under a weak perspective (about 21× the bar height). The bottom edge stays put.
  The top edge drops 31% of the bar height and widens about 3.6%. It overshoots to about -52° at
  160ms and settles by about 280ms.
- Three image files stand behind the front, top-aligned at the slot top. As the front tips, the front
  file appears first and fills the opening. Then the front and middle files slide down, starting 85ms
  and 115ms after hover. Each springs past its rest spot and settles, fanning the stack into three
  bands:
  - Band heights: back 27%, middle 32%, front 41% of the opening.
  - Widths: back ×1.00, middle ×1.023, front ×1.03, so the front files are slightly wider.
- Nothing leaves the row's slot vertically. Rows above and below never move. The bar color doesn't
  change on hover.
- Hover-out: the files fan closed in 130ms, and the front flattens in 300ms starting 30ms later. No
  bounce.

## 1. Fix text contrast

Root cause (confirm in the code): `.work-group` sets no `color`. So `.doc-name` and the link pills
inherit `--ink` (near-black) on the dark bar.

- `.doc-bar`: `background:#0e0c0d; color:#f6f1ea`. Remove any hover background, lift, or shadow.
- `.doc-name`: `#f6f1ea`. `.doc-line`: `rgba(246,241,234,.62)`.
- `.doc-cat`: Geist (not mono, not uppercase), 15px, `#8b898a`. This matches the reference's
  category style.
- New `.doc-stack` directly under the category: Geist 13px, `rgba(246,241,234,.42)`, rendering
  `stack`. Stack info currently lives only in the preview, which is being deleted.
- `.doc-status`: text `rgba(246,241,234,.72)`, border `rgba(246,241,234,.35)`.
- Link pills: text `#f6f1ea`, border `rgba(246,241,234,.32)`. On hover or focus, background
  `#f6f1ea` and text `#0e0c0d`.
- `.doc-note` (the non-link pill): text `rgba(246,241,234,.5)`, dashed border at the same alpha.
- Target contrast against `#0e0c0d`: title at least 15:1, category at least 5.5:1, pills at least
  7:1.

## 2. Delete the old mechanic

- Remove everything in the Work section belonging to the old preview: `.doc-clip`, `.pv`,
  `.pv-num`, `.pv-tag`, the Work `.pv-grid`, and every `.pv--*` rule.
- Before deleting the `.pv--*` rules, copy their gradient values for step 5.
- Also remove:
  - `perspective` and `perspective-origin` on `.doc`, and any `perspective` or `transform-style` on
    `.docs`
  - `.doc:hover{z-index}`
  - the old mobile rule `.doc:hover .doc-clip{...}`
- Remove `stat` from `PROJECTS` (no longer shown).

## 3. New row markup

```jsx
<article className="doc" data-h>
  <div className="doc-files" aria-hidden="true">
    {["back", "mid", "front"].map((layer) => (
      <img key={layer} className={`file ${layer}`} src={p.files[layer].src} alt=""
           loading="lazy" decoding="async" style={{ objectPosition: p.files[layer].pos }} />
    ))}
  </div>
  <div className="doc-bar">
    {p.links[0] && <a className="doc-hit" href={p.links[0].href} target="_blank"
                      rel="noopener noreferrer" aria-hidden="true" tabIndex={-1} />}
    {/* existing content: name + line | cat + stack + status | links */}
  </div>
</article>
```

- DOM order back, mid, front is the paint order. Each project gets
  `files: { front:{src,pos}, mid:{src,pos}, back:{src,pos} }` (step 5).
- `.doc-hit` makes the whole bar open the primary link, so a click still lands while the bar tips:
  `position:absolute; inset:0; z-index:1; border-radius:inherit`. Put `.doc-links` at
  `position:relative; z-index:2` so the pills stay on top and clickable. Projects without links get no
  `.doc-hit`.
- `.doc-bar` stays in normal flow, so the row's height is the bar's height. Don't give it a fixed
  height.
- No ancestor of `.doc` may clip horizontally (no `overflow:hidden` or `clip-path`). The tipped bar's
  top corners overhang the column by about 2%.

## 4. CSS (ported from the prototype; keep values exactly)

Add to `:root`: `--doc-tilt:-48.4deg; --doc-persp:3600px;` (about 21× our ~170px bars), and set
`--doc-radius` to the bar's current corner radius.

```css
.doc{position:relative}
.doc-files{position:absolute;left:0;right:0;top:0;height:42%;clip-path:inset(0 -40px 0 -40px);pointer-events:none}
.file{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
  border-radius:var(--doc-radius) var(--doc-radius) 0 0;transform-origin:50% 0;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35);
  transition:transform 130ms cubic-bezier(.4,0,.2,1)}
.file.back{z-index:1}.file.mid{z-index:2}.file.front{z-index:3}
.doc-bar{position:relative;z-index:4;background:#0e0c0d;color:#f6f1ea;border-radius:var(--doc-radius);
  transform-origin:50% 100%;transform:perspective(var(--doc-persp)) rotateX(0deg);
  transition:transform 300ms cubic-bezier(.25,.7,.3,1) 30ms}
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
```

Rules that matter:
- Write each `linear()` curve literally, never through `var()`. Keep it as the second declaration
  after its `cubic-bezier` fallback. Browsers without `linear()` then keep the fallback. A `var()`
  wrapper would silently drop the whole transition.
- The `translateY` percentages are relative to the file's own height, which is 42% of the bar.
  They equal 0.184× and 0.085× the bar height, so they scale with any bar height.
- Keep the rest-state `transform:perspective(...) rotateX(0deg)`. Don't use `none`, which changes
  how the motion interpolates.

## 5. File images

Each project gets three images in `public/work/`: `<key>-front.jpg`, `<key>-mid.jpg`, and
`<key>-back.jpg`.
- Size 2000×1125 (or the source's native size if smaller), JPG at about quality 72, sRGB, at most
  200 KB each.
- The file boxes are wide, short strips, so `object-fit:cover` shows only a horizontal band of each
  image. Set `pos` (object-position) per file so the band shows something interesting. Skip site nav
  bars; `50% 40%` is a reasonable default.

Capture with headless Chrome at 1600×900, waiting for network idle plus 2 seconds. For YouTube, use
`https://img.youtube.com/vi/<id>/maxresdefault.jpg`, falling back to `hqdefault.jpg`.

| key | front | mid | back |
|---|---|---|---|
| policylens | https://policylens-black.vercel.app/ | YouTube `L08XwNNI8zs` | https://github.com/Swaraj-Patil/PolicyLens (README area) |
| trial | YouTube `e0fk5fH48WY` | https://github.com/Swaraj-Patil/TrialCompanion (README area) | art |
| msstats | https://msstats.org/msstatsshiny/ | https://msstatsshiny.com/app/MSstatsShiny (wait up to 15s) | https://github.com/Vitek-Lab/MSstatsShiny |
| retrace | https://github.com/Swaraj-Patil/retrace (README area) | art | art |
| mongo | the report Google Doc, only if it renders without sign-in; otherwise art | art | art |
| mscllm | art | art | art |

How to make "art": render a 1600×900 HTML card in headless Chrome.
- Use the project's old preview gradient and a 30px grid, with large faint JetBrains Mono glyphs tied
  to the project. Examples: `{ "column": "mapping" }` for mscllm, `span.retrieval` for retrace,
  `TTLMonitor` for mongo, `eligibility_criteria` for trial.
- Vary it per layer: front at full saturation, mid hue-rotated about 25°, back desaturated and
  lighter.
- No numbers, metrics, or results anywhere. MSstatsConvertLLM is unpublished: never capture its
  results, the paper, or lab data.

If a capture comes back blank, a cookie wall, or a login page, use art for that slot and list it in
your report.

## 6. Verify

- `npm run build` passes, and there are no console errors.
- Numeric check in the browser (DevTools or headless):
  1. Add `.is-open` to a `.doc` and wait 700ms.
  2. With `d = doc.getBoundingClientRect()` and `b = bar.getBoundingClientRect()`:
     - `(b.top - d.top) / d.height` is between 0.29 and 0.33.
     - `b.width / d.width` is between 1.02 and 1.05.
     - `d.top` of the next row is unchanged.
  3. Remove `.is-open`; the bar returns to `b.top === d.top`.
- Side by side: open `work-drawer-prototype.html` and the site in two windows and hover each the same
  way. The shape, the files' stagger, the bounce, and the snap back should match.
- Contrast: report the measured ratios from step 1.
- At 880px and below there's no drawer, and rows read normally. Tabbing to a row's link with the
  keyboard opens that drawer; a mouse click on a link does not leave it stuck open.

## 7. Update CLAUDE.md

Replace the Work-hover entry with this:

"Work hover is a drawer. The bar tips toward the viewer about its bottom edge
(`rotateX(-48.4deg)`, perspective about 21× the bar height). Three image files, top-aligned behind
it, fan down: front `translateY(43.8%)`, mid `translateY(20.2%)` of file height. Hover-in uses
staggered spring `linear()` transitions; hover-out uses fast ease-out. The reference is
`work-drawer-prototype.html`, verified against the reference video. Don't change the numbers without
re-measuring."

## 8. Open-source PR stat (ask me before doing this step)

My MSstatsShiny PRs are under my research account `swaraj-neu`. To count the merged ones, run:
`gh search prs --author swaraj-neu --owner Vitek-Lab --merged --limit 200 --json repository,number`

If the count N is 5 or more:
- Set the middle `STATS` item to `["<N>", "merged PRs to open-source MSstats"]`.
- Change the MSstatsShiny link labeled "Repo" back to "PRs", pointing to
  `https://github.com/Vitek-Lab/MSstatsShiny/pulls?q=is%3Apr+author%3Aswaraj-neu`.

Finish with a short report: what changed, which file images are real captures versus art, the
contrast ratios, the numeric check values, and N (if step 8 ran).
