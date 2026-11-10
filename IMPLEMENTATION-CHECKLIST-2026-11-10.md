# New homepage-reference implementation — 10 November 2026

Later client correction: preserve the source page's exact heading/item sequence. See `QA-SOURCE-ORDER-2026-11-10.md` for the completed sequence correction and tests; this supersedes the ingredient-tab and export-led ordering decisions below.

## Binding request

- Content authority: https://sarasinclinic.com/behandelingen/hairfiller/
- Desktop composition: Figma `40002348:849` in file `4bfik7c0UoRH24cfdhtyQX`.
- Mobile composition: Figma `40002348:208` in the same file.
- Preserve Sarasin content, colours and typography; use the reference for layout, not another brand's facts.
- Include every source text/content item. Do not substitute a heading-only test for complete-content verification.
- Add relevant lifestyle/product-use visuals and free-library icons. Never fabricate patient results, reviews, credentials or product benefits.
- Main clinic WordPress and Shopify are outside this implementation's mutation scope.

## Completed now

- Read the pasted reference text. It is RegrowthClub/Regenepure content, not Sarasin copy. Its review totals, guarantees, Minoxidil claims, prices, subscriptions and testimonials must not be transferred.
- Captured current main-content HTML, full text, text nodes, every heading level, table cells, image metadata, links, video elements and labelled controls in `audit/source-complete-2026-11-10.json`.
- Inventory: 478 non-empty text fragments, 43 headings, seven tables, 60 image elements, 57 links and four video/embed elements. Video links are also retained in the link inventory; element count is not a count of all playable stories.
- Confirmed all 139 previously captured paragraph/list/table blocks remain in the current source.
- Added a repeatable read-only audit tool, `tools/audit-complete-source.cjs`.

## Implementation and verification

- [x] Received desktop/mobile PDF exports and mobile PNG; browser/Figma connector access is no longer needed for this reference implementation. Connector repair itself is not established.
- [x] Rendered and inspected the supplied compositions. Adapted their result-led hero, alternating story sections, benefits, ingredient tabs, procedure/video split, gallery/reviews, pricing and FAQs to Sarasin branding.
- [x] Mapped every reader-facing source text fragment, heading, image, video and link to an actual design destination, including reviews, author credentials, all treatment tables, zones, aftercare, alternatives, self-care and consent.
- [x] Retained source wording in the proper reading section—not a separate hidden transcript. Clinical conflicts and claims remain explicitly pending approval.
- [x] Created a labelled AI product-use lifestyle scene using the real pouch as reference; retained the original packshot and all original clinical images separately.
- [x] Reused consistent local Lucide icons, strengthened image/text hierarchy, added accessible ingredient tabs and clearer pricing. No decorative marquee was needed; motion is confined to the controllable hero.
- [x] Verified original content, images, tables, links, keyboard tabs, menu overlay, videos and reduced-motion hero controls at 320–1920px browser viewports. Real-device and clinical acceptance remain outstanding.
- [ ] Production WordPress launch: requires staging access, authorised clinical/media review, integration tests and approval. This is not the static review deployment.

## Current boundary

The new homepage is implemented from the supplied exports in `homepage.css`, `homepage.js` and `tools/build-homepage.cjs`. `/content-check/` links to the real destinations of all 165 semantic items. Tests verify 477 reader-facing fragments; the one excluded raw fragment is literal iframe fallback markup `<br />`, not treatment copy. Source capture covers the treatment's `main#content`, not the original global WordPress navigation/footer. Source provenance does not establish medical accuracy or asset reuse rights. Git/Vercel release is verified separately from a WordPress production launch.
