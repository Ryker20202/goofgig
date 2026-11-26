// GoofGig #620 — Sharpen the Pencil
// A tiny everyday gig: Hold to sharpen, let go in the green. Too little is blunt, too much snaps the tip.
registerGame({
  n: 620,
  title: "Sharpen the Pencil",
  desc: "Hold to sharpen, let go in the green. Too little is blunt, too much snaps the tip.",
  hint: "Press and <b>hold to sharpen</b> — let go inside the green zone. If the gauge hits the top, the tip snaps!",
  grades: [
    ["Head of the Class", "Five pencils, five perfect points. The teacher is framing this."],
    ["Sharp Operator", "Nearly every pencil came out just right. Satisfyingly pointy."],
    ["Decent Point", "Mostly sharp, mostly usable. A couple of pencils beg to differ."],
    ["Blunt Instrument", "These pencils could butter toast, but they can't write a word."],
    ["Lead Everywhere", "Five pencils went in. Five sad stumps came out."]
  ],
  thumb: function (g) {
    g.fillStyle = "#d9a05b"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#b97f3e"; g.fillRect(0, 74, 300, 18);
    // gauge
    g.fillStyle = "#fff7ed"; rr(g, 20, 10, 260, 12, 6); g.fill();
    g.fillStyle = "#16a34a"; rr(g, 130, 10, 80, 12, 6); g.fill();
    g.fillStyle = "#f59e0b"; rr(g, 20, 10, 150, 12, 6); g.fill();
    // sharpener
    g.fillStyle = "#475569"; rr(g, 30, 46, 46, 30, 5); g.fill();
    g.fillStyle = "#1e293b"; g.beginPath(); g.arc(53, 61, 9, 0, 7); g.fill();
    // pencil
    g.fillStyle = "#facc15"; g.fillRect(76, 53, 150, 16);
    g.fillStyle = "#eab308"; g.fillRect(76, 64, 150, 5);
    g.fillStyle = "#fde68a"; g.beginPath(); g.moveTo(226, 53); g.lineTo(262, 61); g.lineTo(226, 69); g.closePath(); g.fill();
    g.fillStyle = "#334155"; g.beginPath(); g.moveTo(252, 59); g.lineTo(262, 61); g.lineTo(252, 63); g.closePath(); g.fill();
    g.fillStyle = "#f87171"; g.fillRect(64, 53, 12, 16);
    // shavings
    g.strokeStyle = "#fde68a"; g.lineWidth = 3;
    g.beginPath(); g.arc(96, 84, 7, 0, 5); g.stroke();
    g.beginPath(); g.arc(120, 86, 5, 1, 6); g.stroke();
    g.beginPath(); g.arc(250, 84, 6, 0, 5); g.stroke();
  },
  create: function (api) {
    var LIMIT = 25;
    var ROUNDS = 5;
    var t0 = -1, done = false;
    var round = 0, gauge = 0, holding = false;
    var zone = { lo: 50, hi: 80, c: 65 };
    var speed = 52;
    var pause = 0, verdict = "", verdictGood = false;
    var results = [];
    var bestDist = 999;
    var shavings = [], shaveT = 0, blipT = 0;
    var snapPiece = null;
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function newZone() {
      var w = 30 - round * 3;
      var c = 40 + Math.random() * 45;
      zone = { lo: c - w / 2, hi: c + w / 2, c: c };
      speed = 52 + round * 7;
      gauge = 0;
      snapPiece = null;
    }
    function scoreRound(snap) {
      var d = Math.abs(gauge - zone.c);
      if (d < bestDist) bestDist = d;
      var pts, inZone = false;
      if (snap) {
        pts = 0;
        verdict = "SNAP! The tip broke off.";
        verdictGood = false;
        snapPiece = { x: 0, y: 0, vy: 0, rot: 0 };
        sndBad();
      } else if (gauge >= zone.lo && gauge <= zone.hi) {
        var half = (zone.hi - zone.lo) / 2;
        pts = 12 + 8 * (1 - d / half);
        inZone = true;
        verdict = "On point! Beautifully sharp.";
        verdictGood = true;
        sndGood();
      } else if (gauge < zone.lo) {
        pts = clamp(10 - d * 0.25, 1, 10);
        verdict = "Too blunt — keep sharpening next time!";
        verdictGood = false;
        sndBad();
      } else {
        pts = clamp(10 - d * 0.25, 1, 10);
        verdict = "Overdone — you sailed past the green!";
        verdictGood = false;
        sndBad();
      }
      results.push({ pts: Math.round(pts), inZone: inZone, snap: snap, dist: d });
      holding = false;
      pause = 0.9;
    }
    function nextRound() {
      round++;
      if (round >= ROUNDS) { finishAll(); return; }
      newZone();
    }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll() {
      var total = 0, onPoint = 0, snaps = 0;
      for (var i = 0; i < results.length; i++) {
        total += results[i].pts;
        if (results[i].inZone) onPoint++;
        if (results[i].snap) snaps++;
      }
      var bd = bestDist === 999 ? 50 : bestDist;
      fin(total, [
        { label: "Pencils on point", value: Math.round(onPoint / ROUNDS * 100), text: onPoint + " of " + ROUNDS + " pencils", good: onPoint >= 4 },
        { label: "Tips snapped", value: Math.round((ROUNDS - snaps) / ROUNDS * 100), text: snaps + " snapped", good: snaps === 0 },
        { label: "Best stop", value: clamp(Math.round(100 - bd * 2), 0, 100), text: bd.toFixed(0) + " off the mark", good: bd <= 5 }
      ]);
    }
    newZone();
    return {
      status: function () {
        if (done) return "All five pencils are done — how sharp did they come out?";
        if (pause > 0) return verdict;
        return "Pencil " + (round + 1) + " of " + ROUNDS + " — hold to sharpen, let go in the green!";
      },
      down: function (p, now) {
        el(now);
        if (done || pause > 0) return;
        holding = true;
        blip();
      },
      move: function (p, now) {},
      up: function (p, now) {
        if (done || pause > 0 || !holding) return;
        scoreRound(false);
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t >= LIMIT) finishAll();
        if (done) t = Math.min(t, LIMIT);
        if (pause > 0) {
          pause -= dt;
          if (pause <= 0 && !done) nextRound();
        }
        // sharpening
        if (holding && !done && pause <= 0) {
          gauge += speed * dt;
          shaveT -= dt;
          if (shaveT <= 0) {
            shaveT = 0.09;
            shavings.push({ x: 150 + Math.random() * 60, y: 300 + Math.random() * 30, r: 3 + Math.random() * 5, rot: Math.random() * 6 });
            if (shavings.length > 26) shavings.shift();
          }
          blipT -= dt;
          if (blipT <= 0) { blipT = 0.22; blip(); }
          if (gauge >= 100) { gauge = 100; scoreRound(true); }
        }
        if (snapPiece) {
          snapPiece.vy += 500 * dt;
          snapPiece.y += snapPiece.vy * dt;
          snapPiece.rot += dt * 6;
        }
        // background: wooden desk
        g.fillStyle = dark ? "#3f2d1e" : "#d9a05b"; g.fillRect(0, 0, W, H);
        g.fillStyle = dark ? "#33241a" : "#c98f45";
        for (var wy = 60; wy < H; wy += 64) g.fillRect(0, wy, W, 3);
        // paper sheet under the action
        g.fillStyle = dark ? "#475569" : "#fffbeb"; rr(g, 60, 96, 600, 260, 10); g.fill();
        g.strokeStyle = dark ? "#64748b" : "#e7c98a"; g.lineWidth = 2; rr(g, 60, 96, 600, 260, 10); g.stroke();
        // gauge: sharp-o-meter
        txt(g, "SHARP-O-METER", 360, 34, 15, dark ? "#fde68a" : "#78350f");
        g.fillStyle = dark ? "#1e293b" : "#fff7ed"; rr(g, 120, 48, 480, 24, 12); g.fill();
        g.fillStyle = "#16a34a"; rr(g, 120 + zone.lo * 4.8, 48, (zone.hi - zone.lo) * 4.8, 24, 12); g.fill();
        g.fillStyle = "#f59e0b"; rr(g, 120, 48, clamp(gauge, 0, 100) * 4.8, 24, 12); g.fill();
        g.strokeStyle = dark ? "#e2e8f0" : "#451a03"; g.lineWidth = 2; rr(g, 120, 48, 480, 24, 12); g.stroke();
        // marker
        var mx = 120 + clamp(gauge, 0, 100) * 4.8;
        g.fillStyle = "#dc2626";
        g.beginPath(); g.moveTo(mx - 8, 78); g.lineTo(mx + 8, 78); g.lineTo(mx, 90); g.closePath(); g.fill();
        txt(g, "Pencil " + Math.min(round + 1, ROUNDS) + " of " + ROUNDS + "  —  " + Math.max(0, Math.ceil(LIMIT - t)) + "s left", 360, 118, 15, dark ? "#e2e8f0" : "#78350f");
        // sharpener (left)
        g.fillStyle = "#475569"; rr(g, 130, 210, 74, 60, 8); g.fill();
        g.fillStyle = "#334155"; rr(g, 130, 210, 74, 14, 8); g.fill();
        g.fillStyle = "#0f172a"; g.beginPath(); g.arc(204, 240, 13, 0, 7); g.fill();
        g.fillStyle = "#94a3b8"; g.beginPath(); g.arc(204, 240, 13, 0, 7); g.stroke();
        g.fillStyle = "#cbd5e1"; g.beginPath(); g.arc(204, 240, 5, 0, 7); g.fill();
        // pencil: body + tip, tip length grows with gauge
        var tipLen = snapPiece ? 8 : 12 + clamp(gauge, 0, 100) * 0.55;
        var bodyX0 = 204, bodyX1 = 470, tipX = bodyX1 + tipLen, py = 240;
        g.fillStyle = "#facc15"; g.fillRect(bodyX0, py - 13, bodyX1 - bodyX0, 26);
        g.fillStyle = "#eab308"; g.fillRect(bodyX0, py + 6, bodyX1 - bodyX0, 7);
        g.fillStyle = "#fde68a";
        g.beginPath(); g.moveTo(bodyX1, py - 13); g.lineTo(tipX, py); g.lineTo(bodyX1, py + 13); g.closePath(); g.fill();
        if (!snapPiece) {
          g.fillStyle = "#334155";
          g.beginPath(); g.moveTo(tipX - tipLen * 0.28, py - 4); g.lineTo(tipX, py); g.lineTo(tipX - tipLen * 0.28, py + 4); g.closePath(); g.fill();
        } else {
          // jagged broken tip
          g.fillStyle = "#fde68a";
          g.beginPath(); g.moveTo(bodyX1, py - 13); g.lineTo(bodyX1 + 8, py - 4); g.lineTo(bodyX1 + 3, py + 2); g.lineTo(bodyX1 + 9, py + 13); g.lineTo(bodyX1, py + 13); g.closePath(); g.fill();
          // falling broken piece
          g.save();
          g.translate(tipX - 20, 250 + snapPiece.y);
          g.rotate(snapPiece.rot);
          g.fillStyle = "#334155";
          g.beginPath(); g.moveTo(-8, -4); g.lineTo(8, 0); g.lineTo(-8, 4); g.closePath(); g.fill();
          g.restore();
        }
        // eraser end
        g.fillStyle = "#f87171"; g.fillRect(bodyX0 - 16, py - 13, 16, 26);
        g.fillStyle = "#d1d5db"; g.fillRect(bodyX0 - 22, py - 13, 6, 26);
        // shavings
        g.strokeStyle = dark ? "#fde68a" : "#b45309"; g.lineWidth = 3;
        for (var s = 0; s < shavings.length; s++) {
          var sh = shavings[s];
          g.beginPath(); g.arc(sh.x, sh.y, sh.r, sh.rot, sh.rot + 4.5); g.stroke();
        }
        // verdict / prompt
        if (pause > 0 || done) {
          txt(g, verdict, 360, 330, 24, verdictGood ? "#16a34a" : "#dc2626");
        } else if (t < 1.5) {
          txt(g, "Hold anywhere to sharpen — let go inside the green!", 360, 330, 19, dark ? "#fde68a" : "#92400e");
        } else if (holding) {
          txt(g, "Sharpening… let go in the green!", 360, 330, 19, dark ? "#fde68a" : "#92400e");
        }
        // pencil dots: progress
        for (var d2 = 0; d2 < ROUNDS; d2++) {
          var dx = 330 + d2 * 20;
          g.fillStyle = d2 < results.length ? (results[d2].inZone ? "#16a34a" : results[d2].snap ? "#dc2626" : "#f59e0b") : (d2 === round ? "#f59e0b" : (dark ? "#475569" : "#d6d3d1"));
          g.beginPath(); g.arc(dx, 392, 7, 0, 7); g.fill();
        }
        txt(g, "green = on point   •   amber = off the mark   •   red = snapped", 360, 416, 13, dark ? "#cbd5e1" : "#78350f");
      }
    };
  }
});
