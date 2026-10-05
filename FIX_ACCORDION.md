# Fix: Experience tiles vanish when clicked

## Diagnosis

The scroll-reveal observer and React are fighting over the same `class` attribute.

The reveal CSS hides every `[data-reveal]` element, and the IntersectionObserver reveals it by calling
`classList.add("in")` imperatively, then unobserves it so it only ever happens once.

The Experience tiles are the one place where an element has both `data-reveal` and a className that
React recomputes:

```jsx
<div className={`acc-item ${open === i ? "open" : ""}`} data-reveal key={i}>
```

When you click a header, `open` changes, React re-renders, and because that className string changed,
React writes the whole `class` attribute from its own value. Its value does not contain `in`, so the
class the observer added is wiped. The element matches `[data-reveal]` again, fades to opacity 0 and
slides down 38px. The observer already unobserved it, so `in` never comes back and the tile is gone
for good.

On the first click two tiles can vanish at once: the one you clicked, and the one that was open (the
first item is open by default), since both className strings change.

I reproduced the mechanism in a headless browser. With a class, computed opacity goes from 1 to 0 the
moment the className is rewritten. With an attribute, it stays 1.

## Step 1: confirm before changing anything

In DevTools, scroll to Experience, then run this and click a tile:

```js
const t = document.querySelectorAll('.acc-item')[1];
console.log('before', t.className, getComputedStyle(t).opacity);
t.querySelector('.acc-head').click();
setTimeout(() => console.log('after', t.className, getComputedStyle(t).opacity), 50);
```

Expected if the diagnosis is right: `in` is present and opacity is 1 before, then `in` is gone and
opacity is heading to 0 after. If that is not what you see, stop and report what you actually got
instead of applying the fix.

## Step 2: move the reveal flag off the class attribute

This fixes the whole class of bug, not just this one tile, so no future element can hit it.

In the IntersectionObserver callback, set an attribute value instead of adding a class:

```js
// was: e.target.classList.add("in");
e.target.setAttribute("data-reveal", "in");
```

Keep everything else about that effect the same, including `io.unobserve(e.target)`.

Then update the two reveal rules in the styles string:

```css
[data-reveal]{opacity:0;transform:translateY(38px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
[data-reveal="in"]{opacity:1;transform:none}
```

The second selector must stay immediately after the first. Both are attribute selectors with the same
specificity, so source order is what makes the revealed state win. I verified that ordering works.

Why this is safe: JSX `data-reveal` with no value renders as `data-reveal="true"`, which still matches
`[data-reveal]` and starts hidden. React only writes DOM attributes whose prop value changed between
renders, and this prop never changes, so React leaves the observer's `"in"` alone.

Before you finish, grep `src/` for `\.in\b` and `"in"` and `classList`. If anything else depends on
that `in` class, do not force this through. Report what you found and use the fallback below instead.

## Step 3: fallback, only if step 2's grep shows `in` is used elsewhere

Leave the reveal mechanism alone and stop React from owning the accordion's className: drive the open
state with an attribute instead.

```jsx
<div className="acc-item" data-open={open === i ? "true" : "false"} data-reveal key={i}>
```

Then change the open rules from `.acc-item.open` to `.acc-item[data-open="true"]`, including the body
and the plus-icon rotation. The className is now a constant string, so React never rewrites it.

Do not fix this by removing `data-reveal` from the tiles. That stops the bug but loses the entrance
animation, and it leaves the same trap for the next element that needs both.

## Step 4: verify

- Expand and collapse every Experience tile several times. No tile fades out, and none moves down 38px.
- The clicked tile's body animates open and closed, and the plus icon still rotates.
- Reload, scroll down to Experience: tiles still fade and slide up on first appearance, once each.
- Scroll the whole page once and confirm every other `data-reveal` element still reveals: the Hello
  blocks, manifesto lines with their stagger, facets, highlights, Approach cards, capability columns,
  Work rows, About, Contact, Index.
- Click a different tile while one is open: the first closes, the second opens, and neither vanishes.
- Check the Approach tabs still switch correctly, since they also use a dynamic className.

Report which step you applied, the grep result, and whether the reveal animation still fires
everywhere.
