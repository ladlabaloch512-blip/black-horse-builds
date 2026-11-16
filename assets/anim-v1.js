/* Black Horse V1 - approved animation layer JS.
   Only job: V1-2 announcement bar marquee. It wraps the bar's OWN text
   (duplicated once for the loop). No new claims, no offers added.
   If JS fails, the bar stays static and fully visible. */
(function () {
  function init() {
    var bar = document.querySelector('.topbar');
    if (!bar || bar.querySelector('.bh-track')) return;
    var text = (bar.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;
    var track = document.createElement('div');
    track.className = 'bh-track';
    for (var i = 0; i < 2; i++) {
      var s = document.createElement('span');
      s.textContent = text;
      track.appendChild(s);
    }
    bar.textContent = '';
    bar.appendChild(track);
    bar.classList.add('bh-marquee');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
