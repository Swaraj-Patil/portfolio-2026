# Portfolio — notes for Claude

All UI content and styles live in `src/App.jsx` (the `styles` template string at the
bottom holds all the CSS). The 3D facet scenes are in `src/Facet3D.jsx`.

## Hero monogram (section 00)

Hero SP is a canvas renderer in `src/HeroMonogram.jsx`, set in Cormorant Garamond. Letters are
vector paths from `src/heroGlyphs.json`, extracted with `scripts/extract_glyphs.py`. S tokens are
sampled inside the real outline, and the ink grows from them clipped to it. The P is cut from the
real glyph into stem and bowl along measured lines, and the bowl docks at identity, so there is no
glyph swap. Every value is an analytic function of time. The reference is
`hero-monogram-prototype.html`. Re-verify with `scripts/hero-verify.py` before changing the font or
the timing.

## Work hover (section 03)

Work hover is a drawer. The bar tips toward the viewer about its bottom edge
(`rotateX(-48.4deg)`, perspective about 21× the bar height). Three image files, top-aligned
behind it, fan down: front `translateY(43.8%)`, mid `translateY(20.2%)` of file height.
Hover-in uses staggered spring `linear()` transitions; hover-out uses fast ease-out. The
reference is `work-drawer-prototype.html`, verified against the reference video. Don't change
the numbers without re-measuring.
