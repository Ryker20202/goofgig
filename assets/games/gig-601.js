// GoofGig #601 — Wrap the Scarf
// A tiny everyday gig: Two wraps, no chills. Round and round it goes.
registerGame({
  n: 601,
  title: "Wrap the Scarf",
  desc: "Two wraps, no chills. Round and round it goes.",
  hint: "Grab the scarf tip and drag it in circles around the neck — two full wraps!",
  grades: [
    ["Grandma-Approved Wrapper", "That snowman is warmer than you are."],
    ["Chief Neck Warmer", "Snug, neat, and only slightly dizzy."],
    ["Scarf Apprentice", "It holds. Mostly. Until the wind finds out."],
    ["Tangler", "That is less a wrap and more a knot with ambitions."],
    ["Certified Chill Giver", "The snowman is melting and still cold. Impressive."]
  ],
  thumb: function (g) {
    // snowman head + wrapped scarf on 300x92
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(150, 34, 24, 0, 7); g.fill();
    g.strokeStyle = "#cbd5e1"; g.lineWidth = 2; g.beginPath(); g.arc(150, 34, 24, 0, 7); g.stroke();
    g.fillStyle = "#334155"; g.beginPath(); g.arc(142, 30, 3, 0, 7); g.fill(); g.beginPath(); g.arc(158, 30, 3, 0, 7); g.fill();
    g.fillStyle = "#f97316"; g.beginPath(); g.moveTo(150, 36); g.lineTo(168, 41); g.lineTo(150, 44); g.closePath(); g.fill();
    for (var i = 0; i < 3; i++) {
      g.fillStyle = i % 2 ? "#0e9594" : "#e11d48";
      rr(g, 112, 54 + i * 11, 76, 9, 4); g.fill();
    }
    g.fillStyle = "#e11d48"; rr(g, 182, 58, 26, 30, 5); g.fill();
    g.fillStyle = "#0e9594"; rr(g, 182, 72, 26, 6, 3); g.fill();
  },
  create: function (api) {
    var CX = 360, CY = 205, R = 92, TARGET = Math.PI * 4, LIMIT = 20;
    var t0 = -1, done = false;
    var dragging = false, lastAng = 0, rot = 0, dirLock = 0;
    var devSum = 0, devN = 0, flash = 0, flashTxt = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function tipPos() {
      var a = -Math.PI / 2 + rot;
      return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R };
    }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var wraps = Math.min(rot / (Math.PI * 2), 2);
      var neat = devN ? clamp(100 - (devSum / devN) * 1.6, 0, 100) : 60;
      var timeLeft = Math.max(0, LIMIT - el(now));
      var score;
      if (rot >= TARGET) score = 62 + neat * 0.28 + timeLeft * 0.5;
      else score = (wraps / 2) * 62 + neat * 0.2;
      fin(score, [
        { label: "Wraps", value: Math.round(wraps / 2 * 100), text: wraps.toFixed(1) + " / 2", good: wraps >= 2 },
        { label: "Neatness", value: Math.round(neat), text: Math.round(neat) + "%", good: neat >= 70 }
      ]);
    }
    function angOf(p) { return Math.atan2(p.y - CY, p.x - CX); }
    function normD(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
    return {
      status: function () {
        var w = Math.min(rot / (Math.PI * 2), 2);
        return done ? "All wrapped up. Done!" : "Wrap the scarf — " + w.toFixed(1) + " of 2 wraps";
      },
      down: function (p, now) {
        el(now); if (done) return;
        var tp = tipPos();
        if (dist(p.x, p.y, tp.x, tp.y) < 64) { dragging = true; lastAng = angOf(p); }
      },
      move: function (p, now) {
        if (!dragging || done) return;
        var a = angOf(p), d = normD(a - lastAng);
        lastAng = a;
        if (dirLock === 0 && Math.abs(d) > 0.02) dirLock = d > 0 ? 1 : -1;
        rot = Math.max(0, rot + (dirLock !== 0 ? d * dirLock : 0));
        var dev = Math.abs(dist(p.x, p.y, CX, CY) - R);
        devSum += dev; devN++;
        if (rot >= TARGET) { flash = 0.9; flashTxt = "Two wraps! Toasty!"; sndGood(); finishAll(now); }
      },
      up: function (p, now) { dragging = false; },
      draw: function (g, dt, now) {
        var dark = isDark();
        g.fillStyle = dark ? "#16202b" : "#eaf6ff"; g.fillRect(0, 0, W, H);
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        // ground snow
        g.fillStyle = dark ? "#223140" : "#ffffff"; rr(g, 130, 330, 460, 60, 26); g.fill();
        // snowman body + head
        g.fillStyle = dark ? "#dbe7f3" : "#ffffff";
        g.beginPath(); g.arc(CX, 300, 62, 0, 7); g.fill();
        g.beginPath(); g.arc(CX, CY - 58, 44, 0, 7); g.fill();
        g.strokeStyle = dark ? "#5b7d9e" : "#bcd7ee"; g.lineWidth = 3;
        g.beginPath(); g.arc(CX, 300, 62, 0, 7); g.stroke();
        g.beginPath(); g.arc(CX, CY - 58, 44, 0, 7); g.stroke();
        // face
        g.fillStyle = "#334155";
        g.beginPath(); g.arc(CX - 15, CY - 66, 4.5, 0, 7); g.fill();
        g.beginPath(); g.arc(CX + 15, CY - 66, 4.5, 0, 7); g.fill();
        g.fillStyle = "#f97316";
        g.beginPath(); g.moveTo(CX, CY - 58); g.lineTo(CX + 26, CY - 50); g.lineTo(CX, CY - 46); g.closePath(); g.fill();
        // hat
        g.fillStyle = "#334155"; rr(g, CX - 30, CY - 108, 60, 10, 4); g.fill(); rr(g, CX - 20, CY - 132, 40, 26, 5); g.fill();
        // wrapped scarf: bands thicken with rotation
        var wrapsF = Math.min(rot / (Math.PI * 2), 2);
        for (var i = 0; i < 2; i++) {
          var filled = clamp(wrapsF - i, 0, 1);
          if (filled <= 0) continue;
          g.fillStyle = i % 2 ? "#0e9594" : "#e11d48";
          g.save();
          g.beginPath(); g.rect(CX - 56, CY - 16 + i * 15, 112 * filled, 13); g.clip();
          rr(g, CX - 56, CY - 16 + i * 15, 112, 13, 6); g.fill();
          g.restore();
        }
        // loose end follows the wrap angle
        var tp = tipPos();
        g.strokeStyle = "#e11d48"; g.lineWidth = 13; g.lineCap = "round";
        g.beginPath(); g.moveTo(CX + Math.cos(-Math.PI / 2 + rot) * 40, CY + Math.sin(-Math.PI / 2 + rot) * 40);
        g.lineTo(tp.x, tp.y); g.stroke();
        // the grab tip
        g.fillStyle = dragging ? "#fb7185" : "#e11d48";
        g.beginPath(); g.arc(tp.x, tp.y, 17, 0, 7); g.fill();
        g.fillStyle = "#0e9594"; g.beginPath(); g.arc(tp.x, tp.y, 7, 0, 7); g.fill();
        if (!dragging && !done && rot === 0) txt(g, "grab the round tip!", tp.x, tp.y - 34, 17, dark ? "#9fd8d7" : "#0e7490");
        // progress ring of wraps
        g.strokeStyle = dark ? "#33506b" : "#c9e4f7"; g.lineWidth = 7;
        g.beginPath(); g.arc(CX, CY, R + 26, 0, 7); g.stroke();
        g.strokeStyle = "#0e9594";
        g.beginPath(); g.arc(CX, CY, R + 26, -Math.PI / 2, -Math.PI / 2 + Math.min(rot / TARGET, 1) * Math.PI * 2); g.stroke();
        if (flash > 0) { flash -= dt; txt(g, flashTxt, CX, 96, 30, "#0e9594"); }
        // time bar
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#0e9594" : "#e11d48"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
