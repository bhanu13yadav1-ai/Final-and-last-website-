# BLacked Final Fusion — Release Candidate

A consolidated, mobile-first static website prototype built around the supplied P2 BLACKED repositories. The project combines a campaign-led home, an editorial Intimates gallery, Couples tools, an adults-only After Dark room, women's wellness education, the Sanskari gallery, upcoming collection previews, and a local-only manual Fit Studio.

## Important asset note

This ZIP **uses the original image files already present in the P2 repositories** via their `raw.githubusercontent.com` URLs. It does **not** bundle those image binaries inside this ZIP, so the first image load needs an internet connection. The page includes a per-image fallback path where an alternate source image is available. The local application shell and its CSS/JS are included. To produce a self-contained/offline release on a computer with internet access and Python 3, run `python tools-download-assets.py` from the extracted project folder. The helper attempts to download the 60 image files listed in `assets/asset-manifest.json`, rewrite the HTML/JavaScript to local paths, update the service-worker precache and generate `BLacked-Final-Fusion-Offline.zip`. Review the generated download report and verify every image before using the offline build.

## Run / publish

1. Extract this ZIP.
2. For a quick preview, open `index.html`. Some browser features are more reliable when served over HTTP(S).
3. For GitHub Pages, upload the **contents of this folder** to the root of a new test repository or branch (do not upload only the ZIP). Keep `index.html`, `styles.css`, `app.js`, `sw.js` and `manifest.webmanifest` at the same level.
4. Enable GitHub Pages for the intended branch/root folder, wait for publishing, then test the live URL on Android Chrome with a fresh reload.
5. Do not replace/delete any original P2 repo until a deployed test build has been reviewed and backed up.

## Included interactions

- Mobile-responsive navigation between Home, Intimates, Boyfriend & Couples, After Dark, Wellness, Sanskari Edit, Fit Studio, and About/Privacy.
- Intimates search, category filters, alphabetical sorting, local save/favourites, up-to-three concept compare, details dialogs, and a clearly labelled demo bag.
- Date idea generator, local save for the current date idea, conversation prompts and copy actions.
- A new Dirty/Wild Wheel with ten prompt categories, spin/skip/reset, and an opt-in consent checkbox before a generated prompt is revealed.
- The three legacy wheel locations are kept separate: Wellness Dildo comfort wheel, Wellness plug safety wheel, and Boyfriend/Couples size-vibe wheel.
- Approximate size-guide starting point with input validation and a brand-variation disclaimer.
- Nine-frame concept angle viewer with arrows, slider and direct frame selection.
- Body-education cards linked to ACOG, NHS and Planned Parenthood references.
- Sanskari campaign gallery with filters, saved stories and clearly disabled Muslim-inspired / Christian-inspired Coming Soon previews.
- Manual Fit Studio accepts a user photo and a transparent garment cutout, supports size/rotation/opacity/position changes and creates a local PNG preview. It is **not** AI try-on or a real garment-fit prediction.
- Local JSON export and reset for saved concepts/demo bag; no backend is connected.

## What this is not

There is no real checkout/payment, live stock, supplier database, customer login, cloud sync, companion booking service, connected AI model, identity/age verification, or production analytics. The 18+ gate is only a self-attestation UI. Product/reference pictures do not establish actual product availability, features, materials, measurements, certifications or commercial rights. Obtain permission where required and verify legal/advertising obligations before commercial release.

## Artwork sources

See `assets/asset-manifest.json` for the exact image URLs used in the site and their source repository. Images are sourced from these P2 repositories:

- https://github.com/bhanu13yadav1-ai/Brand-website-4f
- https://github.com/bhanu13yadav1-ai/Brand-website-1
- https://github.com/bhanu13yadav1-ai/Brand-website-2
- https://github.com/bhanu13yadav1-ai/Brand-website-3
- https://github.com/bhanu13yadav1-ai/Brand-website-full-finally-

## Health-content notes

Wellness material is general education, not diagnosis or personal medical advice. It explicitly distinguishes vulva/vagina, says virginity is not a medical diagnosis and hymen appearance cannot establish sexual history, avoids self-inspection claims, and recommends qualified care for persistent pain, unusual bleeding, sores or concerning symptom changes. The measurement calculator is only an approximate starting point and states that brand/country sizing differs.

## QA scope

Run `python qa/static_check.py` to repeat the no-network static checks. See `QA-REPORT.md` for the recorded result and important outstanding live/device checks. See `SOURCE-COMBINATION.md` for the merge decisions across all ten P2 repositories, and `QUICK-START-HINDI.txt` for quick setup steps in Hindi. No honest claim is made that this package has already passed a real Android device run or a live GitHub Pages deployment.
