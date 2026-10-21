# QA report — BLacked Final Fusion

Date of package assembly: 21 October 2026  
Release label: `4.0.0-rc1`

## Static checks performed

The reproducible project checker is `qa/static_check.py`. It uses Python's standard library and Node.js (for JavaScript syntax checks), and does not require a network connection.

Latest run: **28 PASS, 0 FAIL**.

Checks include:

- HTML parsed without parser errors; all 114 element IDs are unique.
- All 19 static HTML image tags have alt text.
- No inline `on*` event-handler attributes.
- All eight navigation view names match existing page sections.
- Local JavaScript/CSS references point to files in the package.
- All 92 literal JavaScript ID selectors resolve, apart from the documented `compare-tray` created dynamically.
- All original three wheel controls and click/data logic are present at their intended locations, plus the separate Dirty/Wild Wheel.
- Home shortcuts to the original Wellness wheels target the correct wheel cards.
- Dirty/Wild Wheel has ten categories.
- Wellness education includes core anatomy/virginity accuracy statements and ACOG/NHS/Planned Parenthood source links.
- Image manifest parses with 60 unique source-image records; literal and dynamic source-image references are recorded.
- Service worker and age-dialog cancel listeners are each registered once.
- Image fallback handles an image that failed before listener setup and has a no-broken-icon placeholder state.
- CSS braces balance (641 opening / 641 closing), responsive breakpoints are present.
- The PWA web manifest is valid JSON and its SVG icon path resolves.
- `node --check app.js` and `node --check sw.js` pass.

Repeat the checks with:

```bash
python qa/static_check.py
```

## Interactions implemented; not claimed as live-browser tested

- Responsive primary and mobile navigation between Home, Intimates, Boyfriend & Couples, After Dark, Wellness, Sanskari Edit, Fit Studio, and About/Privacy.
- Intimates search, category filters, alphabetical sorting, local saved/favourites, up-to-three concept compare, details dialogs, and demo bag.
- Date idea generator, local save for the current idea, conversation prompts and copy actions.
- 18+ self-attestation and consent-checkbox prompt reveal on the Dirty/Wild wheel.
- Three legacy wheels: Dildo comfort (Wellness), plug safety (Wellness), and Boyfriend/Couples vibe wheel (Couples view).
- Size calculator unit switch, input validation, reset, and size-brand disclaimer.
- Nine-frame concept-angle viewer with arrows, slider and frame-selection controls.
- Local photo + transparent garment image upload, overlay adjustments and PNG export.
- Local JSON export and local-data reset.

## Not verified in this environment

- Actual binary download, decode, dimensions or visual suitability for every selected image. The 60 sources are recorded in the manifest and their filenames were found during GitHub repository-tree review, but this environment could not resolve `raw.githubusercontent.com` to download the binary bytes.
- Real Android Chrome layout/touch testing or full interactive click-through. Headless browser navigation was blocked by the environment's browser/network policy (`ERR_BLOCKED_BY_ADMINISTRATOR`).
- Live GitHub Pages path/cache/service-worker deployment.
- Screen-reader audit, Lighthouse/Core Web Vitals, dependency/security audit.
- Commercial image usage rights, product claims, supplier data or legal review.

## Important asset status

The included ZIP is the **online-image variant**. The HTML/JavaScript use image URLs from the P2 public repositories; image loading requires internet access and the source repositories must remain publicly reachable. `assets/asset-manifest.json` records 60 selected images. `tools-download-assets.py` is included to download those image binaries and produce a separate offline ZIP in an environment with internet access. That offline output must itself be checked before release.

## Known limitations before production

1. Download and bundle source image files; verify actual dimensions, decodability, content match, path casing and usage permission. Confirm every image on a fresh load and refresh.
2. Review every historic product/campaign item in all ten source repositories. This is a curated merge, not a claim that every historical item or feature was migrated.
3. Run browser smoke tests at 320, 360, 390, 430 and desktop widths, including all navigation paths, each wheel, dialogs, persistence and uploads.
4. Test over a real HTTPS origin and deployed GitHub Pages. Confirm no horizontal overflow, console error, broken image or stale service-worker shell.
5. Obtain human review for visual image/content match, copyright/usage permission, medical content and commercial compliance.

## Behaviour and product-truth safeguards

- Cart is demo-only and does not place an order.
- Adult-age dialog is self-attestation, not formal age verification.
- Fit Studio is manual overlay, not AI try-on and not fit prediction.
- The 360-degree display is a frame viewer, not true 3D or a verified product scan.
- Size result is a rough EU-style starting point and must be checked against the brand's sizing chart.
- No user photo, measurement, saved item or wheel choice is transmitted to a server by this static prototype.
