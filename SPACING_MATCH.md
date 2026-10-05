# Match the reference site's sidebar and main-section spacing

Our outer gutters are all one 8px token, so the panels nearly touch the window edge. The reference
uses larger, deliberately uneven gutters. This spec replaces the single `--gap` token with named
spacing tokens and rewires the layout to them.

## Measured values

Measured from screenshots of both sites in the same 1470 CSS px window (2x retina, so halved), and
cross-checked against the reference hover video.

| metric | reference | ours |
|---|---|---|
| left gutter, window edge to sidebar card | 24 | 8 |
| sidebar card width | 178 | 180 |
| gap, sidebar card to main panel | 28 | 8 |
| right gutter, main panel to window edge | 32 | 8 |
| top gutter | 24 | 8 |
| gap between sidebar cards | 12 | 6 |
| gap between stacked main cards | 14 | 8 |
| gap between the 3 capability columns | 16 | 8 |
| gap between Work rows | 14 | 14, already matches |
| main bar inner left and right padding | 48 | 44 |

Derived: the reference's main panel starts at x=230 (24+178+28) and ends at x=1438 (1470-32).

The gutters are not fixed px. A second reference capture at a 784px viewport gives 11 / 98 / 13 / 16
instead of 24 / 178 / 28 / 32, so the spacing scales with viewport width. The clamp values below
reproduce the reference within about 3px at both measured viewports, which is why they are fluid
rather than fixed. Each floor is set so it only takes effect below the 880px breakpoint, where the
mobile layout takes over; above that the tokens are purely proportional, as the reference is.

## 1. Replace the spacing tokens

In `:root`, keep `--nav-w` as a derived value and add these. Remove `--gap` at the end of step 2.

```css
--pad-edge:clamp(10px,1.63vw,30px);    /* top, bottom, left gutters: 24 at 1470 */
--pad-right:clamp(14px,2.18vw,40px);   /* right gutter: 32 at 1470 */
--nav-card:clamp(106px,12.1vw,210px);  /* sidebar card width: 178 at 1470 */
--nav-gap:clamp(12px,1.9vw,34px);      /* sidebar card to main panel: 28 at 1470 */
--nav-vgap:clamp(6px,.82vw,15px);      /* between sidebar cards: 12 at 1470 */
--stack:14px;                          /* between stacked main cards */
--col-gap:16px;                        /* between side-by-side columns */
--nav-w:calc(var(--pad-edge) + var(--nav-card));
```

## 2. Rewire the layout

```css
.nav{width:var(--nav-w);padding:var(--pad-edge) 0 var(--pad-edge) var(--pad-edge);gap:var(--nav-vgap)}
.screen{margin-left:var(--nav-w);
  padding:var(--pad-edge) var(--pad-right) var(--pad-edge) var(--nav-gap);
  gap:var(--stack)}
.hero{height:calc(100vh - var(--pad-edge) * 2)}
```

`.nav` keeps `position:fixed; left:0`, so its content box is exactly `--nav-card` wide and the cards
sit between x=24 and x=202. `.screen`'s left padding is the sidebar-to-main gap, putting the main
panels at x=230.

Then find every remaining `var(--gap)` and convert it:
- vertical gaps between stacked main cards (`.screen`, `.hello-group`, `.approach-group`,
  `.work-group`, `.pbars`, `.docs`, and any other column stack) become `var(--stack)`
- horizontal gaps in side-by-side grids (`.cap-cols`, and any similar multi-column grid) become
  `var(--col-gap)`
- anything left that is neither, report it instead of guessing

When nothing references `var(--gap)`, delete the token. Do not leave it defined and unused.

Optional, to finish matching the bars: change `.doc-bar`'s horizontal padding so it computes to 48px
at this width (the current `clamp(26px,3vw,44px)` tops out at 44). Use `clamp(26px,3.3vw,48px)`.
Leave the vertical padding alone.

## 3. Mobile

Inside `@media (max-width:880px)`, keep the existing top-bar behavior and only swap the hardcoded
spacing:
- keep `--nav-w:0px`
- `.nav` keeps its row layout; set its padding to `var(--pad-edge)` and its gap to `var(--nav-vgap)`
- `.screen{margin-left:0;padding:var(--pad-edge)}` plus the existing top padding that clears the
  fixed top bar, recomputed if the bar's height changed

## 4. Verify

With the browser window at exactly 1470 CSS px wide (check `window.innerWidth`), read
`getBoundingClientRect()` and confirm:

- a sidebar card: `left` is 24 (±1) and `width` is 178 (±1)
- the first main panel: `left` is 230 (±1) and `right` is 1438 (±1)
- two adjacent sidebar cards: the gap is 12 (±1)
- two adjacent stacked main cards: the gap is 14 (±1)
- two adjacent capability columns: the gap is 16 (±1)
- no horizontal scrollbar: `document.documentElement.scrollWidth` equals `window.innerWidth`

Then resize to 1100px and 900px and confirm the layout still holds with no overlap and no horizontal
scroll, and at 820px confirm the mobile top bar still engages correctly.

The Work drawer is sensitive to this change, because the tipped bar overhangs its column by about 2%.
After the change, hover a Work row and confirm the drawer still opens correctly and nothing clips at
the left or right edge.

Report the measured numbers from the checks above, every `var(--gap)` site you converted and what you
converted it to, and anything that did not fit the three categories.
