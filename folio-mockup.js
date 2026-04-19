const products = [
  {
    id: "oval-silver-spiral-ring",
    collection: "Rings",
    title: "Oval Silver Spiral Ring",
    subtitle: "Statement Ring, Adjustable",
    price: 92,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/d6d5d58a-il_fullxfull.2499350676_2qd3.jpg?v=1761507398",
    description: "An open oval spiral, adjustable and lightweight. Statement scale without weight.",
    variants: ["Matte Silver", "Polished Silver"]
  },
  {
    id: "silver-brass-band-ring",
    collection: "Rings",
    title: "Sterling Silver & Brass Band Ring",
    subtitle: "Unisex Mixed Metals",
    price: 380,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/0946328a-il_fullxfull.1036825496_8kji.jpg?v=1769609611",
    description: "A brushed silver band inlaid with a warm brass stripe — mixed metals, unisex profile.",
    variants: ["Matte-brushed"]
  },
  {
    id: "minimalist-square-signet",
    collection: "Rings",
    title: "Minimalist Square Signet",
    subtitle: "Handcrafted unisex",
    price: 250,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/faa89ef8-il_fullxfull.897071198_rcsc.jpg?v=1761507406",
    description: "A clean square face with a restrained band — a quiet signet for everyday.",
    variants: ["Silver", "Brass", "Gold"]
  },
  {
    id: "narrow-oval-signet",
    collection: "Rings",
    title: "Narrow Oval Silver Signet",
    subtitle: "Pinky ring",
    price: 240,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/17f7bf95-il_fullxfull.2706245870_r0qe.jpg?v=1769782436",
    description: "Narrow oval face designed for pinky or stacking — soft polish, firm presence.",
    variants: ["Sterling Silver"]
  },
  {
    id: "big-octagon-signet",
    collection: "Rings",
    title: "Big Octagon Signet Ring",
    subtitle: "Men & women",
    price: 390,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/def12509-il_fullxfull.2662492230_reaj.jpg?v=1761507403",
    description: "An eight-sided flat face with clean facets — modern geometry for a classic form.",
    variants: ["Sterling Silver", "Yellow Gold 14k", "White Gold", "Brass"]
  },
  {
    id: "14k-gold-octagon-signet",
    collection: "Rings",
    title: "14k Gold Octagon Signet",
    subtitle: "Unisex classic",
    price: 3100,
    badge: "Heirloom",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/82e3b6e2-il_fullxfull.3146785751_df5n.jpg?v=1761507402",
    description: "Solid 14k gold octagon signet. One piece, handmade and finished in the studio.",
    variants: ["14k Gold"]
  },
  {
    id: "brass-oxidized-cuff",
    collection: "Bracelets",
    title: "Brass Oxidized Cuff",
    subtitle: "Men & women",
    price: 250,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/8db7b610-il_fullxfull.1029111031_b73y.jpg?v=1767524019",
    description: "A heavy oxidized brass cuff with a hand-formed curve. Warmth through patina.",
    variants: ["Brass"]
  },
  {
    id: "hammered-silver-cuff",
    collection: "Bracelets",
    title: "Hammered Sterling Silver Cuff",
    subtitle: "Solid form",
    price: 490,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/il_1000x794.3368277198_qjer.jpg?v=1761507693",
    description: "A solid sterling cuff, hand-hammered across the surface. Single focal piece.",
    variants: ["Sterling Silver"]
  },
  {
    id: "oxidized-silver-cuff",
    collection: "Bracelets",
    title: "Oxidized Sterling Silver Cuff 925",
    subtitle: "Unisex bangle",
    price: 250,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/89e32691-il_fullxfull.982577810_ien0.jpg?v=1761507406",
    description: "Oxidized 925 silver cuff — graphite tone, close to the wrist.",
    variants: ["Sterling Silver", "Brass", "Oxidized 925"]
  },
  {
    id: "mixed-metal-rings-necklace",
    collection: "Necklaces",
    title: "Mixed Metal Rings Necklace",
    subtitle: "Industrial long chain",
    price: 400,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/il_1000x794.2771069017_r8xz.jpg?v=1761507692",
    description: "Three mixed-metal rings on a long chain. Silver, brass, copper — layered by the maker.",
    variants: ["Sterling Silver", "Brass", "Copper", "Leather", "Silver-plated"]
  },
  {
    id: "oxidized-spiral-necklace",
    collection: "Necklaces",
    title: "Oxidized Silver Spiral Necklace",
    subtitle: "Spiral pendant",
    price: 220,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/bb6a91ba-il_fullxfull.1083659720_k2l9.jpg?v=1761570202",
    description: "A small oxidized silver spiral on a whisper chain. Understated everyday piece.",
    variants: ["Sterling Silver"]
  },
  {
    id: "oxidized-leaf-earrings",
    collection: "Earrings",
    title: "Oxidized Brass Leaf Earrings",
    subtitle: "Lightweight boho",
    price: 165,
    badge: "",
    image: "https://cdn.shopify.com/s/files/1/0756/6891/4233/files/e582991a-il_fullxfull.3441641009_85x9_1b501df5-eda5-4883-aaff-c297f6a1d6d7.jpg?v=1761507406",
    description: "Lightweight dangling brass leaf earrings with an oxidized finish.",
    variants: ["Brass"]
  }
];

