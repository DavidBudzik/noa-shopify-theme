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
