/* Black Horse V4 animation layer JS: S11 counters only.
   Counts the two numeric Product hex stats (24 SACHETS, 10 GRAMS EACH)
   from 0 to their exact final values over 900ms, once, on load.
   The HTML already carries the final values, so if this script does
   not run, the correct numbers simply stay on screen. */
(function () {
  var hexes = document.querySelectorAll(".hx");
  hexes.forEach(function (el) {
    var m = el.textContent.trim().match(/^(\d+)(\s.*)?$/);
    if (!m) return;
    var target = parseInt(m[1], 10);
    if (target !== 24 && target !== 10) return;
    var suffix = m[2] || "";
    var start = null, dur = 900;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * p) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  });
})();
