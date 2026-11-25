// GoofGig #619 — Lunch Tray Balance
// A tiny everyday gig: Carry five dishes across the cafeteria. The tray tilts, the bumps come, the floor is hungry.
registerGame({
  n: 619,
  title: "Lunch Tray Balance",
  desc: "Carry five dishes across the cafeteria. The tray tilts, the bumps come, the floor is hungry.",
  hint: "Move to <b>keep the tray level</b> — glide, don't jerk. When a bump hits, ease back to center before the dishes slide off!",
  grades: [
    ["Cafeteria Legend", "Five dishes, zero spills. The lunch ladies are applauding."],
    ["Steady Server", "A smooth crossing and a full tray. The floor got nothing."],
    ["Tray Survivor", "Most dishes made it. One or two fed the floor instead."],
    ["Wobbly Waiter", "The tray survived, mostly. The floor ate well today."],
    ["Floor Feast", "The cafeteria floor thanks you for the five-course meal."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fef3c7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#b45309"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "#92400e"; g.fillRect(52, 30, 18, 44); g.fillRect(92, 30, 18, 44);
    g.fillStyle = "#78350f"; g.fillRect(48, 26, 206, 8);
    // tray
    g.fillStyle = "#d6d3d1"; rr(g, 92, 46, 140, 10, 5); g.fill();
    g.strokeStyle = "#78716c"; g.lineWidth = 2; rr(g, 92, 46, 140, 10, 5); g.stroke();
    // apple
    g.fillStyle = "#dc2626"; g.beginPath(); g.arc(120, 36, 9, 0, 7); g.fill();
    g.fillStyle = "#16a34a"; g.fillRect(118, 24, 3, 6);
    // milk carton
    g.fillStyle = "#ffffff"; g.fillRect(150, 22, 16, 24); g.fillStyle = "#2563eb"; g.fillRect(150, 30, 16, 5);
    // sandwich
    g.fillStyle = "#fbbf24"; g.beginPath(); g.moveTo(182, 46); g.lineTo(196, 26); g.lineTo(210, 46); g.closePath(); g.fill();
    // juice box
    g.fillStyle = "#f97316"; g.fillRect(220, 26, 14, 20); g.fillStyle = "#fde68a"; g.fillRect(224, 20, 3, 6);
    // hand under tray
    g.fillStyle = "#f2c89b"; g.beginPath(); g.ellipse(162, 62, 26, 9, 0, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 20;
    var t0 = -1, done = false;
    var trayX = 360, targetX = 360;
    var tilt = 0, tiltVel = 0;
    var wobble = 0, wobbleT = 0;
    var bumpT = 2.2, bumps = 0, bumpsTotal = 0, bumpActive = false, keptAtBump = 5;
    var flash = 0, flashTxt = "";
    var tiltSum = 0, tiltN = 0;
    var items = [
      { kind: "apple", off: -72, fall: -1, fy: 0, fvy: 0 },
      { kind: "milk", off: -36, fall: -1, fy: 0, fvy: 0 },
      { kind: "sandwich", off: 0, fall: -1, fy: 0, fvy: 0 },
      { kind: "juice", off: 36, fall: -1, fy: 0, fvy: 0 },
      { kind: "cookie", off: 72, fall: -1, fy: 0, fvy: 0 }
    ];
    var tables = [];
    for (var ti = 0; ti < 8; ti++) tables.push({ x: ti * 130 + 40, top: ti % 2 === 0 });
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function kept() { var k = 0; for (var i = 0; i < items.length; i++) if (items[i].fall < 0) k++; return k; }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var k = kept();
      var avgTilt = tiltN > 0 ? tiltSum / tiltN : 0;
      var balScore = clamp(30 - avgTilt * 90, 0, 30);
      var score = k * 14 + balScore;
      fin(score, [
        { label: "Dishes saved", value: Math.round(k / 5 * 100), text: k + " of 5 dishes", good: k >= 4 },
        { label: "Balance", value: Math.round(clamp(1 - avgTilt / 0.35, 0, 1) * 100), text: "avg tilt " + avgTilt.toFixed(2), good: avgTilt < 0.12 },
        { label: "Bumps ridden out", value: bumpsTotal > 0 ? Math.round(bumps / bumpsTotal * 100) : 100, text: bumps + " of " + bumpsTotal + " bumps", good: bumps >= bumpsTotal - 1 }
      ]);
    }
    function steer(p) { if (!p) return; targetX = clamp(p.x, 90, 630); }
    function drawItem(g, kind, x, y) {
      if (kind === "apple") {
        g.fillStyle = "#dc2626"; g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill();
        g.fillStyle = "#16a34a"; g.fillRect(x - 1, y - 18, 3, 7);
        g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(x - 4, y - 4, 3, 0, 7); g.fill();
      } else if (kind === "milk") {
        g.fillStyle = "#ffffff"; g.fillRect(x - 10, y - 24, 20, 24);
        g.strokeStyle = "#94a3b8"; g.lineWidth = 2; g.strokeRect(x - 10, y - 24, 20, 24);
        g.fillStyle = "#2563eb"; g.fillRect(x - 10, y - 12, 20, 6);
        g.fillStyle = "#93c5fd"; g.beginPath(); g.moveTo(x - 10, y - 24); g.lineTo(x - 4, y - 30); g.lineTo(x + 4, y - 30); g.lineTo(x + 10, y - 24); g.closePath(); g.fill();
      } else if (kind === "sandwich") {
        g.fillStyle = "#fbbf24"; g.beginPath(); g.moveTo(x - 16, y); g.lineTo(x, y - 20); g.lineTo(x + 16, y); g.closePath(); g.fill();
        g.fillStyle = "#16a34a"; g.fillRect(x - 14, y - 6, 28, 4);
        g.fillStyle = "#f59e0b"; g.beginPath(); g.moveTo(x - 16, y); g.lineTo(x, y - 20); g.lineTo(x + 16, y); g.closePath(); g.stroke();
      } else if (kind === "juice") {
        g.fillStyle = "#f97316"; g.fillRect(x - 9, y - 22, 18, 22);
        g.strokeStyle = "#9a3412"; g.lineWidth = 2; g.strokeRect(x - 9, y - 22, 18, 22);
        g.fillStyle = "#fde68a"; g.fillRect(x + 2, y - 30, 3, 9);
        g.fillStyle = "#fff7ed"; g.beginPath(); g.arc(x, y - 10, 4, 0, 7); g.fill();
      } else {
        g.fillStyle = "#b45309"; g.beginPath(); g.arc(x, y - 6, 11, 0, 7); g.fill();
        g.fillStyle = "#78350f";
        g.beginPath(); g.arc(x - 4, y - 8, 2, 0, 7); g.fill();
        g.beginPath(); g.arc(x + 4, y - 4, 2, 0, 7); g.fill();
        g.beginPath(); g.arc(x, y - 10, 2, 0, 7); g.fill();
      }
    }
    return {
      status: function () {
        return done ? "You reached the table — how many dishes survived?" : "Keep the tray level and ride out the bumps. " + kept() + " of 5 dishes still on board.";
      },
      down: function (p, now) { el(now); steer(p); },
      move: function (p, now) { steer(p); },
      up: function (p, now) {},
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t >= LIMIT) finishAll(now);
        if (done) t = Math.min(t, LIMIT);
        if (flash > 0) flash -= dt;
        // tray follows pointer; tilt from speed + wobble
        var oldX = trayX;
        trayX += (targetX - trayX) * Math.min(1, dt * 8);
        trayX = clamp(trayX, 90, 630);
        var vx = (trayX - oldX) / Math.max(dt, 0.001);
        var tiltTarget = clamp(vx * 0.00045, -0.35, 0.35) + wobble;
        tilt += (tiltTarget - tilt) * Math.min(1, dt * 10);
        if (wobbleT > 0) { wobbleT -= dt; if (wobbleT <= 0) wobble = 0; }
        // bumps
        if (!done) {
          bumpT -= dt;
          if (bumpT <= 0) {
            bumpsTotal++;
            bumpActive = true; keptAtBump = kept();
            wobble = (Math.random() < 0.5 ? -1 : 1) * (0.22 + Math.random() * 0.14);
            wobbleT = 0.9;
            flash = 0.9; flashTxt = "Bump! Someone just walked into you!";
            sndBad();
            bumpT = 2.2 + Math.random() * 1.2;
          }
          tiltSum += Math.abs(tilt); tiltN++;
        }
        // items slide with tilt; fall off the edge
        for (var i = 0; i < items.length; i++) {
          var it = items[i];
          if (it.fall >= 0) {
            it.fvy += 900 * dt;
            it.fy += it.fvy * dt;
            continue;
          }
          if (!done) {
            it.off += tilt * 260 * dt;
            if (it.off > 96 || it.off < -96) {
              it.fall = 1; it.fy = 0; it.fvy = 40;
              flash = 0.8; flashTxt = "A dish hit the floor!";
              sndBad();
            }
          }
        }
        // a bump counts as ridden out if no dish fell while it lasted
        if (bumpActive && wobbleT <= 0) {
          bumpActive = false;
          if (kept() === keptAtBump) bumps++;
        }
        // background: cafeteria
        g.fillStyle = dark ? "#1e293b" : "#fef3c7"; g.fillRect(0, 0, W, H);
        g.fillStyle = dark ? "#334155" : "#fde68a"; g.fillRect(0, 0, W, 70);
        g.fillStyle = dark ? "#475569" : "#fbbf24"; g.fillRect(0, 70, W, 6);
        // passing tables (scrolling)
        for (var k = 0; k < tables.length; k++) {
          var tb = tables[k];
          tb.x -= dt * 55;
          if (tb.x < -90) tb.x += 8 * 130;
          var ty = tb.top ? 96 : 300;
          g.fillStyle = dark ? "#475569" : "#d97706";
          g.fillRect(tb.x - 52, ty, 104, 10);
          g.fillStyle = dark ? "#334155" : "#b45309";
          g.fillRect(tb.x - 46, ty + 10, 8, 26);
          g.fillRect(tb.x + 38, ty + 10, 8, 26);
          g.fillStyle = dark ? "#64748b" : "#f59e0b";
          g.beginPath(); g.arc(tb.x - 20, ty - 12, 8, 0, 7); g.fill();
          g.beginPath(); g.arc(tb.x + 22, ty - 10, 7, 0, 7); g.fill();
        }
        // floor
        g.fillStyle = dark ? "#0f172a" : "#e7c98a"; g.fillRect(0, 380, W, 60);
        g.fillStyle = dark ? "#1e293b" : "#d9b06a";
        for (var fx = 0; fx < 9; fx++) g.fillRect(fx * 90, 380, 2, 60);
        // progress bar: distance across the cafeteria
        var prog = clamp(t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#334155" : "#fff7ed"; rr(g, 180, 84, 360, 12, 6); g.fill();
        g.fillStyle = "#16a34a"; rr(g, 180, 84, 360 * prog, 12, 6); g.fill();
        txt(g, "Table " + Math.round(prog * 100) + "% — " + Math.max(0, Math.ceil(LIMIT - t)) + "s to go", 360, 80, 13, dark ? "#e2e8f0" : "#78350f");
        txt(g, "Dishes on tray: " + kept() + " / 5", 360, 116, 17, dark ? "#f1f5f9" : "#451a03");
        if (flash > 0) txt(g, flashTxt, 360, 150, 22, "#dc2626");
        if (!done && t < 1.5) txt(g, "Move to keep the tray level — glide, don't jerk!", 360, 176, 19, dark ? "#fde68a" : "#92400e");
        // tray (tilted) + hand
        var trayY = 330;
        g.fillStyle = "#f2c89b";
        g.beginPath(); g.ellipse(trayX, trayY + 30, 30, 12, 0, 0, 7); g.fill();
        g.save();
        g.translate(trayX, trayY);
        g.rotate(tilt);
        g.fillStyle = "#d6d3d1"; rr(g, -100, -6, 200, 12, 6); g.fill();
        g.strokeStyle = "#78716c"; g.lineWidth = 2; rr(g, -100, -6, 200, 12, 6); g.stroke();
        for (var j = 0; j < items.length; j++) {
          var itm = items[j];
          if (itm.fall < 0) drawItem(g, itm.kind, itm.off, -6);
        }
        g.restore();
        // falling dishes
        for (var m = 0; m < items.length; m++) {
          var fi = items[m];
          if (fi.fall >= 0 && fi.fy < 130) {
            g.save();
            g.translate(trayX + fi.off, trayY + fi.fy);
            g.rotate(tilt + fi.fy * 0.02);
            drawItem(g, fi.kind, 0, 0);
            g.restore();
          }
        }
        // tilt meter
        g.fillStyle = dark ? "#334155" : "#fff7ed"; rr(g, 260, 396, 200, 10, 5); g.fill();
        var tiltFrac = clamp((tilt + 0.35) / 0.7, 0, 1);
        g.fillStyle = Math.abs(tilt) > 0.22 ? "#dc2626" : Math.abs(tilt) > 0.12 ? "#f59e0b" : "#16a34a";
        rr(g, 260, 396, 200 * tiltFrac, 10, 5); g.fill();
        g.fillStyle = "#16a34a"; g.fillRect(356, 392, 8, 18);
        txt(g, "TILT — keep the marker in the green", 360, 420, 12, dark ? "#e2e8f0" : "#78350f");
      }
    };
  }
});
