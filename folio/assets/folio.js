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
