/* ============================================================
   DEVPOCKET — app.js
   Uygulamayı başlatır
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

// DOMContentLoaded bazen dosya sırası yüzünden kaçırılabilir.
// Bu yüzden kontrol edip hemen başlatıyoruz.
function initApp() {
  const savedTheme = DP.storage.getTheme();
  DP.applyTheme(savedTheme);

  DP.bindThemeToggle();
  DP.bindSearch();
  DP.bindSidebarDrawer();
  DP.bindModal();

  DP.initRouter();
  DP.router(); // İlk yüklemede sayfayı çizer

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      DP.toggleTheme();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // Eğer dosya geç yüklendiyse ve DOM zaten hazırsa hemen başlat
  initApp();
}