const state = {
  route: "home",
  searchOpen: false,
  cartOpen: false,
  activeCollection: "all",
  selectedProduct: null,
  cart: []
};

const grid = document.getElementById("productGrid");
const featuredGrid = document.getElementById("featuredGrid");
const categoriesGrid = document.getElementById("categoriesGrid");
const cartLines = document.getElementById("cartLines");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCount = document.querySelector("[data-cart-count]");
const productModal = document.getElementById("productModal");
const productVariant = document.getElementById("productVariant");
const productQuantity = document.getElementById("productQuantity");
const screenOverlay = document.getElementById("screenOverlay");
const toast = document.getElementById("toast");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterFeedback = document.getElementById("newsletterFeedback");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

function money(value) {
  return "₪" + new Intl.NumberFormat("en-IL", { maximumFractionDigits: 0 }).format(value);
}

function filteredProducts() {
  if (state.activeCollection === "all") return products;
  return products.filter((product) => product.collection === state.activeCollection);
}

function productCardHTML(product) {
  return `
    <article class="product-card">
      <div class="product-card__media">
        <button class="product-card__art product-card__art--photo" type="button" data-open-product="${product.id}" aria-label="Open ${product.title} details" style="background-image:url('${product.image}');"></button>
        ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ""}
        <button class="product-card__quick" type="button" data-add-quick="${product.id}">Quick add</button>
      </div>
      <div class="product-card__meta">
        <span class="product-card__collection">${product.collection}</span>
        <h3 class="product-card__title">${product.title}</h3>
        ${product.subtitle ? `<span class="product-card__subtitle">${product.subtitle}</span>` : ""}
        <span class="product-card__price">${money(product.price)}</span>
      </div>
    </article>
  `;
}

function renderGrid() {
  const visibleProducts = filteredProducts();
  grid.innerHTML = visibleProducts.map(productCardHTML).join("");
}

function renderFeatured() {
  if (!featuredGrid) return;
  featuredGrid.innerHTML = products.slice(0, 12).map(productCardHTML).join("");
}

const categoryCards = [
  { key: "Rings", label: "Collection", title: "Rings", heroId: "14k-gold-octagon-signet" },
  { key: "Earrings", label: "Collection", title: "Earrings", heroId: "oxidized-leaf-earrings" },
  { key: "Necklaces", label: "Collection", title: "Necklaces", heroId: "mixed-metal-rings-necklace" },
  { key: "Bracelets", label: "Collection", title: "Bracelets", heroId: "hammered-silver-cuff" }
];

function categoryCardHTML(card) {
  const hero = products.find((p) => p.id === card.heroId) || products.find((p) => p.collection === card.key);
  const img = hero ? hero.image : "";
  return `
    <button class="category-card" type="button" data-category-link="${card.key}" aria-label="Browse ${card.title}">
      <img class="category-card__img" src="${img}" alt="${card.title}" loading="lazy">
      <span class="category-card__overlay"></span>
      <span class="category-card__body">
        <span>
          <span class="category-card__label">${card.label}</span>
          <span class="category-card__title">${card.title}</span>
        </span>
        <span class="category-card__cta">Shop</span>
      </span>
    </button>
  `;
}

function renderCategories() {
  if (!categoriesGrid) return;
  categoriesGrid.innerHTML = categoryCards.map(categoryCardHTML).join("");
}

function renderSearchResults(query = "") {
  const normalized = query.trim().toLowerCase();
  const resultSet = products.filter((product) => {
    if (!normalized) return true;
    return `${product.title} ${product.collection}`.toLowerCase().includes(normalized);
  });

  searchResults.innerHTML = resultSet.map((product) => `
    <div class="search-result">
      <button type="button" data-open-product="${product.id}">
        <p class="search-result__title">${product.title}</p>
        <p class="search-result__meta">${product.collection}</p>
      </button>
      <span class="search-result__meta">${money(product.price)}</span>
    </div>
  `).join("");
}

