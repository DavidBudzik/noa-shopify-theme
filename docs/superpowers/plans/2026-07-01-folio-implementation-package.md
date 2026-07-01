# Folio Theme — Implementation Package Refactor Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the `folio/` Shopify theme into a clean, uploadable implementation package: no inline mega-scripts, no hardcoded layout chrome, UI strings in locales, required templates present, zero theme-check offenses, and a one-command zip builder.

**Architecture:** Pure Liquid theme (vintage `.liquid` templates, no OS 2.0 JSON conversion — out of scope). Refactor moves ~250 lines of inline JS out of `layout/theme.liquid` into two asset files driven by a small inline `window.FolioTheme` config (Liquid-injected money format + translated strings), extracts the hardcoded footer into `sections/footer.liquid`, replaces JS-generated inline styles with CSS classes, and adds the missing storefront templates (404, search, list-collections).

**Tech Stack:** Shopify Liquid, vanilla JS, single `assets/folio.css`. Tooling: Shopify CLI 3.92.1 (`shopify theme check`). No test framework exists for Liquid themes — every task verifies via `shopify theme check` + grep assertions + (final) zip build.

**Working directory for all commands:** `/Users/davidbudzik/Desktop/💻 Dev & Experiments/shopify-theme/folio` (repo root is one level up).

---

## Current state (verified 2026-07-01)

- `shopify theme check`: 39 files, **2 warnings** (both false positives, see Task 6).
- `layout/theme.liquid` is 430 lines: ~250 lines inline JS (2 blocks), ~135 lines hardcoded footer markup.
- Hardcoded English UI strings in layout, drawers, header; `locales/en.default.json` has only 10 keys.
- Drawer JS renders cart lines / search results with long inline `style=""` strings.
- Missing templates: `404.liquid`, `search.liquid`, `list-collections.liquid` (footer links to `routes.collections_url`). Deliberately skipped (YAGNI, custom store — no blog, no customer accounts, no gift cards planned): `blog`, `article`, `customers/*`, `gift_card`.
- Stray non-theme files inside `folio/`: `~/nanobanana-images/`, `.impeccable.md`, `docs/`, `.claude/` — must be excluded from the package zip (already gitignored).

---

### Task 1: Extract global JS from `layout/theme.liquid` into `assets/folio.js`

**Files:**
- Create: `folio/assets/folio.js`
- Modify: `folio/layout/theme.liquid` (first `<script>` block, lines 178–267)
- Modify: `folio/locales/en.default.json`

- [ ] **Step 1: Add locale keys used by the JS config**

Replace `folio/locales/en.default.json` entirely with:

```json
{
  "general": {
    "pagination": {
      "page": "Page {{ page }}"
    },
    "search": {
      "title": "Search",
      "placeholder": "Search products…",
      "searching": "Searching…",
      "no_results_for": "No results for",
      "unavailable": "Search unavailable."
    },
    "404": {
      "title": "Page not found",
      "subtext": "The page you were looking for doesn't exist or has moved.",
      "back_to_shop": "Back to shop"
    }
  },
  "templates": {
    "cart": {
      "cart": "Cart"
    },
    "list_collections": {
      "title": "Collections"
    },
    "search": {
      "results_with_count": {
        "one": "{{ count }} result for \"{{ terms }}\"",
        "other": "{{ count }} results for \"{{ terms }}\""
      },
      "no_results": "No results found for \"{{ terms }}\"."
    }
  },
  "products": {
    "product": {
      "sold_out": "Sold out",
      "quantity": "Quantity",
      "product_variants": "Options"
    }
  },
  "collections": {
    "general": {
      "no_matches": "No products found in this collection."
    }
  },
  "cart": {
    "general": {
      "remove": "Remove",
      "subtotal": "Subtotal",
      "total": "Total",
      "checkout": "Checkout",
      "added": "Added to cart.",
      "loading": "Loading cart…",
      "empty": "Your cart is empty.",
      "load_error": "Unable to load cart.",
      "update_error": "Unable to update cart.",
      "decrease": "Decrease quantity",
      "increase": "Increase quantity"
    },
    "footer": {
      "newsletter_eyebrow": "Stay in touch",
      "newsletter_heading": "New pieces, studio notes & offers",
      "newsletter_success": "You're subscribed.",
      "newsletter_email_label": "Email address",
      "newsletter_placeholder": "your@email.com",
      "subscribe": "Subscribe",
      "privacy": "Privacy",
      "terms": "Terms",
      "accessibility": "Accessibility"
    }
  }
}
```

(The `cart.footer.*` group is consumed in Task 3; adding it now avoids editing this file twice.)

- [ ] **Step 2: Create `folio/assets/folio.js`**

Content is the first inline script from `theme.liquid` with all Liquid interpolations replaced by `window.FolioTheme` config reads:

