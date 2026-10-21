# Source-repository review and merge decisions

The P2 owner account was inspected across all ten repositories listed below. This release is a curated, integrated build; files from different generations were not blindly overlaid because the same filenames (`index.html`, `app.js`, `styles.css`) have incompatible IDs and event logic in some versions.

## Sources used for the final app and/or its artwork

| Repository | Useful source material used | Decision |
|---|---|---|
| `Brand-website-4f` | Best-documented current functional baseline, wheel concepts, campaign/Sanskari/Wellness art, app-shell and QA notes | Main design/interaction reference and a major source of the 60 image references |
| `Brand-website-1` | Campaign-led home, Intimates browsing, wishlist/compare/demo-bag concepts, editorial imagery | Used for selected home/catalogue concepts and artwork |
| `Brand-website-2` | Wellness/Fit Studio ideas, size and comfort sections, product-angle artwork, fit/editorial imagery | Used for Wellness/Fit Studio design ideas and selected artwork |
| `Brand-website-3` | Catalogue/detail/compare patterns, Sanskari stories, cutout families, concept-angle frame viewer, Couples content | Used for catalogue/story structure and selected artwork |
| `Brand-website-full-finally-` | Couples café story scenes, Sanskari/wellness campaign art | Used for selected Couples and gallery artwork |

## Repositories reviewed but not copied wholesale

| Repository | Reason |
|---|---|
| `Brand-website-v1` | Valuable master prompt, phase handoff notes, asset audit and test records; largely process/audit material rather than a separate large local image collection |
| `Brand-website-v2` | Recovery-oriented build with a different code/layout generation and no root image collection in its documented state; useful for requirement cross-checks, but merging its wrappers directly risks path/ID conflicts |
| `Brand-website-5` | Empty repository; no source files to merge |
| `Brand-website-final-` | Primarily visual concept/screen-board images rather than a functional source codebase; those giant screenshot boards are not appropriate as live campaign assets |
| `Pics-` | A separate PornPicks-branded demo with only three generic placeholder gallery images. They were not mixed into the BLACKED brand without visual verification or a reason to treat those placeholders as approved BLACKED artwork |

## Integration safeguards

- The app has one unified `index.html`, `styles.css` and `app.js` to avoid collisions from similarly named files in different versions.
- The image manifest records **60 selected image files** and their source repository/path. The current release references those public images directly, so the online variant requires internet access.
- `tools-download-assets.py` can fetch the 60 referenced files, rewrite their paths to a local `assets/images/` tree and generate a self-contained offline ZIP when run in an environment with internet access.
- The original three wheel flows are preserved at separate locations: Dildo comfort and plug safety inside Wellness; the Boyfriend/Couples vibe wheel inside Couples. The added Dirty/Wild Wheel is separate and does not replace them.
- No original GitHub repository was changed by creating this package.

This review establishes source-path and design provenance, not proof that every historical feature/image across all ten repositories has been ported. Full binary image verification, live HTTPS testing and physical Android QA remain outstanding.
