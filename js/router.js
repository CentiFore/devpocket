/* ============================================================
   DEVPOCKET — router.js
   Hash-based router (#/ , #/tool/:id)
   ============================================================ */

window.DP = window.DP || {};

/* ---------- ANA SAYFA (kart grid) ---------- */
DP.renderHome = function () {
  const app = document.getElementById('app');

  const cards = DP.TOOLS.map((tool) => {
    const isFav = DP.storage.isFavorite(tool.id);
    return `
      <article class="tool-card" data-tool-id="${tool.id}">
        <div class="tool-card__header">
          <div class="tool-card__icon">${tool.icon}</div>
          <button class="fav-btn ${isFav ? 'is-fav' : ''}" data-fav-id="${tool.id}" aria-label="Toggle favorite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
        </div>
        <div>
          <h3 class="tool-card__title">${DP.escapeHtml(tool.name)}</h3>
          <p class="tool-card__desc">${DP.escapeHtml(tool.desc)}</p>
        </div>
        <div class="tool-card__footer">
          <span class="tool-card__badge">${DP.escapeHtml(tool.category)}</span>
        </div>
      </article>
    `;
  }).join('');

  app.innerHTML = `
    <section class="hero">
      <h1 class="hero__title">Your developer <span>pocket toolbox</span></h1>
      <p class="hero__subtitle">${DP.TOOLS.length} fast, free and private tools that run entirely in your browser.</p>
    </section>
    <div class="tools-grid">${cards}</div>
  `;

  /* Kart tıklaması */
  app.querySelectorAll('.tool-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-fav-id]')) return;
      const id = card.dataset.toolId;
      location.hash = `#/tool/${id}`;
    });
  });

  /* Favori butonu */
  app.querySelectorAll('[data-fav-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.favId;
      const isFav = DP.storage.toggleFavorite(id);
      btn.classList.toggle('is-fav', isFav);
      DP.toast(isFav ? 'Added to favorites' : 'Removed from favorites', 'success');
      DP.renderSidebar();
    });
  });
};

/* ---------- ARAÇ SAYFASI ---------- */
DP.renderToolPage = function (toolId) {
  const app = document.getElementById('app');
  const tool = DP.getTool(toolId);

  if (!tool) {
    app.innerHTML = `
      <div class="tool-panel">
        <div class="tool-panel__header">
          <div class="tool-panel__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <h1 class="tool-panel__title">Tool not found</h1>
            <p class="tool-panel__desc">The tool you're looking for doesn't exist.</p>
          </div>
        </div>
        <a href="#/" class="btn btn--primary">Back to home</a>
      </div>
    `;
    return;
  }

  DP.storage.addRecent(tool.id);

  app.innerHTML = `
    <div class="tool-panel">
      <div class="tool-panel__header">
        <div class="tool-panel__icon">${tool.icon}</div>
        <div style="flex:1; min-width: 200px;">
          <h1 class="tool-panel__title">${DP.escapeHtml(tool.name)}</h1>
          <p class="tool-panel__desc">${DP.escapeHtml(tool.desc)}</p>
        </div>
        <button class="fav-btn ${DP.storage.isFavorite(tool.id) ? 'is-fav' : ''}" id="toolFavBtn" aria-label="Toggle favorite">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
      </div>
      <div class="tool-panel__body" id="toolBody"></div>
    </div>
  `;

  const favBtn = document.getElementById('toolFavBtn');
  favBtn.addEventListener('click', () => {
    const isFav = DP.storage.toggleFavorite(tool.id);
    favBtn.classList.toggle('is-fav', isFav);
    DP.toast(isFav ? 'Added to favorites' : 'Removed from favorites', 'success');
    DP.renderSidebar(tool.id);
  });

  const body = document.getElementById('toolBody');
  if (window.DP.tools && window.DP.tools[tool.id]) {
    window.DP.tools[tool.id].render(body);
  } else {
    body.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 12px;">🚧</p>
        <p>This tool is coming soon.</p>
      </div>
    `;
  }
};

/* ---------- ROUTER ---------- */
DP.router = function () {
  const hash = location.hash || '#/';
  const app = document.getElementById('app');
  if (!app) return;

  const toolMatch = hash.match(/^#\/tool\/([\w-]+)$/);
  if (toolMatch) {
    const id = toolMatch[1];
    DP.renderToolPage(id);
    DP.renderSidebar(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  DP.renderHome();
  DP.renderSidebar('');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* Router'ı başlat */
DP.initRouter = function () {
  window.addEventListener('hashchange', DP.router);
};