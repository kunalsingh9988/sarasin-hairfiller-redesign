# Sarasin Clinic Hairfiller page concept

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

This review deployment deliberately uses `noindex,follow` and a canonical link to the existing clinic page. When integrating the approved design into the clinic's real URL, confirm its intended indexing policy, retain a self-referencing canonical and verify the rendered page in Search Console. Recheck clinical copy, prices, booking links, the sitemap, internal links and the clinic's existing structured data in that environment. The preview does not verify or change those production settings. FAQ markup describes visible content and does not guarantee a rich search result.
