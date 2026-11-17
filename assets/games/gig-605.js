// GoofGig #605 — Comb the Cat
// A tiny everyday gig: Brush the cat's fur the right way. Wrong way and the cat objects.
registerGame({
  n: 605,
  title: "Comb the Cat",
  desc: "Brush the cat's fur the right way. Wrong way and the cat objects.",
  hint: "Drag the comb <b>along the arrows</b> — smooth strokes calm the cat, backwards strokes don't.",
  grades: [
    ["Cat Whisperer", "The cat is purring. You may stay forever."],
    ["Trusted Groomer", "Silky fur, happy cat, only one suspicious glare."],
    ["Brave Brusher", "The cat tolerates you. Mostly. For now."],
    ["Fur Ruffler", "You combed against the grain. The cat has filed a complaint."],
    ["Cat Enemy Number One", "The cat has left. The comb has been confiscated."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fde68a"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#f59e0b";
    g.beginPath(); g.ellipse(150, 62, 70, 24, 0, 0, 7); g.fill();
    g.beginPath(); g.arc(212, 46, 20, 0, 7); g.fill();
    g.beginPath(); g.moveTo(200, 30); g.lineTo(204, 12); g.lineTo(214, 28); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(216, 28); g.lineTo(226, 12); g.lineTo(228, 32); g.closePath(); g.fill();
    g.strokeStyle = "#92400e"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(100, 60); g.lineTo(120, 60); g.moveTo(116, 54); g.lineTo(122, 60); g.lineTo(116, 66); g.stroke();
    g.beginPath(); g.moveTo(140, 60); g.lineTo(160, 60); g.moveTo(156, 54); g.lineTo(162, 60); g.lineTo(156, 66); g.stroke();
    g.fillStyle = "#334155"; g.beginPath(); g.arc(218, 42, 3, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 20, NEED = 8;
    var t0 = -1, done = false;
    var dragging = false, lastX = 0, lastY = 0, strokeLen = 0, strokeGood = 0;
    var good = 0, bad = 0, smooth = 0, grump = 0, comb = { x: 360, y: 150 };
    var flash = 0, flashTxt = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var acc = (good + bad) ? good / (good + bad) : 0;
      var score = good >= NEED ? 70 + smooth * 0.2 + acc * 10 : good / NEED * 62 + smooth * 0.25;
      fin(score, [
        { label: "Good strokes", value: Math.round(good / NEED * 100), text: good + " / " + NEED, good: good >= NEED },
        { label: "Smoothness", value: Math.round(smooth), text: Math.round(smooth) + "%", good: smooth >= 70 }
      ]);
    }
    function onBack(p) { return p.x > 190 && p.x < 560 && p.y > 210 && p.y < 330; }
    return {
      status: function () {
        return done ? "Grooming complete. The cat has opinions." : "Good strokes: " + good + " / " + NEED + " — follow the arrows!";
      },
      down: function (p, now) {
        el(now); if (done) return;
        if (onBack(p)) { dragging = true; lastX = p.x; lastY = p.y; strokeLen = 0; strokeGood = 0; }
        comb.x = p.x; comb.y = p.y;
      },
      move: function (p, now) {
        comb.x = p.x; comb.y = p.y;
        if (!dragging || done) return;
        var dx = p.x - lastX, dy = p.y - lastY;
        var d = Math.hypot(dx, dy);
        if (d < 2) return;
        lastX = p.x; lastY = p.y;
        if (!onBack(p)) return;
        strokeLen += d;
        // fur runs left-to-right: rightward, mostly horizontal strokes are good
        if (dx > 0 && Math.abs(dy) < Math.abs(dx) * 0.7) strokeGood += d;
        else strokeGood -= d * 0.4;
      },
      up: function (p, now) {
        if (!dragging) return;
        dragging = false;
        if (strokeLen > 40) {
          var ratio = strokeGood / strokeLen;
          if (ratio > 0.45) {
            good++;
            smooth = clamp(smooth + 12, 0, 100);
            flash = 0.5; flashTxt = "Purrr…";
            blip(520, 0.07);
            if (good >= NEED) { sndGood(); finishAll(now); }
          } else {
            bad++;
            grump = clamp(grump + 18, 0, 100);
            smooth = clamp(smooth - 6, 0, 100);
            flash = 0.5; flashTxt = "Hiss! Wrong way!";
            sndBad();
          }
        }
        strokeLen = 0; strokeGood = 0;
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        g.fillStyle = dark ? "#16202b" : "#fef3c7"; g.fillRect(0, 0, W, H);
        // rug
        g.fillStyle = dark ? "#3a2f22" : "#fde68a"; rr(g, 120, 330, 480, 60, 26); g.fill();
        // tail
        var tailWag = Math.sin(t * (2 + grump / 25)) * (4 + grump / 8);
        g.strokeStyle = "#f59e0b"; g.lineWidth = 16; g.lineCap = "round";
        g.beginPath(); g.moveTo(190, 300); g.quadraticCurveTo(140, 300 + tailWag, 130, 250 + tailWag); g.stroke();
        // cat body (lying loaf)
        g.fillStyle = "#f59e0b";
        g.beginPath(); g.ellipse(375, 280, 185, 62, 0, 0, 7); g.fill();
        g.fillStyle = "#fbbf24";
        g.beginPath(); g.ellipse(375, 292, 150, 40, 0, 0, 7); g.fill();
        // stripes
        g.strokeStyle = "#d97706"; g.lineWidth = 5;
        for (var i = 0; i < 4; i++) {
          g.beginPath(); g.moveTo(260 + i * 70, 232); g.lineTo(260 + i * 70, 258); g.stroke();
        }
        // head
        g.fillStyle = "#f59e0b";
        g.beginPath(); g.arc(545, 250, 48, 0, 7); g.fill();
        var earFlat = grump / 100 * 10;
        g.beginPath(); g.moveTo(510, 218); g.lineTo(516, 196 - earFlat); g.lineTo(532, 212); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(556, 212); g.lineTo(570, 196 - earFlat); g.lineTo(578, 218); g.closePath(); g.fill();
        // eyes: happy arcs when smooth, angry slits when grumpy
        g.strokeStyle = "#334155"; g.lineWidth = 3;
        if (grump > 50) {
          g.beginPath(); g.moveTo(524, 246); g.lineTo(540, 252); g.moveTo(566, 252); g.lineTo(550, 246); g.stroke();
        } else {
          g.beginPath(); g.arc(532, 250, 8, Math.PI, 0); g.stroke();
          g.beginPath(); g.arc(560, 250, 8, Math.PI, 0); g.stroke();
        }
        // nose + whiskers
        g.fillStyle = "#f472b6"; g.beginPath(); g.moveTo(540, 264); g.lineTo(552, 264); g.lineTo(546, 270); g.closePath(); g.fill();
        g.strokeStyle = dark ? "#e2e8f0" : "#94a3b8"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(500, 262); g.lineTo(530, 266); g.moveTo(562, 266); g.lineTo(592, 262); g.stroke();
        // fur direction arrows
        g.strokeStyle = dark ? "#fbbf24" : "#b45309"; g.lineWidth = 3;
        for (var j = 0; j < 4; j++) {
          var ax = 250 + j * 80, ay = 200;
          g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax + 26, ay); g.moveTo(ax + 20, ay - 6); g.lineTo(ax + 26, ay); g.lineTo(ax + 20, ay + 6); g.stroke();
        }
        txt(g, "comb this way", 375, 178, 16, dark ? "#fbbf24" : "#b45309");
        // comb
        g.save(); g.translate(comb.x, comb.y); g.rotate(dragging ? -0.3 : 0.15);
        g.fillStyle = "#2563eb"; rr(g, -34, -10, 68, 20, 8); g.fill();
        g.fillStyle = "#dbeafe";
        for (var k = 0; k < 6; k++) g.fillRect(-28 + k * 10, 10, 4, 12);
        g.restore();
        // meters
        txt(g, "SMOOTH", 90, 60, 14, dark ? "#94a3b8" : "#64748b");
        g.fillStyle = dark ? "#223140" : "#e2e8f0"; rr(g, 60, 72, 120, 12, 6); g.fill();
        g.fillStyle = "#16a34a"; rr(g, 60, 72, 120 * smooth / 100, 12, 6); g.fill();
        txt(g, "GRUMP", 640, 60, 14, dark ? "#94a3b8" : "#64748b");
        g.fillStyle = dark ? "#223140" : "#e2e8f0"; rr(g, 580, 72, 120, 12, 6); g.fill();
        g.fillStyle = "#dc2626"; rr(g, 580, 72, 120 * grump / 100, 12, 6); g.fill();
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 120, 26, flashTxt.indexOf("Hiss") === 0 ? "#dc2626" : "#16a34a"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#f59e0b" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