function renderCart() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = String(count);
  cartSubtotal.textContent = money(subtotal);

  if (state.cart.length === 0) {
    cartLines.innerHTML = `<p class="cart-line__meta">Your cart is empty.</p>`;
    return;
  }

  cartLines.innerHTML = state.cart.map((item) => `
    <article class="cart-line">
      <div class="cart-line__row">
        <div>
          <p class="cart-line__title">${item.title}</p>
          <p class="cart-line__meta">${item.variant}</p>
        </div>
        <strong>${money(item.price * item.quantity)}</strong>
      </div>
      <div class="cart-line__actions">
        <div class="quantity-controls">
          <button type="button" data-cart-step="${item.id}" data-step="-1">-</button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-step="${item.id}" data-step="1">+</button>
        </div>
        <button class="remove-link" type="button" data-remove-cart="${item.id}">Remove</button>
      </div>
    </article>
  `).join("");
}

function setRoute(route) {
  state.route = route;
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    const showHomeContent = route === "home" && panel.dataset.panel === "home";
    const showNamedPanel = panel.dataset.panel === route;
    panel.classList.toggle("is-active", showHomeContent || showNamedPanel);
  });

  document.querySelectorAll("[data-route]").forEach((button) => {
    const match = button.dataset.route === route;
    button.classList.toggle("is-active", match);
  });

  if (route === "shop") {
    window.scrollTo({ top: document.querySelector(".product-index").offsetTop - 80, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function toggleOverlay() {
  const shouldShow = state.searchOpen || state.cartOpen;
  screenOverlay.hidden = !shouldShow;
}

function openSearch() {
  state.searchOpen = true;
  document.getElementById("searchDrawer").hidden = false;
  renderSearchResults(searchInput.value);
  toggleOverlay();
  searchInput.focus();
}

function closeSearch() {
  state.searchOpen = false;
  document.getElementById("searchDrawer").hidden = true;
  toggleOverlay();
}

function openCart() {
  state.cartOpen = true;
  document.getElementById("cartDrawer").hidden = false;
  toggleOverlay();
}

function closeCart() {
  state.cartOpen = false;
  document.getElementById("cartDrawer").hidden = true;
  toggleOverlay();
}

function showToast(message) {
  toast.hidden = false;
  toast.textContent = message;
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function addToCart(productId, variant, quantity = 1) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) return;

  const selectedVariant = variant || product.variants[0];
  const existing = state.cart.find((item) => item.id === productId && item.variant === selectedVariant);

  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      variant: selectedVariant,
      quantity
    });
  }

  renderCart();
  showToast(`${product.title} added to cart`);
}

function openProduct(productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) return;

  state.selectedProduct = product;

  // Product page route
  const crumb = document.getElementById("productPageCrumb");
  if (crumb) crumb.textContent = product.title;
  document.getElementById("productPageCollection").textContent = product.collection;
  document.getElementById("productPageTitle").textContent = product.title;
  const subEl = document.getElementById("productPageSubtitle");
  if (subEl) subEl.textContent = product.subtitle || "";
  document.getElementById("productPagePrice").textContent = money(product.price);
  document.getElementById("productPageDescription").textContent = product.description;

  const main = document.getElementById("productPageMain");
  if (main) main.style.backgroundImage = `url('${product.image}')`;

  const thumbsEl = document.getElementById("productPageThumbs");
  if (thumbsEl) {
    thumbsEl.innerHTML = [product.image, product.image, product.image, product.image]
      .map((src, i) => `<button type="button" class="product-page__thumb${i===0?' is-active':''}" data-page-thumb="${i}" style="background-image:url('${src}');" aria-label="View image ${i+1}"></button>`)
      .join("");
  }

  const variantSel = document.getElementById("productPageVariant");
  if (variantSel) {
    variantSel.innerHTML = product.variants.map((v) => `<option value="${v}">${v}</option>`).join("");
  }
  const qtyEl = document.getElementById("productPageQuantity");
  if (qtyEl) qtyEl.value = "1";

  setRoute("product");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeProduct() {
  if (productModal && productModal.open) productModal.close();
  state.selectedProduct = null;
}

function updateCartItem(productId, delta) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry !== item);
  }
  renderCart();
}

