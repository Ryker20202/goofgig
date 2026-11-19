// GoofGig #613 — The Revolving Door
// A tiny everyday gig: The door keeps spinning. Step through the gap the moment it faces you.
registerGame({
  n: 613,
  title: "The Revolving Door",
  desc: "The door keeps spinning. Step through the gap the moment it faces you.",
  hint: "Tap to walk in when the <b>opening faces you</b>. Mind the glass!",
  grades: [
    ["Lobby Legend", "Eight smooth entries and not a single nose-print on the glass."],
    ["Doorman's Favorite", "You glide through like you own the building."],
    ["Revolving Regular", "Mostly smooth — the glass forgave you."],
    ["Glass Bumper", "You met the door more than the lobby did."],
    ["Spinning Newcomer", "The door won. Your forehead knows it."]
  ],
  thumb: function (g) {
    g.fillStyle = "#bae6fd"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#94a3b8"; g.fillRect(0, 0, 300, 20);
    g.fillStyle = "#64748b"; g.fillRect(96, 20, 108, 72);
    g.fillStyle = "#e0f2fe"; g.beginPath(); g.arc(150, 62, 28, 0, 7); g.fill();
    g.strokeStyle = "#334155"; g.lineWidth = 3;
    g.beginPath(); g.arc(150, 62, 28, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(150, 62); g.lineTo(150, 34); g.moveTo(150, 62); g.lineTo(178, 62); g.stroke();
    g.fillStyle = "#dc2626"; g.beginPath(); g.arc(150, 84, 7, 0, 7); g.fill();
    g.fillStyle = "#facc15"; g.beginPath(); g.arc(60, 76, 8, 0, 7); g.fill();
    g.fillStyle = "#facc15"; g.beginPath(); g.arc(240, 76, 8, 0, 7); g.fill();
    txt(g, "DOOR", 150, 14, 11, "#ffffff");
  },
  create: function (api) {
    var LIMIT = 20;
    var ROUNDS = 8;
    var CX = 360, CY = 205, R = 118;
    var TARGET = Math.PI / 2;
    var t0 = -1, done = false;
    var rot = 0.6, omega = 1.2;
    var phase = "wait"; // wait | walk | bump
    var phaseT = 0;
    var attempt = 0, perfects = 0, goods = 0, bumps = 0, points = 0;
    var lastMsg = "", lastKind = "", flash = 0;
    var walkY = 0, shake = 0;
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function gapError() {
      var best = Math.PI;
      for (var k = 0; k < 4; k++) {
        var ga = rot + Math.PI / 4 + k * Math.PI / 2;
        var d = ga - TARGET;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        if (Math.abs(d) < best) best = Math.abs(d);
      }
      return best * 180 / Math.PI;
    }
    function newRound() {
      omega = (0.8 + Math.random() * 0.9) * (Math.random() < 0.5 ? 1 : -1);
      rot = Math.random() * Math.PI * 2;
      phase = "wait";
    }
    function finishAll(now) {
      var total = points + (perfects === ROUNDS ? 4 : 0);
      fin(total, [
        { label: "Clean entries", value: Math.round((perfects + goods) / ROUNDS * 100), text: (perfects + goods) + " / " + ROUNDS, good: (perfects + goods) >= 6 },
        { label: "Perfect timings", value: Math.round(perfects / ROUNDS * 100), text: perfects + " perfect", good: perfects >= 4 },
        { label: "Glass bumps", value: bumps === 0 ? 100 : Math.max(0, 100 - bumps * 25), text: bumps === 0 ? "none — spotless glass!" : bumps + " bump" + (bumps > 1 ? "s" : ""), good: bumps === 0 }
      ]);
    }
    function attemptEntry(now) {
      if (phase !== "wait") return;
      attempt++;
      var err = gapError();
      phaseT = 0;
      if (err < 10) {
        perfects++; points += 12;
        lastMsg = "Perfect! Straight through!"; lastKind = "good";
        phase = "walk"; sndGood(); blip(880, 0.08);
      } else if (err < 22) {
        goods++; points += 7;
        lastMsg = "In! A little sideways, but in."; lastKind = "good";
        phase = "walk"; sndGood(); blip(660, 0.08);
      } else {
        bumps++;
        lastMsg = "BONK! That was glass."; lastKind = "bad";
        phase = "bump"; shake = 1; sndBad(); blip(140, 0.15);
      }
      flash = 1.2;
    }
    newRound();
    return {
      status: function () {
        if (done) return "Lobby duty done — " + (perfects + goods) + " clean entries out of " + attempt + ".";
        if (phase === "walk") return "Smooth… keep going!";
        if (phase === "bump") return "Ouch. Watch the gap next time!";
        return "Entries: " + attempt + " / " + ROUNDS + " — tap when the gap faces you!";
      },
      down: function (p, now) {
        el(now); if (done) return;
        attemptEntry(now);
      },
      move: function (p, now) {},
      up: function (p, now) {},
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        dt = clamp(dt, 0, 0.05);
        if (!done) {
          rot += omega * dt;
          if (phase === "walk" || phase === "bump") {
            phaseT += dt;
            if (phaseT > 0.7) {
              if (attempt >= ROUNDS) { finishAll(now); }
              else newRound();
            }
          }
          if (flash > 0) flash -= dt;
          if (shake > 0) shake -= dt * 3;
        }
        // --- scene ---
        g.fillStyle = dark ? "#0f172a" : "#bae6fd"; g.fillRect(0, 0, W, H);
        // building wall
        g.fillStyle = dark ? "#1e293b" : "#94a3b8"; g.fillRect(0, 0, W, 60);
        g.fillStyle = dark ? "#334155" : "#64748b";
        for (var wx = 30; wx < W; wx += 60) { g.fillRect(wx, 14, 34, 32); }
        // floor
        g.fillStyle = dark ? "#292524" : "#d6d3d1"; g.fillRect(0, 380, W, 60);
        g.fillStyle = dark ? "#44403c" : "#a8a29e"; g.fillRect(0, 380, W, 4);
        // door frame
        g.fillStyle = dark ? "#475569" : "#475569";
        rr(g, CX - 150, 60, 300, 320, 18); g.fill();
        g.fillStyle = dark ? "#0c1220" : "#e0f2fe";
        g.beginPath(); g.arc(CX, CY, R + 12, 0, 7); g.fill();
        // glass disc
        g.fillStyle = dark ? "rgba(125,211,252,0.18)" : "rgba(186,230,253,0.55)";
        g.beginPath(); g.arc(CX, CY, R, 0, 7); g.fill();
        // gap markers (small floor lights showing where gaps are)
        for (var k = 0; k < 4; k++) {
          var ga = rot + Math.PI / 4 + k * Math.PI / 2;
          var gx = CX + Math.cos(ga) * (R + 26);
          var gy = CY + Math.sin(ga) * (R + 26);
          g.fillStyle = "#facc15";
          g.beginPath(); g.arc(gx, gy, 6, 0, 7); g.fill();
        }
        // panels
        g.strokeStyle = dark ? "#e2e8f0" : "#334155"; g.lineWidth = 7;
        for (var i = 0; i < 4; i++) {
          var pa = rot + i * Math.PI / 2;
          g.beginPath(); g.moveTo(CX, CY); g.lineTo(CX + Math.cos(pa) * R, CY + Math.sin(pa) * R); g.stroke();
        }
        // center hub
        g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(CX, CY, 12, 0, 7); g.fill();
        g.fillStyle = "#78350f"; g.beginPath(); g.arc(CX, CY, 5, 0, 7); g.fill();
        // entrance arrow at bottom
        var arrowY = 340 + Math.sin(t * 4) * 4;
        g.fillStyle = "#16a34a";
        g.beginPath(); g.moveTo(CX - 12, arrowY); g.lineTo(CX + 12, arrowY); g.lineTo(CX, arrowY - 16); g.closePath(); g.fill();
        txt(g, "ENTER", CX, arrowY + 16, 13, dark ? "#e2e8f0" : "#334155");
        // person
        var px = CX, py = 402;
        var bob = Math.sin(t * 5) * 2;
        if (phase === "walk") {
          var wp = clamp(phaseT / 0.7, 0, 1);
          py = 402 - wp * 150;
        }
        if (phase === "bump" && shake > 0) px += Math.sin(t * 40) * 6 * shake;
        // shadow
        g.fillStyle = "rgba(0,0,0,0.2)";
        g.beginPath(); g.ellipse(px, 414, 18, 5, 0, 0, 7); g.fill();
        // body
        g.fillStyle = "#2563eb"; rr(g, px - 13, py - 26 + bob * 0.3, 26, 26, 8); g.fill();
        // head
        g.fillStyle = "#fcd34d"; g.beginPath(); g.arc(px, py - 34 + bob * 0.3, 11, 0, 7); g.fill();
        g.fillStyle = "#334155"; g.beginPath(); g.arc(px - 4, py - 36 + bob * 0.3, 1.8, 0, 7); g.fill();
        g.beginPath(); g.arc(px + 4, py - 36 + bob * 0.3, 1.8, 0, 7); g.fill();
        // dizzy stars after bump
        if (phase === "bump" && shake > 0) {
          g.fillStyle = "#facc15";
          for (var s = 0; s < 3; s++) {
            var sa = t * 6 + s * 2.1;
            g.beginPath(); g.arc(px + Math.cos(sa) * 20, py - 44 + Math.sin(sa) * 8, 3, 0, 7); g.fill();
          }
        }
        // HUD
        txt(g, "Entries " + attempt + " / " + ROUNDS + "   •   Points " + points, 360, 24, 18, dark ? "#e2e8f0" : "#1e293b");
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#e2e8f0"; rr(g, 160, H - 24, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#16a34a" : "#dc2626"; rr(g, 160, H - 24, 400 * tl, 9, 4); g.fill();
        // attempt pips
        for (var q = 0; q < ROUNDS; q++) {
          g.fillStyle = q < attempt ? "#16a34a" : (dark ? "#475569" : "#cbd5e1");
          g.beginPath(); g.arc(590 + q * 16, H - 20, 5, 0, 7); g.fill();
        }
        if (flash > 0) {
          txt(g, lastMsg, 360, 100, 24, lastKind === "bad" ? "#dc2626" : "#15803d");
        }
        if (!done && phase === "wait" && attempt === 0) txt(g, "Tap when a yellow gap marker points DOWN!", 360, 120, 20, dark ? "#e2e8f0" : "#334155");
      }
    };
  }
});
