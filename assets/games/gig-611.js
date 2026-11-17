// GoofGig #611 — Count the Change
// A tiny everyday gig: The coins flash, the cloth covers them. How much was on the counter?
registerGame({
  n: 611,
  title: "Count the Change",
  desc: "The coins flash, the cloth covers them. How much was on the counter?",
  hint: "Memorize the coins, then tap the <b>correct total</b> before time runs out.",
  grades: [
    ["Human Calculator", "Every total exact. The till is afraid of you."],
    ["Sharp Shopper", "Nearly perfect — the till blinked first."],
    ["Pocket Counter", "You got most of it. The coins are flattered."],
    ["Fuzzy Math", "Close-ish. The coins are laughing behind the cloth."],
    ["Change Confused", "You counted the cloth. The cloth is not money."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fef3c7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#facc15";
    g.beginPath(); g.arc(80, 46, 14, 0, 7); g.fill();
    g.beginPath(); g.arc(120, 46, 14, 0, 7); g.fill();
    g.beginPath(); g.arc(160, 46, 14, 0, 7); g.fill();
    g.fillStyle = "#92400e";
    txt(g, "5", 80, 47, 15, "#92400e");
    txt(g, "10", 120, 47, 15, "#92400e");
    txt(g, "25", 160, 47, 15, "#92400e");
    g.fillStyle = "#dc2626"; rr(g, 200, 24, 70, 46, 8); g.fill();
    txt(g, "?", 235, 48, 26, "#ffffff");
  },
  create: function (api) {
    var LIMIT = 25, ROUNDS = 3;
    var t0 = -1, done = false;
    var round = 0, phase = "show", phaseT = 0, coins = [], total = 0;
    var options = [], picked = -1, correct = 0, answerT = 0;
    var flash = 0, flashTxt = "";
    var VALS = [1, 5, 10, 25];
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var score = correct * 30 + (correct === ROUNDS ? 10 : 0);
      fin(score, [
        { label: "Correct totals", value: Math.round(correct / ROUNDS * 100), text: correct + " / " + ROUNDS, good: correct >= 2 },
        { label: "Rounds played", value: Math.round(round / ROUNDS * 100), text: round + " / " + ROUNDS + " rounds", good: round === ROUNDS }
      ]);
    }
    function startRound() {
      round++;
      var n = 3 + round; // 4, 5, 6 coins
      coins = [];
      total = 0;
      var used = [];
      for (var i = 0; i < n; i++) {
        var v = VALS[Math.floor(Math.random() * VALS.length)];
        total += v;
        coins.push({ v: v, x: 150 + i * 100 + (Math.random() * 30 - 15), y: 190 + (Math.random() * 60 - 30) });
        used.push(v);
      }
      // build 3 options: correct + two near misses
      var o = [total];
      var d1 = total + (Math.random() < 0.5 ? -1 : 1) * (5 + Math.floor(Math.random() * 10));
      var d2 = total + (Math.random() < 0.5 ? -1 : 1) * (10 + Math.floor(Math.random() * 15));
      if (d1 === total || d1 <= 0) d1 = total + 7;
      if (d2 === total || d2 === d1 || d2 <= 0) d2 = total + 13;
      o.push(d1, d2);
      // shuffle
      for (var j = o.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var tmp = o[j]; o[j] = o[k]; o[k] = tmp; }
      options = o;
      picked = -1;
      phase = "show";
      phaseT = 0;
    }
    startRound();
    return {
      status: function () {
        if (done) return "Till closed. The coins have been counted.";
        if (phase === "show") return "Round " + round + " — memorize the coins!";
        if (phase === "ask") return "Round " + round + " — what was the total?";
        return "Round " + round + " — next round coming…";
      },
      down: function (p, now) {
        el(now); if (done || phase !== "ask" || picked >= 0) return;
        for (var i = 0; i < 3; i++) {
          var bx = 160 + i * 200, by = 300;
          if (p.x > bx - 80 && p.x < bx + 80 && p.y > by - 32 && p.y < by + 32) {
            picked = i;
            if (options[i] === total) {
              correct++;
              flash = 0.8; flashTxt = "Correct! " + total + " cents!";
              sndGood();
            } else {
              flash = 0.8; flashTxt = "Nope — it was " + total + ".";
              sndBad();
            }
            phase = "reveal"; phaseT = 0;
            return;
          }
        }
      },
      move: function (p, now) {},
      up: function (p, now) {},
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        phaseT += dt;
        if (phase === "show" && phaseT > 3) { phase = "ask"; phaseT = 0; }
        else if (phase === "reveal" && phaseT > 1.6) {
          if (round >= ROUNDS) finishAll(now);
          else { startRound(); }
        }
        g.fillStyle = dark ? "#16202b" : "#fef3c7"; g.fillRect(0, 0, W, H);
        // counter
        g.fillStyle = dark ? "#2b3a4a" : "#d97706"; rr(g, 90, 140, 540, 150, 16); g.fill();
        g.fillStyle = dark ? "#0f172a" : "#fffbeb"; rr(g, 110, 158, 500, 114, 12); g.fill();
        if (phase === "show") {
          coins.forEach(function (c) {
            g.fillStyle = "#facc15"; g.beginPath(); g.arc(c.x, c.y, 26, 0, 7); g.fill();
            g.strokeStyle = "#b45309"; g.lineWidth = 2; g.beginPath(); g.arc(c.x, c.y, 26, 0, 7); g.stroke();
            txt(g, String(c.v), c.x, c.y + 1, 20, "#92400e");
          });
          txt(g, "memorize… " + Math.max(0, 3 - Math.floor(phaseT)) + "s", 360, 110, 20, dark ? "#fbbf24" : "#b45309");
        } else {
          // cloth covers the coins
          g.fillStyle = "#dc2626"; rr(g, 110, 158, 500, 114, 12); g.fill();
          g.fillStyle = "#ffffff";
          for (var i = 0; i < 5; i++) { g.beginPath(); g.arc(160 + i * 100, 200, 8, 0, 7); g.fill(); }
          txt(g, "covered!", 360, 250, 18, "#ffffff");
        }
        if (phase === "ask") {
          txt(g, "What was the total? (cents)", 360, 110, 20, dark ? "#e2e8f0" : "#334155");
          options.forEach(function (o, i) {
            var bx = 160 + i * 200, by = 330;
            g.fillStyle = dark ? "#1e3a4a" : "#ffffff";
            rr(g, bx - 80, by - 32, 160, 64, 12); g.fill();
            g.strokeStyle = "#2563eb"; g.lineWidth = 3; rr(g, bx - 80, by - 32, 160, 64, 12); g.stroke();
            txt(g, String(o), bx, by + 1, 26, dark ? "#e2e8f0" : "#1e3a8a");
          });
        }
        if (phase === "reveal") {
          txt(g, "Total was " + total + " cents", 360, 330, 24, dark ? "#fbbf24" : "#b45309");
        }
        txt(g, "round " + round + " / " + ROUNDS + "   •   correct: " + correct, 360, 40, 18, dark ? "#94a3b8" : "#64748b");
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 70, 26, flashTxt.indexOf("Correct") === 0 ? "#16a34a" : "#dc2626"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#f59e0b" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
