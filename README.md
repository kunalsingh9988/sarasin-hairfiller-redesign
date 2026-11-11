# Sarasin Hairfiller — Figma homepage, 11 November 2026

The homepage now follows Figma file `4bfik7c0UoRH24cfdhtyQX`, frame `40002354:233`. It uses the frame's peach CTAs, comparison hero, product compositions, cause illustrations, video rail, paired information layouts and visual hierarchy. The homepage uses the English wording from the supplied Figma frame, as requested. The complete source item inventory, original media, link destinations and numbered topic order are retained. `content/homepage-en.json` stores the English content; `content/homepage-source.json` remains the original Dutch reference.

- Run `node tools/build-homepage.cjs` to regenerate the homepage and content checklist.
- `homepage.css` supplies existing base components; `figma-homepage.css` applies the Figma desktop design and phone layouts.
- `audit/figma-homepage-assets.json` records every downloaded asset, its Figma section and intrinsic dimensions. Assets are local under `assets/figma/`; no temporary Figma URLs are used at runtime.
- `audit/homepage-figma-mapping-2026-11-11.json` records source content and the displayed image files.
- Run `node tests/homepage.cjs http://localhost:8774` for complete source/content order and interaction regression checks.
- Run `node tests/figma-homepage.cjs http://localhost:8774` for Figma hero geometry, critical asset slots, phone layouts and video rail checks. Playwright must be available through the local Node environment.

The new design is the standalone review homepage. The historical WordPress review ZIP is a prior handoff and has not been regenerated for this Figma revision.

---

# Sarasin Hairfiller — PDF-reference homepage, 10 November 2026

Standalone HTML/CSS/JavaScript review site adapted from the supplied desktop/mobile PDF exports, with Sarasin's Dutch content, green/ivory palette and self-hosted Bricolage Grotesque. The main clinic site and Shopify are unchanged.

## Current build

- Run `node tools/build-homepage.cjs`, then `python3 -m http.server 8774`.
- `homepage.css` and `homepage.js` implement the new homepage. Legacy CSS/JS remain for supporting blog/project routes and historical evidence.
- **Do not run `tools/build-pilot.cjs` over this homepage.** It is the superseded November 7–8 builder.
- `content/homepage-source.json` contains the original semantic content groups; `audit/source-complete-2026-11-10.json` preserves original HTML, text, links and media.
- With Playwright available, run `node tests/homepage.cjs http://localhost:8774` for content, responsive and interaction checks.
- `/content-check/` links directly to each original item's real section, not a separate source transcript.

## Content and imagery

The new homepage retains 43 original headings, 165 semantic items, seven tables, 60 original image elements and 57 links. Of 478 raw text fragments, 477 are reader-facing; one is literal iframe fallback code `<br />`. Tests verify actual text and cells, not merely headings. Source clinical claims and inconsistent protocols are retained with a review warning, not medically approved by this project.

Original clinical imagery and numbered zone diagram are unaltered. `assets/lifestyle-collagen.webp` is a labelled AI lifestyle illustration based on the real Sarasin pouch, not a patient result. Existing `vision-*.jpg` imagery is illustrative too. The source packshot is retained separately. See `assets/homepage-media-provenance.json` for sources and generation prompt. Icons use the existing local Lucide library.

The reference brand's testimonials, review counts, benefits, guarantees, subscriptions and press endorsements are not Sarasin content and were not imported.

## Current behaviour and handoff

Two-second hero rotation has manual controls, pause, hidden-tab suspension and reduced-motion pause. Original headings and content items follow the source order, including numbered sections 1–6; the peptide table is visible inline. Native disclosures retain the long photo gallery, original animation and FAQ answers in HTML. The mobile menu overlays content without displacing it, traps focus and closes on Escape/backdrop/selection. External videos are click-to-load and removed on close. No analytics vendor, cookies or campaigns are activated. See `QA-SOURCE-ORDER-2026-11-10.md` for the fresh audit and sequence regression checks; it supersedes the earlier export-led ordering and ingredient-tab notes.

`node tools/build-handoff.cjs` updates an optional WordPress staging-review package, not an installed or runtime-tested production integration. Preview remains noindex. Clinical approval, media reuse rights, final CTA approval, WordPress access/integration, production SEO/analytics and physical-device QA remain separate launch gates. See `QA-2026-11-10.md` for current evidence.

