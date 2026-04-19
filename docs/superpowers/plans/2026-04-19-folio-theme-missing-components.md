# Folio Theme — Missing Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add all CSS and Liquid components present in the mockup but missing from the live Shopify folio theme, so every page renders correctly with the full design system applied.

**Architecture:** The live theme (`folio/`) shares the same design tokens and CSS variables as the mockup (`folio-mockup.css`). All missing CSS is appended to `folio/assets/folio.css`. Missing Liquid drawers are added as snippets included in `folio/layout/theme.liquid`.

**Tech Stack:** Shopify Liquid, CSS (custom properties, CSS Grid/Flex), vanilla JS (no build step).

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `folio/assets/folio.css` | Modify | Add 5 CSS blocks: noa-page, noa-contact+noa-form, noa-faq, noa-size-guide, materials-grid fix |
| `folio/sections/materials.liquid` | Modify | Fix class names to match existing CSS OR add new CSS for current class names |
| `folio/layout/theme.liquid` | Modify | Include search-drawer and cart-drawer snippets + JS |
| `folio/snippets/search-drawer.liquid` | Create | Search drawer overlay |
| `folio/snippets/cart-drawer.liquid` | Create | Cart drawer slide-over |

---

## Task 1: Add noa-page base CSS

Missing: `.noa-page`, `.noa-page__head`, `.noa-page__title`, `.noa-page__body` — used by `page.liquid`, `page.contact.liquid`, `page.faq.liquid`, `page.size-guide.liquid`. Without this, those pages have no padding, heading size, or layout.

**Files:**
- Modify: `folio/assets/folio.css` (append at end)

- [ ] **Step 1: Append noa-page CSS to end of folio.css**

Open `folio/assets/folio.css` and append at the very end (after line 2681):

```css
/* ==========================================================================
   Generic page layout (page.liquid, contact, faq, size-guide)
   ========================================================================== */
.noa-page {
  width: 100%;
  max-width: 85rem;
  margin-inline: auto;
  padding: var(--section-y) var(--gutter);
}
.noa-page__head {
  margin-bottom: var(--stack);
  border-bottom: 1px solid var(--rule);
  padding-bottom: 2rem;
}
.noa-page__title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
  line-height: 1.15;
}
.noa-page__body {
  max-width: 72ch;
}
.noa-page__body p { margin: 0 0 1em; }
```

- [ ] **Step 2: Open mockup in browser and open a `/pages/about` page in Shopify preview to confirm heading and padding now applies**

Manual check: `noa-page__head` should have a visible bottom border, title should be uppercase display font.

- [ ] **Step 3: Commit**

```bash
cd /Users/davidbudzik/Desktop/shopify-theme
git add folio/assets/folio.css
git commit -m "feat: add noa-page base CSS for generic page templates"
```

---

## Task 2: Add noa-contact and noa-form CSS

Missing: All `.noa-contact__*` layout and `.noa-form-*` form element classes. The contact page (`page.contact.liquid`) renders a two-column grid (info | form) with no styles.

**Files:**
- Modify: `folio/assets/folio.css` (append at end)

- [ ] **Step 1: Append noa-contact and noa-form CSS**

Append to end of `folio/assets/folio.css`:

