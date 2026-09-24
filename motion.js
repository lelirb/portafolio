/* Movimiento al hacer scroll: reveal en ambas direcciones + parallax suave.
   - Al bajar, los bloques .reveal entran desde abajo; al subir, entran desde arriba.
   - Los elementos con [data-parallax] reciben la variable CSS --p (px recorridos),
     que el CSS de cada página usa para mover decoraciones a distinta velocidad.
   - Si el sistema pide "reducir movimiento", todo se muestra quieto. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reveals = [];
  var parallaxEls = [];
  var observer = null;
  var ticking = false;

  function showAll() {
    reveals.forEach(function (el) {
      el.classList.remove('from-above');
      el.classList.add('visible');
    });
    parallaxEls.forEach(function (el) { el.style.removeProperty('--p'); });
  }

  // Un bloque se considera visible cuando asoma al menos un 12 %,
  // o un cuarto de la pantalla si es más alto que la pantalla (zoom alto).
  function enough(entry) {
    var root = entry.rootBounds;
    return entry.intersectionRatio >= 0.12 ||
      (root && entry.intersectionRect.height >= root.height * 0.25);
  }

  function onIntersect(entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      if (entry.isIntersecting && enough(entry)) {
        // Si salió por arriba (se está subiendo), entra desde arriba.
        el.classList.toggle('from-above', entry.boundingClientRect.top < 0);
        el.classList.add('visible');
      } else if (!entry.isIntersecting) {
        // Fuera de pantalla: se prepara para volver a animar desde el lado por el que salió.
        el.classList.remove('visible');
        el.classList.toggle('from-above', entry.boundingClientRect.top < 0);
      }
    });
  }

  function updateParallax() {
    ticking = false;
    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return; // lejos de la pantalla: no se calcula
      el.style.setProperty('--p', (-r.top).toFixed(1));
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  }

  function start() {
    if (reduce.matches) { showAll(); return; }
    observer = new IntersectionObserver(onIntersect, {
      threshold: [0, 0.12, 0.25, 0.5]
    });
    reveals.forEach(function (el) { observer.observe(el); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateParallax();
  }

  function stop() {
    if (observer) { observer.disconnect(); observer = null; }
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    showAll();
  }

  function init() {
    reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    start();
    // Si la persona activa "reducir movimiento" con la página abierta, se respeta al instante.
    var onChange = function () { if (reduce.matches) stop(); else start(); };
    if (reduce.addEventListener) reduce.addEventListener('change', onChange);
    else if (reduce.addListener) reduce.addListener(onChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
