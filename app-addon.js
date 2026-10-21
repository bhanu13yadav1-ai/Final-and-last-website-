/* BEGIN FINAL FUSION INTEGRATION KIT — appended to app.js so existing app state is reused. */
(function finalFusionIntegrationKit() {
  'use strict';
  if (window.__finalFusionIntegrationKitMounted) return;
  window.__finalFusionIntegrationKitMounted = true;

  const integrationId = 'innerwear-360-study';
  const frameFiles = [
    '360-demo-01-front.webp',
    '360-demo-02-front-three-quarter.webp',
    '360-demo-03-side-quarter.webp',
    '360-demo-04-rear-three-quarter.webp',
    '360-demo-05-rear.webp',
    '360-demo-06-rear-opposite.webp',
    '360-demo-07-side-opposite.webp',
    '360-demo-08-front-opposite.webp'
  ];
  const frameNames = ['Front', 'Front ¾', 'Side ¾', 'Rear ¾', 'Rear', 'Rear opposite', 'Side opposite', 'Front opposite'];
  const integrationStorageKey = 'blackedFusionIntegrationV1';
  const qs = (selector, root = document) => root.querySelector(selector);
  const safe = value => typeof htmlSafe === 'function' ? htmlSafe(value) : String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const localRead = (key, fallback) => {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch (_) { return fallback; }
  };
  const localWrite = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { if (typeof toast === 'function') toast('Device storage is unavailable. This change may not persist.'); return false; }
  };

  // Reuse the existing Saved drawer by registering this one viewer as a clearly labelled concept.
  if (Array.isArray(products) && !products.some(product => product.id === integrationId)) {
    products.push({
      id: integrationId,
      name: 'Innerwear 360° Angle Study',
      category: 'Editorial',
      filter: 'editorial',
      description: 'An eight-frame innerwear angle concept from the original source collection. These frames are visual references, not a verified supplier turntable, confirmed inventory, product specification, or true 3D scan.',
      image: asset('Brand-website-3', frameFiles[0]),
      badge: '8-FRAME VIEWER',
      kind: 'Angle concept'
    });
  }
  if (state && !state.librarySaved) state.librarySaved = {};

  let imageLibrary = [];
  let localAssetByUrl = new Map();
  let galleryFiltered = [];
  let galleryVisibleCount = 24;
  let viewerIndex = 0;
  let viewerDragStart = null;

  function resolvedImage(url) {
    const assetRecord = localAssetByUrl.get(url);
    return assetRecord && assetRecord.bundledLocally && assetRecord.localPath ? assetRecord.localPath : url;
  }
  function imageFailure(img, placeholder) {
    img.hidden = true;
    if (placeholder) placeholder.hidden = false;
  }

  function mountInnerwearViewer() {
    const view = qs('#view-intimates');
    if (!view || qs('#innerwear-360-section')) return;
    const insertBefore = qs('.fit-cta', view) || null;
    const section = document.createElement('section');
    section.id = 'innerwear-360-section';
    section.className = 'section-shell ff360-section';
    section.innerHTML = `
      <div class="ff360-heading">
        <div><span class="eyebrow">THE INNERWEAR ANGLE STUDY</span><h2>See the look from <em>every side.</em></h2></div>
        <p>Explore eight original concept frames. Drag the image or use the controls. This is a frame viewer, not a verified 3D scan.</p>
      </div>
      <div class="ff360-layout">
        <div class="ff360-stage" id="innerwear-360-stage" tabindex="0" role="group" aria-label="Eight-frame innerwear concept viewer. Use left and right arrow keys to change angles.">
          <img id="innerwear-360-image" alt="Innerwear angle concept, front view" loading="lazy">
          <div class="ff360-image-placeholder" id="innerwear-360-placeholder" hidden><span>✦</span><strong>Image unavailable</strong><small>Check the source image or bundle it locally.</small></div>
          <span id="innerwear-360-count" class="ff360-count">01 / 08</span>
          <span class="ff360-drag-hint">Drag to rotate · concept frames</span>
        </div>
        <div class="ff360-controls">
          <span class="micro-tag">CONCEPT VIEWER · 8 FRAMES</span>
          <h3 id="innerwear-360-frame-name">Front view</h3>
          <p>Choose a frame to compare the front, side and rear views in this artwork set. Images do not verify real-world fit or stock.</p>
          <div class="ff360-progress"><input id="innerwear-360-range" type="range" min="0" max="7" step="1" value="0" aria-label="Choose innerwear viewing angle"><div id="innerwear-360-dots" class="ff360-dots"></div></div>
          <div class="ff360-actions"><button type="button" class="button button-outline" id="innerwear-360-prev" aria-label="Previous angle">← Previous</button><button type="button" class="button button-primary" id="innerwear-360-next" aria-label="Next angle">Next →</button></div>
          <button type="button" class="button button-ghost ff360-fav" id="innerwear-360-save" aria-pressed="false">♡ Save this 360° view</button>
          <small class="ff360-local-note">Saved concepts use your existing local Favourites drawer on this device.</small>
        </div>
      </div>`;
    if (insertBefore) view.insertBefore(section, insertBefore); else view.appendChild(section);

    const image = qs('#innerwear-360-image');
    const placeholder = qs('#innerwear-360-placeholder');
    function renderFrame(index) {
      viewerIndex = (index + frameFiles.length) % frameFiles.length;
      const url = asset('Brand-website-3', frameFiles[viewerIndex]);
      image.hidden = false;
      placeholder.hidden = true;
      image.onerror = () => imageFailure(image, placeholder);
      image.src = resolvedImage(url);
      image.alt = `Innerwear angle concept: ${frameNames[viewerIndex]}, frame ${viewerIndex + 1} of ${frameFiles.length}`;
      qs('#innerwear-360-count').textContent = `${String(viewerIndex + 1).padStart(2, '0')} / ${String(frameFiles.length).padStart(2, '0')}`;
      qs('#innerwear-360-frame-name').textContent = frameNames[viewerIndex];
      qs('#innerwear-360-range').value = String(viewerIndex);
      qs('#innerwear-360-dots').querySelectorAll('button').forEach((button, i) => {
        const active = i === viewerIndex;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      const saved = state.saved.has(integrationId);
      qs('#innerwear-360-save').textContent = saved ? '♥ Saved to Favourites' : '♡ Save this 360° view';
      qs('#innerwear-360-save').setAttribute('aria-pressed', String(saved));
    }
    qs('#innerwear-360-dots').innerHTML = frameFiles.map((_, i) => `<button type="button" data-innerwear-angle="${i}" aria-label="Show ${safe(frameNames[i])} angle" aria-pressed="${i === 0}">${String(i + 1).padStart(2, '0')}</button>`).join('');
    qs('#innerwear-360-prev').addEventListener('click', () => renderFrame(viewerIndex - 1));
    qs('#innerwear-360-next').addEventListener('click', () => renderFrame(viewerIndex + 1));
    qs('#innerwear-360-range').addEventListener('input', event => renderFrame(Number(event.target.value)));
    qs('#innerwear-360-dots').addEventListener('click', event => {
      const button = event.target.closest('[data-innerwear-angle]');
      if (button) renderFrame(Number(button.dataset.innerwearAngle));
    });
    qs('#innerwear-360-save').addEventListener('click', () => {
      if (typeof toggleSaved === 'function') toggleSaved(integrationId);
      renderFrame(viewerIndex);
      if (typeof renderSavedDrawer === 'function' && qs('#saved-dialog')?.open) renderSavedDrawer();
    });
    const stage = qs('#innerwear-360-stage');
    stage.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); renderFrame(viewerIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); renderFrame(viewerIndex + 1); }
    });
    stage.addEventListener('pointerdown', event => { viewerDragStart = {x: event.clientX, y: event.clientY}; });
    stage.addEventListener('pointerup', event => {
      if (!viewerDragStart) return;
      const dx = event.clientX - viewerDragStart.x;
      const dy = event.clientY - viewerDragStart.y;
      viewerDragStart = null;
      if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) renderFrame(viewerIndex + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener('pointercancel', () => { viewerDragStart = null; });
    renderFrame(0);
  }

  function saveLibraryItem(item) {
    if (!item) return;
    const id = `library-${item.id}`;
    if (state.saved.has(id)) {
      state.saved.delete(id);
      delete state.librarySaved[id];
    } else {
      state.saved.add(id);
      state.librarySaved[id] = {
        id,
        name: item.title || item.filename,
        category: `${item.category || 'Source image'} · ${item.source_repo || 'source archive'}`,
        image: resolvedImage(item.src),
        notes: item.notes || 'Source reference; verify suitability and rights.'
      };
    }
    saveState();
    renderGalleryCards();
    renderAfterDarkCards();
    if (typeof renderSavedCount === 'function') renderSavedCount();
    if (typeof renderSavedDrawer === 'function') renderSavedDrawer();
    if (typeof toast === 'function') toast(state.saved.has(id) ? 'Saved to your local Favourites.' : 'Removed from your Favourites.');
  }

  function mountAllImagesGallery() {
    const view = qs('#view-intimates');
    if (!view || qs('#all-collection-gallery')) return;
    const section = document.createElement('section');
    section.id = 'all-collection-gallery';
    section.className = 'section-shell ff-library-section';
    section.innerHTML = `
      <div class="ff360-heading">
        <div><span class="eyebrow">THE SOURCE IMAGE ARCHIVE</span><h2>Every reference in <em>one place.</em></h2></div>
        <p id="ff-library-status" aria-live="polite">Loading the source-image library…</p>
      </div>
      <div class="ff-library-tools">
        <label class="ff-library-search"><span>⌕</span><input id="ff-library-search" type="search" placeholder="Search image title, filename or source" aria-label="Search all source images"></label>
        <label class="ff-library-category-label">Category <select id="ff-library-category"><option value="all">All categories</option></select></label>
      </div>
      <p class="ff-library-disclaimer">This archive preserves source labels. Some items are campaign art, owner references, concept frames or inspiration from a separate brand; they are not all BLACKED product listings. Check usage rights before public/commercial use.</p>
      <div id="ff-library-grid" class="ff-library-grid"></div>
      <div class="ff-library-more-wrap"><button type="button" class="button button-outline" id="ff-library-more">Show more images</button></div>`;
    const anchor = qs('#innerwear-360-section', view) || qs('.fit-cta', view);
    if (anchor) anchor.insertAdjacentElement('afterend', section); else view.appendChild(section);
    qs('#ff-library-search').addEventListener('input', applyGalleryFilters);
    qs('#ff-library-category').addEventListener('change', applyGalleryFilters);
    qs('#ff-library-more').addEventListener('click', () => { galleryVisibleCount += 24; renderGalleryCards(); });
    qs('#ff-library-grid').addEventListener('click', event => {
      const button = event.target.closest('[data-gallery-save]');
      if (!button) return;
      const item = imageLibrary.find(entry => `library-${entry.id}` === button.dataset.gallerySave);
      saveLibraryItem(item);
    });
  }

  function applyGalleryFilters() {
    const needle = (qs('#ff-library-search')?.value || '').trim().toLowerCase();
    const category = qs('#ff-library-category')?.value || 'all';
    galleryFiltered = imageLibrary.filter(item => {
      const text = [item.title, item.filename, item.category, item.source_repo, item.notes].join(' ').toLowerCase();
      return (category === 'all' || item.category === category) && (!needle || text.includes(needle));
    });
    galleryVisibleCount = 24;
    renderGalleryCards();
  }

  function renderGalleryCards() {
    const grid = qs('#ff-library-grid');
    if (!grid) return;
    const shown = galleryFiltered.slice(0, galleryVisibleCount);
    grid.innerHTML = shown.map(item => {
      const key = `library-${item.id}`;
      const src = resolvedImage(item.src);
      const saved = state.saved.has(key);
      const title = item.title || item.filename || 'Untitled source image';
      const category = item.category || 'Uncategorised';
      const repo = item.source_repo || 'source archive';
      return `<article class="ff-library-card">
        <div class="ff-library-image-wrap"><img src="${safe(src)}" alt="${safe(title)}" loading="lazy"><div class="ff-library-image-placeholder" hidden><span>Image unavailable</span><small>${safe(item.filename || '')}</small></div>
          <button type="button" class="ff-library-save ${saved ? 'saved' : ''}" data-gallery-save="${safe(key)}" aria-label="${saved ? 'Remove' : 'Save'} ${safe(title)}" aria-pressed="${saved}">${saved ? '♥' : '♡'}</button>
        </div>
        <div class="ff-library-card-copy"><strong>${safe(title)}</strong><span>${safe(category)}</span><small>${safe(repo)} · ${safe(item.filename || '')}</small></div>
      </article>`;
    }).join('');
    grid.querySelectorAll('img').forEach(img => { img.onerror = () => imageFailure(img, img.parentElement.querySelector('.ff-library-image-placeholder')); });
    qs('#ff-library-status').textContent = `Showing ${shown.length} of ${galleryFiltered.length} matching images · ${imageLibrary.length} source records loaded`;
    qs('#ff-library-more').hidden = galleryVisibleCount >= galleryFiltered.length;
  }

  async function loadImageLibrary() {
    const status = qs('#ff-library-status');
    try {
      const baseUrl = new URL('innerwear-image-library.json', document.baseURI).href;
      const manifestUrl = new URL('asset-manifest.json', document.baseURI).href;
      const [libraryResponse, assetResponse] = await Promise.all([fetch(baseUrl, {cache: 'no-cache'}), fetch(manifestUrl, {cache: 'no-cache'})]);
      if (!libraryResponse.ok) throw new Error(`Library HTTP ${libraryResponse.status}`);
      imageLibrary = await libraryResponse.json();
      if (!Array.isArray(imageLibrary)) throw new Error('Source library JSON is not an array');
      if (assetResponse.ok) {
        const manifest = await assetResponse.json();
        localAssetByUrl = new Map((manifest.assets || []).filter(item => item.url).map(item => [item.url, item]));
      }
      state.librarySaved = state.librarySaved || {};
      const categories = [...new Set(imageLibrary.map(item => item.category || 'Uncategorised'))].sort((a,b) => a.localeCompare(b));
      qs('#ff-library-category').innerHTML = '<option value="all">All categories</option>' + categories.map(category => `<option value="${safe(category)}">${safe(category)}</option>`).join('');
      // Rehydrate the local Saved drawer with references saved in an earlier visit.
      imageLibrary.forEach(item => {
        const key = `library-${item.id}`;
        if (state.saved.has(key)) state.librarySaved[key] = {
          id: key,
          name: item.title || item.filename,
          category: `${item.category || 'Source image'} · ${item.source_repo || 'source archive'}`,
          image: resolvedImage(item.src),
          notes: item.notes || ''
        };
      });
      galleryFiltered = imageLibrary.slice();
      renderGalleryCards();
      renderAfterDarkCards();
      if (typeof renderSavedDrawer === 'function') renderSavedDrawer();
      mountCutoutLibrary();
    } catch (error) {
      if (status) status.textContent = 'The source library could not load. Open the website over HTTPS and confirm innerwear-image-library.json and asset-manifest.json are in the site root.';
      const grid = qs('#ff-library-grid');
      if (grid) grid.innerHTML = '<div class="ff-library-empty">The archive metadata is unavailable. The 360° viewer can still work if its frame files are reachable.</div>';
    }
  }

  function mountAfterDarkGallery() {
    const view = qs('#view-afterdark');
    if (!view || qs('#ff-afterdark-library')) return;
    const section = document.createElement('section');
    section.id = 'ff-afterdark-library';
    section.className = 'section-shell ff-library-section';
    section.innerHTML = `
      <div class="ff360-heading"><div><span class="eyebrow">AFTER DARK · CONCEPT ARCHIVE</span><h2>Explore the <em>angle studies.</em></h2></div><p id="ff-after-dark-status" aria-live="polite">Loading concept references…</p></div>
      <div class="ff-library-tools"><label class="ff-library-search"><span>⌕</span><input id="ff-after-dark-search" type="search" placeholder="Search a concept or frame" aria-label="Search After Dark concepts"></label><label class="ff-library-category-label">View <select id="ff-after-dark-filter"><option value="all">All concept references</option><option value="product">Product-only concept art</option><option value="angles">8-frame angle studies</option></select></label></div>
      <p class="ff-library-disclaimer">Concept art only—not verified inventory, supplier data, safety certification, material information or a real product listing. The eight-frame viewer remains a separate visual demo.</p>
      <div id="ff-after-dark-grid" class="ff-library-grid"></div><div class="ff-library-more-wrap"><button type="button" class="button button-outline" id="ff-after-dark-more">Show more concepts</button></div>`;
    const anchor = qs('.wild-wheel-section', view) || qs('.afterdark-hero', view);
    if (anchor) anchor.insertAdjacentElement('afterend', section); else view.appendChild(section);
    qs('#ff-after-dark-search').addEventListener('input', () => { afterDarkVisibleCount = 12; renderAfterDarkCards(); });
    qs('#ff-after-dark-filter').addEventListener('change', () => { afterDarkVisibleCount = 12; renderAfterDarkCards(); });
    qs('#ff-after-dark-more').addEventListener('click', () => { afterDarkVisibleCount += 12; renderAfterDarkCards(); });
    qs('#ff-after-dark-grid').addEventListener('click', event => {
      const button = event.target.closest('[data-after-dark-save]');
      if (!button) return;
      saveLibraryItem(imageLibrary.find(item => `library-${item.id}` === button.dataset.afterDarkSave));
    });
  }

  let afterDarkVisibleCount = 12;
  function renderAfterDarkCards() {
    const grid = qs('#ff-after-dark-grid');
    if (!grid) return;
    const mode = qs('#ff-after-dark-filter')?.value || 'all';
    const needle = (qs('#ff-after-dark-search')?.value || '').trim().toLowerCase();
    const eligible = imageLibrary.filter(item => /^(product-only concept image|8-frame concept viewer)$/i.test(item.category || ''));
    const filtered = eligible.filter(item => {
      const category = (item.category || '').toLowerCase();
      const modeOK = mode === 'all' || (mode === 'product' && category === 'product-only concept image') || (mode === 'angles' && category === '8-frame concept viewer');
      const text = [item.title, item.filename, item.category, item.source_repo, item.notes].join(' ').toLowerCase();
      return modeOK && (!needle || text.includes(needle));
    });
    const shown = filtered.slice(0, afterDarkVisibleCount);
    grid.innerHTML = shown.map(item => {
      const key = `library-${item.id}`;
      const saved = state.saved.has(key);
      const title = item.title || item.filename || 'Concept reference';
      return `<article class="ff-library-card"><div class="ff-library-image-wrap"><img src="${safe(resolvedImage(item.src))}" alt="${safe(title)}" loading="lazy"><div class="ff-library-image-placeholder" hidden><span>Image unavailable</span><small>${safe(item.filename || '')}</small></div><button type="button" class="ff-library-save ${saved ? 'saved' : ''}" data-after-dark-save="${safe(key)}" aria-label="${saved ? 'Remove' : 'Save'} ${safe(title)}" aria-pressed="${saved}">${saved ? '♥' : '♡'}</button></div><div class="ff-library-card-copy"><strong>${safe(title)}</strong><span>${safe(item.category || 'Concept reference')}</span><small>${safe(item.source_repo || '')} · ${safe(item.filename || '')}</small></div></article>`;
    }).join('');
    grid.querySelectorAll('img').forEach(img => { img.onerror = () => imageFailure(img, img.parentElement.querySelector('.ff-library-image-placeholder')); });
    const status = qs('#ff-after-dark-status');
    if (status) status.textContent = `Showing ${shown.length} of ${filtered.length} matching concepts. No live stock is connected.`;
    const more = qs('#ff-after-dark-more');
    if (more) more.hidden = afterDarkVisibleCount >= filtered.length;
  }

  function mountCutoutLibrary() {
    const panel = qs('#view-fitstudio .fit-upload-panel');
    if (!panel || qs('#ff-cutout-picker')) return;
    const picker = document.createElement('div');
    picker.id = 'ff-cutout-picker';
    picker.className = 'ff-cutout-picker';
    picker.innerHTML = `<span class="eyebrow">READY-MADE CUTOUT REFERENCES</span><label for="ff-cutout-select">Choose an available garment concept</label><select id="ff-cutout-select"><option value="">Loading cutout library…</option></select><button type="button" class="button button-outline full-width" id="ff-use-cutout">Use selected cutout</button><small>Preset cutouts are concepts. The safest PNG export path is a locally bundled image; you can still upload your own transparent PNG below.</small>`;
    const firstUpload = qs('.upload-box', panel);
    if (firstUpload) firstUpload.insertAdjacentElement('beforebegin', picker); else panel.appendChild(picker);
    const cutouts = imageLibrary.filter(item => /transparent garment cutout concept/i.test(item.category || '') && /\.(webp|png)$/i.test(item.filename || ''));
    const select = qs('#ff-cutout-select');
    select.innerHTML = '<option value="">Choose a cutout…</option>' + cutouts.map((item, i) => `<option value="${safe(item.id)}">${safe(item.title || item.filename)} · ${safe(item.filename)}</option>`).join('');
    qs('#ff-use-cutout').addEventListener('click', () => {
      const item = cutouts.find(entry => entry.id === select.value);
      if (!item) { if (typeof toast === 'function') toast('Choose a cutout first.'); return; }
      const source = resolvedImage(item.src);
      const image = new Image();
      if (/^https?:/i.test(source)) image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (state.fit.garmentUrl) { try { URL.revokeObjectURL(state.fit.garmentUrl); } catch (_) {} }
        state.fit.garment = image;
        state.fit.garmentUrl = null;
        const preview = qs('#fit-garment-preview');
        preview.src = source;
        preview.hidden = false;
        const empty = qs('#fit-canvas .fit-empty');
        if (empty) empty.hidden = true;
        if (state.fit.body) qs('#export-fit').disabled = false;
        qs('#fit-preview-status').textContent = 'Preset concept cutout loaded';
        updateFitPreview();
        if (typeof toast === 'function') toast('Concept cutout loaded. Check the overlay manually; it is not a fit prediction.');
      };
      image.onerror = () => { if (typeof toast === 'function') toast('Cutout could not load. Bundle the image locally or upload a transparent PNG.'); };
      image.src = source;
    });
  }

  function mountPrivateComfortNotes() {
    const view = qs('#view-wellness');
    if (!view || qs('#ff-private-fit-notes')) return;
    const section = document.createElement('section');
    section.id = 'ff-private-fit-notes';
    section.className = 'section-shell ff-private-section';
    section.innerHTML = `
      <div class="ff360-heading"><div><span class="eyebrow">YOUR DEVICE · YOUR CHOICE</span><h2>Comfort & fit <em>notes.</em></h2></div><p>A short educational check-in, not a diagnosis. Your answers and notes stay in this browser; nothing is sent to a server by this static page.</p></div>
      <div class="ff-private-grid">
        <form id="ff-comfort-form" class="ff-private-card">
          <h3>Private comfort check</h3>
          <label for="ff-comfort-focus">What would help most today?</label>
          <select id="ff-comfort-focus"><option value="comfort">Comfort and taking things at your own pace</option><option value="materials">Materials and cleaning instructions</option><option value="communication">Communication and boundaries</option><option value="fit">Fit, sizing and product labels</option></select>
          <label for="ff-comfort-experience">How much detail would you like?</label>
          <select id="ff-comfort-experience"><option value="starter">Beginner-friendly basics</option><option value="some">A little more detail</option><option value="review">A checklist to review</option></select>
          <button class="button button-primary full-width" type="submit">Show my guidance</button>
          <div id="ff-comfort-result" class="ff-comfort-result" aria-live="polite">Choose a focus and select “Show my guidance”. You can skip any question.</div>
        </form>
        <div class="ff-private-card">
          <h3>Personal fit notes</h3>
          <p>Save a short reminder for yourself, such as a preferred size-chart link or a fabric label to check next time. Avoid entering highly sensitive personal information.</p>
          <label for="ff-fit-note">Your note <span id="ff-note-count">0 / 600</span></label>
          <textarea id="ff-fit-note" rows="5" maxlength="600" placeholder="Example: Check the brand's official size chart before choosing a size…"></textarea>
          <div class="ff-notes-meta" id="ff-notes-meta">Not saved yet on this device.</div>
          <div class="ff-note-actions"><button type="button" class="button button-primary" id="ff-save-note">Save note locally</button><button type="button" class="button button-outline" id="ff-clear-note">Delete note</button></div>
        </div>
      </div>`;
    const anchor = qs('.education-section', view) || qs('.medical-alert', view) || null;
    if (anchor) anchor.insertAdjacentElement('beforebegin', section); else view.appendChild(section);
    const guidance = {
      comfort: {
        starter: 'Comfort is individual. Start with product instructions, proceed at your own pace, and stop if you feel pain, pressure or uncertainty.',
        some: 'Review shape, materials, cleaning directions and how comfort changes over time. Do not treat someone else’s experience as a rule for you.',
        review: 'Checklist: read instructions; choose suitable lubricant if relevant; agree on boundaries; stop for pain or irritation; clean and store as directed.'
      },
      materials: {
        starter: 'Read the exact material and care labels. Do not assume two visually similar products have the same material or cleaning requirements.',
        some: 'Use the maker’s instructions for cleaning, storage and compatibility. Replace damaged products and do not infer certification from a picture.',
        review: 'Checklist: material label; cleaning method; lubricant compatibility; storage; signs of damage; manufacturer contact and safety guidance.'
      },
      communication: {
        starter: 'A clear yes is needed, and anyone can pause or stop at any time. Skipping a question or activity is always acceptable.',
        some: 'Discuss what feels comfortable, what is off-limits and how to pause before trying something new. Consent is ongoing, not a one-time checkbox.',
        review: 'Checklist: ask first; agree on boundaries; choose a pause signal; check in; respect a no immediately; do not pressure for an explanation.'
      },
      fit: {
        starter: 'Measure only as the brand recommends and compare with that brand’s official size chart. A calculator gives a starting point, not a guaranteed fit.',
        some: 'Brand, country, cut and stretch change sizing. Check garment measurements, return rules and comfort cues before treating a label size as final.',
        review: 'Checklist: official chart; measurement unit; garment measurements; fabric/stretch; return policy; comfort in normal movement. No size is a body judgement.'
      }
    };
    qs('#ff-comfort-form').addEventListener('submit', event => {
      event.preventDefault();
      const focus = qs('#ff-comfort-focus').value;
      const experience = qs('#ff-comfort-experience').value;
      qs('#ff-comfort-result').textContent = (guidance[focus] || guidance.comfort)[experience] || guidance.comfort.starter;
      localWrite(integrationStorageKey, {focus, experience, updatedAt: new Date().toISOString()});
    });
    const note = localRead('blackedFusionFitNotesV1', null);
    if (note && typeof note.text === 'string') {
      qs('#ff-fit-note').value = note.text.slice(0, 600);
      qs('#ff-notes-meta').textContent = note.updatedAt ? `Last saved on this device: ${new Date(note.updatedAt).toLocaleString()}` : 'Saved on this device.';
    }
    const updateCount = () => { qs('#ff-note-count').textContent = `${qs('#ff-fit-note').value.length} / 600`; };
    qs('#ff-fit-note').addEventListener('input', updateCount); updateCount();
    qs('#ff-save-note').addEventListener('click', () => {
      const payload = {text: qs('#ff-fit-note').value.trim(), updatedAt: new Date().toISOString()};
      if (localWrite('blackedFusionFitNotesV1', payload)) qs('#ff-notes-meta').textContent = `Saved on this device: ${new Date(payload.updatedAt).toLocaleString()}`;
    });
    qs('#ff-clear-note').addEventListener('click', () => {
      try { localStorage.removeItem('blackedFusionFitNotesV1'); } catch (_) {}
      qs('#ff-fit-note').value = ''; updateCount(); qs('#ff-notes-meta').textContent = 'Note deleted from this device.';
      if (typeof toast === 'function') toast('Your local fit note was deleted.');
    });
  }

  mountInnerwearViewer();
  mountAllImagesGallery();
  mountAfterDarkGallery();
  mountPrivateComfortNotes();
  // The gallery metadata is a source inventory. Image bytes remain remote unless the bundler is run.
  loadImageLibrary();
  if (typeof renderCatalog === 'function') renderCatalog();
  if (typeof renderSavedCount === 'function') renderSavedCount();
  if (typeof renderSavedDrawer === 'function') renderSavedDrawer();
})();
/* END FINAL FUSION INTEGRATION KIT */
