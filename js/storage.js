/* ============================================================
   DEVPOCKET — storage.js
   LocalStorage yönetimi: tema, favoriler, son kullanılanlar, snippet'ler
   ============================================================ */

window.DP = window.DP || {};

/* ---------- ANAHTARLAR (sabitler) ---------- */
const KEYS = {
  THEME: 'dp:theme',
  FAVORITES: 'dp:favorites',
  RECENT: 'dp:recent',
  SNIPPETS: 'dp:snippets'
};

/* ---------- YARDIMCI: Güvenli okuma ---------- */
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/* ---------- YARDIMCI: Güvenli yazma ---------- */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // Kota dolu olabilir vb.
    console.warn('Storage write failed:', err);
    return false;
  }
}

/* ---------- 1. TEMA ---------- */
DP.storage = {
  /* --- Tema --- */
  getTheme() {
    return safeGet(KEYS.THEME, 'dark');
  },
  setTheme(theme) {
    safeSet(KEYS.THEME, theme);
  },

  /* --- Favoriler (tool id dizisi) --- */
  getFavorites() {
    return safeGet(KEYS.FAVORITES, []);
  },
  isFavorite(toolId) {
    return this.getFavorites().includes(toolId);
  },
  toggleFavorite(toolId) {
    const favs = this.getFavorites();
    const idx = favs.indexOf(toolId);
    if (idx === -1) {
      favs.push(toolId);
    } else {
      favs.splice(idx, 1);
    }
    safeSet(KEYS.FAVORITES, favs);
    return favs.includes(toolId); // yeni durum
  },

  /* --- Son kullanılanlar (en fazla 8) --- */
  getRecent() {
    return safeGet(KEYS.RECENT, []);
  },
  addRecent(toolId) {
    let recent = this.getRecent();
    // Zaten varsa çıkar, en başa ekle
    recent = recent.filter((id) => id !== toolId);
    recent.unshift(toolId);
    // En fazla 8 tane tut
    recent = recent.slice(0, 8);
    safeSet(KEYS.RECENT, recent);
  },

  /* --- Snippet'ler --- */
  getSnippets() {
    return safeGet(KEYS.SNIPPETS, []);
  },
  saveSnippet(snippet) {
    const snippets = this.getSnippets();
    const idx = snippets.findIndex((s) => s.id === snippet.id);
    if (idx === -1) {
      // Yeni ekle — en başa
      snippets.unshift(snippet);
    } else {
      // Güncelle
      snippets[idx] = snippet;
    }
    safeSet(KEYS.SNIPPETS, snippets);
    return snippets;
  },
  deleteSnippet(id) {
    const snippets = this.getSnippets().filter((s) => s.id !== id);
    safeSet(KEYS.SNIPPETS, snippets);
    return snippets;
  }
};