```css
/* ==========================================================================
   Contact page layout
   ========================================================================== */
.noa-contact__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 800px) {
  .noa-contact__grid {
    grid-template-columns: 1fr 1.6fr;
    gap: 4rem;
    align-items: start;
  }
}

.noa-contact__copy {
  font-size: var(--fs-md);
  color: var(--graphite);
  line-height: 1.65;
  margin: 0 0 1.5rem;
}

.noa-contact__details {
  display: grid;
  gap: 1rem;
  font-size: var(--fs-sm);
}
.noa-contact__details dt {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--graphite);
  margin-bottom: 0.15rem;
}
.noa-contact__details dd {
  margin: 0 0 0.5rem;
  color: var(--ink);
}
.noa-contact__details a { color: var(--ink); text-underline-offset: 0.2em; }
.noa-contact__details a:hover { color: var(--graphite); }

.noa-contact__success {
  font-size: var(--fs-md);
  color: var(--graphite);
  padding: 1.25rem;
  border: 1px solid var(--rule);
  background: var(--surface-soft);
}
.noa-contact__error {
  font-size: var(--fs-sm);
  color: #b00020;
  margin-bottom: 1rem;
}

/* ==========================================================================
   Shared form elements (contact form)
   ========================================================================== */
.noa-form-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}
.noa-form-label {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--graphite);
}
.noa-form-input {
  width: 100%;
  height: 2.75rem;
  padding: 0 0.875rem;
  border: 1px solid var(--rule);
  background: var(--white);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: var(--fs-base);
  letter-spacing: 0.02em;
  outline: none;
  transition: border-color 0.15s;
}
.noa-form-input:focus { border-color: var(--ink); }
.noa-form-input::placeholder { color: var(--stone); }
.noa-form-textarea {
  height: auto;
  padding: 0.75rem 0.875rem;
  resize: vertical;
  min-height: 9rem;
}
```

- [ ] **Step 2: Verify contact page renders two-column layout**

Open `/pages/contact` in Shopify preview. Should show info column on left, form on right (on desktop). Form inputs should have border, correct font.

- [ ] **Step 3: Commit**

```bash
git add folio/assets/folio.css
git commit -m "feat: add noa-contact and noa-form CSS for contact page"
```

---

## Task 3: Add noa-faq CSS

Missing: All `.noa-faq__*` classes. The FAQ page (`page.faq.liquid`) renders two columns of accordions with no layout or spacing.

**Files:**
- Modify: `folio/assets/folio.css` (append at end)

- [ ] **Step 1: Append noa-faq CSS**

Append to end of `folio/assets/folio.css`:

```css
/* ==========================================================================
   FAQ page
   ========================================================================== */
.noa-faq__intro {
  max-width: 60ch;
  font-size: var(--fs-md);
  color: var(--graphite);
  margin-bottom: var(--stack);
  line-height: 1.65;
}

.noa-faq__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: var(--stack);
}
@media (min-width: 800px) {
  .noa-faq__grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
}

.noa-faq__col { display: flex; flex-direction: column; }

.noa-faq__section-label {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--graphite);
  margin: 0 0 0.75rem;
}

.noa-faq__cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding-top: var(--section-y);
  border-top: 1px solid var(--rule);
}
.noa-faq__cta p {
  font-size: var(--fs-md);
  color: var(--graphite);
  margin: 0;
}
```

- [ ] **Step 2: Verify FAQ page renders two-column accordion layout**

Open `/pages/faq` in Shopify preview. Should show two columns of accordion items on desktop, single column on mobile. Section labels ("Orders & Payment", "Shipping", etc.) should appear as small uppercase labels.

- [ ] **Step 3: Commit**

```bash
git add folio/assets/folio.css
git commit -m "feat: add noa-faq CSS for FAQ page"
```

---

## Task 4: Add noa-size-guide CSS

Missing: All `.noa-size-guide__*` classes. The size guide page (`page.size-guide.liquid`) renders sizing tables and chain-length lists with no styles.

**Files:**
- Modify: `folio/assets/folio.css` (append at end)

- [ ] **Step 1: Append noa-size-guide CSS**

Append to end of `folio/assets/folio.css`:

