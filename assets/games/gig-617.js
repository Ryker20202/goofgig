// GoofGig #617 — The Fridge Thief
// A tiny everyday gig: Something vanished from the fridge while you blinked. Name the missing snack.
registerGame({
  n: 617,
  title: "The Fridge Thief",
  desc: "Something vanished from the fridge while you blinked. Name the missing snack.",
  hint: "Memorize the shelf, then tap the <b>missing snack</b> — all four choices were on the shelf!",
  grades: [
    ["Fridge Detective", "Every thief caught. The milk is safe with you around."],
    ["Sharp Snacker", "Nearly perfect — the thief left crumbs, and you followed them."],
    ["Shelf Watcher", "Most snacks accounted for. The fridge respects you."],
    ["Fridge Forgetter", "You blinked and the shelf went blank. The thief sends thanks."],
    ["Snack Amnesiac", "You named the fridge itself. The thief took the cake too."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dbeafe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#ffffff"; rr(g, 105, 6, 90, 80, 8); g.fill();
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2; rr(g, 105, 6, 90, 80, 8); g.stroke();
    g.fillStyle = "#f87171"; g.fillRect(105, 42, 90, 4);
    g.fillStyle = "#facc15"; g.beginPath(); g.arc(130, 28, 9, 0, 7); g.fill();
    g.fillStyle = "#f87171"; g.beginPath(); g.arc(165, 28, 9, 0, 7); g.fill();
    g.fillStyle = "#a78bfa"; g.beginPath(); g.arc(147, 62, 9, 0, 7); g.fill();
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(175, 62, 9, 0, 7); g.fill();
    g.fillStyle = "#dc2626"; g.beginPath(); g.arc(255, 20, 12, 0, 7); g.fill();
    txt(g, "?", 255, 21, 18, "#ffffff");
    g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(48, 70, 12, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 30, ROUNDS = 3, SHOW_T = 3.5, REVEAL_T = 1.6;
    var t0 = -1, done = false;
    var round = 0, phase = "show", phaseT = 0;
    var shelf = [], missing = null, options = [], picked = -1;
    var correct = 0, askT = 0, fastest = -1;
    var flash = 0, flashTxt = "";
    var POOL = [
      { id: "milk", name: "Milk" },
      { id: "eggs", name: "Eggs" },
      { id: "cheese", name: "Cheese" },
      { id: "apple", name: "Apple" },
      { id: "carrot", name: "Carrot" },
      { id: "cake", name: "Cake" },
      { id: "juice", name: "Juice" },
      { id: "butter", name: "Butter" },
      { id: "yogurt", name: "Yogurt" },
      { id: "grapes", name: "Grapes" },
      { id: "tomato", name: "Tomato" },
      { id: "sandwich", name: "Sandwich" }
    ];
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var score = correct * 30 + (correct === ROUNDS ? 10 : 0);
      var qv = 0, qt = "no catch yet";
      if (fastest >= 0) {
        qv = fastest <= 2 ? 100 : fastest <= 4 ? 70 : 40;
        qt = fastest.toFixed(1) + "s";
      }
      fin(score, [
        { label: "Snacks named", value: Math.round(correct / ROUNDS * 100), text: correct + " / " + ROUNDS, good: correct >= 2 },
        { label: "Rounds played", value: Math.round(round / ROUNDS * 100), text: round + " / " + ROUNDS + " rounds", good: round === ROUNDS },
        { label: "Quickest catch", value: qv, text: qt, good: fastest >= 0 && fastest <= 3 }
      ]);
    }
    function shuffled(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
      return a;
    }
    function startRound() {
      round++;
      shelf = shuffled(POOL).slice(0, 6);
      missing = shelf[Math.floor(Math.random() * shelf.length)];
      options = shuffled(shelf).slice(0, 4);
      if (options.indexOf(missing) < 0) { options[3] = missing; options = shuffled(options); }
      picked = -1;
      phase = "show";
      phaseT = 0;
    }
    function drawItem(g, id, x, y) {
      // icon ~44px wide, centered at (x, y)
      if (id === "milk") {
        g.fillStyle = "#ffffff"; g.fillRect(x - 13, y - 14, 26, 30);
        g.fillStyle = "#dbeafe"; g.beginPath(); g.moveTo(x - 13, y - 14); g.lineTo(x, y - 24); g.lineTo(x + 13, y - 14); g.fill();
        g.fillStyle = "#2563eb"; g.fillRect(x - 13, y - 2, 26, 8);
        g.fillStyle = "#1e3a8a"; g.fillRect(x - 5, y - 24, 10, 5);
      } else if (id === "eggs") {
        g.fillStyle = "#cbd5e1"; rr(g, x - 18, y - 12, 36, 26, 4); g.fill();
        g.fillStyle = "#ffffff";
        g.beginPath(); g.ellipse(x - 8, y - 2, 8, 10, 0, 0, 7); g.fill();
        g.beginPath(); g.ellipse(x + 8, y - 2, 8, 10, 0, 0, 7); g.fill();
      } else if (id === "cheese") {
        g.fillStyle = "#facc15"; g.beginPath(); g.moveTo(x - 18, y + 12); g.lineTo(x + 18, y + 12); g.lineTo(x + 18, y - 12); g.fill();
        g.fillStyle = "#eab308";
        g.beginPath(); g.arc(x - 4, y + 2, 4, 0, 7); g.fill();
        g.beginPath(); g.arc(x + 9, y + 6, 3, 0, 7); g.fill();
      } else if (id === "apple") {
        g.fillStyle = "#dc2626"; g.beginPath(); g.arc(x, y + 2, 15, 0, 7); g.fill();
        g.fillStyle = "#92400e"; g.fillRect(x - 1, y - 18, 3, 8);
        g.fillStyle = "#16a34a"; g.beginPath(); g.ellipse(x + 9, y - 13, 8, 4, -0.5, 0, 7); g.fill();
      } else if (id === "carrot") {
        g.fillStyle = "#f97316"; g.beginPath(); g.moveTo(x - 13, y - 8); g.lineTo(x + 13, y - 8); g.lineTo(x, y + 20); g.fill();
        g.fillStyle = "#16a34a";
        g.fillRect(x - 2, y - 20, 4, 12); g.fillRect(x - 9, y - 16, 4, 10); g.fillRect(x + 5, y - 16, 4, 10);
      } else if (id === "cake") {
        g.fillStyle = "#f9a8d4"; g.fillRect(x - 17, y - 6, 34, 20);
        g.fillStyle = "#ffffff"; g.fillRect(x - 17, y - 6, 34, 7);
        g.fillStyle = "#facc15"; g.fillRect(x - 2, y - 18, 4, 12);
        g.fillStyle = "#f97316"; g.beginPath(); g.arc(x, y - 20, 3, 0, 7); g.fill();
      } else if (id === "juice") {
        g.fillStyle = "#fb923c"; g.fillRect(x - 12, y - 16, 24, 32);
        g.fillStyle = "#ffffff"; g.fillRect(x - 12, y - 2, 24, 10);
        g.strokeStyle = "#dc2626"; g.lineWidth = 3;
        g.beginPath(); g.moveTo(x + 6, y - 16); g.lineTo(x + 12, y - 26); g.stroke();
      } else if (id === "butter") {
        g.fillStyle = "#e2e8f0"; g.beginPath(); g.ellipse(x, y + 12, 20, 5, 0, 0, 7); g.fill();
        g.fillStyle = "#fde047"; g.fillRect(x - 15, y - 10, 30, 18);
        g.fillStyle = "#facc15"; g.fillRect(x - 15, y - 10, 30, 4);
      } else if (id === "yogurt") {
        g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(x - 13, y - 12); g.lineTo(x + 13, y - 12); g.lineTo(x + 10, y + 14); g.lineTo(x - 10, y + 14); g.fill();
        g.fillStyle = "#f472b6"; g.fillRect(x - 13, y - 16, 26, 6);
        g.fillStyle = "#ec4899"; g.beginPath(); g.arc(x, y + 2, 5, 0, 7); g.fill();
      } else if (id === "grapes") {
        g.fillStyle = "#7c3aed";
        g.beginPath(); g.arc(x - 9, y - 4, 8, 0, 7); g.fill();
        g.beginPath(); g.arc(x + 9, y - 4, 8, 0, 7); g.fill();
        g.beginPath(); g.arc(x, y + 8, 8, 0, 7); g.fill();
        g.beginPath(); g.arc(x - 9, y + 12, 6, 0, 7); g.fill();
        g.beginPath(); g.arc(x + 9, y + 12, 6, 0, 7); g.fill();
        g.fillStyle = "#16a34a"; g.fillRect(x - 1, y - 20, 3, 8);
      } else if (id === "tomato") {
        g.fillStyle = "#ef4444"; g.beginPath(); g.arc(x, y + 3, 15, 0, 7); g.fill();
        g.fillStyle = "#16a34a";
        g.beginPath(); g.moveTo(x, y - 10); g.lineTo(x - 8, y - 16); g.lineTo(x - 2, y - 8); g.fill();
        g.beginPath(); g.moveTo(x, y - 10); g.lineTo(x + 8, y - 16); g.lineTo(x + 2, y - 8); g.fill();
      } else if (id === "sandwich") {
        g.fillStyle = "#fde68a"; g.beginPath(); g.moveTo(x - 17, y + 10); g.lineTo(x + 17, y + 10); g.lineTo(x, y - 14); g.fill();
        g.fillStyle = "#16a34a"; g.fillRect(x - 13, y + 2, 26, 4);
        g.fillStyle = "#f59e0b"; g.fillRect(x - 10, y + 6, 20, 4);
      }
    }
    function optRect(i) {
      return { x: 230 + (i % 2) * 260 - 120, y: 322 + Math.floor(i / 2) * 58 - 23, w: 240, h: 46 };
    }
    startRound();
    return {
      status: function () {
        if (done) return "Fridge closed. The thief has been named — or got away.";
        if (phase === "show") return "Round " + round + " — memorize the shelf!";
        if (phase === "ask") return "Round " + round + " — what went missing?";
        return "Round " + round + " — next round coming…";
      },
      down: function (p, now) {
        el(now);
        if (done || phase !== "ask" || picked >= 0 || !p) return;
        for (var i = 0; i < 4; i++) {
          var r = optRect(i);
          if (p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h) {
            picked = i;
            if (options[i] === missing) {
              correct++;
              if (fastest < 0 || askT < fastest) fastest = askT;
              flash = 0.9; flashTxt = "Caught! The " + missing.name + " is gone!";
              sndGood();
            } else {
              flash = 0.9; flashTxt = "Nope — the " + options[i].name + " is still there.";
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
        if (!done && t >= LIMIT) finishAll(now);
        if (done) t = Math.min(t, LIMIT);
        phaseT += dt;
        if (phase === "show" && phaseT > SHOW_T) { phase = "ask"; phaseT = 0; askT = 0; }
        else if (phase === "ask") { askT += dt; }
        else if (phase === "reveal" && phaseT > REVEAL_T) {
          if (round >= ROUNDS) finishAll(now);
          else startRound();
        }
        // kitchen wall + floor
        g.fillStyle = dark ? "#1c2733" : "#fef3c7"; g.fillRect(0, 0, W, H);
        g.fillStyle = dark ? "#22303f" : "#fde68a"; g.fillRect(0, 0, W, 46);
        g.fillStyle = dark ? "#31435a" : "#e7c86a"; g.fillRect(0, 46, W, 4);
        // fridge body
        g.fillStyle = dark ? "#8fa3b8" : "#e2e8f0"; rr(g, 150, 62, 420, 240, 14); g.fill();
        g.strokeStyle = dark ? "#64748b" : "#94a3b8"; g.lineWidth = 3; rr(g, 150, 62, 420, 240, 14); g.stroke();
        g.fillStyle = dark ? "#475569" : "#cbd5e1"; g.fillRect(150, 176, 420, 4);
        if (phase === "show") {
          // shelves with items
          var pos = [[240, 128], [360, 128], [480, 128], [240, 238], [360, 238], [480, 238]];
          shelf.forEach(function (it, i) {
            drawItem(g, it.id, pos[i][0], pos[i][1]);
            txt(g, it.name, pos[i][0], pos[i][1] + 36, 14, dark ? "#e2e8f0" : "#334155");
          });
          txt(g, "memorize… " + Math.max(0, Math.ceil(SHOW_T - phaseT)) + "s", 360, 92, 18, dark ? "#fbbf24" : "#b45309");
        } else {
          // closed door with a sticky note
          g.fillStyle = dark ? "#64748b" : "#f1f5f9"; rr(g, 168, 80, 384, 204, 10); g.fill();
          g.fillStyle = dark ? "#94a3b8" : "#94a3b8"; rr(g, 522, 120, 10, 60, 5); g.fill();
          g.fillStyle = "#fde047"; rr(g, 220, 110, 90, 70, 4); g.fill();
          txt(g, "1 item", 265, 132, 16, "#713f12");
          txt(g, "MISSING!", 265, 154, 16, "#713f12");
          txt(g, "which one?", 360, 262, 20, dark ? "#e2e8f0" : "#475569");
        }
        if (phase === "ask") {
          txt(g, "What went missing?", 360, 306, 20, dark ? "#e2e8f0" : "#334155");
          options.forEach(function (o, i) {
            var r = optRect(i);
            var sel = (picked === i);
            g.fillStyle = sel ? (o === missing ? "#dcfce7" : "#fee2e2") : (dark ? "#1e3a4a" : "#ffffff");
            rr(g, r.x, r.y, r.w, r.h, 12); g.fill();
            g.strokeStyle = sel ? (o === missing ? "#16a34a" : "#dc2626") : "#2563eb"; g.lineWidth = 3;
            rr(g, r.x, r.y, r.w, r.h, 12); g.stroke();
            txt(g, o.name, r.x + r.w / 2, r.y + r.h / 2 + 1, 20, dark ? "#e2e8f0" : "#1e3a8a");
          });
        }
        if (phase === "reveal") {
          txt(g, "It was the " + missing.name + "!", 360, 336, 26, dark ? "#fbbf24" : "#b45309");
        }
        txt(g, "round " + round + " / " + ROUNDS + "   •   correct: " + correct, 360, 24, 17, dark ? "#94a3b8" : "#64748b");
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 66, 22, flashTxt.indexOf("Caught") === 0 ? "#16a34a" : "#dc2626"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 22, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#f59e0b" : "#dc2626"; rr(g, 160, H - 22, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
