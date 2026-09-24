(function () {
  function syncLangButtons(lang) {
    lang = lang === 'es' ? 'es' : 'en';
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.remove('active');
    });
    var activeBtn = document.querySelector(
      '.lang-btn[onclick*="setLang(\'' + lang + '\')"]'
    );
    if (activeBtn) activeBtn.classList.add('active');
  }

  function setLang(lang) {
    lang = lang === 'es' ? 'es' : 'en';
    document.body.className = 'lang-' + lang;
    document.documentElement.setAttribute('lang', lang);
    syncLangButtons(lang);
    try {
      localStorage.setItem('lang', lang);
    } catch (e) {}
  }

  window.setLang = setLang;

  var saved = null;
  try {
    saved = localStorage.getItem('lang');
  } catch (e) {}
  if (saved === 'es' || saved === 'en') {
    document.body.className = 'lang-' + saved;
    document.documentElement.setAttribute('lang', saved);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        syncLangButtons(saved);
      });
    } else {
      syncLangButtons(saved);
    }
  }
})();
