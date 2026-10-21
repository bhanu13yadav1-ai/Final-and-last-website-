# Parallel chats ka kaam ek saath kaise merge karna hai

## Sabse zaroori rule

**Har chat ka kaam alag rakho. Koi bhi chat shared `main` ko bina coordination ke replace na kare.** `index.html`, `app.js`, `styles.css`, `sw.js` aur manifests common files hain; inko poora replace karne se doosre chat ke features delete ho sakte hain.

## Recommended workflow

1. **Master base fix karo:** `Final-and-last-website-` ka ek backup/ZIP lo aur uska base commit SHA note karo. Isi ko final integration base maana jayega.
2. **Feature-wise parallel work:** Har chat ko alag branch ya alag ZIP/copy do. Suggested boundaries:
   - Image asset migration and local bundling: `assets/`, manifest, image audit scripts.
   - Innerwear 360/favourites: `addons/innerwear-360.*` or one small isolated patch.
   - Wellness/Fit Studio: `addons/wellness-fit.*` and its matching CSS.
   - UI/UX: visual review and small CSS-only changes where possible.
   - QA: `qa/`, test report and bug list only.
3. **No blind file overwrite:** Agar kisi chat ne `app.js` banaya hai, usko master `app.js` par seedha upload/replace mat karna. Pehle diff compare karo; sirf new functions, event bindings aur associated styles merge karo.
4. **Assets pehle, features baad mein:** Root asset manifest, correct local paths, image attribution and service-worker rules ko pehle final karo. Uske baad add-on code integrate karo, taaki features ki image paths dobara na badalni padhein.
5. **Ek branch ek baar merge:** Har feature merge ke baad `node --check app.js`, project static check aur browser smoke tests chalao. Ek baar sab merge ho jaaye tab live GitHub Pages deployment karo.
6. **Service worker update:** `app.js`, CSS, manifest ya offline files badalne ke baad cache version update karo aur fresh/private window se check karo. Purani cache se galat version dikh sakta hai.
7. **Original features ko test se verify karo:** Teen old wheels alag-alag, naya Dirty/Wild Wheel, Sanskari, all-image gallery, saved drawer, fit overlay, offline images aur responsive navigation. Feature ka code hona uske working hone ka proof nahi hai.

## Har chat ke end par yeh handoff mangna

- Base repo aur base commit SHA.
- Branch name ya exact output ZIP/files.
- Added/changed/deleted files ki list.
- Feature ka user-visible behaviour aur screenshots, agar possible.
- Run kiye gaye commands/tests aur actual results.
- Kya test nahi hua, known bugs aur external asset dependencies.
- Duplicate/conflicting functions, IDs, localStorage keys ya CSS class names.
- Kya doosre feature ki file replace ki gayi hai? Agar haan, reason aur diff.
- Exact integration instructions; “copy all files and replace everything” acceptable nahi hai.

## Final merge order

`Backup/base → asset path + inventory → innerwear 360 + favourites → wellness/fit tools → navigation/UI polish → QA/security/accessibility → GitHub Pages release`.

Agar koi branch available nahi hai, har chat se **feature-only ZIP/diff** lo. Sabko ek final ZIP folder mein extract karke merge karo; do alag complete `app.js` files ko concatenate ya ek ke upar ek upload mat karna.
