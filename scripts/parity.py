"""Step 5 parity: load the site at 1470 CSS px, read __hero.probe()/ropeErr(), seek + screenshot the canvas."""
import sys, io, os, json
from PIL import Image
from playwright.sync_api import sync_playwright
PORT, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page(viewport={"width": 1470, "height": 900}, device_scale_factor=2)
    pg.goto(f"http://localhost:{PORT}/", wait_until="load")
    pg.wait_for_function("() => window.__hero && (() => { try { window.__hero.probe(); return true } catch(e){ return false } })()", timeout=20000)
    pg.wait_for_timeout(1400)   # let the CRT frame animation settle before screenshotting
    probe = pg.evaluate("() => window.__hero.probe()")
    rope = pg.evaluate("() => window.__hero.ropeErr()")
    box = pg.evaluate("() => { const c = document.querySelector('canvas.mono-canvas').getBoundingClientRect(); return {w:c.width, h:c.height}; }")
    print("PROBE " + json.dumps(probe))
    print("ROPEERR " + repr(rope))
    print("CANVAS_CSS " + json.dumps(box))
    for t in (950, 1300, 1600, 2600):
        pg.evaluate(f"() => window.__hero.seek({t})")
        pg.wait_for_timeout(60)
        png = pg.locator("canvas.mono-canvas").screenshot()
        Image.open(io.BytesIO(png)).save(os.path.join(OUT, f"site-{t}ms.png"))
    br.close()
print("DONE")
