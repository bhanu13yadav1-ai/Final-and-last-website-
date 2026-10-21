# Manual browser / Android QA checklist — do not mark pass without testing

## 360° Innerwear viewer
- [ ] All eight `360-demo-*.webp` frames load; frame counter and label match the image.
- [ ] Previous / Next, range slider, frame dots, keyboard left/right, horizontal swipe/drag each select the correct frame.
- [ ] Missing frame shows an explicit “Image unavailable” panel rather than a broken icon or a wrong product fallback.
- [ ] Save toggle appears in the existing Saved drawer; save/remove works after refresh.

## Full source image archive
- [ ] Archive reports correct count from `innerwear-image-library.json` and categories populate.
- [ ] Search matches title, category, filename and source repo; category filter resets pagination.
- [ ] “Show more” reveals additional images without refreshing the page.
- [ ] Each card shows a real, appropriate source image; unavailable files are obvious.
- [ ] External-brand inspiration and owner-reference items remain clearly labelled; no product claims are inferred from imagery.
- [ ] Saving an archive card shows it in the same Saved drawer; removal persists after reload.

## After Dark concept archive
- [ ] Search and three filter states work; only “Product-only concept image” and “8-frame concept viewer” entries are included.
- [ ] Text correctly says concept art only and does not imply live stock, price or supplier data.

## Wellness comfort notes
- [ ] Focus/detail choices generate relevant general guidance; no result is described as diagnosis.
- [ ] Fit note saves locally; survives reload; character count stops at 600; delete removes it.
- [ ] Data export and clear-local-data controls still work; no note or quiz answer is sent to a server.

## Fit Studio cutouts
- [ ] Select shows cutouts; use action loads selected cutout into overlay.
- [ ] Sliders, drag, rotation, opacity, reset and local body-photo upload still work.
- [ ] Test PNG export using locally bundled cutout. If CORS/canvas-taint prevents a preset export, the UI gives an honest message and local PNG upload remains usable.

## PWA / assets / layout
- [ ] `asset-manifest.json`, `innerwear-image-library.json`, `assets/app-icon.svg`, CSS and JS are present at expected paths.
- [ ] `node --check app.js`, `python static_check.py`, image downloader report and any integration-specific checks have fresh results.
- [ ] Test viewport widths 320, 360, 390, 430 and desktop: no horizontal overflow, clipped controls or body text below legible sizing.
- [ ] Test HTTPS cold start, hard reload, private window, after service-worker update, airplane mode after viewing required images, and offline refresh.
- [ ] Keyboard focus order and screen reader labels are usable; reduced-motion preference does not break controls.
- [ ] Never describe the eight frames as genuine 3D or the static 18+ self-attestation as formal age verification.