```js
/* Folio global helpers: money formatting, toast, cart add, misc delegation.
   Config (money format, currency, translated strings) is injected inline by
   layout/theme.liquid as window.FolioTheme before this file loads. */
(function () {
  var T = window.FolioTheme = window.FolioTheme || {};
  T.strings = T.strings || {};

  T.formatMoney = function (cents) {
    if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
      return window.Shopify.formatMoney(cents, T.moneyFormat);
    }
    var normalized = Number(cents || 0) / 100;
    return normalized.toLocaleString(undefined, { style: 'currency', currency: T.currency });
  };

  T.showToast = function (message, isError) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.toggle('is-error', Boolean(isError));
    clearTimeout(T.toastTimer);
    T.toastTimer = setTimeout(function () { toast.hidden = true; }, 2800);
  };

  T.updateCartCount = function (count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (node) {
      node.textContent = count;
    });
  };

  T.addToCart = async function (form) {
    var formData = new FormData(form);
    var submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;
    try {
      var response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      if (!response.ok) {
        var errorData = await response.json();
        throw new Error(errorData.description || T.strings.updateError);
      }
      await response.json();
      var cartResponse = await fetch('/cart.js');
      var cartData = await cartResponse.json();
      T.updateCartCount(cartData.item_count);
      T.showToast(T.strings.addedToCart);
      document.dispatchEvent(new CustomEvent('folio:cart-updated', { detail: cartData }));
      if (submit && submit.classList.contains('pc__quickadd')) {
        submit.classList.add('is-added');
        submit.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3L13 5"/></svg>';
        setTimeout(function () {
          submit.classList.remove('is-added');
          submit.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>';
        }, 1200);
      }
    } catch (error) {
      T.showToast(error.message, true);
    } finally {
      if (submit) submit.disabled = false;
    }
  };

  document.addEventListener('submit', function (event) {
    var productForm = event.target.closest('[data-product-form]');
    if (!productForm) return;
    event.preventDefault();
    T.addToCart(productForm);
  });

  document.addEventListener('click', function (event) {
    var closeBtn = event.target.closest('[data-close-announcement]');
    if (closeBtn) {
      var bar = document.querySelector('.announcement-bar');
      if (bar) bar.hidden = true;
    }
    var mobileToggle = event.target.closest('[data-mobile-toggle]');
    if (mobileToggle) {
      var menu = document.getElementById('mobileMenu');
      var next = mobileToggle.getAttribute('aria-expanded') !== 'true';
      mobileToggle.setAttribute('aria-expanded', String(next));
      if (menu) menu.hidden = !next;
    }
    // Share triggers ([data-share]) are handled by snippets/share-modal.liquid.
  });
})();
```

- [ ] **Step 3: Replace the first inline script in `theme.liquid`**

Delete lines 178–267 (the whole `<script> window.FolioTheme = ... </script>` block) and put this in its place:

```liquid
    <script>
      window.FolioTheme = {
        moneyFormat: {{ shop.money_format | json }},
        currency: {{ cart.currency.iso_code | default: shop.currency | json }},
        strings: {
          addedToCart: {{ 'cart.general.added' | t | json }},
          cartLoading: {{ 'cart.general.loading' | t | json }},
          cartEmpty: {{ 'cart.general.empty' | t | json }},
          loadError: {{ 'cart.general.load_error' | t | json }},
          updateError: {{ 'cart.general.update_error' | t | json }},
          decreaseQty: {{ 'cart.general.decrease' | t | json }},
          increaseQty: {{ 'cart.general.increase' | t | json }},
          remove: {{ 'cart.general.remove' | t | json }},
          searching: {{ 'general.search.searching' | t | json }},
          noResultsFor: {{ 'general.search.no_results_for' | t | json }},
          searchUnavailable: {{ 'general.search.unavailable' | t | json }}
        }
      };
    </script>
    <script src="{{ 'folio.js' | asset_url }}" defer></script>
```

Note: the old code toasted `settings.quick_add_label | default: 'Added to cart' | append: '.'` — the schema default for `quick_add_label` is "Add to cart" (a button label), so the toast now uses the dedicated `cart.general.added` key instead. Intentional behavior fix.

- [ ] **Step 4: Verify**

```bash
shopify theme check
grep -c "window.FolioTheme.addToCart\|T.addToCart" assets/folio.js   # expect ≥ 1
grep -c "addToCart = async" layout/theme.liquid                      # expect 0
```
Expected: theme check still reports only the 2 known RemoteAsset warnings; greps as noted.

- [ ] **Step 5: Commit**

```bash
git add folio/assets/folio.js folio/layout/theme.liquid folio/locales/en.default.json
git commit -m "refactor: extract global JS from theme.liquid into assets/folio.js"
```

---

### Task 2: Extract drawer JS into `assets/folio-drawers.js`, replace inline styles with CSS classes

**Files:**
- Create: `folio/assets/folio-drawers.js`
- Modify: `folio/layout/theme.liquid` (second `<script>` block, lines 276–428 pre-Task-1 numbering)
- Modify: `folio/assets/folio.css` (append)
- Modify: `folio/snippets/cart-drawer.liquid`

- [ ] **Step 1: Create `folio/assets/folio-drawers.js`**

Same logic as the current second inline script, but all generated markup uses classes and all strings come from `window.FolioTheme.strings`:

