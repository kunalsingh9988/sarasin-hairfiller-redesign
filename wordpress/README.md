# WordPress handoff — approval and staging required

This is an **optional integration approach**, not an installed or production-verified WordPress site. Joachim must confirm the actual mini-site URL, CMS, theme/builder and plugin stack before choosing this approach. Keep the existing platform. Prefer the site's existing block/builder architecture if that is more maintainable; the plugin is not a requirement to replace it.

## What is included

- `sarasin-hairfiller-pilot/`: a narrowly scoped full-page review template and bundled static assets. It registers an optional template but creates no posts, pages, redirects, database migrations or theme changes.
- `landing-page.html`: Gutenberg Custom HTML block content for a draft review page; the text is editable as HTML. It is not a fully native block-by-block editor implementation.
- `article-drafts.xml`: three native WordPress draft posts. On import, assign them to an approved existing editorial user; do not present the drafts as clinically approved.
- `faq-schema.json`: matching FAQ data as a handoff. **Do not add duplicate schema** if the existing SEO plugin already owns it.

## Staging workflow for Joachim

1. Confirm WordPress is the actual mini-site platform. Take a restorable backup and work in a protected staging clone, not the main clinic website.
2. Inventory theme, builder, PHP/WP versions, SEO plugin, consent manager, caching, security, multilingual setup and booking integration. The package has not been runtime-tested against that stack.
3. If the template approach is approved, install the review plugin on staging only. Create a **draft** page, assign the `Sarasin Hairfiller Pilot (staging review)` template and paste `landing-page.html` into the code editor / Custom HTML block. Preview it. Existing theme assets can still be enqueued by WordPress; test for CSS/plugin conflicts.
4. Import `article-drafts.xml` as drafts through the normal WordPress importer, only after approval to import. Confirm authorship and map the preview `/blog/…/` links to the actual existing permalink structure. This package does not change permalinks globally.
5. Use the existing SEO plugin for titles, descriptions, canonicals and sitemap. The prototype's clinic canonical and Vercel URLs are **not** imported into the WordPress template. Configure real self-canonicals on the approved domain. Preserve existing routes; prepare redirects only for URLs that genuinely change.
6. Migrate source media to the existing Media Library if that is the agreed maintenance model; verify patient/photo reuse permission for this separate mini-site. Bundled assets are a review aid, not proof of reuse consent. Check the server's upload-size limit before uploading the ZIP.
7. Connect the existing CMP to `window.sarasinMeasurement.setConsent({analytics: true/false})` and the approved analytics setup. It defaults to denied and loads no analytics/advertising vendor scripts. Do not send health conditions, form fields, FAQ topics or patient data. Booking clicks are not completed bookings.
8. Complete clinical, accessibility, responsive, real-device, performance, consent, booking and SEO tests. Update/remove the visible draft notice only after written sign-off.
9. Indexing remains blocked for this template by default. Only after launch approval may Joachim set `SARASIN_HAIRFILLER_PILOT_LAUNCH_APPROVED` to `true` in controlled configuration. This removes this plugin's block; it does **not** override a global staging/noindex policy or force indexing. Check all other indexing controls and the actual response afterwards.
10. Deploy using the existing site's release process; retain the previous page and backup for rollback. No new hosting/platform migration is required by this package.

## Not yet verified

Actual WordPress rendering, plugin/builder compatibility, SEO-plugin output, consent integration, Media Library migration, native blog URLs, booking completion attribution and production deployment remain unverified until staging access is approved. Browser checks of the static preview do not prove these integrations work.

The target declared by the sample plugin is WordPress 6+ / PHP 7.4+; confirm the real environment. This is a compatibility target, not a claim that the client's WordPress/PHP version was inspected.
