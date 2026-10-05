# Portfolio — notes for Claude

All UI content and styles live in `src/App.jsx` (the `styles` template string at the
bottom holds all the CSS). The 3D facet scenes are in `src/Facet3D.jsx`.

## Work hover (section 03)

Work hover is a drawer. The bar tips toward the viewer about its bottom edge
(`rotateX(-48.4deg)`, perspective about 21× the bar height). Three image files, top-aligned
behind it, fan down: front `translateY(43.8%)`, mid `translateY(20.2%)` of file height.
Hover-in uses staggered spring `linear()` transitions; hover-out uses fast ease-out. The
reference is `work-drawer-prototype.html`, verified against the reference video. Don't change
the numbers without re-measuring.