```js
/* Folio drawers: search drawer + AJAX cart drawer.
   Depends on window.FolioTheme (config + helpers from folio.js). */
(function () {
  var T = window.FolioTheme || {};
  var S = (T && T.strings) || {};
  var searchDrawer = document.getElementById('searchDrawer');
  var cartDrawer = document.getElementById('cartDrawer');
  var overlay = document.getElementById('screenOverlay');
  var searchClose = document.getElementById('searchDrawerClose');
  var cartClose = document.getElementById('cartDrawerClose');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var cartLines = document.getElementById('cartLines');
  var cartFooter = document.getElementById('cartFooter');
  var cartSubtotal = document.getElementById('cartSubtotal');

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function note(text) { return '<p class="drawer-note">' + esc(text) + '</p>'; }
  function lockScroll(lock) { document.body.style.overflow = lock ? 'hidden' : ''; }

  function openSearch() {
    if (!searchDrawer) return;
    closeCart();
    searchDrawer.hidden = false;
    if (overlay) overlay.hidden = false;
    lockScroll(true);
    if (searchInput) searchInput.focus();
  }
  function closeSearch() {
    if (!searchDrawer) return;
    searchDrawer.hidden = true;
    if (overlay && (!cartDrawer || cartDrawer.hidden)) overlay.hidden = true;
    if (!cartDrawer || cartDrawer.hidden) lockScroll(false);
  }
  function openCart() {
    if (!cartDrawer) return;
    closeSearch();
    cartDrawer.hidden = false;
    if (overlay) overlay.hidden = false;
    lockScroll(true);
    loadCart();
  }
  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.hidden = true;
    if (overlay && (!searchDrawer || searchDrawer.hidden)) overlay.hidden = true;
    if (!searchDrawer || searchDrawer.hidden) lockScroll(false);
  }
  function closeAll() { closeSearch(); closeCart(); }

  function loadCart() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(renderCart)
      .catch(function () {
        if (cartLines) cartLines.innerHTML = note(S.loadError);
      });
  }

  function renderCart(cart) {
    if (!cartLines) return;
    if (!cart.items || cart.items.length === 0) {
      cartLines.innerHTML = note(S.cartEmpty);
      if (cartFooter) cartFooter.hidden = true;
      return;
    }
    cartLines.innerHTML = cart.items.map(function (item) {
      var img = item.featured_image && item.featured_image.url
        ? '<img class="cart-line__img" src="' + esc(item.featured_image.url) + '&width=200" width="100" height="124" alt="' + esc(item.featured_image.alt || '') + '">'
        : '<div class="cart-line__img cart-line__img--empty"></div>';
      return '<div class="cart-line">' +
        img +
        '<div class="cart-line__info">' +
          '<span class="cart-line__title">' + esc(item.product_title) + '</span>' +
          (item.variant_title && item.variant_title !== 'Default Title' ? '<span class="cart-line__variant">' + esc(item.variant_title) + '</span>' : '') +
          '<span class="cart-line__price">' + T.formatMoney(item.line_price) + '</span>' +
          '<div class="cart-line__controls">' +
            '<button class="cart-qty-btn" data-key="' + esc(item.key) + '" data-qty="' + (item.quantity - 1) + '" aria-label="' + esc(S.decreaseQty) + '">−</button>' +
            '<span class="cart-line__qty">' + item.quantity + '</span>' +
            '<button class="cart-qty-btn" data-key="' + esc(item.key) + '" data-qty="' + (item.quantity + 1) + '" aria-label="' + esc(S.increaseQty) + '">+</button>' +
            '<button class="cart-remove-btn" data-key="' + esc(item.key) + '" aria-label="' + esc(S.remove) + ' ' + esc(item.product_title) + '">' + esc(S.remove) + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    if (cartSubtotal) cartSubtotal.textContent = T.formatMoney(cart.total_price);
    if (cartFooter) cartFooter.hidden = false;
    if (T.updateCartCount) T.updateCartCount(cart.item_count);
  }

  function updateCartItem(key, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    })
      .then(function (r) { return r.json(); })
      .then(renderCart)
      .catch(function () {
        if (T.showToast) T.showToast(S.updateError, true);
      });
  }

  if (cartLines) {
    cartLines.addEventListener('click', function (e) {
      var qtyBtn = e.target.closest('.cart-qty-btn');
      if (qtyBtn) {
        updateCartItem(qtyBtn.getAttribute('data-key'), parseInt(qtyBtn.getAttribute('data-qty'), 10));
        return;
      }
      var removeBtn = e.target.closest('.cart-remove-btn');
      if (removeBtn) {
        updateCartItem(removeBtn.getAttribute('data-key'), 0);
      }
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-search]')) { e.preventDefault(); openSearch(); return; }
    if (e.target.closest('[data-open-cart]')) { e.preventDefault(); openCart(); return; }
  });
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  if (searchInput) {
    var searchTimer;
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim();
      if (q.length < 2) { searchResults.innerHTML = ''; return; }
      searchResults.innerHTML = note(S.searching);
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=6')
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var products = (data.resources && data.resources.results && data.resources.results.products) || [];
            if (!products.length) {
              searchResults.innerHTML = note(S.noResultsFor + ' “' + q + '”');
              return;
            }
            searchResults.innerHTML = products.map(function (p) {
              var img = p.featured_image && p.featured_image.url
                ? '<img class="search-result-item__img" src="' + esc(p.featured_image.url) + '&width=80" width="40" height="50" alt="">'
                : '';
              return '<a class="search-result-item" href="' + esc(p.url) + '">' + img + '<span>' + esc(p.title) + '</span></a>';
            }).join('');
          })
          .catch(function () {
            searchResults.innerHTML = note(S.searchUnavailable);
          });
      }, 280);
    });
  }

  document.addEventListener('folio:cart-updated', function (e) {
    if (!cartDrawer || cartDrawer.hidden) return;
    renderCart(e.detail);
  });
})();
```

