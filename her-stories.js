/* Her Stories: original adult-romance fiction. No backend or tracking. */
(() => {
  'use strict';

  const STORAGE_KEY = 'blacked-her-stories-v1';
  const stories = [
    {
      id: 'baarish-ka-waada', title: 'Baarish Ka Waada', category: 'slow', categoryLabel: 'Slow-burn romance', mood: 'COZY ROMANCE', minutes: 7,
      description: 'Ek chhata, do cutting chai, aur woh sawaal jo dono kaafi time se chhupa rahe the.',
      tags: ['Slow burn', 'Cafe date', 'Feel-good'],
      cover: 'https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-full-finally-/main/boyfriend-cafe-01.webp',
      fallback: 'https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-3/main/companion-cafe.webp',
      deck: 'Meher, 27, ko lagta tha ki Kabir, 29, bas uska favourite coffee buddy hai. Phir ek baarish ne dono ka plan aur feelings dono badal diye.',
      chapters: [
        { title: 'Chapter 1 · Do coffees, ek chhata', paragraphs: [
          'Meher ne cafe ki khidki se bahar dekha. Baarish aisi pad rahi thi jaise Dilli ne saara pending drama aaj hi nikaalna ho. Usne phone check kiya: Kabir ka message tha, “Main pahunch gaya. Aur haan, tumhari extra-strong coffee order kar di.”',
          'Kabir uska dost tha—woh wala dost jo uske terrible jokes par bhi hasta tha, aur jab woh “main bilkul theek hoon” bolti thi tab seedha poochhta tha, “Sach mein?” Pichhle chhe mahine se unki Saturday coffee ek ritual ban chuki thi. Dono ne kabhi is baat ko naam nahi diya.',
          '“Madam, baarish rukne ka wait karogi ya meri chhatri ko retirement de dogi?” Kabir ne table par umbrella ghumate hue poochha. Meher hansi. “Tumhari chhatri se zyada holes toh tumhare plans mein hain.”',
          'Cafe band hone laga toh dono ek hi chhate ke neeche nikle. Kandhe takraaye, phir dono ne ek saath “sorry” kaha. Chhoti si silence aayi. Kabir ne dheere se poochha, “Ek personal sawaal poochhun? Nahi bolna ho toh rehne do.” Meher ne uski taraf dekha. “Poochho.”'
        ]},
        { title: 'Chapter 2 · Jo bolna tha', paragraphs: [
          '“Kya tumne kabhi socha hai ki hum sirf coffee ke liye milte hain… ya kisi aur wajah se bhi?” Kabir ki awaaz casual banne ki koshish kar rahi thi, par uska haath chhate ki handle par tight tha.',
          'Meher ka dil ek second ke liye ruk sa gaya. “Socha hai,” woh boli. “Kaafi baar. Par mujhe humari dosti kharab karne se darr lagta tha.”',
          'Kabir ne turant haan mein haan nahi milayi. “Mujhe bhi. Isliye main tum par koi pressure nahi daalna chahta. Jo tum feel karti ho, wahi important hai.” Uski honesty ne Meher ko us confession se zyada touch kiya jo woh imagine kar rahi thi.',
          'Meher ne apna haath uske haath ke paas rakha—touch karne se pehle ek chhota sa pause. “Aaj ek coffee date try karte hain? Proper date. Aur agar awkward hui toh hum isko apna worst Saturday bol kar has lenge.” Kabir muskuraya. “Deal.”',
          'Baarish ab bhi chal rahi thi. Dono dheere-dheere chal pade—kisi perfect ending ki guarantee ke bina, lekin pehli baar ek doosre se sach bolkar. Aur Meher ko laga, kabhi-kabhi sabse romantic cheez grand gesture nahi, ek safe sawaal hota hai.'
        ]}
      ]
    },
    {
      id: 'room-407', title: 'Room 407: Weekend Ka Plan', category: 'sensual', categoryLabel: 'Sensual fiction', mood: 'SENSUAL · NON-GRAPHIC', minutes: 8,
      description: 'Ek work trip, ek late-night conversation aur do adults jo apni boundaries clearly bolna jaante hain.',
      tags: ['Adult romance', 'Boundaries', 'Slow tension'],
      cover: 'https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-full-finally-/main/boyfriend-cafe-04.webp',
      fallback: 'https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-full-finally-/main/black-gold-tease-wide.webp',
      deck: 'Anaya, 30, aur Rishabh, 32, conference ke baad hotel lobby mein phir milte hain. Attraction hai, lekin dono ko pehle trust aur clear communication chahiye.',
      chapters: [
        { title: 'Chapter 1 · Lobby ki aakhri chai', paragraphs: [
          'Conference ke teen din baad Anaya ka dimaag slides, deadlines aur ek irritating client se bhara hua tha. Hotel lobby mein raat ke gyarah baje chai milna kisi miracle se kam nahi tha. Rishabh, 32, already sofa par baitha tha—tie khuli hui, laptop band aur chehre par woh thaka hua smile.',
          '“Tum bhi kaam se bhaag kar chai ke paas aayi ho?” usne poochha. “Nahi, main toh chai ko emotional support dene aayi hoon,” Anaya ne jawab diya. Rishabh zor se hasa. Din bhar ki formal meetings ke baad pehli baar conversation easy lagi.',
          'Baat music se shuru hui, travel par pahunchi, phir un cheezon tak gayi jo dono normally naye logon ko nahi batate. Rishabh ne compliment diya—simple, bina cheesy pressure ke. Anaya ne smile ki, phir honestly kaha, “Attraction feel ho rahi hai, par main jaldi mein kuch decide nahi karna chahti.”',
          '“Good,” Rishabh bola. “Main guess karne se better seedha poochhna pasand karta hoon. Tum jis pace par comfortable ho, wahi pace.” Us jawab ne Anaya ki shoulders se ek invisible tension hata di.'
        ]},
        { title: 'Chapter 2 · Haan ka matlab haan', paragraphs: [
          'Agli shaam unhone hotel ke quiet lounge mein dinner kiya. Rishabh ne poochha ki Anaya ko haath pakadna comfortable lagega ya nahi. Sawal chhota tha, lekin usne Anaya ko feel karaya ki uski choice conversation ka centre thi, koi formality nahi.',
          '“Haan, abhi haath pakad sakte ho,” usne kaha. Rishabh ne uska haath softly pakda. Dono kuch der chup baithe, bina silence ko fill karne ki jaldi ke. Anaya ko woh calm pasand aaya—no performance, no proving anything.',
          'Room 407 ke corridor tak saath chalte hue Anaya ruki. “Main tumhare saath aur time spend karna chahti hoon, lekin aaj yahin goodnight. Kal subah mujhe early train pakadni hai—and honestly, main apni pace slow hi rakhna chahti hoon.”',
          '“Bilkul,” Rishabh ne kaha. “Goodnight, Anaya. Kal safe journey.” Usne goodbye hug ke liye poochha; Anaya ne haan kaha. Hug warm tha, brief tha, aur kisi next step ka promise nahi tha.',
          'Train par agle din Anaya ke phone par message aaya: “Trip kaisi rahi? No pressure to reply abhi.” Anaya muskuraayi. Attraction achhi thi, par respect ne usse aur bhi meaningful bana diya. Kabhi-kabhi best chemistry wahi hoti hai jahan “nahi” ya “abhi nahi” bolne se mood kharab nahi hota.'
        ]}
      ]
    },
    {
      id: 'last-metro', title: 'Last Metro, Last Chance', category: 'modern', categoryLabel: 'Modern love', mood: 'CITY ROMANCE', minutes: 6,
      description: 'Ek missed metro, ek honest apology aur kya pata—ek nayi beginning.',
      tags: ['City lights', 'Second chance', 'Hopeful'],
      cover: 'https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-3/main/companion-event.webp',
      fallback: 'https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-3/main/companion-gallery.webp',
      deck: 'Tara, 26, aur Dev, 28, ek misunderstanding ke baad alag ho gaye the. Ek late-night encounter unhe decide karne ka mauka deta hai: closure ya conversation.',
      chapters: [
        { title: 'Chapter 1 · Platform number teen', paragraphs: [
          'Tara ko metro ke closing announcement se zyada apne phone ka blank notification bar dara raha tha. Dev ka naam do hafton se screen par nahi aaya tha. Unka breakup dramatic nahi tha—bas ek galat assumption, teen unsent messages aur dono ka ego.',
          'Platform par Dev ko dekh kar Tara almost stairs ki taraf palat gayi. Lekin train late thi, universe ko apparently comedy pasand thi, aur dono ek hi bench ke opposite ends par baith gaye.',
          '“Hey,” Dev ne kaha. “Hey.” Silence. Phir Dev bola, “Maine tumhari baat sune bina conclusion nikaal liya. That was unfair. Sorry.” Tara ne uski taraf dekha. Woh apology “sorry if you felt bad” wali nahi thi; usne apna part clearly own kiya.',
          '“Mujhe bhi tumhe reply karna chahiye tha,” Tara boli, “par main hurt thi aur socha tumhe farak hi nahi padta.” Dono ne ek doosre ki taraf dekha—pehli baar fight ke version se nahi, actual person se.'
        ]},
        { title: 'Chapter 2 · Train aane se pehle', paragraphs: [
          'Dev ne poochha, “Kya tum abhi baat karna chahti ho, ya main tumhe space doon?” Tara ko choice milna achha laga. “Aaj thodi baat kar sakte hain. Lekin iska matlab yeh nahi ki sab automatically theek ho gaya.”',
          '“Fair,” Dev bola. “Main ek conversation ko instant reset button nahi samajhunga.” Tara halki si hansi. “Good. Waise bhi tumhara reset button hamesha kharab rehta hai.”',
          'Train ke aane se pehle unhone apni misunderstanding clear ki. Sab solve nahi hua—trust ko time chahiye tha. Lekin dono ne next Sunday ek walk ka plan banaya, bina label aur big promise ke.',
          'Doors khule toh Dev ne poochha, “Text kar sakta hoon kal?” Tara ne kaha, “Haan. Aur main bhi jawab dungi.” Woh train mein chadh gayi. Is baar phone ki blank screen scary nahi lag rahi thi. Uske paas answer nahi tha, par apni choice thi.'
        ]}
      ]
    },
    {
      id: 'unsent-draft', title: 'Reply Mat Karna… Ya Kar Do?', category: 'interactive', categoryLabel: 'Choose-your-ending', mood: 'TUMHARA ENDING', minutes: 7,
      description: 'Ek unsent message aur do raaste. Is kahaani ka ending tum choose karogi.',
      tags: ['Interactive', 'Choices', 'Fresh start'],
      cover: 'https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-4f/main/campaign-sanskari-raat.webp',
      fallback: 'https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-3/main/02-sanskari-raat.webp',
      deck: 'Naina, 28, ko ex Ayaan ka message milta hai. Is baar woh impulse ke bajaye apni needs aur boundaries ke saath decision legi.',
      chapters: [
        { title: 'Chapter 1 · 11:48 PM ka message', paragraphs: [
          'Naina apni skincare routine complete karke bed par aayi hi thi ki phone vibrate hua. Ayaan ka naam. Chaar mahine se no contact tha. Message sirf itna: “I know I messed up. Agar kabhi tum comfortable ho, main properly sorry bolna chahta hoon.”',
          'Usne message teen baar padha. Purani Naina shayad turant reply kar deti, phir har word ka hidden meaning decode karti rehti. Lekin therapy journal mein usne ek line likhi thi: “Missing someone aur unke paas wapas jaana, same cheez nahi hai.”',
          'Usne apni best friend Siya ko voice note bheja. Siya ka reply aaya, “Girl, pehle yeh decide kar ki tujhe kya chahiye. Uske regret ka manager banna tera kaam nahi hai.” Naina has padi. “Saala, tu kabhi soft advice kyun nahi de sakti?”',
          'Naina ne phone ulta rakha, paani piya aur socha: kya use closure chahiye, ek honest conversation, ya bas abhi raat ke silence se bachna hai? Teenon answers valid ho sakte the. Bas decision pressure mein nahi lena tha.'
        ]},
        { title: 'Chapter 2 · Ending tum choose karo', paragraphs: [
          'Subah Naina ne message phir khola. Ayaan ka apology ek opening thi, obligation nahi. Use yeh decide karne ka haq tha ki woh reply kare, boundary set kare, ya conversation ko wahi end hone de.'
        ], choices: [
          { id: 'talk', label: 'Ek clear conversation choose karo', result: 'Naina ne reply kiya: “Main ek baar baat kar sakti hoon, lekin mujhe excuses nahi, honesty chahiye. Agar main uncomfortable hui toh conversation end kar dungi.” Ayaan ne haan kaha. Call par usne bina blame shift kiye apology di. Naina ne turant relationship restart nahi ki—usne bas apna sawaal poochha, apna answer suna, aur phir apne pace par sochne ka space rakha. Closure kabhi-kabhi doosre insaan ki perfect line se nahi, apni clarity se aata hai.' },
          { id: 'boundary', label: 'Apni boundary ko priority do', result: 'Naina ne likha: “Message ke liye thanks. Main ab is chapter ko reopen nahi karna chahti. Please meri boundary respect karna.” Send dabane ke baad usne guilt expect kiya, par sabse pehle relief aaya. Usne Siya ko text kiya, “Maine apne liye choose kiya.” Siya ka reply tha: “Proud of you, madam. Ab breakfast order kar.” Naina muskuraayi. Har ending reunion nahi hoti; kuch endings apni peace wapas laati hain.' }
        ]}
      ]
    }
  ];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const cleanState = () => ({ bookmarks: [], progress: {}, completed: [], endings: {} });
  let saved = cleanState();
  let filter = 'all';
  let bookmarksOnly = false;
  let currentStoryId = null;
  let currentChapter = 0;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function loadSaved() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      saved = {
        bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks.filter(id => stories.some(s => s.id === id)) : [],
        progress: parsed.progress && typeof parsed.progress === 'object' ? parsed.progress : {},
        completed: Array.isArray(parsed.completed) ? parsed.completed.filter(id => stories.some(s => s.id === id)) : [],
        endings: parsed.endings && typeof parsed.endings === 'object' ? parsed.endings : {}
      };
    } catch (_) { saved = cleanState(); }
  }

  function saveSaved() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }
    catch (_) { /* Private browsing/storage-disabled mode: current session still works. */ }
    renderCards();
    renderContinue();
    renderBookmarkButton();
  }

  function getStory(id) { return stories.find(story => story.id === id); }

  function renderCards() {
    const grid = $('#her-stories-grid');
    if (!grid) return;
    const query = ($('#her-story-search')?.value || '').trim().toLocaleLowerCase();
    const sort = $('#her-story-sort')?.value || 'featured';
    let items = stories.filter(story => {
      const matchesFilter = filter === 'all' || story.category === filter;
      const matchesSaved = !bookmarksOnly || saved.bookmarks.includes(story.id);
      const haystack = [story.title, story.description, story.categoryLabel, story.mood, ...story.tags].join(' ').toLocaleLowerCase();
      return matchesFilter && matchesSaved && (!query || haystack.includes(query));
    });
    if (sort === 'short') items = [...items].sort((a, b) => a.minutes - b.minutes);
    if (sort === 'title') items = [...items].sort((a, b) => a.title.localeCompare(b.title, 'hi'));

    grid.innerHTML = items.map(story => {
      const isSaved = saved.bookmarks.includes(story.id);
      const progress = saved.progress[story.id];
      const done = saved.completed.includes(story.id);
      const progressLine = done ? 'Kahaani poori' : progress ? `Hissa ${Math.min((progress.chapter || 0) + 1, story.chapters.length)} / ${story.chapters.length}` : `${story.chapters.length} hisse`;
      const buttonText = done ? 'Dobara padho' : progress ? 'Aage padho' : 'Kahaani padho';
      return `<article class="her-story-card">
        <div class="her-story-cover"><img src="${escapeHtml(story.cover)}" data-her-fallback="${escapeHtml(story.fallback || '')}" alt="${escapeHtml(story.title)} ke liye story artwork" loading="lazy"><span class="her-story-mood">${escapeHtml(story.mood)}</span><button type="button" class="her-story-bookmark" data-her-bookmark="${story.id}" aria-label="${isSaved ? 'Saved story se hatao' : 'Story save karo'}" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button></div>
        <div class="her-story-card-copy"><div class="her-story-meta"><span>${escapeHtml(story.categoryLabel)}</span><i class="her-meta-dot"></i><span>${story.minutes} min</span><i class="her-meta-dot"></i><span>${escapeHtml(progressLine)}</span></div><h3>${escapeHtml(story.title)}</h3><p class="her-story-desc">${escapeHtml(story.description)}</p><div class="her-story-tags">${story.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div><button type="button" class="her-story-read" data-her-story-open="${story.id}"><span>${buttonText}</span><span aria-hidden="true">↗</span></button></div>
      </article>`;
    }).join('');
    grid.setAttribute('aria-busy', 'false');
    $('#her-stories-empty').hidden = items.length !== 0;
    grid.hidden = items.length === 0;
    grid.querySelectorAll('.her-story-cover img').forEach(img => {
      const handleFailure = () => {
        if (img.dataset.herFallback && img.dataset.herFallbackTried !== '1') {
          img.dataset.herFallbackTried = '1';
          img.src = img.dataset.herFallback;
          return;
        }
        img.parentElement.classList.add('has-no-image');
      };
      img.addEventListener('error', handleFailure);
      if (img.complete && img.naturalWidth === 0) handleFailure();
    });
    $$('[data-her-filter]').forEach(button => {
      const active = button.dataset.herFilter === filter;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const bookmarkBtn = $('#her-bookmarks-only');
    bookmarkBtn?.classList.toggle('selected', bookmarksOnly);
    bookmarkBtn?.setAttribute('aria-pressed', String(bookmarksOnly));
  }

  function renderContinue() {
    const card = $('#her-continue-card');
    if (!card) return;
    const recent = Object.entries(saved.progress)
      .filter(([id, value]) => getStory(id) && value && !saved.completed.includes(id))
      .sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0))[0];
    if (!recent) { card.hidden = true; return; }
    const story = getStory(recent[0]);
    const chapterIndex = Math.min(Number(recent[1].chapter) || 0, story.chapters.length - 1);
    $('#her-continue-title').textContent = story.title;
    $('#her-continue-subtitle').textContent = `Hissa ${chapterIndex + 1} · ${story.categoryLabel} · ${story.minutes} min ki kahaani`;
    $('#her-continue-button').dataset.herContinue = story.id;
    card.hidden = false;
  }

  function renderBookmarkButton() {
    const button = $('#her-reader-bookmark');
    if (!button || !currentStoryId) return;
    const isSaved = saved.bookmarks.includes(currentStoryId);
    button.textContent = isSaved ? '♥ Saved hai — hatao' : '♡ Story save karo';
    button.setAttribute('aria-pressed', String(isSaved));
  }

  function toggleBookmark(id) {
    const index = saved.bookmarks.indexOf(id);
    if (index >= 0) saved.bookmarks.splice(index, 1);
    else saved.bookmarks.push(id);
    saveSaved();
  }

  function openStory(id, resume = false) {
    const story = getStory(id);
    if (!story) return;
    currentStoryId = id;
    const progress = saved.progress[id];
    currentChapter = resume && progress ? Math.min(Number(progress.chapter) || 0, story.chapters.length - 1) : progress && !saved.completed.includes(id) ? Math.min(Number(progress.chapter) || 0, story.chapters.length - 1) : 0;
    if (saved.completed.includes(id) && !resume) currentChapter = 0;
    renderReader();
    const dialog = $('#her-story-reader');
    if (dialog && !dialog.open) dialog.showModal();
  }

  function renderReader() {
    const story = getStory(currentStoryId);
    if (!story) return;
    const chapter = story.chapters[currentChapter];
    $('#her-reader-title').textContent = story.title;
    $('#her-reader-category').textContent = story.categoryLabel;
    $('#her-reader-duration').textContent = `${story.minutes} min padhne mein`;
    $('#her-reader-deck').textContent = story.deck;
    $('#her-reader-chapter-title').textContent = chapter.title;
    $('#her-reader-content').innerHTML = chapter.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');
    const progressPct = Math.round(((currentChapter + 1) / story.chapters.length) * 100);
    $('#her-reader-progress-bar').style.width = `${progressPct}%`;
    $('#her-reader-progress-text').textContent = `Hissa ${currentChapter + 1} / ${story.chapters.length}`;
    $('#her-reader-prev').disabled = currentChapter === 0;
    $('#her-reader-next').disabled = false;
    $('#her-reader-next').textContent = currentChapter < story.chapters.length - 1 ? 'Agla hissa →' : (chapter.choices && !saved.endings[story.id] ? 'Ending chuno ↓' : 'Kahaani poori ✓');
    renderChoices(story, chapter);
    renderBookmarkButton();
    saved.progress[currentStoryId] = { chapter: currentChapter, updatedAt: Date.now() };
    if (currentChapter === story.chapters.length - 1 && !saved.completed.includes(currentStoryId)) {
      // Last chapter means the reader has reached the ending; mark complete only after the final action.
      saved.progress[currentStoryId].reachedEnding = true;
    }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (_) { /* local-only best effort */ }
    renderContinue();
    renderCards();
  }

  function renderChoices(story, chapter) {
    const box = $('#her-ending-choices');
    if (!chapter.choices) { box.hidden = true; box.innerHTML = ''; return; }
    const selected = saved.endings[story.id] || '';
    box.hidden = false;
    box.innerHTML = `<p>Is mod par tum kya choose karogi? Apna ending chuno.</p>${chapter.choices.map(choice => `<button type="button" data-her-ending="${choice.id}" aria-pressed="${selected === choice.id}">${escapeHtml(choice.label)}</button>`).join('')}${selected ? `<div class="her-ending-result"><p>${escapeHtml(chapter.choices.find(choice => choice.id === selected)?.result || '')}</p></div>` : ''}`;
  }

  function chooseEnding(choiceId) {
    const story = getStory(currentStoryId);
    if (!story) return;
    const chapter = story.chapters[currentChapter];
    if (!chapter.choices?.some(choice => choice.id === choiceId)) return;
    saved.endings[currentStoryId] = choiceId;
    saveSaved();
    renderChoices(story, chapter);
    if (chapter.choices && saved.endings[story.id]) $('#her-reader-next').textContent = 'Kahaani poori ✓';
  }

  function nextChapter() {
    const story = getStory(currentStoryId);
    if (!story) return;
    if (currentChapter < story.chapters.length - 1) {
      currentChapter += 1;
      renderReader();
      $('#her-reader-title').focus?.({ preventScroll: true });
      return;
    }
    if (story.chapters[currentChapter].choices && !saved.endings[currentStoryId]) {
      $('#her-ending-choices')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!saved.completed.includes(currentStoryId)) saved.completed.push(currentStoryId);
    delete saved.progress[currentStoryId];
    saveSaved();
    $('#her-reader-next').textContent = 'Complete ho gayi ✓';
    $('#her-reader-next').disabled = true;
    $('#her-reader-progress-text').textContent = 'Kahaani poori — padhne ke liye shukriya!';
    $('#her-reader-progress-bar').style.width = '100%';
    renderContinue();
  }

  function clearFilters() {
    filter = 'all'; bookmarksOnly = false;
    $('#her-story-search').value = '';
    $('#her-story-sort').value = 'featured';
    renderCards();
  }

  function bindEvents() {
    $('#her-story-search')?.addEventListener('input', renderCards);
    $('#her-story-sort')?.addEventListener('change', renderCards);
    $('#her-clear-filters')?.addEventListener('click', clearFilters);
    $('#her-bookmarks-only')?.addEventListener('click', () => { bookmarksOnly = !bookmarksOnly; renderCards(); });
    $('#her-continue-button')?.addEventListener('click', event => openStory(event.currentTarget.dataset.herContinue, true));
    $('#her-reader-prev')?.addEventListener('click', () => { if (currentChapter > 0) { currentChapter -= 1; renderReader(); } });
    $('#her-reader-next')?.addEventListener('click', nextChapter);
    $('#her-reader-bookmark')?.addEventListener('click', () => currentStoryId && toggleBookmark(currentStoryId));
    $('#her-story-reader')?.addEventListener('cancel', event => { event.preventDefault(); $('#her-story-reader').close(); });
    $('#her-story-reader')?.addEventListener('click', event => { if (event.target === $('#her-story-reader')) $('#her-story-reader').close(); });
    document.addEventListener('click', event => {
      const open = event.target.closest('[data-her-story-open]');
      if (open) { openStory(open.dataset.herStoryOpen); return; }
      const mark = event.target.closest('[data-her-bookmark]');
      if (mark) { toggleBookmark(mark.dataset.herBookmark); return; }
      const filterButton = event.target.closest('[data-her-filter]');
      if (filterButton) { filter = filterButton.dataset.herFilter; renderCards(); return; }
      const ending = event.target.closest('[data-her-ending]');
      if (ending) { chooseEnding(ending.dataset.herEnding); return; }
      if (event.target.closest('[data-her-close]')) { $('#her-story-reader')?.close(); return; }
      if (event.target.closest('[data-her-jump]')) { $('#her-story-library')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); return; }
      if (event.target.closest('[data-view]') && $('#her-story-reader')?.open) $('#her-story-reader').close();
    });
  }

  function init() {
    if (!$('#view-herstories') || !$('#her-story-reader')) return;
    loadSaved();
    bindEvents();
    renderCards();
    renderContinue();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
