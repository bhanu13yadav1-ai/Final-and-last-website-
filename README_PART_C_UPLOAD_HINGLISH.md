# V1 Part C — Upload Guide (Hinglish)

## Is ZIP mein kya hai?

Part C ek **add-on patch** hai, full site replacement nahi. Isme actual wheel repair, 4 Boyfriend reference cards, alag Threesome Fantasy 18+ view, 5 bundled WebP images, diagnostics aur reports hain. Original `index.html`, `app.js`, `styles.css`, `sw.js`, manifest, stories aur product data ko replace karne ki zaroorat nahi.

## GitHub par upload

Target repo: `https://github.com/bhanu13yadav1-ai/Brand-website-v2`

1. ZIP download karke Android phone par extract karo.
2. Repository ko backup karo ya ek branch banao.
3. Extracted `V1_PART_C_ADDON_PACKAGE` folder ke **contents** `main` branch ke repository root mein upload karo. ZIP ko khud live root mein mat upload karna.
4. `assets/fantasy-gallery/` folder ko subfolder ke roop mein hi rakho.
5. Root `index.html` mein sirf do tags add karo. Exact lines `PATCH_INDEX_INSERT.txt` mein hain:
   - Existing `<link rel="stylesheet" href="./styles.css">` ke immediately baad Part C CSS link.
   - Existing `<script src="./app.js" defer></script>` ke immediately baad Part C JS script.
6. Existing `fallback.js`/`app.js` ka order mat badalna. Part C JS existing `app.js` ke **baad** load hona chahiye.
7. Ek commit karo: `Part C: align wheel results, add boyfriend reference gallery and threesome view`.

## Upload ke baad test

Open:
`https://bhanu13yadav1-ai.github.io/Brand-website-v2/part-c-diagnostics.html`

- `Run basic checks` dabao.
- `Check bundled images` dabao.
- `Run all 4 wheel tests` dabao. Yeh har wheel ko ek baar ghumayega, result/pointer alignment check karega aur wheel reset karega.
- Physical Android par menu, wheel size aur gallery cards bhi test karo.

## Important

- Agar `Part C add-on loaded` FAIL aaye, pehle `PATCH_INDEX_INSERT.txt` wale dono tags aur file paths check karo.
- Reference photos par real naam ya anatomical size photo ke basis par add nahi kiya gaya hai. Rights/permission public upload se pehle confirm karo.
- Threesome section 18+ self-attestation gate use karta hai; yeh formal age verification nahi hai.
- Live photos ka loading, hosting result, physical Android aur final production regression **upload ke baad** hi confirmed honge.