(Improvements over the inline original, all behavior-preserving: HTML-escaping of API-sourced text, `searchTimer` no longer a global `window._searchTimer`.)

- [ ] **Step 2: Replace the second inline script in `theme.liquid`**

Delete the entire second `<script>(function () { ... })();</script>` block and replace with:

```liquid
    <script src="{{ 'folio-drawers.js' | asset_url }}" defer></script>
```

- [ ] **Step 3: Append drawer CSS classes to `folio/assets/folio.css`**

Append at end of file:

```css
/* ============================================================
   Drawer-rendered content (markup generated by folio-drawers.js)
   ============================================================ */
.drawer-note {
  padding: 1.25rem;
  font-size: 0.75rem;
  color: #8a8a8a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.cart-line {
  display: flex;
  gap: 0.875rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #e5e5e5;
  align-items: flex-start;
}
.cart-line__img {
  width: 100px;
  height: 124px;
  object-fit: cover;
  flex-shrink: 0;
}
.cart-line__img--empty { background: #efefef; }
.cart-line__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.cart-line__title {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
}
.cart-line__variant {
  font-size: 0.6875rem;
  color: #8a8a8a;
}
.cart-line__price { font-size: 0.75rem; }
.cart-line__controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.cart-line__qty {
  font-size: 0.75rem;
  min-width: 16px;
  text-align: center;
}
.cart-qty-btn {
  width: 22px;
  height: 22px;
  border: 1px solid #d4d4d4;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-remove-btn {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.6875rem;
  color: #8a8a8a;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0;
}
.cart-footer__checkout {
  width: 100%;
  display: flex;
  justify-content: center;
}
.search-result-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #e5e5e5;
  text-decoration: none;
  color: #1c1c1c;
  font-size: 0.8125rem;
}
.search-result-item__img {
  width: 40px;
  height: 50px;
  object-fit: cover;
  flex-shrink: 0;
}
```

- [ ] **Step 4: De-inline `snippets/cart-drawer.liquid`**

Replace its two inline styles + hardcoded strings (full new file):

```liquid
<aside class="cart-drawer" id="cartDrawer" aria-label="{{ 'templates.cart.cart' | t }}" hidden>
  <div class="drawer-header">
    <h2 class="drawer-header__title">{{ 'templates.cart.cart' | t }}</h2>
    <button class="drawer-close" type="button" id="cartDrawerClose" aria-label="{{ 'templates.cart.cart' | t }}">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
      </svg>
    </button>
  </div>
  <div class="cart-lines" id="cartLines">
    <p class="drawer-note">{{ 'cart.general.loading' | t }}</p>
  </div>
  <div class="cart-footer" id="cartFooter" hidden>
    <div class="cart-total-row">
      <span>{{ 'cart.general.subtotal' | t }}</span>
      <strong id="cartSubtotal"></strong>
    </div>
    <a class="button button--solid cart-footer__checkout" href="{{ routes.cart_url }}">{{ 'cart.general.checkout' | t }}</a>
  </div>
</aside>
```

- [ ] **Step 5: Verify**

```bash
shopify theme check
grep -c "style=" assets/folio-drawers.js        # expect 0
grep -c "<script" layout/theme.liquid            # expect 3 (config, folio.js, folio-drawers.js src tags)
```

- [ ] **Step 6: Commit**

```bash
git add folio/assets/folio-drawers.js folio/assets/folio.css folio/layout/theme.liquid folio/snippets/cart-drawer.liquid
git commit -m "refactor: extract drawer JS to asset file, replace inline styles with classes"
```

---

### Task 3: Extract footer into `sections/footer.liquid`

**Files:**
- Create: `folio/sections/footer.liquid`
- Modify: `folio/layout/theme.liquid` (replace `<footer class="noa-footer">…</footer>` with `{% section 'footer' %}`)
- Modify: `folio/config/settings_schema.json` (add `footer_blurb` setting)

- [ ] **Step 1: Add `footer_blurb` to the Footer group in `settings_schema.json`**

Insert as the first entry of the `"Footer"` group's `settings` array:

```json
      {
        "type": "textarea",
        "id": "footer_blurb",
        "label": "Footer brand blurb",
        "default": "Handmade unisex jewelry crafted in our Tel Aviv studio. Each piece is one of a kind."
      },
```

- [ ] **Step 2: Create `folio/sections/footer.liquid`**

Move the footer markup out of `theme.liquid` verbatim, with UI strings switched to the `cart.footer.*` locale keys added in Task 1 and the brand blurb switched to `settings.footer_blurb`:

