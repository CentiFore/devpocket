/* ============================================================
   DEVPOCKET — utils.js
   Yardımcı fonksiyonlar: toast, kopyalama, debounce, kaçış
   ============================================================ */

/* Global namespace — diğer dosyalar bunu kullanacak */
window.DP = window.DP || {};

/* ---------- 1. TOAST (bildirim) ---------- */
/**
 * Ekranın sağ altında küçük bir bildirim gösterir.
 * @param {string} message - Gösterilecek mesaj
 * @param {'success'|'error'|'info'} type - Bildirim tipi
 * @param {number} duration - Kaç ms sonra kaybolsun (varsayılan 3000)
 */
DP.toast = function (message, type = 'success', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // İkonlar (tip'e göre)
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };

  // Yeni toast elemanı oluştur
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__message">${DP.escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Süre sonunda çıkış animasyonu + silme
  setTimeout(() => {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

/* ---------- 2. KOPYALAMA ---------- */
/**
 * Metni panoya kopyalar ve toast gösterir.
 * @param {string} text - Kopyalanacak metin
 * @param {string} successMessage - Başarı mesajı (opsiyonel)
 */
DP.copy = async function (text, successMessage = 'Copied to clipboard!') {
  if (!text) {
    DP.toast('Nothing to copy', 'error');
    return false;
  }
  try {
    // Modern API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback (eski tarayıcılar için)
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    DP.toast(successMessage, 'success');
    return true;
  } catch (err) {
    DP.toast('Copy failed: ' + err.message, 'error');
    return false;
  }
};

/* ---------- 3. DEBOUNCE ---------- */
/**
 * Bir fonksiyonun çok sık çalışmasını engeller.
 * (Örn: kullanıcı yazarken her harfte değil, durunca çalışsın)
 * @param {Function} fn - Çalıştırılacak fonksiyon
 * @param {number} delay - Bekleme süresi (ms)
 */
DP.debounce = function (fn, delay = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

/* ---------- 4. HTML KAÇIŞI ---------- */
/**
 * Kullanıcı girdisini HTML'e güvenli şekilde basmak için.
 * (XSS saldırılarını önler — çok önemli!)
 * @param {string} str
 */
DP.escapeHtml = function (str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/* ---------- 5. DOSYA İNDİRME ---------- */
/**
 * Bir metni .txt / .json vb. olarak indirir.
 * @param {string} content - Dosya içeriği
 * @param {string} filename - Örn: "data.json"
 * @param {string} mime - Örn: "application/json"
 */
DP.download = function (content, filename = 'download.txt', mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/* ---------- 6. KOPYALAMA BUTONU OLUŞTURUCU ---------- */
/**
 * Bir kopyalama butonu döndürür (araç panellerinde kullanılır).
 * @param {Function|string} getText - Metni döndüren fonksiyon veya string
 */
DP.copyButton = function (getText) {
  const btn = document.createElement('button');
  btn.className = 'btn btn--secondary btn--sm';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <span>Copy</span>
  `;
  btn.addEventListener('click', async () => {
    const text = typeof getText === 'function' ? getText() : getText;
    await DP.copy(text);
  });
  return btn;
};

/* ---------- 7. ID ÜRETİCİ (kısa) ---------- */
/** Rastgele kısa bir id üretir (snippet kartları vb. için) */
DP.uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};