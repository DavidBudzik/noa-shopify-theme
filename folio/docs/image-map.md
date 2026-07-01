# Folio theme — image map

Generated audit of every image in the theme: static asset files, dynamic (merchant/product) image slots, logos, and placeholders. "File dims" = actual pixels on disk. "Requested" = width passed to Shopify `image_url` in code. "Render aspect" = the `width`/`height` attrs or CSS box the image fills.

## 1. Static asset files (`assets/`)

| File | File dims | Used by | Requested / render | Notes |
|---|---|---|---|---|
| `hero-01.jpg` | 3840×5760 | — | — | **Unused** in theme (root mockup only) |
| `hero-02.jpg` | 3840×5760 | instagram + materials fallback | w1200 / w720 | |
| `hero-03.jpg` | 1707×2560 | instagram + materials fallback | w1200 / w720 | ✅ compressed 5 MB→544 KB |
| `hero-04.jpg` | 3840×5760 | instagram + materials fallback | w1200 / w720 | |
| `hero-05.jpg` | 3726×5648 | — | — | **Unused** in theme |
| `hero-06.jpg` | 3840×5760 | instagram + materials fallback | w1200 / w720 | |
| `hero-07.jpg` | 3840×5760 | instagram + materials fallback | w1200 / w720 | |
| `hero-08.jpg` | 3840×5760 | instagram + materials fallback | w1200 / w720 | |
| `home-page-hero-hot-spots.jpeg` | 2560×1429 (16:9) | **Hero fallback** (homepage) | w1800, full-bleed cover | AI-regenerated w/ triangle earrings, upscaled 2×; 904 KB. Old square-earrings version backed up in scratchpad |
| `banner-collection.jpg` | 1706×2560 | generic banner | — | ✅ compressed 14 MB→1 MB |
| `cat-bracelets.jpg` | 768×768 | categories-grid fallback | 1200×1200 box (1:1) | ✅ square-cropped |
| `cat-earrings.png` | 768×768 | categories-grid fallback | 1200×1200 box (1:1) | ✅ square; ⚠️ still PNG (972 KB) |
| `cat-necklaces.png` | 768×768 | categories-grid fallback | 1200×1200 box (1:1) | ✅ square-cropped |
| `cat-rings.jpg` | 768×768 | categories-grid fallback | 1200×1200 box (1:1) | ✅ square-cropped |
| `collection-banner-bracelets.png` | 2172×724 | collection-banner fallback | 1800×600 | 3:1 |
| `collection-banner-earrings.png` | 2172×724 | collection-banner fallback | 1800×600 | 3:1 |
| `collection-banner-necklaces.png` | 2172×724 | collection-banner fallback | 1800×600 | 3:1 |
| `collection-banner-rings.png` | 2172×724 | collection-banner fallback | 1800×600 | 3:1 |
| `noa_logo.svg` | 820×90 (~9:1) | — | — | **Unused** (header/footer use inline SVG) |
| `noa_logo_white.png` | 820×90 | — | — | **Unused** |

## 2. Dynamic image slots (merchant / product uploads)

These pull from theme settings or product data. No file on disk — currently blank/fallback since `settings_data.json` has no uploads. Recommended = requested width × render aspect.

| Slot | Source | Requested | Render aspect | Recommended upload | Fallback |
|---|---|---|---|---|---|
| Hero slides | `block.settings.image` | w1800 | full-bleed cover (~2:3) | 1800×2700 | hero-0x.jpg |
| Collection banner | `collection.image` | w1800 | 1800×600 (3:1) | 1800×600 | collection-banner-*.png |
| Category card | `block.settings.image` | w1200 | 1200×800 (3:2) | 1200×800 | cat-*.png |
| Instagram tile | `block.settings.image` | w720 | 720×720 (1:1) | 1080×1080 | hero-0x.jpg |
| Newsletter bg | `section.settings.image` | w1600 | full-bleed cover | 1600×1200 | none (blank) |
| Materials card | `block.settings.image` | w1200 | 1200×900 (4:3) | 1200×900 | hero-0x.jpg |
| Story image | `section.settings.image` | w1600 | cover (~4:5) | 1600×2000 | none (blank) |
| Product card | `product.featured_image` | w800 | 800×1000 (4:5) | 1200×1500 | — |
| Product main | `product` images | w1600 | cover | ≥1600×2000 | grey box |
| Product thumb | `product` images | w800 | thumbnail | — | — |
| Product gallery | `product` images | w1200 (srcset 600/1200) | full width | — | — |
| Cart drawer thumb | line item image | w240 → w200 | 100×124 (~4:5) | — | grey box |
| Search result thumb | product | w80 | 40×50 | — | — |
| Share modal thumb | `product.featured_image` | w200 | 72×72 | — | hidden |
| About page images | page settings | w1200, w800 | editorial | 1200 / 800 wide | — |

## 3. Shoppable sections

| Section | Requested | Render | Placeholder when empty |
|---|---|---|---|
| shoppable-product-hero | `image_url: w1800` | full-bleed cover | `placeholder_svg: product-1` |
| shoppable-lookbook | `image_url: w1800` | cover (~4:5) | `placeholder_svg: lifestyle-1` |
| hotspot pin thumb | `featured_image: w104` | 52×52 | — |
| hotspot popover img | `featured_image: w560` | 560×420 (4:3) | — |

## 4. Logo / branding

| Element | Source | Requested | Fallback |
|---|---|---|---|
| Header logo | `settings.brand_logo` | w320 | inline SVG (273×30 viewBox) |
| Footer logo | `settings.brand_logo` | w320 | inline SVG (273×30 viewBox) |
| Favicon | `settings.favicon` | w32 / w180 | `favicon.svg` (bundled) |

## Flags
- ✅ **Compressed:** `banner-collection.jpg` 14 MB→1 MB, `hero-03.jpg` 5 MB→544 KB (max 2560 px). Originals backed up in scratchpad.
- ✅ **Aspect fixed:** `cat-*` tiles square-cropped to 768×768; card `<img>` attrs now 1:1. Remaining: `cat-earrings.png` is a photo saved as PNG (972 KB) — convert to JPG for ~85% savings (requires renaming the fallback ref in `categories-grid.liquid`).
- ✅ **Favicon:** `favicon.svg` bundled + `settings.favicon` picker added; linked in `theme.liquid` head.
- **Unused:** `hero-01.jpg`, `hero-05.jpg`, `noa_logo.svg`, `noa_logo_white.png`.
- **No blank fallback:** story + newsletter render empty if merchant uploads nothing.
