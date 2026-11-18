// GoofGig #612 — Hold Your Breath
// A tiny everyday gig: Dive down, grab the pearls, surface before your air runs out.
registerGame({
  n: 612,
  title: "Hold Your Breath",
  desc: "Dive down, grab the pearls, surface before your air runs out.",
  hint: "Press and <b>HOLD to dive</b>, let go to float back up. Grab pearls, watch your air!",
  grades: [
    ["Pearl Diver Pro", "Every pearl, zero gasps. The sea applauds you."],
    ["Deep-Sea Regular", "A fine haul — the pearls barely noticed you."],
    ["Snorkel Survivor", "Most pearls in the bag, one close call with the surface."],
    ["Splashy Beginner", "You came up gasping, but the pearls are yours."],
    ["Puddle Paddler", "The pearls stayed put. The surface saved you."]
  ],
  thumb: function (g) {
    g.fillStyle = "#38bdf8"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#bae6fd"; g.fillRect(0, 0, 300, 14);
    g.fillStyle = "#fde68a"; g.fillRect(0, 78, 300, 14);
    g.fillStyle = "#ffffff";
    g.beginPath(); g.arc(60, 55, 8, 0, 7); g.fill();
    g.beginPath(); g.arc(110, 68, 8, 0, 7); g.fill();
    g.beginPath(); g.arc(160, 48, 8, 0, 7); g.fill();
    g.fillStyle = "#f472b6"; g.beginPath(); g.arc(230, 46, 14, 0, 7); g.fill();
    g.fillStyle = "#0c4a6e"; g.beginPath(); g.arc(234, 44, 4, 0, 7); g.fill();
    g.fillStyle = "#f472b6"; g.fillRect(216, 54, 28, 10);
    txt(g, "HOLD", 230, 78, 13, "#0c4a6e");
  },
  create: function (api) {
    var LIMIT = 25;
    var SURFACE = 110, FLOOR = 400;
    var t0 = -1, done = false, holding = false;
    var dx = 360, dy = SURFACE, tx = 360;
    var air = 100, gasping = false, gasps = 0, gasped = false;
    var maxDepth = 0, pearls = 0, flash = 0, flashTxt = "";
    var pearlsList = [
      { x: 140, y: 205, got: false, ph: 0 },
      { x: 250, y: 250, got: false, ph: 2 },
      { x: 360, y: 295, got: false, ph: 4 },
      { x: 470, y: 335, got: false, ph: 1 },
      { x: 580, y: 370, got: false, ph: 3 },
      { x: 300, y: 385, got: false, ph: 5 }
    ];
    var fishes = [
      { x: 90, y: 170, v: 26, c: "#f59e0b", s: 1 },
      { x: 620, y: 230, v: -20, c: "#a78bfa", s: 1.2 },
      { x: 200, y: 330, v: 18, c: "#34d399", s: 0.9 }
    ];
    var bubbles = [];
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var depthBonus = Math.round(clamp((maxDepth - SURFACE) / (FLOOR - SURFACE), 0, 1) * 10);
      var score = pearls * 15 + depthBonus;
      fin(score, [
        { label: "Pearls grabbed", value: Math.round(pearls / 6 * 100), text: pearls + " / 6", good: pearls >= 4 },
        { label: "Deepest dive", value: Math.round(clamp((maxDepth - SURFACE) / (FLOOR - SURFACE), 0, 1) * 100), text: Math.round(clamp((maxDepth - SURFACE) / (FLOOR - SURFACE), 0, 1) * 12) + " m down", good: maxDepth > 330 },
        { label: "Air scares", value: gasps === 0 ? 100 : Math.max(0, 100 - gasps * 30), text: gasps === 0 ? "none — smooth breathing!" : gasps + " gasp" + (gasps > 1 ? "s" : ""), good: gasps === 0 }
      ]);
    }
    return {
      status: function () {
        if (done) return "Dive over — " + pearls + " pearls in the bag.";
        if (gasping) return "GASP! Get to the surface!";
        if (holding) return "Diving… air " + Math.round(air) + "% — pearls " + pearls + " / 6";
        return "Press and HOLD to dive for pearls!";
      },
      down: function (p, now) {
        el(now); if (done) return;
        holding = true; tx = clamp(p.x, 60, 660); blip(440, 0.05);
      },
      move: function (p, now) {
        if (done) return;
        tx = clamp(p.x, 60, 660);
      },
      up: function (p, now) {
        if (done) return;
        holding = false;
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        dt = clamp(dt, 0, 0.05);
        // movement
        if (!done) {
          if (gasping) {
            dy -= 280 * dt;
            if (dy <= SURFACE) { dy = SURFACE; gasping = false; air = 25; }
          } else if (holding) {
            dy += 150 * dt;
            if (dy > FLOOR) dy = FLOOR;
          } else {
            dy -= 130 * dt;
            if (dy < SURFACE) dy = SURFACE;
          }
          dx += clamp(tx - dx, -260 * dt, 260 * dt);
          if (dy > maxDepth) maxDepth = dy;
          // air
          if (dy > SURFACE + 12) {
            air -= 15 * dt;
            if (air <= 0) {
              air = 0;
              if (!gasped) { gasped = true; gasps++; gasping = true; flash = 1.0; flashTxt = "Out of air! Surface NOW!"; sndBad(); }
            }
          } else {
            air += 45 * dt;
            if (air > 100) air = 100;
            if (air > 50) gasped = false;
          }
          // pearls
          pearlsList.forEach(function (q) {
            if (q.got) return;
            var px = q.x + Math.sin(t * 1.2 + q.ph) * 14;
            if (dist(dx, dy, px, q.y) < 36) {
              q.got = true; pearls++;
              flash = 0.7; flashTxt = "Pearl! " + pearls + " / 6";
              sndGood(); blip(880, 0.08);
            }
          });
          // fish
          fishes.forEach(function (f) {
            f.x += f.v * dt;
            if (f.x > 760) f.x = -40;
            if (f.x < -40) f.x = 760;
          });
          // bubbles
          if (Math.random() < 0.25) bubbles.push({ x: dx + (Math.random() * 20 - 10), y: dy - 14, r: 2 + Math.random() * 3 });
          bubbles.forEach(function (b) { b.y -= 60 * dt; b.x += Math.sin(t * 5 + b.y * 0.1) * 8 * dt; });
          bubbles = bubbles.filter(function (b) { return b.y > SURFACE - 4 && b.r < 9; });
        }
        // --- scene ---
        g.fillStyle = dark ? "#0b2237" : "#7dd3fc"; g.fillRect(0, 0, W, 120);
        g.fillStyle = dark ? "#0e2f4d" : "#38bdf8"; g.fillRect(0, 120, W, 180);
        g.fillStyle = dark ? "#123f63" : "#0ea5e9"; g.fillRect(0, 300, W, 140);
        // sun rays
        g.fillStyle = dark ? "rgba(186,230,253,0.08)" : "rgba(255,255,255,0.25)";
        for (var i = 0; i < 4; i++) {
          var rx = 120 + i * 160;
          g.beginPath(); g.moveTo(rx, 0); g.lineTo(rx + 60, 0); g.lineTo(rx + 20, 300); g.lineTo(rx - 20, 300); g.fill();
        }
        // surface waves
        g.strokeStyle = dark ? "#7dd3fc" : "#ffffff"; g.lineWidth = 3;
        g.beginPath();
        for (var wx = 0; wx <= W; wx += 12) {
          var wy = SURFACE + Math.sin(wx * 0.05 + t * 3) * 4;
          if (wx === 0) g.moveTo(wx, wy); else g.lineTo(wx, wy);
        }
        g.stroke();
        // sand
        g.fillStyle = dark ? "#3b2f1d" : "#fde68a"; g.fillRect(0, FLOOR, W, H - FLOOR);
        g.fillStyle = dark ? "#2f5d3a" : "#16a34a";
        g.beginPath(); g.moveTo(60, FLOOR); g.quadraticCurveTo(70, 360, 60, 340); g.quadraticCurveTo(52, 368, 60, FLOOR); g.fill();
        g.beginPath(); g.moveTo(660, FLOOR); g.quadraticCurveTo(672, 356, 660, 336); g.quadraticCurveTo(650, 366, 660, FLOOR); g.fill();
        // fish
        fishes.forEach(function (f) {
          g.fillStyle = f.c;
          g.beginPath(); g.ellipse(f.x, f.y, 14 * f.s, 7 * f.s, 0, 0, 7); g.fill();
          g.beginPath(); g.moveTo(f.x - 12 * f.s * (f.v > 0 ? 1 : -1), f.y); g.lineTo(f.x - 22 * f.s * (f.v > 0 ? 1 : -1), f.y - 7 * f.s); g.lineTo(f.x - 22 * f.s * (f.v > 0 ? 1 : -1), f.y + 7 * f.s); g.fill();
        });
        // pearls
        pearlsList.forEach(function (q) {
          if (q.got) return;
          var px = q.x + Math.sin(t * 1.2 + q.ph) * 14;
          var bob = Math.sin(t * 2 + q.ph) * 4;
          g.fillStyle = "#fde68a";
          g.beginPath(); g.arc(px, q.y + bob, 13, 0, 7); g.fill();
          g.fillStyle = "#ffffff";
          g.beginPath(); g.arc(px, q.y + bob, 9, 0, 7); g.fill();
          g.fillStyle = "#fbcfe8";
          g.beginPath(); g.arc(px - 3, q.y + bob - 3, 3, 0, 7); g.fill();
        });
        // bubbles
        g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 1.5;
        bubbles.forEach(function (b) { g.beginPath(); g.arc(b.x, b.y, b.r, 0, 7); g.stroke(); });
        // diver
        var kick = Math.sin(t * (holding ? 10 : 5)) * 6;
        g.fillStyle = "#f472b6";
        g.beginPath(); g.ellipse(dx, dy + 12, 20, 12, kick * 0.01, 0, 7); g.fill();
        g.fillStyle = "#fbbf24";
        g.beginPath(); g.moveTo(dx - 18, dy + 10); g.lineTo(dx - 34, dy + 18 + kick); g.lineTo(dx - 18, dy + 20); g.fill();
        g.beginPath(); g.moveTo(dx - 18, dy + 10); g.lineTo(dx - 34, dy + 4 - kick); g.lineTo(dx - 18, dy + 18); g.fill();
        g.fillStyle = "#f9a8d4";
        g.beginPath(); g.arc(dx + 16, dy - 2, 11, 0, 7); g.fill();
        g.fillStyle = "#0ea5e9";
        g.fillRect(dx + 8, dy - 8, 16, 7);
        g.fillStyle = "#0c4a6e";
        g.beginPath(); g.arc(dx + 20, dy - 4, 2.5, 0, 7); g.fill();
        // air meter + timer
        var airC = air > 50 ? "#16a34a" : (air > 25 ? "#f59e0b" : "#dc2626");
        g.fillStyle = dark ? "#223140" : "#e0f2fe"; rr(g, 20, 16, 200, 16, 8); g.fill();
        g.fillStyle = airC; rr(g, 20, 16, 200 * clamp(air / 100, 0, 1), 16, 8); g.fill();
        txt(g, "AIR", 232, 28, 15, dark ? "#e2e8f0" : "#0c4a6e");
        txt(g, "pearls " + pearls + " / 6", 360, 28, 18, dark ? "#e2e8f0" : "#0c4a6e");
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#e0f2fe"; rr(g, 480, 16, 220, 16, 8); g.fill();
        g.fillStyle = tl > 0.3 ? "#f59e0b" : "#dc2626"; rr(g, 480, 16, 220 * tl, 16, 8); g.fill();
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 66, 22, flashTxt.indexOf("Out") === 0 ? "#dc2626" : "#0c4a6e"); }
        if (!done && !holding && dy <= SURFACE + 1) txt(g, "Press and HOLD to dive!", 360, 200, 24, dark ? "#e2e8f0" : "#0c4a6e");
      }
    };
  }
});
