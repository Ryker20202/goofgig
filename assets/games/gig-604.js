// GoofGig #604 — Hold the Door
// A tiny everyday gig: Hold the door open for everyone coming through. Let go at the right moment.
registerGame({
  n: 604,
  title: "Hold the Door",
  desc: "Hold the door open for everyone coming through. Let go at the right moment.",
  hint: "Hold to keep the door open. Let go only when <b>nobody is in the doorway</b> — and don't hold it forever.",
  grades: [
    ["Doorkeeper of the Year", "Every single person through, zero bumps, perfect timing."],
    ["Polite Professional", "Smooth, courteous, barely a wobble in the doorway."],
    ["Door Intern", "Mostly fine. One person is still rubbing their shoulder."],
    ["Door Slammer", "You let go at the worst moment. Twice."],
    ["Revolving Door Menace", "The door is a hazard and you are its accomplice."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fef3c7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#92400e"; g.fillRect(120, 8, 60, 84);
    g.fillStyle = "#f59e0b"; g.fillRect(126, 14, 48, 72);
    g.fillStyle = "#334155"; g.beginPath(); g.arc(60, 70, 10, 0, 7); g.fill();
    g.fillStyle = "#2563eb"; rr(g, 52, 78, 16, 14, 4); g.fill();
    g.fillStyle = "#334155"; g.beginPath(); g.arc(240, 70, 10, 0, 7); g.fill();
    g.fillStyle = "#16a34a"; rr(g, 232, 78, 16, 14, 4); g.fill();
  },
  create: function (api) {
    var LIMIT = 20;
    var t0 = -1, done = false, holding = false;
    var people = [], spawnAt = [0.8, 2.6, 4.4, 6.2, 8.0, 9.8], spawned = 0;
    var through = 0, bumps = 0, holdTime = 0, lastRelease = -1, releasedClean = false;
    var flash = 0, flashTxt = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var t = el(now);
      var score = through * 13 + (bumps === 0 ? 18 : Math.max(0, 18 - bumps * 9)) + (t <= LIMIT ? Math.max(0, 10 - Math.max(0, t - 15) * 2) : 0);
      if (through === 0) score = 5;
      fin(score, [
        { label: "People through", value: Math.round(through / 6 * 100), text: through + " / 6", good: through >= 5 },
        { label: "Bumps", value: bumps === 0 ? 100 : Math.max(0, 100 - bumps * 25), text: bumps === 0 ? "none — smooth!" : bumps + " bump" + (bumps > 1 ? "s" : ""), good: bumps === 0 }
      ]);
    }
    return {
      status: function () {
        return done ? "Door duty done." : (holding ? "Holding… " + through + " through, " + (6 - through) + " to go" : "Press and HOLD the door open!");
      },
      down: function (p, now) {
        el(now); if (done) return;
        holding = true; blip(440, 0.05);
      },
      move: function (p, now) {},
      up: function (p, now) {
        if (!holding || done) return;
        holding = false;
        var t = el(now);
        var inDoor = people.some(function (q) { return q.x > 300 && q.x < 430 && !q.bumped; });
        if (inDoor) {
          bumps++;
          people.forEach(function (q) { if (q.x > 300 && q.x < 430 && !q.bumped) { q.bumped = true; q.v = 0; } });
          flash = 0.7; flashTxt = "Ouch! Someone was in the doorway!";
          sndBad();
        } else if (through >= 6) {
          releasedClean = true;
          finishAll(now);
        } else {
          lastRelease = t;
          flash = 0.4; flashTxt = "Door closed — hold it again!";
        }
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        if (holding) holdTime += dt;
        // spawn people
        while (spawned < spawnAt.length && t >= spawnAt[spawned]) {
          var cols = ["#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#ea580c", "#0891b2"];
          people.push({ x: 40, v: 85 + Math.random() * 25, c: cols[spawned], bumped: false, wob: Math.random() * 6 });
          spawned++;
        }
        g.fillStyle = dark ? "#16202b" : "#fef3c7"; g.fillRect(0, 0, W, H);
        // wall + doorway
        g.fillStyle = dark ? "#2b3a4a" : "#fde68a"; g.fillRect(0, 60, W, 300);
        g.fillStyle = dark ? "#0f172a" : "#fffbeb"; g.fillRect(300, 60, 130, 300);
        // floor
        g.fillStyle = dark ? "#1e3a2a" : "#d1fae5"; g.fillRect(0, 360, W, 80);
        // door (opens while holding)
        var openA = holding ? 0.9 : 0;
        g.save();
        g.translate(300, 360); g.rotate(-openA * 0.9);
        g.fillStyle = "#92400e"; g.fillRect(0, -300, 14, 300);
        g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(24, -150, 7, 0, 7); g.fill();
        g.restore();
        g.fillStyle = dark ? "#475569" : "#78350f"; g.fillRect(430, 60, 8, 300);
        // doorway highlight
        if (!done) {
          g.strokeStyle = holding ? "#16a34a" : "#dc2626"; g.lineWidth = 3;
          g.strokeRect(300, 60, 130, 300);
        }
        // people
        people.forEach(function (q) {
          if (q.bumped) return;
          if (q.x < 700) {
            if (holding) { q.x += q.v * dt; if (q.x > 292) q.inDoor = true; }
            else if (q.inDoor) q.x += q.v * dt;
            else q.x = Math.min(q.x + q.v * dt, 292);
          }
          if (q.x >= 700) { if (!q.counted) { q.counted = true; through++; } return; }
          var bob = Math.sin(t * 6 + q.wob) * 3;
          g.fillStyle = "#334155"; g.beginPath(); g.arc(q.x, 320 + bob, 12, 0, 7); g.fill();
          g.fillStyle = q.c; rr(g, q.x - 13, 332 + bob, 26, 30, 8); g.fill();
        });
        // bumped person lying in doorway
        people.forEach(function (q) {
          if (!q.bumped) return;
          g.fillStyle = "#334155"; g.beginPath(); g.arc(q.x + 10, 356, 12, 0, 7); g.fill();
          g.fillStyle = q.c; rr(g, q.x - 8, 344, 34, 16, 8); g.fill();
          txt(g, "x_x", q.x + 10, 330, 15, "#dc2626");
        });
        // queue label
        txt(g, "QUEUE", 90, 90, 15, dark ? "#94a3b8" : "#64748b");
        txt(g, "EXIT", 620, 90, 15, dark ? "#94a3b8" : "#64748b");
        txt(g, "through: " + through + " / 6", 360, 40, 20, dark ? "#e2e8f0" : "#334155");
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 405, 24, flashTxt.indexOf("Ouch") === 0 ? "#dc2626" : "#b45309"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#f59e0b" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
