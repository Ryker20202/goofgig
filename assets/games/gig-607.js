// GoofGig #607 — Herd the Ducks
// A tiny everyday gig: Five ducklings are wandering off. Gently push them into the pond.
registerGame({
  n: 607,
  title: "Herd the Ducks",
  desc: "Five ducklings are wandering off. Gently push them into the pond.",
  hint: "Move your farmer close — ducklings waddle <b>away from you</b>. Nudge them into the pond!",
  grades: [
    ["Duck Whisperer", "Five ducks, one pond, zero drama. The farmer's hat tips to you."],
    ["Pond Manager", "Four in the pond. The fifth is filing a complaint."],
    ["Duck Herder", "Mostly herded. The ducks are unimpressed but wet."],
    ["Duck Chaser", "You ran. They ran faster. The pond is empty."],
    ["Duck Disaster", "The ducks have unionized and left the garden."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dcfce7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#3b82f6"; g.beginPath(); g.ellipse(220, 62, 62, 24, 0, 0, 7); g.fill();
    g.fillStyle = "#facc15";
    g.beginPath(); g.arc(90, 50, 10, 0, 7); g.fill();
    g.beginPath(); g.arc(120, 66, 10, 0, 7); g.fill();
    g.beginPath(); g.arc(200, 50, 10, 0, 7); g.fill();
    g.fillStyle = "#78350f"; g.beginPath(); g.arc(150, 30, 12, 0, 7); g.fill();
    g.fillStyle = "#facc15"; rr(g, 138, 12, 24, 6, 3); g.fill();
  },
  create: function (api) {
    var LIMIT = 25;
    var t0 = -1, done = false;
    var farmer = { x: 360, y: 130 };
    var ducks = [], pond = { x: 560, y: 330, rx: 130, ry: 62 };
    var safe = 0, flash = 0, flashTxt = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var t = el(now);
      var score = safe * 17 + (safe === 5 ? 15 + clamp(25 - t, 0, 25) * 0 : 0);
      fin(score, [
        { label: "Ducks in pond", value: Math.round(safe / 5 * 100), text: safe + " / 5", good: safe >= 4 },
        { label: "Time left", value: Math.round(clamp(1 - t / LIMIT, 0, 1) * 100), text: Math.max(0, Math.round(LIMIT - t)) + "s left", good: safe === 5 }
      ]);
    }
    function init() {
      var spots = [[180, 300], [300, 220], [420, 320], [240, 150], [480, 180]];
      for (var i = 0; i < 5; i++) ducks.push({ x: spots[i][0], y: spots[i][1], vx: 0, vy: 0, wob: Math.random() * 6, safe: false });
    }
    init();
    return {
      status: function () {
        return done ? "Roundup complete. The pond is pleased." : "Ducks in pond: " + safe + " / 5 — nudge them in!";
      },
      down: function (p, now) { el(now); farmer.x = clamp(p.x, 40, 680); farmer.y = clamp(p.y, 40, 400); },
      move: function (p, now) { farmer.x = clamp(p.x, 40, 680); farmer.y = clamp(p.y, 40, 400); },
      up: function (p, now) {},
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        g.fillStyle = dark ? "#16202b" : "#dcfce7"; g.fillRect(0, 0, W, H);
        // flowers
        g.fillStyle = "#f472b6";
        [[80, 380], [660, 90], [120, 90]].forEach(function (f) { g.beginPath(); g.arc(f[0], f[1], 6, 0, 7); g.fill(); });
        // pond
        g.fillStyle = dark ? "#1d4e6b" : "#38bdf8";
        g.beginPath(); g.ellipse(pond.x, pond.y, pond.rx, pond.ry, 0, 0, 7); g.fill();
        g.strokeStyle = dark ? "#7dd3fc" : "#0284c7"; g.lineWidth = 3;
        g.beginPath(); g.ellipse(pond.x, pond.y, pond.rx, pond.ry, 0, 0, 7); g.stroke();
        txt(g, "POND", pond.x, pond.y + 4, 16, "#ffffff");
        // ducks
        ducks.forEach(function (d) {
          if (d.safe) return;
          var dx = d.x - farmer.x, dy = d.y - farmer.y;
          var dd = Math.hypot(dx, dy);
          if (dd < 110 && dd > 1) {
            var push = (110 - dd) / 110 * 200;
            d.vx += dx / dd * push * dt * 2; d.vy += dy / dd * push * dt * 2;
          }
          d.vx += Math.sin(t * 1.3 + d.wob) * 6 * dt; d.vy += Math.cos(t * 1.1 + d.wob) * 6 * dt;
          d.vx *= 0.97; d.vy *= 0.97;
          d.x = clamp(d.x + d.vx * dt, 30, 690); d.y = clamp(d.y + d.vy * dt, 30, 400);
          var inPond = Math.pow((d.x - pond.x) / pond.rx, 2) + Math.pow((d.y - pond.y) / pond.ry, 2) < 0.7;
          if (inPond) {
            d.safe = true; safe++;
            flash = 0.6; flashTxt = safe === 5 ? "All ducks in!" : "Splash! " + safe + " in the pond";
            blip(700, 0.07);
            if (safe === 5) { sndGood(); finishAll(now); }
          }
        });
        ducks.forEach(function (d) {
          var bob = Math.sin(t * 4 + d.wob) * 2;
          g.fillStyle = "#facc15"; g.beginPath(); g.arc(d.x, d.y + bob, 13, 0, 7); g.fill();
          g.fillStyle = "#facc15"; g.beginPath(); g.arc(d.x + 10, d.y - 8 + bob, 8, 0, 7); g.fill();
          g.fillStyle = "#f97316"; g.beginPath(); g.moveTo(d.x + 16, d.y - 9 + bob); g.lineTo(d.x + 23, d.y - 6 + bob); g.lineTo(d.x + 16, d.y - 4 + bob); g.closePath(); g.fill();
          g.fillStyle = "#334155"; g.beginPath(); g.arc(d.x + 12, d.y - 10 + bob, 2, 0, 7); g.fill();
          if (d.safe) {
            g.strokeStyle = "#ffffff"; g.lineWidth = 2;
            g.beginPath(); g.ellipse(d.x, d.y + 12, 16, 4, 0, 0, 7); g.stroke();
          }
        });
        // farmer
        g.fillStyle = "#78350f"; g.beginPath(); g.arc(farmer.x, farmer.y - 22, 14, 0, 7); g.fill();
        g.fillStyle = "#facc15"; rr(g, farmer.x - 22, farmer.y - 30, 44, 8, 4); g.fill();
        g.fillStyle = "#2563eb"; rr(g, farmer.x - 15, farmer.y - 10, 30, 26, 8); g.fill();
        g.fillStyle = "#facc15"; g.beginPath(); g.arc(farmer.x - 8, farmer.y - 20, 2.5, 0, 7); g.fill(); g.beginPath(); g.arc(farmer.x + 8, farmer.y - 20, 2.5, 0, 7); g.fill();
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 50, 26, "#0284c7"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#16a34a" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
