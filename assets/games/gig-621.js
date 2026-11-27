// GoofGig #621 — Water the Plants
// A tiny everyday gig: Drag the can over the thirsty plants. Each one likes its water just right — too little stays thirsty, too much drowns it. Refill at the tap when the can runs dry.
registerGame({
  n: 621,
  title: "Water the Plants",
  desc: "Drag the can over the thirsty plants. Each one likes its water just right — too little stays thirsty, too much drowns it.",
  hint: "Press and <b>drag the watering can</b> over a plant to pour. Watch each plant's green zone, and swing by the <b>tap on the left</b> to refill the can!",
  grades: [
    ["Green Thumb", "Five plants, five perfect drinks. The garden is singing your name."],
    ["Steady Gardener", "Nearly every plant got exactly what it wanted. Lovely work."],
    ["Fair Weather Waterer", "Most plants are happy. A couple are still writing complaints."],
    ["Puddle Maker", "Some plants are thirsty, some are swimming. The garden is confused."],
    ["Plant Drought", "The plants have filed a formal complaint with the sun."]
  ],
  thumb: function (g) {
    g.fillStyle = "#bae6fd"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#fde68a"; g.beginPath(); g.arc(268, 18, 11, 0, 7); g.fill();
    g.fillStyle = "#86c98a"; g.fillRect(0, 62, 300, 30);
    g.fillStyle = "#a16207"; g.fillRect(0, 62, 300, 4);
    // three pots with plants
    var px = [60, 150, 240];
    for (var i = 0; i < 3; i++) {
      g.fillStyle = "#16a34a"; g.fillRect(px[i] - 2, 34, 4, 28);
      g.fillStyle = "#22c55e"; g.beginPath(); g.arc(px[i] - 8, 38, 8, 0, 7); g.fill();
      g.beginPath(); g.arc(px[i] + 8, 32, 8, 0, 7); g.fill();
      g.fillStyle = "#f472b6"; g.beginPath(); g.arc(px[i], 26, 6, 0, 7); g.fill();
      g.fillStyle = "#fff7ed"; g.beginPath(); g.arc(px[i], 26, 2, 0, 7); g.fill();
      g.fillStyle = "#b45309"; rr(g, px[i] - 16, 62, 32, 22, 4); g.fill();
    }
    // watering can
    g.fillStyle = "#0ea5e9"; rr(g, 196, 18, 44, 22, 6); g.fill();
    g.fillStyle = "#0284c7"; g.fillRect(196, 18, 44, 7);
    g.fillStyle = "#0ea5e9"; g.fillRect(240, 26, 20, 6);
    g.fillStyle = "#38bdf8";
    g.beginPath(); g.arc(262, 44, 3, 0, 7); g.fill();
    g.beginPath(); g.arc(268, 52, 3, 0, 7); g.fill();
    g.beginPath(); g.arc(256, 54, 3, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 25;
    var ROUNDS = 5;
    var t0 = -1, done = false;
    var dragging = false, px = 360, py = 200;
    var tank = 100, tankMax = 100;
    var pourRate = 46, drainRate = 30, refillRate = 70;
    var drops = [];
    var plants = [];
    var sndT = 0, dropT = 0;
    var overCount = 0;
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function mkPlants() {
      var xs = [180, 290, 400, 510, 620];
      var cols = ["#f472b6", "#facc15", "#c084fc", "#fb7185", "#f97316"];
      for (var i = 0; i < ROUNDS; i++) {
        var lo = 45 + Math.random() * 20;
        var hi = lo + 22 + Math.random() * 8;
        plants.push({ x: xs[i], level: 8 + Math.random() * 12, lo: lo, hi: hi, color: cols[i], inZone: false, over: false, sway: Math.random() * 6 });
      }
    }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll() {
      var total = 0, happy = 0, best = 999;
      for (var i = 0; i < plants.length; i++) {
        var p = plants[i], d = 0;
        if (p.level >= p.lo && p.level <= p.hi) { d = 0; happy++; }
        else if (p.level < p.lo) d = p.lo - p.level;
        else d = p.level - p.hi;
        if (d < best) best = d;
        var pts;
        if (p.over) pts = 4;
        else pts = clamp(Math.round(20 * (1 - d / 50)), 0, 20);
        total += pts;
      }
      if (best === 999) best = 50;
      fin(total, [
        { label: "Plants in the green", value: happy * 20, text: happy + " of " + ROUNDS + " plants", good: happy >= 4 },
        { label: "Closest call", value: clamp(Math.round(100 - best * 2), 0, 100), text: best.toFixed(0) + " off the mark", good: best <= 5 },
        { label: "Plants not drowned", value: (ROUNDS - overCount) * 20, text: overCount + " drowned", good: overCount === 0 }
      ]);
    }
    function plantAt(x) {
      for (var i = 0; i < plants.length; i++) {
        if (Math.abs(x - plants[i].x) <= 48) return plants[i];
      }
      return null;
    }
    function inTapZone(x, y) { return x >= 20 && x <= 120 && y >= 110 && y <= 230; }
    mkPlants();
    return {
      status: function () {
        if (done) return "Time's up — how did the garden do?";
        var happy = 0;
        for (var i = 0; i < plants.length; i++) if (plants[i].level >= plants[i].lo && plants[i].level <= plants[i].hi) happy++;
        if (tank <= 1) return "The can is empty! Drag it to the tap on the left to refill.";
        return happy + " of " + ROUNDS + " plants happy — drag the can over the thirsty ones!";
      },
      down: function (p, now) {
        el(now);
        if (done) return;
        dragging = true;
        if (p && isFinite(p.x) && isFinite(p.y)) { px = clamp(p.x, 30, W - 30); py = clamp(p.y, 30, H - 30); }
        blip();
      },
      move: function (p, now) {
        if (!dragging || done) return;
        if (p && isFinite(p.x) && isFinite(p.y)) { px = clamp(p.x, 30, W - 30); py = clamp(p.y, 30, H - 30); }
      },
      up: function (p, now) {
        dragging = false;
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t >= LIMIT) finishAll();
        if (done) t = Math.min(t, LIMIT);
        var timeLeft = Math.max(0, LIMIT - t);
        // pouring / refilling
        var pouring = false, refilling = false;
        if (dragging && !done) {
          if (inTapZone(px, py)) {
            refilling = true;
            tank = Math.min(tankMax, tank + refillRate * dt);
          } else if (tank > 0) {
            pouring = true;
            tank = Math.max(0, tank - drainRate * dt);
            var pl = plantAt(px + 30);
            if (pl) {
              pl.level = Math.min(100, pl.level + pourRate * dt);
              if (!pl.inZone && pl.level >= pl.lo && pl.level <= pl.hi) { pl.inZone = true; sndGood(); }
              if (!pl.over && pl.level >= 96) { pl.over = true; overCount++; sndBad(); }
            }
            dropT -= dt;
            if (dropT <= 0) {
              dropT = 0.05;
              drops.push({ x: px + 52 + Math.random() * 8, y: py + 18, vy: 260 + Math.random() * 60, r: 2.5 + Math.random() * 2 });
              if (drops.length > 40) drops.shift();
            }
          }
          sndT -= dt;
          if (pouring && sndT <= 0) { sndT = 0.28; blip(); }
        }
        // update drops
        for (var di = drops.length - 1; di >= 0; di--) {
          drops[di].y += drops[di].vy * dt;
          if (drops[di].y > 330) drops.splice(di, 1);
        }
        // ---- background: sky, sun, fence, soil ----
        g.fillStyle = dark ? "#0c2d4d" : "#bae6fd"; g.fillRect(0, 0, W, 300);
        g.fillStyle = dark ? "#fde68a" : "#fde68a";
        g.beginPath(); g.arc(648, 52, 30, 0, 7); g.fill();
        g.fillStyle = dark ? "#fbbf24" : "#fbbf24";
        g.beginPath(); g.arc(648, 52, 22, 0, 7); g.fill();
        // clouds
        g.fillStyle = dark ? "#1e3a5f" : "#f0f9ff";
        g.beginPath(); g.arc(140, 60, 22, 0, 7); g.fill();
        g.beginPath(); g.arc(168, 60, 26, 0, 7); g.fill();
        g.beginPath(); g.arc(196, 60, 20, 0, 7); g.fill();
        g.beginPath(); g.arc(470, 96, 18, 0, 7); g.fill();
        g.beginPath(); g.arc(494, 96, 22, 0, 7); g.fill();
        // fence
        g.fillStyle = dark ? "#5b4636" : "#d6b48c";
        g.fillRect(0, 236, W, 10);
        g.fillRect(0, 268, W, 10);
        for (var fx = 30; fx < W; fx += 64) g.fillRect(fx, 226, 12, 62);
        // soil
        g.fillStyle = dark ? "#4a3220" : "#86c98a"; g.fillRect(0, 300, W, H - 300);
        g.fillStyle = dark ? "#3d2a1a" : "#a16207"; g.fillRect(0, 300, W, 8);
        // grass tufts
        g.strokeStyle = dark ? "#4ade80" : "#16a34a"; g.lineWidth = 2;
        for (var gx = 20; gx < W; gx += 46) {
          g.beginPath(); g.moveTo(gx, 308); g.lineTo(gx - 4, 298); g.moveTo(gx + 6, 308); g.lineTo(gx + 10, 297); g.stroke();
        }
        // ---- tap station (left) ----
        g.fillStyle = dark ? "#475569" : "#94a3b8"; g.fillRect(28, 110, 14, 120);
        g.fillStyle = dark ? "#64748b" : "#cbd5e1"; g.fillRect(28, 110, 54, 12);
        g.fillStyle = dark ? "#475569" : "#64748b"; g.fillRect(72, 122, 12, 26);
        g.fillStyle = "#38bdf8";
        if (refilling) {
          g.fillRect(74, 148, 7, 40);
          g.beginPath(); g.arc(77, 192, 5, 0, 7); g.fill();
          g.beginPath(); g.arc(70, 204, 4, 0, 7); g.fill();
        }
        g.fillStyle = dark ? "#f1f5f9" : "#0f172a";
        txt(g, "TAP", 62, 248, 13, dark ? "#f1f5f9" : "#0f172a");
        // refill hint arrow
        if (tank <= 25 && !done) {
          g.fillStyle = "#0284c7";
          g.beginPath(); g.moveTo(96, 150); g.lineTo(112, 158); g.lineTo(96, 166); g.closePath(); g.fill();
          txt(g, "refill here!", 96, 132, 13, "#0284c7");
        }
        // ---- plants ----
        for (var i = 0; i < plants.length; i++) {
          var p = plants[i];
          var potY = 330;
          var grow = p.level / 100;
          var stemH = 34 + grow * 62;
          var droop = p.over ? 14 : 0;
          var swayX = Math.sin(t * 1.6 + p.sway) * 3;
          var topX = p.x + swayX + droop, topY = potY - stemH;
          // gauge: thin vertical bar left of the pot
          var gx0 = p.x - 52, gy0 = 218, gh = 92;
          g.fillStyle = dark ? "#1e293b" : "#ffffff"; rr(g, gx0, gy0, 12, gh, 6); g.fill();
          g.fillStyle = "#16a34a"; rr(g, gx0, gy0 + gh - (p.hi / 100) * gh, 12, ((p.hi - p.lo) / 100) * gh, 6); g.fill();
          g.fillStyle = "#38bdf8"; rr(g, gx0, gy0 + gh - (p.level / 100) * gh, 12, (p.level / 100) * gh, 6); g.fill();
          g.strokeStyle = dark ? "#e2e8f0" : "#475569"; g.lineWidth = 1.5; rr(g, gx0, gy0, 12, gh, 6); g.stroke();
          // stem
          g.strokeStyle = p.over ? "#a16207" : "#16a34a"; g.lineWidth = 5;
          g.beginPath(); g.moveTo(p.x, potY); g.quadraticCurveTo(p.x + swayX, potY - stemH / 2, topX, topY); g.stroke();
          // leaves
          var leafY = potY - stemH * 0.55;
          g.fillStyle = p.over ? "#a16207" : "#22c55e";
          g.beginPath(); g.ellipse(p.x - 12, leafY, 13, 6, -0.5, 0, 7); g.fill();
          g.beginPath(); g.ellipse(p.x + 12, leafY - 8, 13, 6, 0.5, 0, 7); g.fill();
          if (grow > 0.55) {
            g.beginPath(); g.ellipse(p.x - 10, leafY - 22, 11, 5, -0.5, 0, 7); g.fill();
            g.beginPath(); g.ellipse(p.x + 10, leafY - 30, 11, 5, 0.5, 0, 7); g.fill();
          }
          // flower when in the green zone
          if (p.level >= p.lo && p.level <= p.hi) {
            g.fillStyle = p.color;
            for (var pet = 0; pet < 5; pet++) {
              var a = pet * 1.2566 + t * 0.4;
              g.beginPath(); g.arc(topX + Math.cos(a) * 8, topY + Math.sin(a) * 8, 6, 0, 7); g.fill();
            }
            g.fillStyle = "#fff7ed"; g.beginPath(); g.arc(topX, topY, 5, 0, 7); g.fill();
          } else if (p.over) {
            g.fillStyle = "#78350f";
            g.beginPath(); g.arc(topX, topY + 6, 6, 0, 7); g.fill();
          } else {
            g.fillStyle = p.color;
            g.beginPath(); g.arc(topX, topY, 5, 0, 7); g.fill();
          }
          // pot
          g.fillStyle = "#b45309"; rr(g, p.x - 34, potY, 68, 46, 6); g.fill();
          g.fillStyle = "#92400e"; g.fillRect(p.x - 34, potY, 68, 10);
          g.fillStyle = "#78350f"; rr(g, p.x - 38, potY - 8, 76, 12, 4); g.fill();
          // thirsty / drowned label
          if (p.over) txt(g, "drowned!", p.x, potY + 66, 12, "#dc2626");
          else if (p.level < p.lo) txt(g, "thirsty", p.x, potY + 66, 12, dark ? "#fca5a5" : "#b91c1c");
          else txt(g, "happy!", p.x, potY + 66, 12, "#16a34a");
        }
        // ---- water drops ----
        g.fillStyle = "#38bdf8";
        for (var d2 = 0; d2 < drops.length; d2++) {
          g.beginPath(); g.arc(drops[d2].x, drops[d2].y, drops[d2].r, 0, 7); g.fill();
        }
        // ---- watering can at pointer ----
        var cx = px, cy = py;
        g.fillStyle = dark ? "#0369a1" : "#0ea5e9";
        rr(g, cx - 34, cy - 16, 68, 34, 8); g.fill();
        g.fillStyle = dark ? "#075985" : "#0284c7"; g.fillRect(cx - 34, cy - 16, 68, 9);
        // spout
        g.fillStyle = dark ? "#0369a1" : "#0ea5e9";
        g.beginPath(); g.moveTo(cx + 30, cy + 2); g.lineTo(cx + 58, cy + 14); g.lineTo(cx + 54, cy + 24); g.lineTo(cx + 26, cy + 14); g.closePath(); g.fill();
        // handle
        g.strokeStyle = dark ? "#7dd3fc" : "#075985"; g.lineWidth = 5;
        g.beginPath(); g.arc(cx - 34, cy + 2, 12, 1.6, 4.7); g.stroke();
        // tank level on the can
        g.fillStyle = dark ? "#1e293b" : "#e0f2fe"; rr(g, cx - 26, cy + 8, 52, 6, 3); g.fill();
        g.fillStyle = "#38bdf8"; rr(g, cx - 26, cy + 8, 52 * (tank / tankMax), 6, 3); g.fill();
        // ---- HUD: timer + tank ----
        g.fillStyle = dark ? "#1e293b" : "#ffffff"; rr(g, 14, 12, 220, 30, 8); g.fill();
        g.fillStyle = "#0284c7"; rr(g, 20, 18, 150, 12, 6); g.fill();
        g.fillStyle = "#e0f2fe"; rr(g, 20, 18, 150 * (tank / tankMax), 12, 6); g.fill();
        txt(g, "WATER " + Math.round(tank) + "%", 196, 30, 13, dark ? "#e0f2fe" : "#0c4a6e");
        txt(g, Math.ceil(timeLeft) + "s", 360, 30, 20, dark ? "#f8fafc" : "#0f172a");
        g.fillStyle = dark ? "#334155" : "#e2e8f0"; rr(g, 250, 44, 220, 8, 4); g.fill();
        g.fillStyle = timeLeft <= 5 ? "#dc2626" : "#16a34a"; rr(g, 250, 44, 220 * (timeLeft / LIMIT), 8, 4); g.fill();
        txt(g, "green band = just right  •  blue = water level", 360, 70, 13, dark ? "#cbd5e1" : "#475569");
        if (!dragging && t < 2.5 && !done) {
          txt(g, "Drag the can over a plant to water it!", 360, 120, 19, dark ? "#fde68a" : "#92400e");
        }
        if (done) {
          txt(g, "Time's up! The garden thanks you.", 360, 120, 20, dark ? "#fde68a" : "#92400e");
        }
      }
    };
  }
});
