(function () {
  'use strict';

  var PAD = 8;

  /* ── Edge-clamp: write --nudge-x / --nudge-y CSS vars ── */
  function clamp(tip) {
    var stage = tip.closest('.shoppable-image, .scene, .state-stage');
    if (!stage) return;
    tip.style.setProperty('--nudge-x', '0px');
    tip.style.setProperty('--nudge-y', '0px');
    var tr = tip.getBoundingClientRect();
    var sr = stage.getBoundingClientRect();
    var dx = 0, dy = 0;
    if (tr.left < sr.left + PAD)          dx = (sr.left + PAD) - tr.left;
    else if (tr.right > sr.right - PAD)   dx = (sr.right - PAD) - tr.right;
    if (tr.top < sr.top + PAD)            dy = (sr.top + PAD) - tr.top;
    else if (tr.bottom > sr.bottom - PAD) dy = (sr.bottom - PAD) - tr.bottom;
    if (dx) tip.style.setProperty('--nudge-x', dx + 'px');
    if (dy) tip.style.setProperty('--nudge-y', dy + 'px');
  }

  /* ── Auto-placement: flip tooltip to avoid container edges ── */
  function determinePlacement(hotspot) {
    var tip = hotspot.querySelector('.hs-tip, .hs-tip-c');
    if (!tip) return;
    var container = hotspot.closest('.shoppable-image');
    if (!container) return;

    tip.classList.remove('hs-tip--top', 'hs-tip--right', 'hs-tip--left');
    tip.style.setProperty('--nudge-x', '0px');
    tip.style.setProperty('--nudge-y', '0px');

    /* Temporarily show for measurement (invisible) */
    var hadVisibility = tip.style.visibility;
    var hadOpacity    = tip.style.opacity;
    tip.style.visibility = 'hidden';
    tip.style.opacity    = '0';
    tip.style.pointerEvents = 'none';
    // Force the tip into visible layout so getBoundingClientRect has real values
    tip.style.display = 'block';

    var tr = tip.getBoundingClientRect();
    var cr = container.getBoundingClientRect();

    // Restore display
    tip.style.display    = '';
    tip.style.visibility = hadVisibility;
    tip.style.opacity    = hadOpacity;
    tip.style.pointerEvents = '';

    /* Flip up if bottom of tooltip overflows container */
    if (tr.bottom > cr.bottom - PAD) {
      tip.classList.add('hs-tip--top');
    }

    /* Flip horizontal if needed */
    tr = tip.getBoundingClientRect();
    if (tr.left < cr.left + PAD) {
      tip.classList.remove('hs-tip--left');
      tip.classList.add('hs-tip--right');
    } else if (tr.right > cr.right - PAD) {
      tip.classList.remove('hs-tip--right');
      tip.classList.add('hs-tip--left');
    }

    /* Final nudge pass */
    clamp(tip);
  }

  /* ── Close all open hotspots ── */
  function closeAllHotspots() {
    var openHotspots = document.querySelectorAll('.hs-hotspot.is-open');
    for (var i = 0; i < openHotspots.length; i++) {
      var h = openHotspots[i];
      h.classList.remove('is-open');
      var btn = h.querySelector('.hs-pin');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      var tip = h.querySelector('.hs-tip, .hs-tip-c');
      if (tip) tip.classList.remove('hs-tip--top', 'hs-tip--right', 'hs-tip--left');
    }
  }

  /* ── Open a hotspot ── */
  function openHotspot(hotspot) {
    hotspot.classList.add('is-open');
    var btn = hotspot.querySelector('.hs-pin');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    determinePlacement(hotspot);
  }

  /* ── Init hotspot interactions ── */
  function initHotspots() {
    var hotspots = document.querySelectorAll('.hs-hotspot');
    for (var i = 0; i < hotspots.length; i++) {
      (function (hotspot) {
        var btn = hotspot.querySelector('.hs-pin');
        if (!btn) return;
        var closeTimer = null;

        function scheduleClose() {
          closeTimer = setTimeout(function () {
            hotspot.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            var tip = hotspot.querySelector('.hs-tip, .hs-tip-c');
            if (tip) tip.classList.remove('hs-tip--top', 'hs-tip--right', 'hs-tip--left');
          }, 120);
        }

        function cancelClose() {
          if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        }

        /* Hover — open on enter, close on leave with a small grace delay */
        hotspot.addEventListener('mouseenter', function () {
          cancelClose();
          closeAllHotspots();
          openHotspot(hotspot);
        });

        hotspot.addEventListener('mouseleave', function () {
          scheduleClose();
        });

        /* Touch / keyboard fallback — toggle on click */
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          cancelClose();
          var wasOpen = hotspot.classList.contains('is-open');
          closeAllHotspots();
          if (!wasOpen) openHotspot(hotspot);
        });

        /* Prevent clicks inside tooltip from bubbling */
        var tip = hotspot.querySelector('.hs-tip, .hs-tip-c');
        if (tip) {
          tip.addEventListener('click', function (e) { e.stopPropagation(); });
        }
      })(hotspots[i]);
    }

    /* Esc closes all */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllHotspots();
    });

    /* Re-clamp on resize */
    window.addEventListener('resize', function () {
      var open = document.querySelectorAll('.hs-hotspot.is-open');
      for (var i = 0; i < open.length; i++) {
        var tip = open[i].querySelector('.hs-tip, .hs-tip-c');
        if (tip) clamp(tip);
      }
    });

    /* Re-clamp once web fonts settle */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        var tips = document.querySelectorAll('.hs-tip, .hs-tip-c');
        for (var i = 0; i < tips.length; i++) clamp(tips[i]);
      });
    }
  }

  /* ── Cart helpers ── */
  function fetchCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        var els = document.querySelectorAll('[data-cart-count]');
        for (var i = 0; i < els.length; i++) {
          els[i].textContent = cart.item_count;
        }
      })
      .catch(function () {});
  }

  /* ── Add-to-cart inside tooltip ── */
  function initAddToCart() {
    var btns = document.querySelectorAll('.hs-tip__add-to-cart');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var variantId = parseInt(btn.dataset.variantId, 10);
          if (!variantId) return;

          btn.disabled = true;
          btn.style.opacity = '0.5';

          fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ id: variantId, quantity: 1 })
          })
            .then(function (res) {
              if (!res.ok) throw new Error('cart_error');
              return res.json();
            })
            .then(function () {
              fetchCartCount();
              var origHTML = btn.innerHTML;
              btn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 8l4 4 6-8"/></svg>';
              btn.style.opacity = '1';
              setTimeout(function () {
                btn.innerHTML = origHTML;
                btn.disabled = false;
              }, 1600);
            })
            .catch(function () {
              btn.disabled = false;
              btn.style.opacity = '';
            });
        });
      })(btns[i]);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHotspots();
    initAddToCart();
  });

})();