```liquid
<footer class="noa-footer">
  <div class="noa-footer__divider"></div>

  <div class="noa-footer__newsletter">
    <div class="noa-footer__newsletter-copy">
      <p class="noa-footer__eyebrow">{{ 'cart.footer.newsletter_eyebrow' | t }}</p>
      <h3>{{ 'cart.footer.newsletter_heading' | t }}</h3>
    </div>
    {% form 'customer', class: 'noa-footer__form', id: 'footer-newsletter-form' %}
      <input type="hidden" name="contact[tags]" value="newsletter">
      {% if form.posted_successfully? %}
        <p class="noa-footer__success">{{ 'cart.footer.newsletter_success' | t }}</p>
      {% else %}
        <label class="sr-only" for="FooterNewsletterEmail">{{ 'cart.footer.newsletter_email_label' | t }}</label>
        <input
          class="noa-footer__input"
          type="email"
          id="FooterNewsletterEmail"
          name="contact[email]"
          value="{{ form.email }}"
          placeholder="{{ 'cart.footer.newsletter_placeholder' | t }}"
          autocomplete="email"
          aria-label="{{ 'cart.footer.newsletter_email_label' | t }}"
          required
        >
        <button class="noa-footer__btn" type="submit">{{ 'cart.footer.subscribe' | t }}</button>
        {% if form.errors %}<p class="noa-footer__error">{{ form.errors | default_errors }}</p>{% endif %}
      {% endif %}
    {% endform %}
  </div>

  <div class="noa-footer__body">

    <div class="noa-footer__brand">
      <a class="noa-footer__brand-link" href="{{ routes.root_url }}" aria-label="{{ settings.brand_name | default: 'Noa' }} — home">
        {% if settings.brand_logo != blank %}
          {{
            settings.brand_logo
            | image_url: width: 320
            | image_tag:
              loading: 'lazy',
              widths: '160, 240, 320',
              class: 'noa-footer__brand-logo',
              alt: settings.brand_name
          }}
        {% else %}
          <svg class="noa-footer__brand-logo" viewBox="0 0 273 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M27.0774 12.0931C21.4036 14.2583 -0.720672 28.1907 0.0180719 20.6778C4.58762 15.4545 31.3728 2.37723 39.1639 7.48147C40.6871 9.7819 42.2102 11.7088 45.9344 9.70071C58.5083 1.23514 85.2859 0.720917 73.664 17.5221C80.1908 20.4775 88.7511 16.2501 95.8948 15.8983C104.036 15.1081 112.513 14.8158 118.575 10.334C124.668 5.2514 142.809 3.29739 144.561 11.4977C143.281 20.943 114.097 32.9431 106.786 21.1433C94.7905 20.445 52.0348 34.6265 66.2156 14.2583C67.4646 12.2988 65.9034 10.6696 62.9865 10.7183C46.0487 11.2596 36.4069 23.7414 22.5307 28.9972C19.8042 29.4248 15.2423 27.3734 18.7228 25.2787C23.0562 21.1758 26.1026 17.3544 27.0774 12.0931ZM128.765 11.5519C123.891 13.2082 113.175 16.8077 121.911 19.8442C127.28 17.4626 137.318 16.7481 128.765 11.5465V11.5519Z" fill="#1c1c1c"/>
            <path d="M174.91 20.1203C134.728 32.7645 142.436 12.4775 173.463 5.9659C174.887 5.27307 177.613 6.12829 175.862 7.29203C153.471 14.8699 151.788 26.1231 176.41 12.9754C172.191 12.1527 171.894 8.98623 176.296 7.90368C180.82 4.83464 182.609 7.55185 185.283 10.2907C186.989 12.9971 184.392 15.4437 187.887 17.8253C201.824 25.322 243.103 13.2244 261.168 11.0052C256.781 9.4788 253.43 7.11342 260.17 8.98623C259.903 6.44765 257.809 4.11473 258.502 1.61945C265.28 11.5194 262.028 6.56131 269.416 0.120117C271.244 3.77374 267.276 6.8103 265.928 10.6209C270.589 10.767 276.369 10.9132 268.898 13.1811C268.555 14.5397 268.418 14.583 264.854 13.3381C267.001 15.8063 266.499 19.4654 270.581 19.8334C266.712 23.2759 265.349 17.7928 263.559 15.947L261.906 18.3341C258.715 5.85224 189.829 38.5887 174.91 20.1203Z" fill="#1c1c1c"/>
            <path d="M253.628 21.4951C256.606 20.2286 259.165 17.8632 261.693 21.2353C259.705 24.824 256.035 25.5277 253.628 21.4951Z" fill="#1c1c1c"/>
          </svg>
        {% endif %}
      </a>
      <p>{{ settings.footer_blurb }}</p>
      <a class="noa-footer__social" href="{{ settings.social_instagram | default: '#' }}" target="_blank" rel="noopener" aria-label="Instagram">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
        </svg>
        <span>{{ settings.social_instagram_handle | default: '@noa.shechter' }}</span>
      </a>
    </div>

    <div>
      <p class="noa-footer__col-title">{{ settings.footer_menu_one_title | default: 'Shop' }}</p>
      <ul class="noa-footer__links">
        {% if settings.footer_menu_one != blank %}
          {% for link in linklists[settings.footer_menu_one].links %}
            <li><a href="{{ link.url }}">{{ link.title }}</a></li>
          {% endfor %}
        {% else %}
          <li><a href="{{ routes.all_products_collection_url }}">All Products</a></li>
          <li><a href="{{ routes.collections_url }}/rings">Rings</a></li>
          <li><a href="{{ routes.collections_url }}/earrings">Earrings</a></li>
          <li><a href="{{ routes.collections_url }}/necklaces">Necklaces</a></li>
          <li><a href="{{ routes.collections_url }}/bracelets">Bracelets</a></li>
        {% endif %}
      </ul>
    </div>

    <div>
      <p class="noa-footer__col-title">{{ settings.footer_menu_two_title | default: 'Studio' }}</p>
      <ul class="noa-footer__links">
        {% if settings.footer_menu_two != blank %}
          {% for link in linklists[settings.footer_menu_two].links %}
            <li><a href="{{ link.url }}">{{ link.title }}</a></li>
          {% endfor %}
        {% else %}
          <li><a href="{{ routes.root_url }}pages/about">About</a></li>
          <li><a href="{{ routes.root_url }}pages/care-guide">Care Guide</a></li>
          <li><a href="{{ routes.root_url }}pages/sustainability">Sustainability</a></li>
        {% endif %}
      </ul>
    </div>

    <div>
      <p class="noa-footer__col-title">{{ settings.footer_menu_three_title | default: 'Support' }}</p>
      <ul class="noa-footer__links">
        {% if settings.footer_menu_three != blank %}
          {% for link in linklists[settings.footer_menu_three].links %}
            <li><a href="{{ link.url }}">{{ link.title }}</a></li>
          {% endfor %}
        {% else %}
          <li><a href="{{ routes.root_url }}pages/contact">Contact</a></li>
          <li><a href="{{ routes.root_url }}pages/shipping">Shipping &amp; Returns</a></li>
          <li><a href="{{ routes.root_url }}pages/faq">FAQ</a></li>
          <li><a href="{{ routes.root_url }}pages/size-guide">Size Guide</a></li>
        {% endif %}
      </ul>
    </div>

  </div>

  <div class="noa-footer__bottom">
    <span class="noa-footer__copy">{{ settings.footer_copy | default: '© 2026 noa · Tel Aviv' }}</span>
    <ul class="noa-footer__legal">
      {% if shop.privacy_policy != blank %}
        <li><a href="{{ shop.privacy_policy.url }}">{{ 'cart.footer.privacy' | t }}</a></li>
      {% endif %}
      {% if shop.terms_of_service != blank %}
        <li><a href="{{ shop.terms_of_service.url }}">{{ 'cart.footer.terms' | t }}</a></li>
      {% endif %}
      <li><a href="{{ routes.root_url }}pages/accessibility">{{ 'cart.footer.accessibility' | t }}</a></li>
    </ul>
  </div>

</footer>

{% schema %}
{
  "name": "Footer",
  "settings": []
}
{% endschema %}
```