```css
/* ==========================================================================
   Size guide page
   ========================================================================== */
.noa-size-guide__intro {
  max-width: 60ch;
  font-size: var(--fs-md);
  color: var(--graphite);
  margin-bottom: var(--stack);
  line-height: 1.65;
}

.noa-size-guide__sections {
  display: flex;
  flex-direction: column;
  gap: calc(var(--section-y) * 0.8);
}

.noa-size-guide__section {
  border-top: 1px solid var(--rule);
  padding-top: 2rem;
}

.noa-size-guide__section-title {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0 0 1.5rem;
}

.noa-size-guide__method {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}
@media (min-width: 700px) {
  .noa-size-guide__method { grid-template-columns: 1fr 1fr; }
}

.noa-size-guide__method-title {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--graphite);
  margin: 0 0 0.75rem;
}

.noa-size-guide__steps {
  padding-left: 1.25rem;
  display: grid;
  gap: 0.5rem;
  font-size: var(--fs-base);
  color: var(--graphite);
  line-height: 1.6;
  margin: 0 0 1rem;
}

.noa-size-guide__tip {
  font-size: var(--fs-sm);
  color: var(--stone);
  border-left: 2px solid var(--gold);
  padding-left: 0.875rem;
  margin: 0;
}

.noa-size-guide__table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.noa-size-guide__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-sm);
}
.noa-size-guide__table th,
.noa-size-guide__table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--rule-soft);
}
.noa-size-guide__table th {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--graphite);
  background: var(--surface-soft);
  white-space: nowrap;
}
.noa-size-guide__table tbody tr:hover { background: var(--surface-soft); }

/* Chain length visual list */
.noa-size-guide__chain-lengths {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.noa-size-guide__chain-item {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--rule-soft);
}
.noa-size-guide__chain-len {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink);
  min-width: 8rem;
  flex-shrink: 0;
}
.noa-size-guide__chain-pos {
  font-size: var(--fs-sm);
  color: var(--graphite);
}
```

- [ ] **Step 2: Verify size guide page renders sizing tables**

Open `/pages/size-guide` in Shopify preview. Tables should have header row with background, rows should be borderlined, chain lengths section should show as a visual list with the measurement in display font.

- [ ] **Step 3: Commit**

```bash
git add folio/assets/folio.css
git commit -m "feat: add noa-size-guide CSS for size guide page"
```

---

## Task 5: Fix materials section CSS class mismatch

**Bug:** `folio/sections/materials.liquid` uses classes `.materials-grid`, `.material-card-bg-image`, `.material-card-overlay`, `.material-card-label`, `.material-card-title` — none of which exist in `folio.css`. The CSS has `.materials-band`, `.material-card__visual`, `.material-card__copy`, etc. (BEM naming). The section renders with no grid layout and no text styling.

**Decision:** Add new CSS for the class names actually used by the section (preserving the Liquid file, which is harder to safely change).

**Files:**
- Modify: `folio/assets/folio.css` (append at end)

- [ ] **Step 1: Append materials-grid CSS**

Append to end of `folio/assets/folio.css`:

```css
/* ==========================================================================
   Materials section (folio/sections/materials.liquid)
   ========================================================================== */
.materials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding-block: var(--section-y);
  width: 100%;
  max-width: 85rem;
  margin-inline: auto;
  padding-inline: var(--gutter);
}
@media (min-width: 700px) {
  .materials-grid { grid-template-columns: repeat(3, 1fr); gap: 1.875rem; }
}

/* Override: .material-card is already styled in folio.css — it covers position/aspect-ratio/overflow.
   Add only what's missing for the new class names the section uses. */
.material-card-bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.material-card-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
}
.material-card-label {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  margin: 0 0 0.25rem;
}
.material-card-title {
  font-family: var(--font-display);
  font-size: clamp(1rem, 0.8rem + 0.6vw, 1.375rem);
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--white);
  line-height: 1.15;
  margin: 0;
}
```

- [ ] **Step 2: Verify materials section renders**

Add the Materials section to the Shopify home page in the theme editor (or open index.liquid preview). The grid of 3 material cards should appear side-by-side on desktop, stacked on mobile. Images (or fallback hero images) should be full-bleed with text overlay at bottom.

- [ ] **Step 3: Commit**

```bash
git add folio/assets/folio.css
git commit -m "fix: add missing CSS for materials-grid section class names"
```

---

## Task 6: Create search-drawer snippet

The mockup shows a right-side search drawer overlay. The live theme currently links the search icon to `/search` (standard Shopify page). This task adds the drawer as an opt-in component.

**Files:**
- Create: `folio/snippets/search-drawer.liquid`
- Modify: `folio/layout/theme.liquid` (include snippet + JS)

- [ ] **Step 1: Create `folio/snippets/search-drawer.liquid`**

