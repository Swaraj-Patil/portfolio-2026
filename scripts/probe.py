"""Print __probe() for a glyph JSON against the prototype (measures armT, ropeW, stemR, bowlB, tokens)."""
import re, os, sys, json
from playwright.sync_api import sync_playwright
proto, gpath = sys.argv[1], sys.argv[2]
glyphs = open(gpath).read().strip()
html = re.sub(r"const GLYPHS = [^\n]*;\n", lambda m: f"const GLYPHS = {glyphs};\n", open(proto).read(), count=1)
run = os.path.join(os.path.dirname(gpath), "_probe_run.html")
open(run, "w").write(html)
with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page(viewport={"width": 1100, "height": 700}, device_scale_factor=2)
    pg.goto("file://" + os.path.abspath(run)); pg.wait_for_timeout(800)
    pr = pg.evaluate("() => __probe()")
    br.close()
print(json.dumps(pr))
