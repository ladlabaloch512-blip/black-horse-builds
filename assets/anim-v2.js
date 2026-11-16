/* Black Horse V2 - R-SNOW-4 expanded set engine (the original V2 set was CSS only).
   Reveal: hidden state (.bh-rv) is added by this script only; an IntersectionObserver
   reveals blocks as they approach, and a 1400ms timer force-reveals everything and sets
   html.bh-all as a CSS backstop. No-JS means no hidden state at all.
   Cart flight and place-order sequencing are layered over Build's wiring without
   changing it: if this script fails, every flow works exactly as built. */
(function () {
  function onReady(f) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', f);
    else f();
  }
  onReady(function () {
    /* Hero entrance */
    var hx = document.querySelector('.hero-txt h1, .page-head h1, h1');
    if (hx) hx.classList.add('bh-hx');
    var hi = document.querySelector('.hero-img');
    if (hi) hi.classList.add('bh-hi');

    /* Logo micro gallop: once after load, and on tap (touch-audit fix for V2-5) */
    var logo = document.querySelector('a.logo');
    if (logo) {
      setTimeout(function () {
        logo.classList.add('bh-gallop');
        setTimeout(function () { logo.classList.remove('bh-gallop'); }, 500);
      }, 350);
      logo.addEventListener('click', function () { logo.classList.add('bh-gallop'); });
    }

    /* Thank-you seal (decorative gold check, drawn in) */
    if (/thank-you\.html/.test(location.pathname)) {
      var ph = document.querySelector('.page-head');
      if (ph && !ph.querySelector('.bh-seal')) {
        var NS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 64 64');
        svg.setAttribute('class', 'bh-seal');
        svg.setAttribute('aria-hidden', 'true');
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', '32'); c.setAttribute('cy', '32'); c.setAttribute('r', '29'); c.setAttribute('pathLength', '1');
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', 'M20 33.5 L28.5 42 L45 24'); p.setAttribute('pathLength', '1');
        svg.appendChild(c); svg.appendChild(p);
        ph.insertBefore(svg, ph.firstChild);
      }
    }

    /* Scroll reveal + in-view extras (shine sweep, image zoom settle) */
    var TARGETS = '.sec,.ben,.ben2,.bcard,.rcard,.pcard,.fq-item,.grp,.cart-row,#co-form,.co-sum,section';
    var targets = [].slice.call(document.querySelectorAll(TARGETS)).filter(function (el) {
      return !el.closest('.hero,header.site,footer.site,.page-head');
    });
    targets = targets.filter(function (el) {
      return !targets.some(function (o) { return o !== el && o.contains(el); });
    });
    function reveal(el) {
      if (!el.classList.contains('bh-rv')) return;
      el.classList.add('bh-in');
      setTimeout(function () { el.classList.remove('bh-rv', 'bh-in'); }, 1000);
    }
    function revealAll() {
      document.documentElement.classList.add('bh-all');
      targets.forEach(reveal);
    }
    var extras = [].slice.call(document.querySelectorAll('.btn-goldb,.pcard img,.rcard img,.bcard img'));
    function armExtras(el) {
      if (el.tagName === 'IMG') el.classList.add('bh-zoom');
      else el.classList.add('bh-shine');
      setTimeout(function () { el.classList.remove('bh-zoom', 'bh-shine'); }, 900);
    }
    if ('IntersectionObserver' in window) {
      targets.forEach(function (el) { el.classList.add('bh-rv'); });
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px 18% 0px', threshold: 0.05 });
      targets.forEach(function (el) { io.observe(el); });
      var io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { armExtras(e.target); io2.unobserve(e.target); } });
      }, { rootMargin: '0px 0px 12% 0px', threshold: 0.2 });
      extras.forEach(function (el) { io2.observe(el); });
      setTimeout(function () { io.disconnect(); revealAll(); }, 1400);
    } else {
      revealAll();
    }

    /* Add to cart: image flight to the header cart, confirm ring, count pop */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-add]') : null;
      if (!btn) return;
      btn.classList.add('bh-added');
      setTimeout(function () { btn.classList.remove('bh-added'); }, 600);
      /* The flight target is the RENDERED cart link: V2/V3 hide the header icon row
         on mobile (parent .icons is display:none), so the first link can be a
         zero-size hidden one. If no cart link is rendered, the flight is skipped
         and the confirm ring carries the feedback. */
      var cart = [].slice.call(document.querySelectorAll('.cart-link')).filter(function (c) {
        return c.getBoundingClientRect().width > 0;
      })[0] || document.querySelector('.cart-link');
      var img = null;
      var gal = document.querySelector('[data-gal]');
      if (gal && btn.closest('.prod,.dp-grid')) {
        var track = gal.querySelector('.gal-track');
        var on = gal.querySelector('.gal-thumbs button.on');
        var idx = on ? [].indexOf.call(gal.querySelectorAll('.gal-thumbs button'), on) : 0;
        if (track && track.children[idx]) { var s = track.children[idx]; img = s.tagName === 'IMG' ? s : s.querySelector('img'); }
      }
      if (!img) {
        var scope = btn.closest('.pcard,.hcard,.rcard,.prod,.dp-grid,.panel,.showcase,.dark-panel,.split,.boxline,.closeband') || document;
        img = scope.querySelector('img');
      }
      if (img && cart && img.animate) {
        /* Measure after Build's paint: the V2 cart link is zero-size until the
           first add gives it its .has state. */
        setTimeout(function () {
        var r = img.getBoundingClientRect(), t = cart.getBoundingClientRect();
        if (t.width === 0) { var bdg = cart.querySelector('[data-cart-count]'); if (bdg) t = bdg.getBoundingClientRect(); }
        if (t.width === 0 && cart.firstElementChild) t = cart.firstElementChild.getBoundingClientRect();
        if (r.width > 0 && t.width > 0) {
          var f = img.cloneNode();
          f.className = 'bh-flyer';
          f.style.left = r.left + 'px'; f.style.top = r.top + 'px';
          f.style.width = r.width + 'px'; f.style.height = r.height + 'px';
          document.body.appendChild(f);
          var dx = t.left + t.width / 2 - (r.left + r.width / 2);
          var dy = t.top + t.height / 2 - (r.top + r.height / 2);
          var a = f.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.06)', opacity: .35 }
          ], { duration: 600, easing: 'ease-in-out' });
          a.onfinish = function () { f.remove(); };
          setTimeout(function () { if (f.parentNode) f.remove(); }, 950);
        }
        }, 60);
      }
      setTimeout(function () {
        document.querySelectorAll('[data-cart-count]').forEach(function (b) {
          b.classList.remove('bh-pop'); void b.offsetWidth; b.classList.add('bh-pop');
        });
      }, 600);
    });

    /* Place order: progress, then placed, then Build's own submit runs */
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('#co-form button[type="submit"]') : null;
      if (!b) return;
      var form = document.getElementById('co-form');
      if (!form || form.dataset.bhBusy) return;
      if (form.checkValidity && !form.checkValidity()) return;
      e.preventDefault(); e.stopPropagation();
      form.dataset.bhBusy = '1';
      b.classList.add('bh-processing'); b.textContent = 'PROCESSING...';
      setTimeout(function () {
        b.classList.remove('bh-processing'); b.classList.add('bh-placed'); b.textContent = 'ORDER PLACED';
      }, 900);
      setTimeout(function () { form.requestSubmit(); }, 1500);
    }, true);
  });
})();
