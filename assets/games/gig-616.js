// GoofGig #616 — Toss the Keys
// A tiny everyday gig: Five tosses, one bowl by the door, and a breeze with opinions. Land the keys where they belong.
registerGame({
  n: 616,
  title: "Toss the Keys",
  desc: "Five tosses, one bowl by the door, and a breeze with opinions. Land the keys where they belong.",
  hint: "Drag back from the keys and let go to toss. Mind the <b>breeze</b> — the bowl is smaller than it looks!",
  grades: [
    ["Key Master", "Five tosses, five clinks. The bowl never stood a chance."],
    ["Hallway Hero", "Mostly in the bowl, barely on the floor. The door salutes you."],
    ["Bowl Regular", "A few clinks, a few clatters. The bowl knows your name."],
    ["Floor Finder", "The rug caught more keys than the bowl did. The cat is unimpressed."],
    ["Keys on the Floor", "The bowl is right there. The keys are everywhere else."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fde68a"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#92400e"; g.fillRect(0, 62, 300, 30);
    g.fillStyle = "#7c2d12"; rr(g, 190, 46, 80, 20, 6); g.fill();
    g.fillStyle = "#38bdf8"; g.beginPath(); g.ellipse(230, 46, 30, 10, 0, 0, 7); g.fill();
    g.strokeStyle = "#64748b"; g.lineWidth = 4;
    g.beginPath(); g.arc(70, 34, 10, 0, 7); g.stroke();
    g.fillStyle = "#facc15"; g.fillRect(62, 42, 5, 16); g.fillRect(72, 42, 5, 12);
    g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(40, 20, 9, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 30;
    var t0 = -1, done = false;
    var THROWS = 5;
    var HAND_X = 100, HAND_Y = 300;
    var TABLE_Y = 356, FLOOR_Y = 396;
    var throwsUsed = 0, inBowl = 0, total = 0, bestDist = 999;
    var bx = 520, wind = 0;
    var phase = "aim"; // aim | fly | rest
    var kx = HAND_X, ky = HAND_Y, vx = 0, vy = 0, rot = 0, flyT = 0, restT = 0;
    var aiming = false, ax = 0, ay = 0;
    var flash = 0, flashTxt = "";
    var lastDist = -1, lastKind = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      fin(total, [
        { label: "Keys in the bowl", value: Math.round(inBowl / THROWS * 100), text: inBowl + " / " + THROWS, good: inBowl >= 3 },
        { label: "Best landing", value: bestDist < 999 ? Math.round(clamp(1 - bestDist / 200, 0, 1) * 100) : 0, text: bestDist < 999 ? Math.round(bestDist) + " px off" : "no throw", good: bestDist <= 28 },
        { label: "Throws used", value: Math.round(throwsUsed / THROWS * 100), text: throwsUsed + " / " + THROWS, good: throwsUsed === THROWS }
      ]);
    }
    function nextThrow() {
      if (throwsUsed >= THROWS) { finishAll(0); return; }
      throwsUsed++;
      bx = 430 + Math.random() * 200;
      wind = Math.round((Math.random() - 0.5) * 90);
      kx = HAND_X; ky = HAND_Y; vx = 0; vy = 0; rot = 0;
      phase = "aim"; aiming = false;
      lastDist = -1; lastKind = "";
    }
    function resolveThrow() {
      var d = Math.abs(kx - bx);
      lastDist = d;
      if (d < bestDist) bestDist = d;
      var pts = 0, kind = "";
      if (d <= 28) { pts = 20; kind = "IN THE BOWL!"; inBowl++; blip(990, 0.08); sndGood(); }
      else if (d <= 70) { pts = 8; kind = "On the table."; blip(660, 0.05); }
      else if (d <= 120) { pts = 4; kind = "So close!"; blip(520, 0.05); }
      else { pts = 0; kind = "Floor again..."; sndBad(); }
      total += pts;
      lastKind = kind + " +" + pts;
      flash = 1.1; flashTxt = lastKind;
      phase = "rest"; restT = 0;
    }
    nextThrow();
    return {
      status: function () {
        if (done) return "All tossed! Did the bowl win, or did you?";
        if (phase === "aim") return "Throw " + throwsUsed + " / " + THROWS + " — drag back from the keys, let go to toss!";
        if (phase === "fly") return "Keys in the air...";
        return lastKind || "Nice toss!";
      },
      down: function (p, now) {
        el(now);
        if (done || phase !== "aim" || !p) return;
        if (Math.hypot(p.x - kx, p.y - ky) < 70) { aiming = true; ax = p.x; ay = p.y; }
      },
      move: function (p, now) {
        if (!aiming || done || phase !== "aim" || !p) return;
        ax = clamp(p.x, 10, 710); ay = clamp(p.y, 60, 430);
      },
      up: function (p, now) {
        if (!aiming || done || phase !== "aim") { aiming = false; return; }
        aiming = false;
        var dx = kx - ax, dy = ky - ay;
        var power = Math.hypot(dx, dy);
        if (power < 18) return;
        var maxV = 560;
        vx = clamp(dx * 4.4, -maxV, maxV);
        vy = clamp(dy * 4.4, -maxV, 320);
        if (vy > -60) vy = -60;
        phase = "fly"; flyT = 0;
        blip(440, 0.05);
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t >= LIMIT) finishAll(now);
        if (done) t = Math.min(t, LIMIT);
        // flight physics
        if (!done && phase === "fly") {
          flyT += dt;
          vy += 980 * dt;
          vx += wind * dt;
          kx += vx * dt; ky += vy * dt;
          rot += dt * 9;
          if (ky >= TABLE_Y && vy > 0 && kx > bx - 90 && kx < bx + 90 && kx > 330) {
            // reached table height over the table: bowl or tabletop
            ky = TABLE_Y; resolveThrow();
          } else if (ky >= FLOOR_Y) {
            ky = FLOOR_Y; resolveThrow();
          } else if (kx > 730 || kx < -20 || flyT > 4) {
            kx = clamp(kx, 0, 720); ky = Math.min(ky, FLOOR_Y); resolveThrow();
          }
        }
        if (!done && phase === "rest") {
          restT += dt;
          if (restT > 0.9) nextThrow();
        }
        // hallway scene
        g.fillStyle = dark ? "#1b2a3a" : "#fde68a"; g.fillRect(0, 0, W, H);
        g.fillStyle = dark ? "#243447" : "#fef3c7"; g.fillRect(0, 0, W, 300);
        // door (left)
        g.fillStyle = dark ? "#3b2f23" : "#b45309"; rr(g, 18, 90, 92, 210, 6); g.fill();
        g.fillStyle = dark ? "#57432c" : "#d97706"; rr(g, 30, 104, 68, 182, 4); g.fill();
        g.fillStyle = "#facc15"; g.beginPath(); g.arc(90, 200, 6, 0, 7); g.fill();
        // window light
        g.fillStyle = dark ? "#1e3a5f" : "#bae6fd"; rr(g, 560, 40, 130, 110, 6); g.fill();
        g.fillStyle = dark ? "#243447" : "#ffffff";
        g.fillRect(620, 40, 6, 110); g.fillRect(560, 90, 130, 6);
        // wall clock
        g.fillStyle = dark ? "#e2e8f0" : "#ffffff"; g.beginPath(); g.arc(300, 80, 26, 0, 7); g.fill();
        g.strokeStyle = "#1e293b"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(300, 80); g.lineTo(300, 62); g.moveTo(300, 80); g.lineTo(314, 84); g.stroke();
        // floor + rug
        g.fillStyle = dark ? "#2c2118" : "#92400e"; g.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);
        g.fillStyle = dark ? "#7f1d1d" : "#dc2626"; rr(g, 330, 372, 340, 34, 8); g.fill();
        g.fillStyle = dark ? "#991b1b" : "#fca5a5"; rr(g, 350, 380, 300, 18, 6); g.fill();
        // side table + bowl
        g.fillStyle = dark ? "#4a3524" : "#78350f"; g.fillRect(bx - 80, TABLE_Y, 160, 12);
        g.fillRect(bx - 70, TABLE_Y + 12, 10, 28); g.fillRect(bx + 60, TABLE_Y + 12, 10, 28);
        g.fillStyle = "#38bdf8"; g.beginPath(); g.ellipse(bx, TABLE_Y, 34, 12, 0, 0, 7); g.fill();
        g.fillStyle = "#bae6fd"; g.beginPath(); g.ellipse(bx, TABLE_Y - 2, 24, 7, 0, 0, 7); g.fill();
        // breeze arrow
        g.fillStyle = dark ? "#e2e8f0" : "#475569";
        var wdir = wind >= 0 ? 1 : -1;
        txt(g, wind === 0 ? "calm air" : (wind > 0 ? "breeze >>>" : "<<< breeze"), 360, 30, 15, dark ? "#e2e8f0" : "#475569");
        if (wind !== 0) {
          g.strokeStyle = dark ? "#7dd3fc" : "#0284c7"; g.lineWidth = 3;
          g.beginPath(); g.moveTo(360 - 30 * wdir, 48); g.lineTo(360 + 30 * wdir, 48); g.stroke();
          g.beginPath(); g.moveTo(360 + 30 * wdir, 48); g.lineTo(360 + 20 * wdir, 42); g.moveTo(360 + 30 * wdir, 48); g.lineTo(360 + 20 * wdir, 54); g.stroke();
        }
        // aim guide while dragging
        if (aiming && phase === "aim") {
          var ddx = kx - ax, ddy = ky - ay;
          var pw = clamp(Math.hypot(ddx, ddy) / 140, 0, 1);
          g.strokeStyle = pw > 0.7 ? "#dc2626" : "#16a34a"; g.lineWidth = 4;
          g.beginPath(); g.moveTo(kx, ky); g.lineTo(kx + ddx * 0.9, ky + ddy * 0.9); g.stroke();
          g.fillStyle = pw > 0.7 ? "#dc2626" : "#16a34a";
          g.beginPath(); g.arc(kx + ddx * 0.9, ky + ddy * 0.9, 6, 0, 7); g.fill();
          txt(g, Math.round(pw * 100) + "% power", kx + 60, ky - 40, 14, dark ? "#e2e8f0" : "#1e293b");
        }
        // keys (ring + 3 keys), spinning while flying
        g.save();
        g.translate(kx, ky);
        if (phase === "fly") g.rotate(rot);
        g.strokeStyle = "#64748b"; g.lineWidth = 4;
        g.beginPath(); g.arc(0, 0, 11, 0, 7); g.stroke();
        g.fillStyle = "#facc15";
        g.fillRect(-2, 8, 5, 18); g.fillRect(6, 6, 5, 14); g.fillRect(-11, 6, 5, 14);
        g.fillStyle = "#eab308";
        g.fillRect(-2, 22, 8, 3); g.fillRect(6, 16, 8, 3); g.fillRect(-11, 16, 8, 3);
        g.restore();
        // hand at the throw spot
        if (phase === "aim") {
          g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(HAND_X - 34, HAND_Y + 6, 12, 0, 7); g.fill();
          g.fillStyle = "#2563eb"; rr(g, HAND_X - 52, HAND_Y + 2, 22, 30, 6); g.fill();
        }
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 130, 28, dark ? "#fde68a" : "#b45309"); }
        txt(g, "In the bowl: " + inBowl + " / " + THROWS + "    Score: " + total, 360, 168, 17, dark ? "#e2e8f0" : "#1e293b");
        if (lastDist >= 0 && phase !== "fly") txt(g, "Last landing: " + Math.round(lastDist) + " px from the bowl", 360, 196, 14, dark ? "#94a3b8" : "#64748b");
        // timer (bar at the very bottom, text above it — never overlapping)
        var tl = clamp(1 - t / LIMIT, 0, 1);
        txt(g, "Time left: " + Math.max(0, Math.ceil(LIMIT - t)) + "s", 360, 330, 13, dark ? "#e2e8f0" : "#1e293b");
        g.fillStyle = dark ? "#223140" : "#e0f2fe"; rr(g, 160, H - 22, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#16a34a" : "#dc2626"; rr(g, 160, H - 22, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
