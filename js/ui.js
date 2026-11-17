/* ============================================================
   DEVPOCKET — ui.js
   Sidebar render, tema değiştirme, arama, mobil drawer
   ============================================================ */

window.DP = window.DP || {};

/* ---------- 1. TEMA ---------- */
DP.applyTheme = function (theme) {
  document.documentElement.setAttribute('data-theme', theme);
  DP.storage.setTheme(theme);

  // Toggle etiketini güncelle
  const label = document.querySelector('.theme-toggle__label');
  if (label) {
    label.textContent = theme === 'dark' ? 'Dark mode' : 'Light mode';
  }
};

DP.toggleTheme = function () {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  DP.applyTheme(current === 'dark' ? 'light' : 'dark');
};

/* ---------- 2. SIDEBAR NAV LİSTESİ ---------- */
/**
 * Bir nav item elemanı oluşturur.
 * @param {object} tool - registry'deki araç
 * @param {string} activeId - şu anda açık olan aracın id'si
 */
function createNavItem(tool, activeId) {
  const li = document.createElement('li');
  li.innerHTML = `
    <a href="#/tool/${tool.id}" class="nav-item ${tool.id === activeId ? 'is-active' : ''}" data-tool-id="${tool.id}">
      <span class="nav-item__icon">${tool.icon}</span>
      <span class="nav-item__label">${DP.escapeHtml(tool.name)}</span>
    </a>
  `;
  return li.firstElementChild;
}

/**
 * Sidebar'ı doldurur (favoriler, son kullanılanlar, tüm araçlar).
 * @param {string} activeId - aktif araç id (opsiyonel)
 */
DP.renderSidebar = function (activeId = '') {
  const favoritesList = document.getElementById('favoritesList');
  const favoritesEmpty = document.getElementById('favoritesEmpty');
  const recentList = document.getElementById('recentList');
  const recentEmpty = document.getElementById('recentEmpty');
  const allList = document.getElementById('allToolsList');

  if (!favoritesList || !recentList || !allList) return;

  /* --- Favoriler --- */
  const favIds = DP.storage.getFavorites();
  const favTools = favIds.map((id) => DP.getTool(id)).filter(Boolean);
  favoritesList.innerHTML = '';
  favTools.forEach((tool) => {
    favoritesList.appendChild(createNavItem(tool, activeId));
  });
  favoritesEmpty.style.display = favTools.length === 0 ? 'block' : 'none';

  /* --- Son kullanılanlar --- */
  const recentIds = DP.storage.getRecent();
  const recentTools = recentIds.map((id) => DP.getTool(id)).filter(Boolean);
  recentList.innerHTML = '';
  recentTools.forEach((tool) => {
    recentList.appendChild(createNavItem(tool, activeId));
  });
  recentEmpty.style.display = recentTools.length === 0 ? 'block' : 'none';

  /* --- Tüm araçlar --- */
  allList.innerHTML = '';
  DP.TOOLS.forEach((tool) => {
    allList.appendChild(createNavItem(tool, activeId));
  });
};

/* ---------- 3. ARAMA (sidebar içi) ---------- */
DP.bindSearch = function () {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const onSearch = DP.debounce((query) => {
    const allItems = document.querySelectorAll('.nav-item');
    const q = query.toLowerCase().trim();

    allItems.forEach((item) => {
      const label = item.querySelector('.nav-item__label').textContent.toLowerCase();
      item.style.display = label.includes(q) ? '' : 'none';
    });
  }, 150);

  input.addEventListener('input', (e) => onSearch(e.target.value));

  // ⌘K kısayolu (Ctrl+K da olur)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
};

/* ---------- 4. MOBİL DRAWER ---------- */
DP.bindSidebarDrawer = function () {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const backdrop = document.getElementById('backdrop');

  const open = () => {
    sidebar.classList.add('is-open');
    backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', open);
  if (sidebarClose) sidebarClose.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);

  // Sidebar'daki bir linke tıklayınca mobilde kapat
  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('.nav-item')) close();
  });

  // ESC ile kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
};

/* ---------- 5. TEMA TOGGLE BUTONU ---------- */
DP.bindThemeToggle = function () {
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', DP.toggleTheme);
  }
};

/* ---------- 6. MODAL ---------- */
/**
 * Modal açar. Body içine HTML string veya element koyabilirsin.
 */
DP.openModal = function (title, content) {
  const modal = document.getElementById('modal');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');

  titleEl.textContent = title;
  bodyEl.innerHTML = '';
  if (typeof content === 'string') {
    bodyEl.innerHTML = content;
  } else if (content instanceof Node) {
    bodyEl.appendChild(content);
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
};

DP.closeModal = function () {
  const modal = document.getElementById('modal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
};

DP.bindModal = function () {
  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', DP.closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') DP.closeModal();
  });
};