"""Extract glyph outlines as SVG path data (font units, y-up) for the hero monogram.

Usage:
  python3 extract_glyphs.py FONT_FILE OUT_JSON [--axes wght=700,opsz=96] [--chars SP]

Variable fonts are instanced at the given axis values first, so the outline matches the weight you
pick exactly. Output: {"upm", "ascender", "descender", "capHeight", "glyphs": {ch: {"d", "adv",
"bbox": [xMin, yMin, xMax, yMax]}}, "kern": {"SP": value}}.
"""
import json, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen


def instance(font, axes):
    if "fvar" not in font or not axes:
        return font
    from fontTools.varLib.instancer import instantiateVariableFont
    return instantiateVariableFont(font, axes, inplace=False)


def kern_pair(font, left, right):
    """Best-effort pair kerning from GPOS PairPos (format 1 and 2), else legacy kern."""
    try:
        gpos = font["GPOS"].table
        for lookup in gpos.LookupList.Lookup:
            for st in lookup.SubTable:
                st = getattr(st, "ExtSubTable", st)
                if getattr(st, "LookupType", None) not in (None, 2) or not hasattr(st, "Format"):
                    continue
                cov = st.Coverage.glyphs if hasattr(st, "Coverage") else []
                if left not in cov:
                    continue
                if st.Format == 1:
                    ps = st.PairSet[cov.index(left)]
                    for rec in ps.PairValueRecord:
                        if rec.SecondGlyph == right and rec.Value1 is not None:
                            return getattr(rec.Value1, "XAdvance", 0) or 0
                elif st.Format == 2:
                    c1 = st.ClassDef1.classDefs.get(left, 0)
                    c2 = st.ClassDef2.classDefs.get(right, 0)
                    v = st.Class1Record[c1].Class2Record[c2].Value1
                    if v is not None:
                        return getattr(v, "XAdvance", 0) or 0
    except Exception:
        pass
    try:
        for t in font["kern"].kernTables:
            if (left, right) in t.kernTable:
                return t.kernTable[(left, right)]
    except Exception:
        pass
    return 0


def main():
    args = sys.argv[1:]
    src, out = args[0], args[1]
    axes, chars = {}, "SP"
    if "--axes" in args:
        for kv in args[args.index("--axes") + 1].split(","):
            k, v = kv.split("=")
            axes[k] = float(v)
    if "--chars" in args:
        chars = args[args.index("--chars") + 1]
    font = instance(TTFont(src), axes)
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    os2 = font["OS/2"] if "OS/2" in font else None
    data = {
        "source": src.split("/")[-1], "axes": axes,
        "upm": font["head"].unitsPerEm,
        "ascender": font["hhea"].ascent, "descender": font["hhea"].descent,
        "capHeight": getattr(os2, "sCapHeight", None) if os2 else None,
        "glyphs": {}, "kern": {},
    }
    names = {}
    for ch in chars:
        name = cmap[ord(ch)]
        names[ch] = name
        pen = SVGPathPen(gs)
        gs[name].draw(pen)
        bp = BoundsPen(gs)
        gs[name].draw(bp)
        data["glyphs"][ch] = {"d": pen.getCommands(), "adv": gs[name].width,
                              "bbox": [round(v, 2) for v in bp.bounds]}
    for a, b in zip(chars, chars[1:]):
        data["kern"][a + b] = kern_pair(font, names[a], names[b])
    with open(out, "w") as f:
        json.dump(data, f)
    g = data["glyphs"]
    print(f"{data['source']} upm={data['upm']} capHeight={data['capHeight']} "
          + " ".join(f"{c}:adv={g[c]['adv']} bbox={g[c]['bbox']} d={len(g[c]['d'])}ch" for c in chars)
          + f" kern={data['kern']}")


if __name__ == "__main__":
    main()