function removeCartItem(productId) {
  state.cart = state.cart.filter((entry) => entry.id !== productId);
  renderCart();
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  const productButton = event.target.closest("[data-open-product]");
  const quickAddButton = event.target.closest("[data-add-quick]");
  const collectionButton = event.target.closest("[data-collection-filter]");
  const categoryLink = event.target.closest("[data-category-link]");
  const cartStep = event.target.closest("[data-cart-step]");
  const removeCart = event.target.closest("[data-remove-cart]");

  if (routeButton) {
    setRoute(routeButton.dataset.route);
    document.getElementById("mobileMenu").hidden = true;
    document.querySelector("[data-mobile-toggle]").setAttribute("aria-expanded", "false");
  }

  if (productButton) {
    openProduct(productButton.dataset.openProduct);
  }

  if (quickAddButton) {
    const product = products.find((entry) => entry.id === quickAddButton.dataset.addQuick);
    addToCart(product.id, product.variants[0], 1);
  }

  if (collectionButton) {
    state.activeCollection = collectionButton.dataset.collectionFilter;
    document.querySelectorAll("[data-collection-filter]").forEach((button) => {
      button.classList.toggle("is-active", button === collectionButton);
    });
    renderGrid();
    setRoute("shop");
  }

  if (categoryLink) {
    const cat = categoryLink.dataset.categoryLink;
    state.activeCollection = cat;
    document.querySelectorAll("[data-collection-filter]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.collectionFilter === cat);
    });
    renderGrid();
    setRoute("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (event.target.closest("[data-open-search]")) openSearch();
  if (event.target.closest("[data-close-search]")) closeSearch();
  if (event.target.closest("[data-open-cart]")) openCart();
  if (event.target.closest("[data-close-cart]")) closeCart();
  if (event.target.closest("[data-close-product]")) closeProduct();

  if (event.target.closest("[data-mobile-toggle]")) {
    const button = event.target.closest("[data-mobile-toggle]");
    const menu = document.getElementById("mobileMenu");
    const nextExpanded = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(nextExpanded));
    menu.hidden = !nextExpanded;
  }

  if (event.target.closest("[data-close-announcement]")) {
    document.querySelector(".announcement-bar").hidden = true;
  }

  if (cartStep) {
    updateCartItem(cartStep.dataset.cartStep, Number(cartStep.dataset.step));
  }

  if (removeCart) {
    removeCartItem(removeCart.dataset.removeCart);
  }

  if (event.target === screenOverlay) {
    closeSearch();
    closeCart();
  }

  if (event.target.closest("[data-checkout]")) {
    showToast("Checkout is mocked in this prototype");
  }
});

const productAddButton = document.getElementById("productAddButton");
if (productAddButton) {
  productAddButton.addEventListener("click", () => {
    if (!state.selectedProduct) return;
    addToCart(state.selectedProduct.id, productVariant.value, Number(productQuantity.value || 1));
    closeProduct();
    openCart();
  });
}

const productPageAddButton = document.getElementById("productPageAddButton");
if (productPageAddButton) {
  productPageAddButton.addEventListener("click", () => {
    if (!state.selectedProduct) return;
    const variantEl = document.getElementById("productPageVariant");
    const qtyEl = document.getElementById("productPageQuantity");
    const variant = variantEl ? variantEl.value : state.selectedProduct.variants[0];
    const qty = Number((qtyEl && qtyEl.value) || 1);
    addToCart(state.selectedProduct.id, variant, qty);
    openCart();
  });
}

document.addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-page-thumb]");
  if (!thumb) return;
  const main = document.getElementById("productPageMain");
  if (main) main.style.backgroundImage = thumb.style.backgroundImage;
  document.querySelectorAll("[data-page-thumb]").forEach((el) => el.classList.toggle("is-active", el === thumb));
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();
  newsletterFeedback.textContent = email ? `Subscribed ${email} to studio notes.` : "Please enter an email address.";
  if (email) {
    newsletterForm.reset();
    showToast("Newsletter subscription captured");
  }
});

searchInput.addEventListener("input", (event) => {
  renderSearchResults(event.target.value);
});

if (productModal) {
  productModal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProduct();
  });
}

const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email) {
      contactFeedback.textContent = "Please fill in your name and email.";
      return;
    }
    if (!message) {
      contactFeedback.textContent = "Please add a message before sending.";
      return;
    }

    contactFeedback.textContent = "Message sent — we'll be in touch within 2 business days.";
    contactForm.reset();
    showToast("Message sent to studio");
  });
}

renderGrid();
renderFeatured();
renderCategories();
renderSearchResults();
renderCart();


(function() {
  var header = document.querySelector('.site-header');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