Create the file with this exact content:

```liquid
<aside class="search-drawer" id="searchDrawer" aria-label="Search" hidden>
  <div class="drawer-header">
    <h2 class="drawer-header__title">Search</h2>
    <button class="drawer-close" type="button" id="searchDrawerClose" aria-label="Close search">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
      </svg>
    </button>
  </div>
  <label class="sr-only" for="searchInput">Search products</label>
  <input
    id="searchInput"
    class="search-input"
    type="search"
    placeholder="Search products…"
    autocomplete="off"
    aria-label="Search products"
  >
  <div class="search-results" id="searchResults" aria-live="polite"></div>
</aside>
<div class="screen-overlay" id="screenOverlay" hidden></div>
```

- [ ] **Step 2: Add search drawer include and JS to `folio/layout/theme.liquid`**

In `folio/layout/theme.liquid`, find the closing `</body>` tag and insert before it:

```liquid
  {% render 'search-drawer' %}

  <script>
    (function () {
      var drawer = document.getElementById('searchDrawer');
      var overlay = document.getElementById('screenOverlay');
      var closeBtn = document.getElementById('searchDrawerClose');
      var input = document.getElementById('searchInput');
      var results = document.getElementById('searchResults');

      function openSearch() {
        if (!drawer) return;
        drawer.hidden = false;
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        input.focus();
      }

      function closeSearch() {
        if (!drawer) return;
        drawer.hidden = true;
        overlay.hidden = true;
        document.body.style.overflow = '';
      }

      document.addEventListener('click', function (e) {
        if (e.target.closest('[data-open-search]')) {
          e.preventDefault();
          openSearch();
        }
      });

      if (closeBtn) closeBtn.addEventListener('click', closeSearch);
      if (overlay) overlay.addEventListener('click', closeSearch);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSearch();
      });

      if (input) {
        input.addEventListener('input', function () {
          var q = input.value.trim();
          if (q.length < 2) { results.innerHTML = ''; return; }
          results.innerHTML = '<p style="padding:1rem;font-size:0.75rem;color:#8a8a8a;letter-spacing:0.1em;text-transform:uppercase;">Searching…</p>';
          clearTimeout(window._searchTimer);
          window._searchTimer = setTimeout(function () {
            fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=6')
              .then(function (r) { return r.json(); })
              .then(function (data) {
                var products = (data.resources && data.resources.results && data.resources.results.products) || [];
                if (!products.length) {
                  results.innerHTML = '<p style="padding:1rem;font-size:0.75rem;color:#8a8a8a;letter-spacing:0.1em;text-transform:uppercase;">No results for &ldquo;' + q + '&rdquo;</p>';
                  return;
                }
                results.innerHTML = products.map(function (p) {
                  var img = p.featured_image && p.featured_image.url ? '<img src="' + p.featured_image.url + '&width=80" width="40" height="50" style="object-fit:cover;flex-shrink:0;" alt="">' : '';
                  return '<a class="search-result-item" href="' + p.url + '" style="display:flex;gap:0.75rem;align-items:center;padding:0.75rem 1.25rem;border-bottom:1px solid #e5e5e5;text-decoration:none;color:#1c1c1c;font-size:0.8125rem;">' + img + '<span>' + p.title + '</span></a>';
                }).join('');
              })
              .catch(function () {
                results.innerHTML = '<p style="padding:1rem;font-size:0.75rem;color:#8a8a8a;">Search unavailable.</p>';
              });
          }, 280);
        });
      }
    })();
  </script>
```

Also update the search link in `folio/sections/header.liquid`: find the search `<a>` tag:
```liquid
<a class="site-action site-action--icon" href="{{ routes.search_url }}" aria-label="{{ settings.search_label | default: 'Search' }}">
```
Change to:
```liquid
<button class="site-action site-action--icon" type="button" data-open-search aria-label="{{ settings.search_label | default: 'Search' }}">
```
(Change closing `</a>` to `</button>` as well.)

- [ ] **Step 3: Verify search drawer opens and shows results**

