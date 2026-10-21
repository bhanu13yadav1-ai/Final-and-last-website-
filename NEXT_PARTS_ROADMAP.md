# Roadmap after Part C

## Part C — this package
- Exact result/pointer match for three original wheels plus Dirty/Wild.
- Local copies of four Boyfriend reference images and the separate Threesome Fantasy cover.
- Generic labels only; no identity or anatomical size guesses.
- Additive patch and diagnostics; live production validation pending.

## Part D — suggested next big update
- Story Reader UX: chapter switcher, clear progress bar, Continue Reading and optional local bookmarks.
- More content filters: language, theme, reading time, intensity/clean-language warnings.
- Image archive repair: run all source URL checks on the deployed site, then decide whether to bundle more images locally.
- Complete regression on all existing screens before any redesign.

## Release gate
Do not proceed from Part C to a production release until `part-c-diagnostics.html` reports all Part C checks passing and the user has checked the hosted page on a real Android device. Keep any live error as FAIL/BLOCKED/NOT TESTED.
