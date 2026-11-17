// GoofGig #609 — Skim the Stone
// A tiny everyday gig: Pull back, let fly, count the skips. Flat stones only.
registerGame({
  n: 609,
  title: "Skim the Stone",
  desc: "Pull back, let fly, count the skips. Flat stones only.",
  hint: "Drag back from the stone to aim, release to throw — shallow and fast skips furthest.",
  grades: [
    ["Skip Master", "That stone skipped into legend. The ducks are taking notes."],
    ["Lake Legend", "A beautiful run of skips. The lake applauds."],
    ["Pond Skimmer", "A few honest skips. The stone is proud."],
    ["Plop Artist", "One skip, then a very confident plop."],
    ["Stone Sinker", "Straight down. The fish didn't even look up."]
  ],
  thumb: function (g) {
    g.fillStyle = "#bae6fd"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#38bdf8"; g.fillRect(0, 56, 300, 36);
    g.fillStyle = "#ffffff";
    g.beginPath(); g.ellipse(90, 62, 14, 3, 0, 0, 7); g.fill();
    g.beginPath(); g.ellipse(140, 62, 18, 3, 0, 0, 7); g.fill();
    g.beginPath(); g.ellipse(200, 62, 14, 3, 0, 0, 7); g.fill();
    g.fillStyle = "#64748b"; g.beginPath(); g.ellipse(240, 40, 12, 7, -0.3, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 20, STONES = 3, WATER_Y = 330;
    var t0 = -1, done = false;
    var stonesLeft = STONES, bestSkips = 0, totalSkips = 0;
    var aiming = false, aimStart = null, aimCur = null;
    var stone = null; // {x,y,vx,vy,skips,alive}
    var ripples = [], flash = 0, flashTxt = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var score = bestSkips * 11 + totalSkips * 3 + (stonesLeft > 0 ? 0 : 0);
      if (totalSkips === 0) score = 5;
      fin(score, [
        { label: "Best throw", value: Math.round(clamp(bestSkips / 7, 0, 1) * 100), text: bestSkips + " skips", good: bestSkips >= 4 },
        { label: "Total skips", value: Math.round(clamp(totalSkips / 12, 0, 1) * 100), text: totalSkips + " skips in " + STONES + " throws", good: totalSkips >= 8 }
      ]);
    }
    function newStone() { return { x: 90, y: 300, vx: 0, vy: 0, skips: 0, alive: false }; }
    stone = newStone();
    return {
      status: function () {
        return done ? "The lake is calm again." : "Stones left: " + stonesLeft + " — best: " + bestSkips + " skips";
      },
      down: function (p, now) {
        el(now); if (done || stonesLeft <= 0) return;
        if (!stone.alive && dist(p.x, p.y, stone.x, stone.y) < 60) {
          aiming = true; aimStart = { x: p.x, y: p.y }; aimCur = { x: p.x, y: p.y };
        }
      },
      move: function (p, now) { if (aiming) aimCur = { x: p.x, y: p.y }; },
      up: function (p, now) {
        if (!aiming || done) return;
        aiming = false;
        var dx = aimStart.x - aimCur.x, dy = aimStart.y - aimCur.y;
        var power = Math.hypot(dx, dy);
        if (power < 25) return; // too weak to throw
        stone.alive = true;
        stone.vx = clamp(dx * 4.2, 120, 620);
        stone.vy = clamp(dy * 4.2, -260, 120);
        stonesLeft--;
        blip(500, 0.06);
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        if (!done && stonesLeft === 0 && !stone.alive && !aiming) finishAll(now);
        // stone physics
        if (stone.alive) {
          stone.vy += 600 * dt;
          stone.x += stone.vx * dt; stone.y += stone.vy * dt;
          if (stone.y >= WATER_Y && stone.vy > 0) {
            var shallow = Math.abs(stone.vy) < 300 && stone.vx > 150;
            ripples.push({ x: stone.x, y: WATER_Y, r: 4, a: 1 });
            if (shallow) {
              stone.skips++;
              stone.y = WATER_Y - 2;
              stone.vy = -stone.vy * 0.55;
              stone.vx *= 0.82;
              blip(600 + stone.skips * 60, 0.05);
            } else {
              stone.alive = false;
              totalSkips += stone.skips;
              bestSkips = Math.max(bestSkips, stone.skips);
              flash = 0.9; flashTxt = stone.skips > 0 ? stone.skips + " skips!" : "Plop!";
              if (stone.skips > 0) sndGood(); else sndBad();
              stone = newStone();
            }
          }
          if (stone.x > 730 || stone.y > 440) {
            stone.alive = false;
            totalSkips += stone.skips;
            bestSkips = Math.max(bestSkips, stone.skips);
            flash = 0.9; flashTxt = stone.skips + " skips — out of the lake!";
            stone = newStone();
          }
        }
        // scene
        g.fillStyle = dark ? "#12233a" : "#bae6fd"; g.fillRect(0, 0, W, H);
        g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(640, 66, 28, 0, 7); g.fill();
        g.fillStyle = dark ? "#1e3a2a" : "#86efac"; g.fillRect(0, 300, 120, 140);
        g.fillStyle = dark ? "#1d4e6b" : "#38bdf8"; g.fillRect(0, WATER_Y, W, 110);
        g.strokeStyle = dark ? "#7dd3fc" : "#ffffff"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(0, WATER_Y); g.lineTo(W, WATER_Y); g.stroke();
        // ripples
        ripples = ripples.filter(function (r) { return r.a > 0; });
        ripples.forEach(function (r) {
          r.r += 60 * dt; r.a -= dt * 1.4;
          g.strokeStyle = "rgba(255,255,255," + clamp(r.a, 0, 1) + ")";
          g.beginPath(); g.ellipse(r.x, r.y, r.r, r.r * 0.25, 0, 0, 7); g.stroke();
        });
        // aim guide
        if (aiming && aimStart) {
          var dx = aimStart.x - aimCur.x, dy = aimStart.y - aimCur.y;
          g.strokeStyle = "#f59e0b"; g.lineWidth = 3; g.setLineDash([6, 5]);
          g.beginPath(); g.moveTo(stone.x, stone.y);
          g.lineTo(stone.x + clamp(dx * 1.2, -160, 160), stone.y + clamp(dy * 1.2, -120, 120)); g.stroke(); g.setLineDash([]);
          txt(g, "power " + Math.round(clamp(Math.hypot(dx, dy) / 150 * 100, 0, 100)) + "%", stone.x + 60, stone.y - 40, 16, "#b45309");
        }
        // stone
        if (!stone.alive) {
          g.fillStyle = "#64748b";
          g.beginPath(); g.ellipse(stone.x, stone.y, 16, 9, -0.2, 0, 7); g.fill();
          if (stonesLeft > 0 && !aiming) txt(g, "grab the stone!", stone.x + 70, stone.y - 30, 16, dark ? "#94a3b8" : "#64748b");
        } else {
          g.save(); g.translate(stone.x, stone.y); g.rotate(Math.atan2(stone.vy, stone.vx));
          g.fillStyle = "#475569"; g.beginPath(); g.ellipse(0, 0, 16, 8, 0, 0, 7); g.fill();
          g.restore();
          txt(g, "skips: " + stone.skips, stone.x, stone.y - 26, 16, dark ? "#e2e8f0" : "#334155");
        }
        // stones left
        for (var i = 0; i < STONES; i++) {
          g.fillStyle = i < stonesLeft ? "#64748b" : (dark ? "#33506b" : "#cbd5e1");
          g.beginPath(); g.ellipse(60 + i * 34, 40, 13, 7, 0, 0, 7); g.fill();
        }
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 90, 28, flashTxt.indexOf("Plop") === 0 ? "#0284c7" : "#16a34a"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#0284c7" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