Open the live theme preview. Click the search icon in the header. Drawer should slide in from the right (`.search-drawer` CSS is already in folio.css). Type a product name — results should appear within ~300ms using the Shopify Predictive Search API.

- [ ] **Step 4: Commit**

```bash
git add folio/snippets/search-drawer.liquid folio/layout/theme.liquid folio/sections/header.liquid
git commit -m "feat: add search drawer with predictive search"
```

---

## Task 7: Create cart-drawer snippet

The mockup has a slide-in cart drawer. The live theme currently links the cart icon to `/cart` (full page). This adds the drawer alongside the cart page — clicking the cart icon in the header opens the drawer instead.

**Files:**
- Create: `folio/snippets/cart-drawer.liquid`
- Modify: `folio/layout/theme.liquid` (include snippet + JS)
- Modify: `folio/sections/header.liquid` (change cart link to button)

- [ ] **Step 1: Create `folio/snippets/cart-drawer.liquid`**

Create the file with this exact content:

```liquid
<aside class="cart-drawer" id="cartDrawer" aria-label="Cart" hidden>
  <div class="drawer-header">
    <h2 class="drawer-header__title">Cart</h2>
    <button class="drawer-close" type="button" id="cartDrawerClose" aria-label="Close cart">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
      </svg>
    </button>
  </div>
  <div class="cart-lines" id="cartLines">
    <p style="padding:1.25rem;font-size:0.75rem;color:#8a8a8a;letter-spacing:0.1em;text-transform:uppercase;">Loading cart…</p>
  </div>
  <div class="cart-footer" id="cartFooter" hidden>
    <div class="cart-total-row">
      <span>Subtotal</span>
      <strong id="cartSubtotal"></strong>
    </div>
    <a class="button button--solid" href="{{ routes.cart_url }}" style="width:100%;justify-content:center;display:flex;">Checkout</a>
  </div>
</aside>
```

- [ ] **Step 2: Add cart drawer include and JS to `folio/layout/theme.liquid`**

In `folio/layout/theme.liquid`, find the closing `</body>` tag and insert before the `</body>` (after the search drawer script added in Task 6):

```liquid
  {% render 'cart-drawer' %}

  <script>
    (function () {
      var drawer = document.getElementById('cartDrawer');
      var overlay = document.getElementById('screenOverlay');
      var closeBtn = document.getElementById('cartDrawerClose');
      var lines = document.getElementById('cartLines');
      var footer = document.getElementById('cartFooter');
      var subtotalEl = document.getElementById('cartSubtotal');

      function openCart() {
        if (!drawer) return;
        drawer.hidden = false;
        if (overlay) overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        loadCart();
      }

      function closeCart() {
        if (!drawer) return;
        drawer.hidden = true;
        if (overlay) overlay.hidden = true;
        document.body.style.overflow = '';
      }

      function loadCart() {
        fetch('/cart.js')
          .then(function (r) { return r.json(); })
          .then(function (cart) {
            renderCart(cart);
          })
          .catch(function () {
            lines.innerHTML = '<p style="padding:1.25rem;font-size:0.75rem;color:#8a8a8a;">Unable to load cart.</p>';
          });
      }

      function renderCart(cart) {
        if (!cart.items || cart.items.length === 0) {
          lines.innerHTML = '<p style="padding:1.25rem;font-size:0.75rem;color:#8a8a8a;letter-spacing:0.1em;text-transform:uppercase;">Your cart is empty.</p>';
          if (footer) footer.hidden = true;
          return;
        }

        lines.innerHTML = cart.items.map(function (item) {
          var img = item.featured_image && item.featured_image.url
            ? '<img src="' + item.featured_image.url + '&width=100" width="50" height="62" style="object-fit:cover;flex-shrink:0;" alt="' + (item.featured_image.alt || '') + '">'
            : '<div style="width:50px;height:62px;background:#efefef;flex-shrink:0;"></div>';
          return '<div class="cart-line" style="display:flex;gap:0.875rem;padding:0.875rem 0;border-bottom:1px solid #e5e5e5;align-items:flex-start;">' +
            img +
            '<div style="flex:1;display:flex;flex-direction:column;gap:0.25rem;">' +
              '<span style="font-size:0.75rem;font-weight:500;letter-spacing:0.08em;">' + item.product_title + '</span>' +
              (item.variant_title && item.variant_title !== 'Default Title' ? '<span style="font-size:0.6875rem;color:#8a8a8a;">' + item.variant_title + '</span>' : '') +
              '<span style="font-size:0.75rem;">' + window.FolioTheme.formatMoney(item.line_price) + '</span>' +
            '</div>' +
          '</div>';
        }).join('');

        if (subtotalEl) subtotalEl.textContent = window.FolioTheme.formatMoney(cart.total_price);
        if (footer) footer.hidden = false;

        if (window.FolioTheme && window.FolioTheme.updateCartCount) {
          window.FolioTheme.updateCartCount(cart.item_count);
        }
      }

      document.addEventListener('click', function (e) {
        if (e.target.closest('[data-open-cart]')) {
          e.preventDefault();
          openCart();
        }
      });

      if (closeBtn) closeBtn.addEventListener('click', closeCart);
      if (overlay) overlay.addEventListener('click', function () {
        closeCart();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeCart();
      });

      document.addEventListener('folio:cart-updated', function (e) {
        if (!drawer || drawer.hidden) return;
        renderCart(e.detail);
      });
    })();
  </script>
```

