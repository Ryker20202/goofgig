// GoofGig #618 — Hold the Sparkler
// A tiny everyday gig: Hold to burn the sparkler, steer the sparks into the jar. Too hot and it flares out.
registerGame({
  n: 618,
  title: "Hold the Sparkler",
  desc: "Hold to burn the sparkler, steer the sparks into the jar. Too hot and it flares out.",
  hint: "Press and <b>hold</b> to burn — drag to steer the sparkler under the jar. Ease off before the heat bar maxes out or it flares!",
  grades: [
    ["Sparkler Superstar", "Every spark found its jar. The night sky is taking notes."],
    ["Firework Whisperer", "A jar full of sparks and not a single singed finger."],
    ["Steady Sparker", "Most sparks caught, a few escaped to join the stars."],
    ["Flickering Amateur", "The sparkler burned, the jar stayed hungry, the wind laughed."],
    ["Damp Squib", "The sparkler flared, the sparks fled, and the jar is still empty."]
  ],
  thumb: function (g) {
    g.fillStyle = "#0f172a"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#fde68a"; g.beginPath(); g.arc(40, 18, 10, 0, 7); g.fill();
    g.fillStyle = "#ffffff";
    g.fillRect(70, 12, 2, 2); g.fillRect(120, 26, 2, 2); g.fillRect(180, 10, 2, 2); g.fillRect(250, 30, 2, 2);
    g.fillStyle = "rgba(186, 230, 253, 0.5)"; rr(g, 205, 8, 56, 40, 8); g.fill();
    g.strokeStyle = "#bae6fd"; g.lineWidth = 2; rr(g, 205, 8, 56, 40, 8); g.stroke();
    g.strokeStyle = "#fbbf24"; g.lineWidth = 4;
    g.beginPath(); g.moveTo(110, 88); g.lineTo(150, 34); g.stroke();
    g.fillStyle = "#fde047"; g.beginPath(); g.arc(150, 32, 7, 0, 7); g.fill();
    g.fillStyle = "#f59e0b";
    g.beginPath(); g.arc(168, 22, 3, 0, 7); g.fill();
    g.beginPath(); g.arc(186, 30, 3, 0, 7); g.fill();
    g.beginPath(); g.arc(196, 18, 3, 0, 7); g.fill();
    g.beginPath(); g.arc(214, 26, 3, 0, 7); g.fill();
    g.fillStyle = "#fde68a";
    g.beginPath(); g.arc(176, 14, 2, 0, 7); g.fill();
    g.beginPath(); g.arc(205, 34, 2, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 15;
    var t0 = -1, done = false;
    var holding = false, flaring = false, flareT = 0;
    var heat = 0, heldTime = 0;
    var sx = 360, targetX = 360;
    var TIP_Y = 330;
    var sparks = [];
    var spawnT = 0, spawnGap = 0.08;
    var caught = 0, streak = 0, bestStreak = 0;
    var flash = 0, flashTxt = "";
    var stars = [];
    for (var si = 0; si < 46; si++) {
      stars.push({ x: 20 + Math.random() * 680, y: 12 + Math.random() * 220, r: 1 + Math.random() * 1.6, tw: Math.random() * 6 });
    }
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var score = caught * 1.5;
      fin(score, [
        { label: "Sparks caught", value: Math.round(clamp(caught / 50, 0, 1) * 100), text: caught + " sparks", good: caught >= 25 },
        { label: "Best streak", value: Math.round(clamp(bestStreak / 12, 0, 1) * 100), text: bestStreak + " in a row", good: bestStreak >= 6 },
        { label: "Time burning", value: Math.round(clamp(heldTime / LIMIT, 0, 1) * 100), text: heldTime.toFixed(1) + "s held", good: heldTime >= 8 }
      ]);
    }
    function jarX(t) { return 360 + Math.sin(t * 0.45) * 240; }
    function spawnSpark() {
      sparks.push({
        x: sx + (Math.random() - 0.5) * 10,
        y: TIP_Y - 6,
        vx: (Math.random() - 0.5) * 30,
        vy: -(240 + Math.random() * 90),
        life: 1.1,
        r: 1.5 + Math.random() * 2
      });
    }
    function steer(p) {
      if (!p) return;
      targetX = clamp(p.x, 60, 660);
    }
    return {
      status: function () {
        return done ? "The sparkler is out — how full is your jar?" : "Hold to burn, steer under the jar. Ease off before the heat bar maxes out!";
      },
      down: function (p, now) { el(now); holding = true; steer(p); },
      move: function (p, now) { if (holding) steer(p); },
      up: function (p, now) { holding = false; },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t >= LIMIT) finishAll(now);
        if (done) t = Math.min(t, LIMIT);
        if (flash > 0) flash -= dt;
        // steer + heat
        sx += (targetX - sx) * Math.min(1, dt * 10);
        sx = clamp(sx, 60, 660);
        if (flaring) {
          flareT -= dt;
          heat = 35;
          if (flareT <= 0) flaring = false;
        } else if (!done && holding) {
          heat += 55 * dt;
          heldTime += dt;
          if (heat >= 100) {
            heat = 100; flaring = true; flareT = 1.2;
            streak = 0;
            flash = 1.2; flashTxt = "Too hot! It flared out!";
            sndBad();
          }
        } else {
          heat -= 70 * dt;
          if (heat < 0) heat = 0;
        }
        // spawn sparks
        if (!done && holding && !flaring) {
          spawnT -= dt;
          if (spawnT <= 0) { spawnSpark(); spawnT = spawnGap; }
        }
        var jx = jarX(t);
        // update sparks
        for (var i = sparks.length - 1; i >= 0; i--) {
          var s = sparks[i];
          s.life -= dt;
          s.vy += 45 * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (!done && s.life > 0 && s.y < 118 && s.y > 56 && Math.abs(s.x - jx) < 52) {
            caught++; streak++;
            if (streak > bestStreak) bestStreak = streak;
            if (streak > 0 && streak % 5 === 0) { flash = 0.7; flashTxt = streak + " in a row!"; sndGood(); }
            else blip(990, 0.04);
            sparks.splice(i, 1);
            continue;
          }
          if (s.life <= 0 || s.y > 432 || s.x < -10 || s.x > 730) sparks.splice(i, 1);
        }
        // night sky
        g.fillStyle = dark ? "#0b1220" : "#17233f"; g.fillRect(0, 0, W, H);
        for (var k = 0; k < stars.length; k++) {
          var st = stars[k];
          var a = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.5 + st.tw));
          g.fillStyle = "rgba(255,255,255," + a.toFixed(2) + ")";
          g.beginPath(); g.arc(st.x, st.y, st.r, 0, 7); g.fill();
        }
        // moon
        g.fillStyle = "#fde68a"; g.beginPath(); g.arc(64, 52, 26, 0, 7); g.fill();
        g.fillStyle = dark ? "#0b1220" : "#17233f"; g.beginPath(); g.arc(74, 46, 22, 0, 7); g.fill();
        // ground
        g.fillStyle = dark ? "#16241a" : "#1e3a2f"; g.fillRect(0, 396, W, 44);
        g.fillStyle = dark ? "#1d3125" : "#27513c";
        g.beginPath(); g.ellipse(360, 442, 420, 46, 0, 0, 7); g.fill();
        // jar (slides along the top)
        var jarW = 110, jarTop = 62, jarH = 52;
        g.fillStyle = "rgba(186, 230, 253, 0.35)"; rr(g, jx - jarW / 2, jarTop, jarW, jarH, 10); g.fill();
        g.strokeStyle = "#bae6fd"; g.lineWidth = 3; rr(g, jx - jarW / 2, jarTop, jarW, jarH, 10); g.stroke();
        g.fillStyle = "#bae6fd"; g.fillRect(jx - jarW / 2 - 4, jarTop - 4, jarW + 8, 8);
        // caught sparks glow inside the jar
        var glowN = Math.min(caught, 24);
        for (var c = 0; c < glowN; c++) {
          var gx = jx - jarW / 2 + 10 + ((c * 37) % (jarW - 20));
          var gy = jarTop + jarH - 8 - Math.floor(c / 6) * 9;
          g.fillStyle = "#fde047"; g.beginPath(); g.arc(gx, gy, 3, 0, 7); g.fill();
        }
        txt(g, "SPARK JAR", jx, jarTop + jarH + 16, 11, "#bae6fd");
        // sparkler stick + hand
        var stickLen = 150;
        var baseX = sx - 26, baseY = 428;
        var tipX = sx, tipY = TIP_Y;
        g.strokeStyle = "#8a6d3b"; g.lineWidth = 5;
        g.beginPath(); g.moveTo(baseX, baseY); g.lineTo(tipX, tipY); g.stroke();
        g.strokeStyle = "#d9c08a"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(baseX, baseY); g.lineTo(tipX, tipY); g.stroke();
        // hand holding the stick
        g.fillStyle = "#f2c89b";
        g.beginPath(); g.ellipse(baseX, baseY - 4, 20, 14, -0.5, 0, 7); g.fill();
        g.fillStyle = "#e8b184"; g.beginPath(); g.arc(baseX + 12, baseY - 12, 6, 0, 7); g.fill();
        // tip glow
        if (!done && holding && !flaring) {
          var glowR = 16 + Math.sin(t * 22) * 4;
          g.fillStyle = "rgba(253, 224, 71, 0.35)"; g.beginPath(); g.arc(tipX, tipY, glowR + 10, 0, 7); g.fill();
          g.fillStyle = "rgba(253, 224, 71, 0.6)"; g.beginPath(); g.arc(tipX, tipY, glowR, 0, 7); g.fill();
          g.fillStyle = "#fff7cc"; g.beginPath(); g.arc(tipX, tipY, 6, 0, 7); g.fill();
        } else if (flaring) {
          g.fillStyle = "rgba(248, 113, 113, 0.5)"; g.beginPath(); g.arc(tipX, tipY, 26, 0, 7); g.fill();
          g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(tipX, tipY, 10, 0, 7); g.fill();
        } else {
          g.fillStyle = "#78716c"; g.beginPath(); g.arc(tipX, tipY, 4, 0, 7); g.fill();
        }
        // sparks
        for (var j = 0; j < sparks.length; j++) {
          var sp = sparks[j];
          var sa = clamp(sp.life / 0.5, 0, 1);
          g.fillStyle = "rgba(253, 224, 71," + sa.toFixed(2) + ")";
          g.beginPath(); g.arc(sp.x, sp.y, sp.r, 0, 7); g.fill();
          g.strokeStyle = "rgba(251, 191, 36," + (sa * 0.7).toFixed(2) + ")"; g.lineWidth = 1.5;
          g.beginPath(); g.moveTo(sp.x, sp.y); g.lineTo(sp.x - sp.vx * 0.03, sp.y - sp.vy * 0.03); g.stroke();
        }
        // HUD
        txt(g, "Sparks caught: " + caught + "    Best streak: " + bestStreak, 360, 30, 17, dark ? "#e2e8f0" : "#f1f5f9");
        if (flash > 0) txt(g, flashTxt, 360, 160, 26, "#fbbf24");
        if (!holding && !done && t < 1.5) txt(g, "Press and HOLD to burn the sparkler!", 360, 200, 20, "#fde68a");
        // heat bar
        var hbX = 160, hbW = 400, hbY = H - 52;
        g.fillStyle = dark ? "#223140" : "#334155"; rr(g, hbX, hbY, hbW, 14, 7); g.fill();
        var heatFrac = clamp(heat / 100, 0, 1);
        g.fillStyle = flaring ? "#dc2626" : heat > 80 ? "#f97316" : "#facc15";
        rr(g, hbX, hbY, hbW * heatFrac, 14, 7); g.fill();
        txt(g, flaring ? "FLARED! Let it cool…" : "HEAT — ease off before it maxes out", 360, hbY - 12, 13, dark ? "#e2e8f0" : "#f1f5f9");
        // timer bar
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#e0f2fe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#16a34a" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
        txt(g, "Sparkler burns out in " + Math.max(0, Math.ceil(LIMIT - t)) + "s", 360, H - 34, 13, dark ? "#e2e8f0" : "#f1f5f9");
      }
    };
  }
});