(Menu fallback link texts stay hardcoded — they're dev fallbacks that disappear once the merchant assigns real menus.)

- [ ] **Step 3: Replace the footer in `theme.liquid`**

Delete everything from `<footer class="noa-footer">` through its closing `</footer>` and replace with:

```liquid
    {% section 'footer' %}
```

After Tasks 1–3, `theme.liquid` body should read (structure check):

```liquid
  <body class="template-{{ template.name | handle }}">
    {% section 'announcement-bar' %}
    {% section 'header' %}

    <main id="MainContent" role="main">
      {{ content_for_layout }}
    </main>

    {% section 'footer' %}

    <div class="toast" id="toast" aria-live="polite" hidden></div>

    <script>
      window.FolioTheme = { ... };   <!-- config block from Task 1 -->
    </script>
    <script src="{{ 'folio.js' | asset_url }}" defer></script>

    {% render 'search-drawer' %}
    {% render 'cart-drawer' %}
    {% render 'share-modal' %}
    {%- if settings.whatsapp_float_enabled -%}
      {% render 'whatsapp-button', style: 'float' %}
    {%- endif -%}

    <script src="{{ 'folio-drawers.js' | asset_url }}" defer></script>
  </body>
```

- [ ] **Step 4: Verify**

```bash
shopify theme check
grep -c "noa-footer__body" layout/theme.liquid    # expect 0
grep -c "noa-footer__body" sections/footer.liquid # expect 1
wc -l layout/theme.liquid                         # expect ~75 lines
```

- [ ] **Step 5: Commit**

```bash
git add folio/sections/footer.liquid folio/layout/theme.liquid folio/config/settings_schema.json
git commit -m "refactor: move footer from layout into sections/footer.liquid"
```

---

### Task 4: Localize remaining hardcoded UI strings (search drawer, header fallback nav)

**Files:**
- Modify: `folio/snippets/search-drawer.liquid`
- Modify: `folio/sections/header.liquid` (fallback nav labels ×2 places)

- [ ] **Step 1: Rewrite `snippets/search-drawer.liquid`**

```liquid
<aside class="search-drawer" id="searchDrawer" aria-label="{{ 'general.search.title' | t }}" hidden>
  <div class="drawer-header">
    <h2 class="drawer-header__title">{{ 'general.search.title' | t }}</h2>
    <button class="drawer-close" type="button" id="searchDrawerClose" aria-label="{{ 'general.search.title' | t }}">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
      </svg>
    </button>
  </div>
  <label class="sr-only" for="searchInput">{{ 'general.search.placeholder' | t }}</label>
  <input
    id="searchInput"
    class="search-input"
    type="search"
    placeholder="{{ 'general.search.placeholder' | t }}"
    autocomplete="off"
    aria-label="{{ 'general.search.placeholder' | t }}"
  >
  <div class="search-results" id="searchResults" aria-live="polite"></div>
</aside>
<div class="screen-overlay" id="screenOverlay" hidden></div>
```

- [ ] **Step 2: Header fallback nav — leave as-is**

`sections/header.liquid` fallback links ("Home", "Shop", "About") are dev fallbacks shown only when no menu is assigned, same policy as footer. No change. (Documented decision, not an omission.)

- [ ] **Step 3: Verify + commit**

```bash
shopify theme check
git add folio/snippets/search-drawer.liquid
git commit -m "refactor: localize search drawer strings"
```

---

### Task 5: Add missing storefront templates (404, search, list-collections)

**Files:**
- Create: `folio/templates/404.liquid`
- Create: `folio/templates/search.liquid`
- Create: `folio/templates/list-collections.liquid`
- Modify: `folio/assets/folio.css` (append)

Uses locale keys added in Task 1 (`general.404.*`, `templates.search.*`, `templates.list_collections.title`) and the existing `product-card` snippet (signature: `{% render 'product-card', product: product %}` — verify the snippet's accepted params in `snippets/product-card.liquid` before wiring; if it requires extra params, pass the same ones `sections/featured-products.liquid` passes).

- [ ] **Step 1: Create `templates/404.liquid`**

```liquid
<section class="page-simple page-404">
  <p class="section-kicker">404</p>
  <h1 class="page-simple__title">{{ 'general.404.title' | t }}</h1>
  <p class="page-simple__subtext">{{ 'general.404.subtext' | t }}</p>
  <a class="button button--solid" href="{{ routes.all_products_collection_url }}">{{ 'general.404.back_to_shop' | t }}</a>
</section>
```

- [ ] **Step 2: Create `templates/search.liquid`**

```liquid
<section class="page-simple search-page">
  <h1 class="page-simple__title">{{ 'general.search.title' | t }}</h1>

  <form action="{{ routes.search_url }}" method="get" role="search" class="search-page__form">
    <input type="hidden" name="type" value="product">
    <label class="sr-only" for="SearchPageInput">{{ 'general.search.placeholder' | t }}</label>
    <input
      id="SearchPageInput"
      class="search-input"
      type="search"
      name="q"
      value="{{ search.terms | escape }}"
      placeholder="{{ 'general.search.placeholder' | t }}"
    >
    <button class="button button--solid" type="submit">{{ 'general.search.title' | t }}</button>
  </form>

  {% if search.performed %}
    {% if search.results_count > 0 %}
      <p class="page-simple__subtext">
        {{ 'templates.search.results_with_count' | t: count: search.results_count, terms: search.terms }}
      </p>
      {% paginate search.results by 12 %}
        <div class="product-grid">
          {% for item in search.results %}
            {% if item.object_type == 'product' %}
              {% render 'product-card', product: item %}
            {% else %}
              <a class="search-page__generic-result" href="{{ item.url }}">{{ item.title }}</a>
            {% endif %}
          {% endfor %}
        </div>
        {% if paginate.pages > 1 %}
          <nav class="pagination" aria-label="{{ 'general.pagination.page' | t: page: paginate.current_page }}">
            {{ paginate | default_pagination }}
          </nav>
        {% endif %}
      {% endpaginate %}
    {% else %}
      <p class="page-simple__subtext">{{ 'templates.search.no_results' | t: terms: search.terms }}</p>
    {% endif %}
  {% endif %}
</section>
```

Note: `product-grid` / `pagination` class names must match what `templates/collection.liquid` already uses — check that file first and reuse its grid + pagination classes verbatim so search results inherit existing styling. If collection.liquid uses different names, use those instead of the ones above.

- [ ] **Step 3: Create `templates/list-collections.liquid`**

```liquid
<section class="page-simple collections-index">
  <h1 class="page-simple__title">{{ 'templates.list_collections.title' | t }}</h1>
  <div class="collections-index__grid">
    {% for collection in collections %}
      <a class="category-card" href="{{ collection.url }}">
        {% if collection.featured_image != blank %}
          {{ collection.featured_image | image_url: width: 900 | image_tag:
            loading: 'lazy',
            widths: '480, 720, 900',
            sizes: '(min-width: 900px) 33vw, 100vw',
            class: 'category-card__img',
            alt: collection.title
          }}
        {% else %}
          <span class="category-card__img" style="background:#efefef;"></span>
        {% endif %}
        <span class="category-card__overlay"></span>
        <span class="category-card__body">
          <span class="category-card__title">{{ collection.title }}</span>
        </span>
      </a>
    {% endfor %}
  </div>
</section>
```

(Reuses `.category-card` classes from `sections/categories-grid.liquid` so it inherits existing card styling.)

- [ ] **Step 4: Append template CSS to `folio/assets/folio.css`**

```css
/* ============================================================
   Simple standalone pages (404, search, collections index)
   ============================================================ */
.page-simple {
  max-width: 60rem;
  margin: 0 auto;
  padding: 5rem 1.5rem 6rem;
  text-align: center;
}
.page-simple__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 500;
  margin: 0.5rem 0 1rem;
}
.page-simple__subtext {
  color: #8a8a8a;
  font-size: 0.875rem;
  margin-bottom: 2rem;
}
.search-page__form {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}
.search-page__form .search-input {
  max-width: 24rem;
  width: 100%;
}
.search-page__generic-result {
  display: block;
  padding: 1rem;
  border: 1px solid #e5e5e5;
  text-decoration: none;
  color: #1c1c1c;
  font-size: 0.875rem;
}
.collections-index__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;
  text-align: left;
}
```

- [ ] **Step 5: Verify + commit**

```bash
shopify theme check    # new files inspected, still only the 2 known warnings
git add folio/templates/404.liquid folio/templates/search.liquid folio/templates/list-collections.liquid folio/assets/folio.css
git commit -m "feat: add 404, search, and list-collections templates"
```

---

### Task 6: Silence the two false-positive theme-check warnings

**Files:**
- Modify: `folio/sections/categories-grid.liquid:42`
- Modify: `folio/sections/collection-banner.liquid:94-100`

Both are `RemoteAsset` false positives: categories-grid's `card_image_asset` is already piped through `asset_url` (linter can't see through the variable); collection-banner's `fallback_url` is a merchant-supplied URL setting. Use the same scoped-disable pattern already used in `layout/theme.liquid:7-11`.

- [ ] **Step 1: categories-grid** — wrap line 42:

```liquid
          {%- comment -%}theme-check-disable RemoteAsset{%- endcomment -%}
          <img class="category-card__img" src="{{ card_image_asset }}" alt="{{ block.settings.title }}" loading="lazy" width="1200" height="1200">
          {%- comment -%}theme-check-enable RemoteAsset{%- endcomment -%}
```

- [ ] **Step 2: collection-banner** — wrap the `{% elsif fallback_url != blank %}` `<img>`:

```liquid
      {% elsif fallback_url != blank %}
        {%- comment -%}theme-check-disable RemoteAsset{%- endcomment -%}
        <img class="collection-banner__img"
          src="{{ fallback_url }}"
          alt="{{ banner_title }}"
          loading="eager"
          width="1800"
          height="600">
        {%- comment -%}theme-check-enable RemoteAsset{%- endcomment -%}
```

- [ ] **Step 3: Verify + commit**

```bash
shopify theme check    # expect: 0 offenses
git add folio/sections/categories-grid.liquid folio/sections/collection-banner.liquid
git commit -m "chore: scope-disable RemoteAsset false positives; theme check now clean"
```

---

### Task 7: Package builder + final verification

**Files:**
- Create: `package-theme.sh` (repo root, next to `folio/`)
- Modify: `.gitignore` (repo root — add `dist/`)

- [ ] **Step 1: Create `package-theme.sh`**

```bash
#!/usr/bin/env bash
# Build a clean, uploadable theme zip containing ONLY the standard Shopify
# theme directories (strays like ~/, docs/, .claude/, .impeccable.md excluded).
set -euo pipefail
cd "$(dirname "$0")/folio"

echo "Running theme check..."
shopify theme check --fail-level error

VERSION="$(date +%Y%m%d)"
OUT_DIR="../dist"
OUT="folio-theme-${VERSION}.zip"
mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR/$OUT"

zip -r "$OUT_DIR/$OUT" assets config layout locales sections snippets templates \
  -x '*.DS_Store'

echo "Built $OUT_DIR/$OUT"
unzip -l "$OUT_DIR/$OUT" | tail -3
```

```bash
chmod +x package-theme.sh
```

- [ ] **Step 2: Add `dist/` to repo-root `.gitignore`**

Append:

```
# Theme package output
dist/
```

- [ ] **Step 3: Build and verify package contents**

```bash
./package-theme.sh
unzip -l dist/folio-theme-*.zip | grep -c "nanobanana\|\.claude\|\.impeccable\|docs/"   # expect 0
unzip -l dist/folio-theme-*.zip | grep -c "layout/theme.liquid"                          # expect 1
```

- [ ] **Step 4: Final full verification**

```bash
cd folio && shopify theme check
```
Expected: `0 offenses`. Optional manual smoke test: `shopify theme dev --store <dev-store>` and click through home → collection → product → add to cart → drawers → search page → 404.

- [ ] **Step 5: Commit**

```bash
git add package-theme.sh .gitignore
git commit -m "build: add package-theme.sh zip builder for clean theme uploads"
```

---

## Out of scope (documented decisions)

- **OS 2.0 JSON template conversion** — the theme is a custom single-store build; vintage `.liquid` templates work and convert later if section-by-page merchant editing is needed.
- **`blog.liquid` / `article.liquid` / `customers/*` / `gift_card.liquid`** — no blog, customer accounts, or gift cards planned for this store. Add before enabling those features.
- **Google Fonts remote load** — deliberate (already scope-disabled in layout); self-hosting fonts is a separate performance task.
- **Page-template hardcoded copy** (about/faq/care-guide etc.) — merchant content, not theme chrome.
- **`share-modal.liquid` / `shoppable-hotspot.js` internals** — already asset-file-based or self-contained; working, untouched.
