# Match the reference's tab borders (Approach principle tabs)

Our principle tabs (Source-Grounded / Eval-Driven / Integrity-First / Production-Ready) are a plain
row of text with one faint line under it. The reference builds the same row as real folder tabs: each
tab is a bordered box, and the active tab's bottom border is removed so it merges into the panel
below. Two things cause the difference: the missing per-tab borders, and our border token being far
too faint.

All values below were measured from the two screenshots, taken in the same 1470px window at 2x.

## What the reference does

| | reference | ours |
|---|---|---|
| border weight and color | 1px solid ink, measured rgb(14,14,14) | 1px rgba(10,10,9,.18) |
| divider between tabs | yes, 1px, full tab height | none visible |
| line under the tabs | yes, 1px, but absent under the active tab | one faint line under the whole row |
| tab height | 60 | 88 |
| tab inner padding, left and right | 27 | about 30 |
| active tab label | purple | purple, already matches |
| inactive tab label | ink | ink, already matches |
| active number pill | filled purple, cream text | outlined purple, purple text |
| inactive number pill | transparent, 1px ink border, ink text | faint outline |
| pill size | 44 x 25, fully rounded | about 38 x 26 |
| card corner radius | about 14 | 18 |

Card geometry for reference: the card spans the full main column. Its four tabs are equal quarters,
and the only lines at the card's outer left and right edges are the card's own border, so tabs must
not add outer side borders of their own.

## 1. Border token

This is the main reason the borders read as missing. The reference draws cream-panel borders and inner
hairline dividers at full-strength ink, not at 18% opacity. I confirmed it on three different cream
cards and on an inner row divider.

```css
--line:#0e0c0d;   /* was rgba(10,10,9,.18) */
```

This is deliberately global. It strengthens every cream-panel border on the site, which is what the
reference does. Expect visible changes on the hero frame, the cream Hello and Approach blocks, the
capability columns, the principle card, the experience accordion items, and the hairline rules inside
the "I make AI" block and the Challenge/Goal rows. Look at those after the change and tell me if any
of them now reads too heavy; do not soften the token to compensate without asking.

Leave borders on dark panels alone. `.doc-bar`'s `rgba(255,255,255,.08)` is correct and unrelated.

## 2. Tab row

Read the current `.prin`, `.prin-tabs`, `.prin-tab`, and `.prin-num` rules first, then replace their
border, size, and padding declarations with the following. Keep the existing `prin` state logic, the
click handler, the `.prin-proof` block, and the panel markup as they are.

```css
.prin{background:var(--cream);border:1px solid var(--line);border-radius:14px;overflow:hidden;
  display:flex;flex-direction:column;min-height:90vh}
.prin-tabs{display:grid;grid-template-columns:repeat(4,1fr)}
.prin-tab{display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;
  min-height:60px;padding:0 27px;
  border-left:1px solid var(--line);
  border-bottom:1px solid var(--line);
  transition:background .3s,color .3s}
.prin-tab:first-child{border-left:none}
.prin-tab:hover{background:rgba(90,18,232,.06)}
.prin-tab.on{color:var(--purple);border-bottom-color:transparent}
```

Three points that matter:
- The divider is `border-left` on every tab except the first, so adjacent tabs share one 1px line
  instead of stacking two. The card's own border supplies the outer left and right edges.
- `border-bottom` belongs on each tab, not on `.prin-tabs`. If the container keeps a bottom border,
  the line will still run under the active tab and the folder effect will not appear.
- The active tab sets `border-bottom-color:transparent` rather than `border-bottom:none`, so its
  height does not change by 1px when it becomes active.

Keep `overflow:hidden` on `.prin` so the first and last tabs get the card's rounded top corners.

Not replicated: in the reference the inactive tabs sit about 1.5px higher than the active one. That is
below the threshold of visibility and is not worth the layout risk. Skip it.

## 3. Number pills

```css
.prin-num{font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1;
  min-width:44px;padding:7px 0;text-align:center;
  background:transparent;color:var(--ink);
  border:1px solid var(--line);border-radius:999px}
.prin-tab.on .prin-num{background:var(--purple);border-color:var(--purple);color:var(--cream)}
```

The active pill is filled, not outlined. That is the clearest signal of which tab is selected in the
reference, and it is the detail our version is missing.

## 4. Optional, ask me first

The reference's cream cards use a corner radius of about 14, where our panels use 18. The CSS above
sets 14 on `.prin` only. If you want the whole site to match, that is a separate change to every
panel radius, so raise it with me instead of doing it now.

## 5. Verify

At a 1470px window, with the Approach tabs on screen:

- a tab's `getBoundingClientRect().height` is 60 (±1)
- the four tabs have equal widths, each a quarter of the card's inner width (±1)
- `getComputedStyle` on the first tab reports `border-left-width` of 0px, and on the others 1px
- the active tab's `border-bottom-color` is transparent, and every inactive tab's is the ink value
- the active pill's `background-color` is the purple token, and its text color is the cream token
- an inactive pill's `background-color` is transparent, with a 1px ink border
- click each tab in turn: the gap in the bottom line follows the selected tab, and the panel text and
  the "In practice" line swap with it
- no 2px-looking doubled line anywhere in the row

Then check the rest of the site for the stronger `--line`, at 1470px and at 900px: hero frame, Hello
cream blocks, capability columns, accordion items. Report anything that now looks too heavy.

Finish with a short report: the measured tab height and widths, the computed border and pill values
above, and your judgment on whether the stronger `--line` suits the other panels.
