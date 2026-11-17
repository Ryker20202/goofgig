// GoofGig #602 — Seagull Selfie
// A tiny everyday gig: A gull is crossing the sky. Snap it inside the frame.
registerGame({
  n: 602,
  title: "Seagull Selfie",
  desc: "A gull is crossing the sky. Snap it inside the frame.",
  hint: "Tap to snap a photo — catch the gull <b>inside the frame</b>. Three shots only!",
  grades: [
    ["Wildlife Photographer", "The gull is posing for you now. It knows."],
    ["Beach Paparazzo", "Nearly frame-perfect. The gull is flattered."],
    ["Holiday Snapper", "In the frame, mostly. Good enough for the group chat."],
    ["Blurry Birder", "You got sky. Lots of lovely sky."],
    ["Gullible Tourist", "The gull flew off and took your dignity with it."]
  ],
  thumb: function (g) {
    g.fillStyle = "#bfe8ff"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#3b82f6"; g.fillRect(0, 62, 300, 30);
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.arc(150, 34, 9, 0, 7); g.fill();
    g.beginPath(); g.ellipse(138, 30, 12, 4, -0.5, 0, 7); g.fill();
    g.beginPath(); g.ellipse(162, 30, 12, 4, 0.5, 0, 7); g.fill();
    g.strokeStyle = "#f59e0b"; g.lineWidth = 3;
    g.strokeRect(118, 14, 64, 44);
    g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(150, 14, 4, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 15, SHOTS = 3;
    var t0 = -1, done = false, shots = 0, best = 0, hits = 0;
    var gull = null, nextIn = 1.2, flash = 0, flashTxt = "", lastShot = 0;
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function spawn(now) {
      var dir = Math.random() < 0.5 ? 1 : -1;
      gull = {
        x: dir > 0 ? -60 : 780, y: 120 + Math.random() * 150,
        v: (110 + Math.random() * 90) * dir, flap: Math.random() * 6
      };
    }
    function finishAll(now) {
      var acc = hits ? Math.round(best) : 0;
      var score = hits * 26 + acc * 0.34 + (SHOTS - shots) * 0;
      if (hits === 0) score = 8;
      fin(score, [
        { label: "Shots hit", value: Math.round(hits / SHOTS * 100), text: hits + " / " + SHOTS, good: hits >= 2 },
        { label: "Best framing", value: Math.round(best), text: Math.round(best) + "%", good: best >= 70 }
      ]);
    }
    return {
      status: function () {
        return done ? "Developed! Time to see the shots." : "Shots left: " + (SHOTS - shots) + " — wait for the gull!";
      },
      down: function (p, now) {
        el(now); if (done || shots >= SHOTS) return;
        shots++; lastShot = el(now);
        var cx = 360, fx = 360, fw = 190;
        if (gull && gull.x > fx - fw / 2 && gull.x < fx + fw / 2 && gull.y > 90 && gull.y < 300) {
          var f = clamp(100 - Math.abs(gull.x - cx) / (fw / 2) * 100, 0, 100);
          best = Math.max(best, f); hits++;
          flash = 0.7; flashTxt = f >= 70 ? "Perfect frame!" : "Got it — a bit off-center.";
          sndGood();
        } else {
          flash = 0.7; flashTxt = "Just sky. The gull is laughing.";
          sndBad();
        }
        if (shots >= SHOTS) finishAll(now);
      },
      move: function (p, now) {},
      up: function (p, now) {},
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        g.fillStyle = dark ? "#12233a" : "#bfe8ff"; g.fillRect(0, 0, W, H);
        // sun + clouds
        g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(640, 66, 30, 0, 7); g.fill();
        g.fillStyle = dark ? "#2b4258" : "#ffffff";
        g.beginPath(); g.ellipse(150, 80, 60, 16, 0, 0, 7); g.fill();
        g.beginPath(); g.ellipse(500, 130, 70, 16, 0, 0, 7); g.fill();
        // sea + sand
        g.fillStyle = dark ? "#1d4e6b" : "#3b82f6"; g.fillRect(0, 330, W, 60);
        g.fillStyle = dark ? "#3a2f22" : "#fde68a"; g.fillRect(0, 390, W, 50);
        // gull
        if (gull === null && t > nextIn) spawn(now);
        if (gull) {
          gull.x += gull.v * dt; gull.flap += dt * 10;
          var flap = Math.sin(gull.flap) * 8;
          g.strokeStyle = dark ? "#e2e8f0" : "#334155"; g.lineWidth = 4; g.lineCap = "round";
          g.beginPath(); g.moveTo(gull.x - 22, gull.y + flap); g.quadraticCurveTo(gull.x - 8, gull.y - 6, gull.x, gull.y); g.quadraticCurveTo(gull.x + 8, gull.y - 6, gull.x + 22, gull.y + flap); g.stroke();
          g.fillStyle = dark ? "#e2e8f0" : "#f8fafc"; g.beginPath(); g.arc(gull.x, gull.y, 7, 0, 7); g.fill();
          g.fillStyle = "#f59e0b"; g.beginPath(); g.moveTo(gull.x + 7, gull.y); g.lineTo(gull.x + 14, gull.y + 2); g.lineTo(gull.x + 7, gull.y + 4); g.closePath(); g.fill();
          if (gull.x < -80 || gull.x > 800) { gull = null; nextIn = t + 0.8 + Math.random() * 1.4; }
        }
        // viewfinder frame
        g.strokeStyle = "#f59e0b"; g.lineWidth = 4;
        g.strokeRect(265, 90, 190, 210);
        g.fillStyle = "#f59e0b";
        g.beginPath(); g.arc(360, 90, 5, 0, 7); g.fill();
        g.strokeStyle = dark ? "#e2e8f0" : "#475569"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(360, 185); g.lineTo(360, 205); g.moveTo(350, 195); g.lineTo(370, 195); g.stroke();
        // shots left
        for (var i = 0; i < SHOTS; i++) {
          g.fillStyle = i < SHOTS - shots ? "#f59e0b" : (dark ? "#33506b" : "#cbd5e1");
          g.beginPath(); g.arc(60 + i * 30, 40, 10, 0, 7); g.fill();
        }
        txt(g, "SHOTS", 60, 66, 13, dark ? "#94a3b8" : "#64748b");
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 60, 26, flashTxt.indexOf("Perfect") === 0 ? "#16a34a" : "#dc2626"); }
        // time bar
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#f59e0b" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
