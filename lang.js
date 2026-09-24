/* Idioma EN/ES + ayudas de accesibilidad compartidas por todas las páginas.
   Se carga al inicio del <body>, antes del contenido. */
(function () {
  var root = document.documentElement;
  // Marca que JS está activo: las animaciones .reveal solo ocultan contenido si JS funciona.
  root.classList.add('js');

  function normalize(lang) { return lang === 'es' ? 'es' : 'en'; }

  function getLang() {
    return document.body && document.body.classList.contains('lang-es') ? 'es' : 'en';
  }

  function setBodyClass(lang) {
    document.body.classList.remove('lang-en', 'lang-es');
    document.body.classList.add('lang-' + lang);
    root.setAttribute('lang', lang);
  }

  // Sincroniza todo lo que CSS no puede cambiar: estado de botones, alt, placeholders.
  function syncDom(lang) {
    document.querySelectorAll('.lang-btn[data-lang]').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('img[data-alt-' + lang + ']').forEach(function (img) {
      img.alt = img.getAttribute('data-alt-' + lang);
    });
    document.querySelectorAll('[data-ph-' + lang + ']').forEach(function (el) {
      el.placeholder = el.getAttribute('data-ph-' + lang);
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  function setLang(lang) {
    lang = normalize(lang);
    setBodyClass(lang);
    syncDom(lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  window.setLang = setLang;
  window.getLang = getLang;

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  if (saved === 'es' || saved === 'en') setBodyClass(saved);

  function init() {
    document.querySelectorAll('.lang-btn[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
    });
    syncDom(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