---

## Historical concept notes (superseded; not current design specifications)

Standalone HTML, CSS and JavaScript refinement of the [Hairfiller page](https://sarasinclinic.com/behandelingen/hairfiller/). This is a concept deployment on Vercel and does not change the clinic website or Shopify theme.

## Approach

- A direct path from concern and suitability to treatment, expectations, price, care and consultation.
- Compact disclosure sections preserve care details and common questions without making the main reading path long.
- One clear booking destination and relevant links to the clinic's priority treatments and webshop.
- Semantic headings, descriptive metadata, responsive layout, keyboard accessible navigation and video dialog.
- Mobile navigation overlays the page without changing the header height or page position. The background is locked while open; Escape, the backdrop, navigation links and the close button dismiss it. Short viewports scroll within the menu, and returning to desktop clears the overlay state.

The before/after photographs and video stills are from the existing public Sarasin Clinic Hairfiller page. The hero and supporting result imagery include patients of different genders and show actual treatment journeys. The three `assets/vision-*.jpg` images in the Sarasin 360° graphic were generated as editorial illustrations; they are not photographs of Sarasin staff, patients, products, or facilities. Individual results vary; the clinic should review result captions and clinical claims before this concept replaces production content. Pricing and instructions were transcribed from the page as viewed on 2 November 2026 and should be confirmed before launch. Icons are from [Lucide](https://lucide.dev/) and include the package license in `assets/icons/LICENSE`.

The closing consultation section uses the Beveren interior photograph from the public Sarasin Clinic homepage.

The pricing cards use three AI-generated photorealistic scalp images instead of SVG diagrams. These are illustrative examples of local, medium and broader thinning, not patient photographs, treatment results, diagnostic categories or guaranteed coverage for a given volume. The page explicitly discloses this. Asset paths and generation prompts are documented in [assets/zone-images.md](assets/zone-images.md).

The supplied Figma frame was visible in the browser but the connected Figma integration lacked permission to inspect its layers and assets. This version uses the visible frame, the live Sarasin Clinic homepage and the Hairfiller page as visual and content references. The canonical URL points to the existing clinic page to avoid competing search listings while this remains a separate concept deployment.

## Local preview

Run `python3 -m http.server 8000` in this directory, then open `http://localhost:8000`.

## Compact mobile reading flow

The overview and suitability content are combined. Both page-navigation sections remain available as native disclosures. On screens up to 800px, navigation panels and zone descriptions start closed; their full content remains in the HTML and opens with a tap or keyboard. Desktop starts with these panels expanded. Prices, quantities, zone illustrations, treatment steps, the main patient result, videos and longevity content stay visible in the primary reading flow. Additional patient examples are available in the results section. The FAQ contains its heading and questions without a patient photograph.

The product thumbnail has a smaller WebP version; clinical before/after photographs remain unchanged. Image dimensions reserve space during loading. Structured data covers the page, breadcrumbs and the six visible FAQ entries.

At a 390 × 844 Chromium viewport, the default reading flow decreased from 13,025px to 7,727px (about 41%). This compares the normal initial states, with the secondary disclosures available to expand. Responsive checks covered 160–1920px widths, and keyboard/disclosure, navigation, carousel, FAQ and video interactions were checked at phone, tablet and desktop widths. Physical iOS/Android device behavior has not been verified.

## Clinic-site handoff

The [6 November client-feedback checklist](CLIENT-FEEDBACK-2026-11-06.md) records the implementation, verification and remaining client dependencies. Booking buttons use a contrasting citrine accent, and the pricing cards now use simple zone headings with indicative outlines and captions on the example scalp images. The corresponding Figma review frames received the requested refinements, but are not a complete synchronized copy of every website section.

This review deployment deliberately uses `noindex,follow` and a canonical link to the existing clinic page. When integrating the approved design into the clinic's real URL, confirm its intended indexing policy, retain a self-referencing canonical and verify the rendered page in Search Console. Recheck clinical copy, prices, booking links, the sitemap, internal links and the clinic's existing structured data in that environment. The preview does not verify or change those production settings. FAQ markup describes visible content and does not guarantee a rich search result.
