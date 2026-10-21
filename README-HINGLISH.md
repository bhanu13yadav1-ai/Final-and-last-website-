# Her Stories — Hinglish Integration Pack

Yeh pack **existing BLacked Final Fusion website** mein ek naya, mobile-first `Her Stories` section add karne ke liye hai. Yeh current pages ko replace nahi karta. Ismein 4 original short stories, chapter reader, mood filters, search, bookmarks, reading progress aur ek choose-your-ending story hai.

## Sabse pehle preview dekho

`her-stories-preview.html` ko browser mein kholo. Preview ke remote artwork ko load hone ke liye internet chahiye. `Her Stories` ka naya UI aur story content Hinglish mein hai.

## Existing repo mein integrate kaise karein

1. Current repo ka backup ya alag testing copy bana lo.
2. Is folder ko existing repo ke root ke andar `Her-Stories-Hinglish-Integration` naam se rakho.
3. Existing repo ke root se yeh command run karo:

   ```bash
   python Her-Stories-Hinglish-Integration/apply_her_stories.py
   ```

4. Script pehle current file anchors aur duplicate IDs check karega. Agar repo version alag hai, toh overwrite karne ke bajaye error dega.
5. Script successful ho jaaye toh yeh checks run karo:

   ```bash
   node --check app.js
   node --check her-stories.js
   node --check sw.js
   ```

6. `index.html` aur `her-stories.js` ko browser mein inspect karo, phir Android Chrome par 360px, 390px aur 430px widths test karo.
7. GitHub Pages par test branch mein publish karna. Live/main branch ko tab tak replace na karo jab tak doosri chat ke current changes reconcile aur test na ho jaayein.

## Kya add hota hai?

- Desktop aur mobile nav mein `Her Stories · 18+`.
- Home explore grid mein story-library card.
- Separate Her Stories page with dark romantic palette, muted rose/burgundy accents, responsive cards and accessible reader dialog.
- Search, four mood filters, short/title sorting, saved-story-only view.
- Four original stories, har ek 2 chapters ke saath; characters adult hain aur romantic situations mein clear consent hai.
- Chapter-by-chapter reader, previous/next navigation, progress bar, continue reading, bookmark persistence.
- `Reply Mat Karna… Ya Kar Do?` mein reader do possible endings choose kar sakti hai.
- Existing site ka age self-attestation gate `After Dark` aur `Her Stories` dono par reuse hota hai.
- Service-worker cache version bump aur naye local CSS/JS files core cache mein add hote hain. Agar `tools-download-assets.py` present ho, script usse bhi update karti hai taaki offline ZIP banate waqt story JS ki images local paths par rewrite ho sakein.

## Privacy, content aur product notes

- Bookmark aur reading progress `localStorage` mein isi device/browser par save hote hain; login, analytics ya backend add nahi kiya gaya.
- Stories original demo fiction hain; characters 18+ adults hain, aur sexual activity graphically describe nahi ki gayi.
- 18+ prompt sirf self-attestation hai, formal age verification nahi.
- Product purchase link, pricing ya medical claim story content mein inject nahi kiya gaya. Wellness CTA existing Wellness page kholta hai.
- Artwork is project ke existing P2 repositories ke image URLs se reuse hota hai. Package artwork ko locally bundle nahi karta; live visuals ke liye internet chahiye. Commercial image rights ko alag se verify karna zaroori hai.
- Is environment se GitHub branch creation permission available nahi hui, isliye main repo ko direct edit nahi kiya gaya. Yeh pack intended integration ke liye ready hai aur doosri chat ke current changes ko overwrite nahi karta.
