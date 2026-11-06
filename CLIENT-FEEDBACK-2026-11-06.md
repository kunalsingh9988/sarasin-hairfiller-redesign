# Client feedback — 6 November 2026

## Review links

- Working website, desktop and mobile: https://hairfiller-redesign.vercel.app/
- Pricing and treatment zones: https://hairfiller-redesign.vercel.app/#prijzen
- Figma desktop refinements: https://www.figma.com/design/4bfik7c0UoRH24cfdhtyQX/Sarasin?node-id=40002266-4255
- Figma mobile refinements: https://www.figma.com/design/4bfik7c0UoRH24cfdhtyQX/Sarasin?node-id=40002277-190

## Findings

The deployed website already had the refined desktop layout, Bricolage Grotesque, two page-guide sections and three pricing columns. The Figma file contained an older English desktop frame with DM Sans/DM Serif typography, SVG zone diagrams, the earlier section layout and the wording flagged by the client. This is a plausible explanation for the discrepancy, not proof of which frame or URL the client was viewing.

The original reference frame `40002259:191` is preserved. The existing desktop and mobile review frames were renamed with the 6 November revision date so the updated targets are identifiable.

## Completed implementation checklist

| Client item | Website | Figma | What changed |
| --- | --- | --- | --- |
| Check the desktop version | Verified at desktop widths | Older desktop frame identified; targeted refinements applied | The website and Figma are reported separately, not treated as automatically synchronized. |
| More noticeable CTA colour | Complete | Complete for five existing consultation buttons | Citrine `#dce784`, green text `#12433d`, visible border; existing rounded shapes retained. Website hover, active and keyboard-focus states are included. |
| Simplify zone headings | Complete | Complete in both review frames | Website: Kleine zone / Middelgrote zone / Grote zone. Existing English Figma copy: Small Zone / Medium Zone / Large Zone. Removed “Gericht beginnen”, “Meer ruimte behandelen”, “Een bredere aanpak” and their English counterparts from the card headings. |
| Clarify the treatment areas | Complete as an illustrative interim solution | Complete as an illustrative interim solution | Localized, medium and larger indicative outlines on the existing photorealistic scalp images. Website also has concise area captions and corrected intrinsic image dimensions. |
| Avoid misleading coverage/result claims | Complete | Complete | Visible disclosure explains that the AI-generated examples are not patient photos/results and outlines do not establish coverage per ml. |
| Preserve the approved mobile direction | Complete | Existing structure preserved | Compact cards, expandable zone details, rounded corners, mint/green branding and existing interactions retained. |
| Preserve important facts and destinations | Complete | Prices and treatment quantities retained | €210 / €310 / €415; 1 / 2 / 3 ml; existing zone explanations and booking destination unchanged. |
| Prevent reuse of an older stylesheet | Complete | Not applicable | Versioned the refined CSS URL and added a machine-readable design revision. |
| Regression checks | Complete in Chromium | Scoped visual and structure checks | See checks below. |

The Impeccable refinement workflow guided the scoped contrast, hierarchy and responsive checks. Existing design identity and unrelated content were preserved.

## Pending / not completed

1. **Client reference photos:** not provided yet. Replace the interim AI-generated zone illustrations with approved photos once supplied. No clinic patient photography was invented or represented as authentic.
2. **Clinical and client approval:** confirm that the indicative marked areas match the clinic's preferred explanation of its zones, and approve the new CTA colour. The outlines are not a clinical area map or guaranteed volume coverage.
3. **Full desktop Figma-to-website synchronization:** not completed. The requested headings, six zone images/outlines, five consultation buttons and disclosures were updated in the existing desktop/mobile frames. Other inherited Figma content/layout, desktop typography, older FAQ imagery and video composition are not yet a full mirror of the current website. Use the website link for the current complete interactive implementation.
4. **Physical-device testing:** not performed on actual iOS/Android hardware. Automated browser checks use Chromium viewport emulation.
5. **Live clinic-site integration:** not performed. This remains the standalone Vercel review deployment; `sarasinclinic.com` and the Shopify theme were not changed. Preview `noindex` and canonical safeguards remain intact.

## Verification

- Responsive checks: 320, 393, 568, 768, 800, 801, 1024, 1440 and 1920 pixels.
- All three photos decode, indicative outlines remain inside their photographs, headings and amounts match, no horizontal overflow.
- Normal CTA text contrast: **8.34:1**. Hover contrast: **7.15:1**. Border contrast against the pale canvas: **4.87:1**.
- Zone descriptions start collapsed on mobile and expanded on desktop, and toggle successfully.
- Both page-guide sections and six FAQ entries remain; no FAQ photograph was reintroduced on the website.
- Mobile menu overlays without shifting the page and restores background interaction on Escape.
- Video dialog opens, closes and removes its iframe.
- Existing broad mechanical design warnings were not treated as permission for unrelated redesign work.
- Figma: headings remain editable text; area markers and Lucide booking arrows are editable vectors. Scalp images are discrete image fills, not screenshots of the UI. JPEG versions were used because the uploaded WebP assets could not be decoded by Figma's renderer.

Run the repeatable browser checks with Playwright available to Node:

```sh
node tests/client-feedback.cjs http://127.0.0.1:8771
node tests/client-feedback.cjs https://hairfiller-redesign.vercel.app/
```
