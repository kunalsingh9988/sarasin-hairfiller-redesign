# Source-order correction — 10 November 2026

## Cause and correction

The previous export-led layout retained the source content but rearranged its sections. In particular, “4. Voordelen van haarfillers” appeared before section 1. Presence-only checks passed and did not detect this reading-order defect.

The homepage now follows the original clinic page's heading and content-item order. Its six numbered topics are:

1. Voor wie is een Hairfiller behandeling geschikt?
2. Hoe ontstaat haaruitval en dunner wordend haar?
3. Wat doen Hair Fillers juist?
4. Voordelen van haarfillers
5. Resultaten
6. Klantervaringen

Intervening original sections remain in their original positions: collagen, consultation, videos, before/after gallery, peptide formulation, procedure, before/after care, prices, alternatives, self-care, quiz, media, FAQs and author biography. Section 4 and its six benefits are not hidden in a disclosure. The peptide table is visible in its original position, not separated from its surrounding explanation by tabs.

## Fresh source audit

Read-only recapture of https://sarasinclinic.com/behandelingen/hairfiller/ on 10 November 2026 matches the retained source snapshot's full treatment text, text nodes, heading sequence, tables, links, video embed sources, original image URLs and alt text. Runtime image-loading metadata differs, not the image content inventory.

- 43 original headings, unchanged and in order.
- 165 original content items, once each and in order.
- 477 reader-facing text fragments retained; one additional captured fragment is literal iframe fallback markup, not reader-facing copy.
- Seven original tables, 60 original image elements, 57 original links.
- Nine unique YouTube video targets across source embed and thumbnail controls.

## Regression coverage

`tests/homepage.cjs` now checks the complete interleaved heading/item sequence against `content/homepage-source.json`, not only presence. It verifies all six numbered sections are visible in increasing vertical order at 320, 360, 393, 568, 700, 768, 900, 1024, 1440 and 1920px. It also checks all six benefits, source text, table rows, image loading, links, anchors, menu overlay, video dialog cleanup and reduced-motion hero behavior.

The generator fails if any original item is absent, duplicated or rendered out of sequence. The public `/content-check/` checklist links to each real homepage item.

## Scope and limits

The audit covers the original treatment page's `main#content`, not the unrelated WordPress global navigation/footer. Source clinical claims and conflicting intervals are retained verbatim, not newly validated or endorsed. Clinical review, media reuse permissions and WordPress production integration remain separate launch dependencies. This change affects the standalone review preview and its WordPress handoff package; the main clinic website and Shopify theme are untouched.
