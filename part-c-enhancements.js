/* BLACKED V1 Part C add-on. Loaded after the existing app.js; no original core files are replaced. */
(() => {
  'use strict';
  if (window.BLACKED_PART_C) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const state = {
    version: 'V1 Part C add-on 1.0.0',
    images: 0,
    activeWheel: null,
    wheelSpins: 0,
    lastIndex: {},
    rotation: {},
    timers: {},
    frames: {},
    errors: [],
    adultGateShown: false,
    threesomePrompts: 0
  };

  const wheelTips = {
    boy: [
      { short: 'ASK FIRST', title: 'Pehle poochho', text: 'Land/penis ka size photo ya guess se pata nahi chalta. Partner ki comfort aur pasand seedhe, bina pressure poochho.' },
      { short: 'COMFORT', title: 'Comfort first', text: 'Kisi number ko performance score mat banao. Har person ka comfort aur preference alag ho sakta hai.' },
      { short: 'BOUNDARY', title: 'Boundary check', text: '“Nahi”, “pause” ya “abhi nahi” ko bina debate respect karo.' },
      { short: 'REAL TALK', title: 'Seedhi baat', text: 'Measurement ka claim tabhi karo jab reliable, authorized source ho. Photo se anatomical size infer mat karo.' },
      { short: 'NO SCORE', title: 'Koi scorecard nahi', text: 'Range sirf fictional conversation prompt hai—medical category ya performance guarantee nahi.' },
      { short: 'RESPECT', title: 'Respect rakho', text: 'Body-shaming ya comparison ko flirting mat samjho. Specific aur kind compliment behtar hai.' },
      { short: 'PRIVATE', title: 'Privacy pehle', text: 'Private body details share ya forward karne se pehle permission lo.' },
      { short: 'SKIP OK', title: 'Skip allowed', text: 'Wheel ka result order nahi deta. Kisi bhi activity ke liye sabki clear haan zaroori hai.' }
    ],
    dildo: [
      { short: 'INSERT\nLENGTH', title: 'Insertable length', text: 'Overall length poore toy ki hoti hai; insertable length intended-use wala hissa hota hai. Dono alag ho sakte hain.' },
      { short: 'WIDEST WIDTH', title: 'Sabse chaudi width', text: 'Widest diameter bhi check karo; sirf S/M/L ya XL label par bharosa mat karo.' },
      { short: 'MATERIAL', title: 'Material check', text: 'Clearly described, body-safe, non-porous material ko prefer karo aur maker ki care instructions padho.' },
      { short: 'LUBE', title: 'Suitable lubricant', text: 'Water-based lube kai toys ke saath compatible hota hai. Silicone toy ke saath silicone lube use karne se pehle maker ki compatibility check karo.' },
      { short: 'CLEAN', title: 'Cleaning', text: 'Use se pehle aur baad maker ki cleaning instructions follow karo. Share karte waqt toy ko clean karo ya compatible condom change karo.' },
      { short: 'PURPOSE', title: 'Intended use', text: 'Toy ko wahi use do jiske liye manufacturer ne design kiya hai; improvised household objects use mat karo.' },
      { short: 'COMFORT', title: 'Comfort check', text: 'Demo range personal recommendation nahi. Force mat karo; pain ya discomfort par stop karo.' },
      { short: 'SKIP OK', title: 'Skip is okay', text: 'Koi size, range ya activity compulsory nahi. Apni comfort ke hisaab se choose karo ya skip karo.' }
    ],
    plug: [
      { short: 'FLARED\nBASE', title: 'Flared base zaroori', text: 'Anal-use toy mein flared base ya suitable retrieval stop hona chahiye, taaki toy andar slip na ho.' },
      { short: 'WIDEST\nWIDTH', title: 'Widest diameter', text: 'Exact widest diameter aur usable length padho. S/M/L label har brand mein ek jaisa nahi hota.' },
      { short: 'LUBE', title: 'Lubricant use karo', text: 'Anus vagina ki tarah naturally lubricate nahi karta; suitable lubricant friction kam karne mein madad karta hai.' },
      { short: 'GO SLOW', title: 'Dheere chalo', text: 'Dheere chalo aur kabhi force mat karo. Pain ho toh turant ruk jao.' },
      { short: 'MATERIAL', title: 'Material check', text: 'Body-safe material aur manufacturer ki cleaning directions verify karo.' },
      { short: 'STOP IF PAIN', title: 'Pain ho toh stop', text: 'Pain, bleeding ya toy stuck hone par continue ya force mat karo; zarurat par medical help lo.' },
      { short: 'CLEAN', title: 'Safai', text: 'Har use ke baad instructions ke mutabik toy saaf karo. Share karte waqt hygiene aur suitable barrier steps follow karo.' },
      { short: 'SKIP OK', title: 'Skip allowed', text: 'Demo size safety guarantee ya body-size judgement nahi hai. Skip karna bilkul theek hai.' }
    ]
  };

  const wildSets = {
    flirty: [
      ['REAL COMPLIMENT','Ek asli tareef do jo looks se aage jaati ho.'], ['SECRET DATE','Date ka secret plan banao; pehle mood poochho.'], ['PLAYFUL LINE','Ek shararti line bolo—sirf jab dono ko maza aaye.'], ['MOOD CHECK','Poochho: cosy, filmy ya playful?'], ['SONG CLUE','Ek gaana bhejo aur uska reason batao.'], ['CUTE CONFESSION','Ek chhoti baat share karo, answer optional.'], ['CHEEKY RIDDLE','Ek halka double-meaning riddle banao.'], ['SLOW TEXT','Ek hint bhejo, pressure ya repeated messages nahi.']
    ],
    double: [
      ['DOUBLE MEANING','Ek funny double-meaning line likho, lekin saamne wale ki comfort ka dhyan rakho.'], ['CHEEKY CAPTION','Ek cheeky caption banao jise dono approve karein.'], ['FINISH THE LINE','“Aaj ka mood itna secret hai ki…” line complete karo.'], ['FUNNY INNUENDO','Wordplay karo, kisi ko embarrass mat karo.'], ['TEASING RIDDLE','Ek shararti riddle poochho; pass allowed.'], ['PRIVATE JOKE','Ek private joke sirf tab share karo jab dono comfortable hon.'], ['WORDPLAY','Ek desi slang line ko funny, non-insulting bana kar bolo.'], ['PASS OR PLAY','Poochho: aage chalein ya topic change karein?']
    ],
    bold: [
      ['BOLD QUESTION','Ek honest sawaal poochho; jawab dena optional hai.'], ['COMFORT RULES','Har person apni ek comfort boundary bataye.'], ['HONEST CONFESSION','Ek aisi baat bolo jo appreciate karte ho.'], ['RESPECT A BOUNDARY','Aaj saamne wale ki ek boundary ko bina debate respect karo.'], ['NO-PRESSURE INVITE','Date suggest karo aur “no” ko easy rakho.'], ['YOUR CHOICE','Do safe, non-sexual date ideas do; partner choose kare.'], ['CLEAR YES','Kisi plan par aage badhne se pehle clear yes lo.'], ['EASY SKIP','Aaj ka prompt skip karo ya ek naya choose karo.']
    ],
    spicy: [
      ['SLOW SCENE','Ek romantic fictional scene set karo; dono ki marzi se next step.'], ['SECRET NOTE','Ek mysterious, playful note likho.'], ['PAUSE OR CONTINUE','Poochho: yahi mood ya scene change?'], ['MOOD BOARD','Colour, song aur setting se date mood board banao.'], ['MYSTERY LINE','Ek normal message ko cinematic aur flirty banao.'], ['HIDDEN CLUE','Date location ka ek harmless clue do.'], ['MIDNIGHT MESSAGE','Ek cute late-evening line; reply expected nahi.'], ['SOFT TENSION','Do characters ke beech romantic tension likho bina pressure ko glamorize kiye.']
    ],
    fantasy: [
      ['THREE ADULT ROLES','Teen fictional adult characters ka premise likho, boundaries pehle clear hon.'], ['MASKED BALL','Masked-ball mystery likho; koi character bina permission touch nahi karta.'], ['OWN DECISION','Heroine apna decision khud leti hai.'], ['SAFE EXIT','Har character ke paas scene chhodne ka option hai.'], ['RESPECTFUL ENDING','Ending mein boundaries ko respect kiya jata hai.'], ['MYSTERY DOOR','Ek clue choose karo: open, ask first, or leave it.'], ['STORY CHOICE','Reader next action choose karta hai.'], ['BOUNDARIES FIRST','Fantasy se pehle limits aur pause word discuss karo.']
    ],
    truth: [
      ['FEEL SAFE?','Kaunsi cheez tumhe safe aur respected feel karati hai?'], ['COMPLIMENT DARE','Ek genuine compliment do.'], ['BOUNDARY TALK','Ek boundary discuss karo.'], ['SONG DARE','Partner ke liye song choose karo.'], ['SKIP A TOPIC','Ek topic choose karo jo aaj skip rahega.'], ['HONEST ANSWER','Ek honest sawaal—pass allowed.'], ['PAUSE ALLOWED','Pause word ya stop signal decide karo.'], ['YOUR COMFORT','Poochho: abhi comfortable ho ya break chahiye?']
    ],
    confession: [
      ['ASK FIRST','Secret share karne se pehle poochho ki doosra sunna chahta hai ya nahi.'], ['KIND COMPLIMENT','Ek kind compliment share karo.'], ['SAY WHAT MATTERS','Ek baat seedhe bolo jise appreciate karte ho.'], ['NO-PRESSURE REPLY','Message bhejo aur reply ke liye pressure mat banao.'], ['I FEEL…','“I feel…” se baat karo; mind read karne ki koshish nahi.'], ['TINY SECRET','Ek harmless secret, sirf agar ready ho.'], ['APPRECIATION','Ek chhoti cheez batao jo tumhe yaad rehti hai.'], ['HONEST PAUSE','Agar unsure ho toh pause lena valid hai.']
    ],
    boyfriend: [
      ['DATE PROPOSAL','Ek personalised date idea propose karo; partner se poochho.'], ['NO-REPLY TEXT','Ek playful text bhejo jisme reply ki demand na ho.'], ['BEYOND LOOKS','Looks ke alawa ek quality notice karo.'], ['FANTASY TALK','Poochho kaunsa fictional topic comfortable hai.'], ['OFFER SUPPORT','Support offer karo bina kisi return ki expectation ke.'], ['CHOOSE TOGETHER','Next plan dono milkar choose karo.'], ['RESPECTFUL FLIRT','Flirt karo, body-shaming nahi.'], ['ASK FIRST','Personal topic se pehle permission lo.']
    ],
    private: [
      ['ASK, NOT DEMAND','Curiosity ko question banao, demand nahi.'], ['PAUSE WORD','Roleplay se pehle stop/pause word agree karo.'], ['SHARE OPTIONAL','Personal detail share karna optional hai.'], ['NO BLAME','Concern ko blame ke bina express karo.'], ['NOT SURE YET','“Abhi sure nahi” ek complete answer hai.'], ['PRIVACY RULE','Private message ko permission ke bina forward mat karo.'], ['CHECK IN','Poochho: abhi bhi comfortable ho?'], ['STOP MEANS STOP','Stop bolne par activity end hoti hai.']
    ],
    dark: [
      ['DARK DEAL','Heroine kahe: “Drama chalega, meri marzi ke saath.”'], ['SECRET NOTE','Haveli mein note: “Raaz tab khulega jab tum ready ho.”'], ['CHOOSE THE PLAN','Hero poochhe: “Mystery date ya ghar chalein?” Choice uski.'], ['SLOW REVEAL','Ek clue reveal karo; suspense, no pressure.'], ['NO MEANS NO','Character ki “naa” ko twist ya challenge mat banao.'], ['MASKED MYSTERY','Masked-ball scene mein boundaries pehle clear hoti hain.'], ['MIDNIGHT CHOICE','Heroine decide karti hai ki scene continue ho ya end.'], ['MYSTERY DATE','Romantic mystery plan banao; exit option clear rakho.']
    ]
  };
  const categoryNames = {
    flirty:'Flirty aur Teasing',double:'Gande Double Meanings',bold:'Bold Couple Challenges',spicy:'Romantic par Spicy',fantasy:'Wild Fantasy Prompts',truth:'Couples Truth ya Dare',confession:'Secret Crush aur Confessions',boyfriend:'Boyfriend Challenges',private:'Private Fantasy Conversations',dark:'Andheri Raat · Dark Romance'
  };
  const rangeNames = {
    boy:{compact:'10 cm tak · demo range',classic:'10–12 cm · demo range',long:'12–14 cm · demo range',xl:'14+ cm · demo label',surprise:'Surprise prompt · no size prediction'},
    dildo:{compact:'8–10 cm · demo range',regular:'10–13 cm · demo range',long:'13–16 cm · demo range',xl:'16+ cm · demo label',surprise:'Surprise prompt · no size recommendation'},
    plug:{small:'2.5 cm tak · demo range',medium:'2.5–3.5 cm · demo range',large:'3.5 cm se zyada · demo range',surprise:'Surprise prompt · no size recommendation'}
  };
  const wheelResults = { boy:'#boyResult', dildo:'#dildoResult', plug:'#plugResult', wild:'#wildResult' };
  const wheelSelects = { boy:'#boyPreference', dildo:'#dildoPreference', plug:'#plugPreference', wild:'#wildCategory' };
  const wheelExperiences = { dildo:'#dildoExperience', plug:'#plugExperience' };
  const wheels = {};

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function make(tag, cls, text) {
    const el=document.createElement(tag);
    if(cls) el.className=cls;
    if(text!==undefined) el.textContent=text;
    return el;
  }
  function getLabels(kind) {
    if(kind==='wild') return (wildSets[$('#wildCategory')?.value] || wildSets.flirty).map(x=>x[0]);
    return wheelTips[kind].map(x=>x.short);
  }
  function getSelectedRange(kind) {
    if(kind==='wild') return categoryNames[$('#wildCategory')?.value] || categoryNames.flirty;
    const select=$(wheelSelects[kind]);
    const value=select?.value || '';
    return rangeNames[kind]?.[value] || 'Surprise prompt · demo only';
  }
  function stopCounterFrame(kind) {
    if(wheels[kind]?.raf) cancelAnimationFrame(wheels[kind].raf);
    if(wheels[kind]) wheels[kind].raf=0;
  }
  function updateCounterRotation(kind) {
    const wheel=wheels[kind];
    if(!wheel) return;
    try {
      const matrix=getComputedStyle(wheel.disc).transform;
      let angle=0;
      if(matrix && matrix!=='none') {
        const m=matrix.match(/^matrix\((.+)\)$/);
        if(m) { const a=m[1].split(',').map(Number); angle=Math.atan2(a[1],a[0])*180/Math.PI; }
      }
      wheel.disc.style.setProperty('--pc-counter-angle', `${-angle}deg`);
    } catch {}
    if(wheel.busy) wheel.raf=requestAnimationFrame(()=>updateCounterRotation(kind));
  }
  function refreshWheel(kind) {
    const wheel=wheels[kind];
    if(!wheel) return;
    const labels=getLabels(kind);
    wheel.layer.replaceChildren();
    labels.slice(0,8).forEach((label,index)=>{
      const tag=make('span','pc-wheel-sector-label',label);
      const angle=(index+0.5)*45*Math.PI/180;
      const radius=32;
      tag.style.left=`${50+Math.sin(angle)*radius}%`;
      tag.style.top=`${50-Math.cos(angle)*radius}%`;
      tag.setAttribute('aria-hidden','true');
      wheel.layer.appendChild(tag);
    });
    wheel.disc.setAttribute('aria-label',`${kind} wheel, 8 segments. Current labels: ${labels.join(', ')}`);
    wheel.labels=labels;
  }
  function buildWheel(kind) {
    const disc=$(`[data-wheel-disc="${kind}"]`);
    if(!disc || wheels[kind]) return;
    const center=disc.querySelector('.wheel-center');
    const centerText=center?.textContent || (kind==='wild'?'WILD':'SPIN');
    center?.remove();
    const stage=make('div','pc-wheel-stage');
    stage.dataset.pcWheelStage=kind;
    stage.setAttribute('role','group');
    stage.setAttribute('aria-label',`${kind} labelled selection wheel`);
    disc.parentNode.insertBefore(stage,disc);
    stage.appendChild(disc);
    disc.classList.add('pc-wheel-disc');
    disc.style.transform='rotate(0deg)';
    const layer=make('div','pc-wheel-label-layer');
    layer.dataset.pcWheelSegments=kind;
    disc.appendChild(layer);
    const pointer=make('span','pc-wheel-pointer','▼');
    pointer.setAttribute('aria-hidden','true');
    stage.appendChild(pointer);
    const centerNew=make('div','pc-wheel-center',centerText);
    centerNew.setAttribute('aria-hidden','true');
    stage.appendChild(centerNew);
    wheels[kind]={kind,stage,disc,layer,center:centerNew,labels:[],busy:false,timer:0,raf:0,rotation:0};
    refreshWheel(kind);
  }
  function showWheelResult(kind, sector, index) {
    const result=$(wheelResults[kind]);
    if(!result) return;
    let title, description, meta;
    if(kind==='wild') {
      const cat=$('#wildCategory')?.value || 'flirty';
      const item=wildSets[cat]?.[index] || wildSets.flirty[index];
      title=`${categoryNames[cat] || 'Dirty/Wild'} · ${item[0]}`;
      description=item[1];
      meta='FICTIONAL PROMPT · OPTIONAL · CONSENT FIRST';
    } else {
      const tip=wheelTips[kind][index];
      title=tip.title;
      description=tip.text;
      meta=rangeNames[kind]?.[$(wheelSelects[kind])?.value] || 'Surprise prompt · demo only';
    }
    const includeBag=kind!=='boy';
    result.innerHTML=`<strong>${esc(title)}</strong><span>${esc(description)}</span><small class="pc-wheel-result-meta">${esc(meta)}</small><p class="micro">Yeh wheel prompt hai, order ya medical advice nahi. Skip karna hamesha theek hai.</p><div class="button-row"><button class="small-btn" type="button" data-wheel-retry="${esc(kind)}">Phir se ghumao</button>${includeBag?`<button class="small-btn" type="button" data-wheel-add="${esc(kind)}" data-wheel-name="${esc(title)}">Demo pick bag mein add karo</button>`:''}</div>`;
    result.dataset.pcSectorIndex=String(index);
    result.dataset.pcSectorTitle=title;
    wheels[kind].lastResult={index,title,description,meta,range:getSelectedRange(kind)};
  }
  function unlockWheel(kind, message) {
    const w=wheels[kind]; if(!w) return;
    w.busy=false;
    stopCounterFrame(kind);
    if(w.timer) clearTimeout(w.timer);
    w.timer=0;
    $$(`[data-spin-wheel="${kind}"]`).forEach(b=>{b.disabled=false;if(b.dataset.pcOldLabel){b.textContent=b.dataset.pcOldLabel;delete b.dataset.pcOldLabel;}});
    const select=$(wheelSelects[kind]); if(select) select.disabled=false;
    const exp=$(wheelExperiences[kind]); if(exp) exp.disabled=false;
    if(message) { const result=$(wheelResults[kind]); if(result) result.textContent=message; }
  }
  function spinWheel(kind) {
    const w=wheels[kind]; if(!w || w.busy) return;
    const select=$(wheelSelects[kind]);
    if(kind!=='wild' && !select?.value) {
      const result=$(wheelResults[kind]); if(result) result.textContent='Pehle demo range select karo.';
      select?.focus(); return;
    }
    const labels=getLabels(kind);
    let index=Math.floor(Math.random()*8);
    const previous=state.lastIndex[kind + ':' + (kind==='wild'?select.value:select.value)];
    if(index===previous && labels.length>1) index=(index+1+Math.floor(Math.random()*7))%8;
    state.lastIndex[kind + ':' + select.value]=index;
    const sectorCentre=index*45+22.5;
    const correction=(360-sectorCentre+360)%360;
    const finalRotation=1440+correction;
    w.busy=true;
    w.lastResult=null;
    state.activeWheel=kind;
    state.wheelSpins++;
    $$(`[data-spin-wheel="${kind}"]`).forEach(b=>{b.disabled=true;b.dataset.pcOldLabel=b.textContent;b.textContent='Ghoom raha hai…';});
    if(select) select.disabled=true;
    const exp=$(wheelExperiences[kind]); if(exp) exp.disabled=true;
    const result=$(wheelResults[kind]); if(result){result.textContent='Wheel ghoom raha hai…';delete result.dataset.pcSectorTitle;}
    const preference=getSelectedRange(kind);
    w.center.textContent='…';
    w.rotation=finalRotation;
    w.disc.style.setProperty('--pc-counter-angle','0deg');
    w.disc.style.transition=reduceMotion?'none':'transform 2.65s cubic-bezier(.12,.76,.16,1)';
    w.disc.style.transform=`rotate(${finalRotation}deg)`;
    if(!reduceMotion) { w.raf=requestAnimationFrame(()=>updateCounterRotation(kind)); }
    const delay=reduceMotion?0:2700;
    w.timer=setTimeout(()=>{
      stopCounterFrame(kind);
      w.disc.style.setProperty('--pc-counter-angle',`${-(((finalRotation%360)+360)%360)}deg`);
      w.center.textContent=kind==='wild'?'WILD':'SPIN';
      showWheelResult(kind, labels[index], index);
      unlockWheel(kind);
      state.activeWheel=null;
    },delay);
  }
  function resetWheel(kind) {
    const w=wheels[kind]; if(!w) return;
    if(w.timer) clearTimeout(w.timer);
    stopCounterFrame(kind);
    w.busy=false; w.timer=0;
    w.disc.style.transition='none';
    w.disc.style.transform='rotate(0deg)';
    w.disc.style.setProperty('--pc-counter-angle','0deg');
    w.rotation=0; w.lastResult=null; w.center.textContent=kind==='wild'?'WILD':'SPIN';
    const result=$(wheelResults[kind]); if(result){delete result.dataset.pcSectorTitle;delete result.dataset.pcSectorIndex;}
    w.stage.offsetHeight;
    w.disc.style.transition=reduceMotion?'none':'transform 2.65s cubic-bezier(.12,.76,.16,1)';
    state.activeWheel=null;
    unlockWheel(kind,kind==='wild'?'Category chuno, phir wheel ghumao.':'Pehle ek demo range select karo.');
    if(kind==='wild') Object.keys(state.lastIndex).filter(k=>k.startsWith('wild:')).forEach(k=>delete state.lastIndex[k]);
    const btn=$(`[data-spin-wheel="${kind}"]`); if(btn) btn.disabled=false;
    refreshWheel(kind);
  }

  function addAdultGate() {
    const gate=make('div','pc-age-gate');
    gate.id='pcThreesomeGate';
    gate.hidden=true;
    gate.innerHTML=`<div class="pc-age-card" role="dialog" aria-modal="true" aria-labelledby="pcAgeTitle"><button type="button" class="pc-close" data-pc-age-cancel aria-label="Close age gate">×</button><p class="pc-eyebrow">18+ · FICTIONAL ADULT CONTENT</p><h2 id="pcAgeTitle">Threesome Fantasy</h2><p>Yeh section fictional consenting adults ke liye hai. Gate sirf self-attestation hai, formal age verification nahi.</p><label class="pc-check"><input type="checkbox" id="pcAgeCheck"> I confirm I am 18 or older and want to open this section.</label><p class="pc-error" id="pcAgeError" hidden>Please confirm first, ya section close kar do.</p><div class="pc-button-row"><button type="button" class="pc-primary" id="pcAgeEnter">Enter 18+ section</button><button type="button" class="pc-secondary" data-pc-age-cancel>Cancel</button></div></div>`;
    document.body.appendChild(gate);
    const openGate=()=>{state.adultGateShown=true;gate.hidden=false;$('#pcAgeCheck').checked=false;$('#pcAgeError').hidden=true;$('#pcAgeCheck').focus();};
    const closeGate=()=>{gate.hidden=true;state.adultGateShown=false;};
    $$('[data-pc-age-cancel]',gate).forEach(b=>b.addEventListener('click',()=>{closeGate();}));
    $('#pcAgeEnter',gate).addEventListener('click',()=>{
      if(!$('#pcAgeCheck').checked){$('#pcAgeError').hidden=false;$('#pcAgeCheck').focus();return;}
      try{sessionStorage.setItem('blackedV1AdultConfirmed','yes');sessionStorage.setItem('blackedPartCThreesomeConfirmed','yes');}catch{}
      // Sync the existing application's age-attestation state as well, to avoid forcing a second gate later.
      try {
        if(window.BLACKED_V1?.setView) {
          window.BLACKED_V1.setView('boyfriend');
          const legacy=$('#ageModal'), check=$('#ageConfirm'), confirm=$('#confirmAge');
          if(legacy && !legacy.classList.contains('hidden') && check && confirm){check.checked=true;confirm.click();}
        }
      } catch(err){state.errors.push('Existing age-gate sync: '+String(err));}
      closeGate(); navigateToThreesome();
    });
    gate.addEventListener('click',e=>{if(e.target===gate)closeGate();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!gate.hidden)closeGate();});
    return openGate;
  }

  let openAgeGate=()=>{};
  function navigateToThreesome() {
    const view=$('#view-threesome'); if(!view)return;
    $$('.view').forEach(v=>{v.hidden=v!==view;v.classList.toggle('active',v===view);});
    $$('[data-view-link]').forEach(b=>b.classList.toggle('active',b.dataset.viewLink==='threesome'));
    const menu=$('#mobileMenu'); if(menu)menu.classList.add('hidden');
    const toggle=$('#menuToggle');if(toggle)toggle.setAttribute('aria-expanded','false');
    window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});
    view.dispatchEvent(new CustomEvent('partc:view-opened'));
  }
  function makeThreesomeView() {
    const view=make('section','view pc-threesome-view');
    view.id='view-threesome'; view.dataset.view='threesome'; view.hidden=true;
    view.setAttribute('aria-labelledby','pcThreesomeTitle');
    view.innerHTML=`
      <div class="page-intro pc-threesome-intro"><p class="eyebrow">18+ · FICTIONAL ADULT FANTASY</p><h1 id="pcThreesomeTitle">Threesome Fantasy.<br><em>Clear rules. Chosen together.</em></h1><p class="muted">Three fictional adult characters, all 18+. Story prompts focus on communication, boundaries and mutual consent—not real-person claims.</p></div>
      <section class="pc-three-hero section-block"><div class="pc-three-cover"><img src="./assets/fantasy-gallery/threesome-fantasy-cover.webp" alt="User-provided threesome-themed fantasy cover" loading="lazy" decoding="async"><small>18+ user-provided reference cover. Use publicly only when rights/permission are confirmed.</small></div><div class="pc-three-copy"><p class="eyebrow">SEPARATE STORY COLLECTION</p><h2>Fantasy, sirf jab sabki marzi ho.</h2><p>Yeh separate section hai, Boyfriend Gallery ka hidden card nahi. Har character adult hai aur kisi bhi point par pause, no ya leave choose kar sakta hai.</p><ul><li>Boundaries pehle discuss hoti hain.</li><li>Har participant ki independent choice hai.</li><li>Story ya game ka prompt skip karna allowed hai.</li></ul><div class="pc-button-row"><button type="button" class="pc-primary" data-pc-story-link>Read After Dark stories</button><button type="button" class="pc-secondary" data-pc-boyfriend-link>Back to Boyfriend Zone</button></div></div></section>
      <div class="pc-three-prompt-grid"><article class="pc-three-prompt"><p class="pc-eyebrow">PROMPT 01</p><h3>First Honest Conversation</h3><p>Teen fictional adult characters decide what they are curious about, what stays off-limits, and how anyone can pause the conversation.</p><button type="button" class="pc-secondary" data-pc-prompt="0">Use this story prompt</button></article><article class="pc-three-prompt"><p class="pc-eyebrow">PROMPT 02</p><h3>One Room, Three Choices</h3><p>A mystery-night setup where each character chooses what to reveal; no one owes anyone a yes, secret or explanation.</p><button type="button" class="pc-secondary" data-pc-prompt="1">Use this story prompt</button></article><article class="pc-three-prompt"><p class="pc-eyebrow">PROMPT 03</p><h3>Pause Means Pause</h3><p>A dark-romance scene slows down when one character asks to stop. The others respect it immediately and agree what happens next together.</p><button type="button" class="pc-secondary" data-pc-prompt="2">Use this story prompt</button></article></div>
      <div id="pcThreesomePromptResult" class="pc-three-result" aria-live="polite">Choose a prompt. Nothing is saved or shared by this page.</div>
      <p class="notice">This gate is self-attestation, not formal age verification. Image identity, performer identity and any body measurements are not verified by this section.</p>`;
    const anchor=$('#view-fit') || $('.site-footer');
    if(anchor)anchor.parentNode.insertBefore(view,anchor);else $('main')?.appendChild(view);
    return view;
  }
  function setupNav() {
    const mainNav=$('#mainNav') || $('.main-nav');
    const mobile=$('#mobileMenu');
    const createLink=(text,host,cls)=>{
      if(!host||host.querySelector('[data-view-link="threesome"]'))return;
      const b=make('button',cls,text); b.type='button';b.dataset.viewLink='threesome';b.setAttribute('aria-label','Open Threesome Fantasy 18+');host.appendChild(b);
    };
    createLink('Threesome Fantasy 18+',mainNav,'nav-link');
    createLink('Threesome Fantasy 18+',mobile,'');
    const destinations=$('.destination-grid');
    if(destinations&&!destinations.querySelector('[data-view-link="threesome"]')){
      const b=make('button','destination');b.type='button';b.dataset.viewLink='threesome';b.innerHTML='<span class="dest-icon">✦</span><span><b>Threesome Fantasy 18+</b><small>Alag fictional collection for consenting adults.</small></span><span class="arrow">↗</span>';destinations.appendChild(b);
    }
  }
  function addBoyfriendGallery() {
    const view=$('#view-boyfriend');if(!view||$('#pcBoyfriendGallery'))return;
    const section=make('section','section-block pc-boyfriend-gallery');section.id='pcBoyfriendGallery';section.setAttribute('aria-labelledby','pcBoyfriendGalleryTitle');
    section.innerHTML=`<div class="section-heading"><div><p class="eyebrow">USER-PROVIDED REFERENCES · 18+</p><h2 id="pcBoyfriendGalleryTitle">Boyfriend Fantasy Gallery</h2><p class="muted">Chaar visual references, alag cards mein. Real identities, performer names ya penis measurements photo se guess nahi kiye gaye.</p></div><span class="pill">18+ · Visual references</span></div><div class="pc-boyfriend-grid"><article class="pc-boyfriend-card"><img src="./assets/fantasy-gallery/male-reference-01.webp" alt="User-provided adult male editorial reference 01" loading="lazy" decoding="async"><div><p class="eyebrow">REFERENCE 01</p><h3>Classic Editorial</h3><p>Name/identity: not verified. Penis size: not inferred from photo.</p></div></article><article class="pc-boyfriend-card"><img src="./assets/fantasy-gallery/male-reference-02.webp" alt="User-provided adult male strength portrait reference 02" loading="lazy" decoding="async"><div><p class="eyebrow">REFERENCE 02</p><h3>Strength Portrait</h3><p>Name/identity: not verified. Penis size: not inferred from photo.</p></div></article><article class="pc-boyfriend-card"><img src="./assets/fantasy-gallery/male-reference-03.webp" alt="User-provided adult male fitness selfie reference 03" loading="lazy" decoding="async"><div><p class="eyebrow">REFERENCE 03</p><h3>Fitness Selfie</h3><p>Name/identity: not verified. Penis size: not inferred from photo.</p></div></article><article class="pc-boyfriend-card"><img src="./assets/fantasy-gallery/male-reference-04.webp" alt="User-provided adult male innerwear editorial reference 04" loading="lazy" decoding="async"><div><p class="eyebrow">REFERENCE 04</p><h3>Innerwear Editorial</h3><p>Name/identity: not verified. Penis size: not inferred from photo.</p></div></article></div><p class="notice">Public posting se pehle har photo ka licence/permission confirm karo. Authoritative, authorized source ke bina kisi ko performer kehna ya body measurement claim karna sahi nahi.</p><div class="pc-button-row"><button type="button" class="pc-primary" data-pc-open-threesome>Threesome Fantasy 18+ ↗</button><button type="button" class="pc-secondary" data-pc-story-link>Explore After Dark Stories</button></div>`;
    const intro=view.querySelector('.page-intro');
    if(intro)intro.insertAdjacentElement('afterend',section); else view.prepend(section);
  }
  function initializeWheels() { ['boy','dildo','plug','wild'].forEach(buildWheel); }
  function imageAssetChecks() {
    return ['male-reference-01.webp','male-reference-02.webp','male-reference-03.webp','male-reference-04.webp','threesome-fantasy-cover.webp'].map(name=>({name,url:`./assets/fantasy-gallery/${name}`,exists:!!$(`img[src="./assets/fantasy-gallery/${name}"]`)}));
  }
  function diagnostics() {
    const wheelInfo={};
    Object.entries(wheels).forEach(([kind,w])=>{
      wheelInfo[kind]={segments:w.layer.querySelectorAll('.pc-wheel-sector-label').length,labels:[...w.layer.querySelectorAll('.pc-wheel-sector-label')].map(x=>x.textContent),selectedTitle:$(wheelResults[kind])?.dataset.pcSectorTitle||null,selectedIndex:w.lastResult?.index??null,rotation:w.rotation,busy:w.busy,alignmentErrorDegrees:w.lastResult?Math.min((((w.lastResult.index*45+22.5+w.rotation%360)%360)+360)%360,360-((((w.lastResult.index*45+22.5+w.rotation%360)%360)+360)%360)):null};
    });
    return {version:state.version,addonLoaded:true,wheelCount:Object.keys(wheels).length,wheels:wheelInfo,boyfriendReferenceCards:$('#pcBoyfriendGallery')?.querySelectorAll('.pc-boyfriend-card').length||0,threesomeSection:!!$('#view-threesome'),threesomePromptCount:$('#view-threesome')?.querySelectorAll('[data-pc-prompt]').length||0,localAssets:imageAssetChecks(),wheelSpins:state.wheelSpins,activeWheel:state.activeWheel,errors:[...state.errors]};
  }

  function bindEvents() {
    document.addEventListener('click',event=>{
      const target=event.target instanceof Element?event.target:null;if(!target)return;
      const spin=target.closest('[data-spin-wheel]');
      if(spin){event.preventDefault();event.stopImmediatePropagation();spinWheel(spin.dataset.spinWheel);return;}
      const reset=target.closest('[data-wheel-reset]');
      if(reset){event.preventDefault();event.stopImmediatePropagation();resetWheel(reset.dataset.wheelReset);return;}
      const retry=target.closest('[data-wheel-retry]');
      if(retry){event.preventDefault();event.stopImmediatePropagation();spinWheel(retry.dataset.wheelRetry);return;}
      if(target.closest('[data-view-link="threesome"],[data-pc-open-threesome]')){event.preventDefault();event.stopImmediatePropagation();const ok=(()=>{try{return sessionStorage.getItem('blackedPartCThreesomeConfirmed')==='yes';}catch{return false;}})();if(ok)navigateToThreesome();else openAgeGate();return;}
      if(target.closest('[data-pc-age-cancel]')) {$('#pcThreesomeGate').hidden=true;return;}
      if(target.closest('[data-pc-story-link]')) { try{window.BLACKED_V1?.setView('stories');}catch{} return; }
      if(target.closest('[data-pc-boyfriend-link]')) { try{window.BLACKED_V1?.setView('boyfriend');}catch{} return; }
      const prompt=target.closest('[data-pc-prompt]');
      if(prompt){
        const items=[
          'Prompt selected: three adult characters agree on boundaries, check-ins and a no-pressure way to stop.',
          'Prompt selected: each fictional adult decides what to share; silence or “not yet” is respected.',
          'Prompt selected: the scene pauses immediately. Characters choose together whether to continue, change topic or end the evening.'
        ];
        $('#pcThreesomePromptResult').textContent=items[Number(prompt.dataset.pcPrompt)]||items[0];state.threesomePrompts++;return;
      }
    },true);
    document.addEventListener('change',event=>{
      const target=event.target;
      if(target.matches('#wildCategory'))refreshWheel('wild');
      if(target.matches('#boyPreference'))refreshWheel('boy');
      if(target.matches('#dildoPreference'))refreshWheel('dildo');
      if(target.matches('#plugPreference'))refreshWheel('plug');
    });
  }

  // Initialize the additive layer without replacing the original application source.
  try {
    const view=makeThreesomeView();
    setupNav();
    addBoyfriendGallery();
    initializeWheels();
    openAgeGate=addAdultGate();
    bindEvents();
    window.BLACKED_PART_C={version:state.version,getDiagnostics:diagnostics,spin:spinWheel,reset:resetWheel,navigateToThreesome,getState:()=>({...state,errors:[...state.errors]})};
    console.info('[BLACKED Part C] Add-on loaded; original core app.js and styles.css preserved.');
  } catch(err) {
    state.errors.push(String(err));
    console.error('[BLACKED Part C] Add-on initialization failed',err);
    window.BLACKED_PART_C={version:state.version,getDiagnostics:diagnostics,getState:()=>({...state,errors:[...state.errors]})};
  }
})();