- [ ] **Step 3: Update header.liquid cart link to button**

In `folio/sections/header.liquid`, find:
```liquid
<a class="site-action site-action--icon cart-trigger" href="{{ routes.cart_url }}" aria-label="{{ 'templates.cart.cart' | t }}">
```
Change to:
```liquid
<button class="site-action site-action--icon cart-trigger" type="button" data-open-cart aria-label="{{ 'templates.cart.cart' | t }}">
```
And change the closing `</a>` to `</button>`.

- [ ] **Step 4: Verify cart drawer opens and shows cart items**

Open the live theme preview. Click the cart icon in the header. Drawer should slide in from the right. If cart is empty, shows "Your cart is empty." If items exist, shows each with image, title, price. Subtotal and Checkout link appear at the bottom. Overlay click closes the drawer.

- [ ] **Step 5: Verify that adding a product via quick-add updates the drawer in real-time**

Add a product from a collection page via the "Quick add" button. The `folio:cart-updated` event fires and the drawer should reflect the updated cart without needing to reopen.

- [ ] **Step 6: Commit**

```bash
git add folio/snippets/cart-drawer.liquid folio/layout/theme.liquid folio/sections/header.liquid
git commit -m "feat: add cart drawer slide-over with live cart rendering"
```

---

## Self-Review Checklist

### Spec coverage

| Mockup component | Task | Status |
|-----------------|------|--------|
| Generic page (noa-page layout) | Task 1 | ✓ |
| Contact page layout + form | Task 2 | ✓ |
| FAQ page two-column layout | Task 3 | ✓ |
| Size guide tables + chain list | Task 4 | ✓ |
| Materials section grid (CSS fix) | Task 5 | ✓ |
| Search drawer | Task 6 | ✓ |
| Cart drawer | Task 7 | ✓ |

### Placeholder scan
None — all tasks include exact CSS or Liquid code.

### Type consistency
- CSS variable names all use existing tokens: `--ink`, `--graphite`, `--stone`, `--rule`, `--rule-soft`, `--surface-soft`, `--white`, `--gold`, `--gutter`, `--section-y`, `--stack`, `--font-display`, `--font-body`, `--fs-sm`, `--fs-base`, `--fs-md`, `--fs-h1`, `--fs-h2`, `--fs-h3`.
- JS: `window.FolioTheme.formatMoney`, `window.FolioTheme.updateCartCount`, `folio:cart-updated` event — all defined in `theme.liquid`.
- `data-open-search`, `data-open-cart` attributes are consistent across header and JS handlers.
- `searchDrawer`, `cartDrawer`, `screenOverlay` IDs referenced consistently.
