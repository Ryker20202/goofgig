// GoofGig #622 — The Price Switch
// A tiny everyday gig: One price tag changed while the lights blinked. Spot it before the checkout beeps.
registerGame({
  n: 622,
  title: "The Price Switch",
  desc: "One price tag changed while the lights blinked. Spot it before the checkout beeps.",
  hint: "Memorize every <b>price tag</b>, then tap the <b>one item whose price changed</b> after the lights blink!",
  grades: [
    ["Price Hawk", "Every switched tag caught. The checkout fears you."],
    ["Sharp Shopper", "Nearly perfect — one sneaky tag slipped past you."],
    ["Bargain Watcher", "Most changes spotted. The store respects you."],
    ["Checkout Daydreamer", "You blinked and the prices danced away."],
    ["Full-Price Fan", "You paid whatever the tag said. The store loves you."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fef3c7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#92400e"; g.fillRect(0, 66, 300, 8);
    // three shelf items with price tags
    var px = [55, 150, 245];
    var cols = ["#dc2626", "#facc15", "#16a34a"];
    for (var i = 0; i < 3; i++) {
      g.fillStyle = cols[i]; g.beginPath(); g.arc(px[i], 34, 14, 0, 7); g.fill();
      g.fillStyle = "#fffbeb"; rr(g, px[i] - 24, 56, 48, 20, 3); g.fill();
      g.strokeStyle = "#92400e"; g.lineWidth = 1; rr(g, px[i] - 24, 56, 48, 20, 3); g.stroke();
      txt(g, "$2.40", px[i], 66, 10, "#78350f");
    }
    // the switched tag, circled in red
    g.strokeStyle = "#dc2626"; g.lineWidth = 3;
    g.beginPath(); g.ellipse(245, 66, 30, 14, 0, 0, 7); g.stroke();
    txt(g, "$2.90", 245, 66, 10, "#dc2626");
    g.fillStyle = "#fde047"; g.beginPath(); g.arc(268, 16, 9, 0, 7); g.fill();
    txt(g, "?", 268, 17, 12, "#713f12");
  },
  create: function (api) {
    var LIMIT = 30, ROUNDS = 3, BLINK_T = 0.7, REVEAL_T = 1.8;
    var SHOW_T = [3.5, 3.0, 2.5];
    var t0 = -1, done = false;
    var round = 0, phase = "show", phaseT = 0;
    var shelf = [], changed = -1, oldPrice = 0, newPrice = 0;
    var picked = -1;
    var correct = 0, askT = 0, fastest = -1;
    var flash = 0, flashTxt = "";
    var POS = [[180, 150], [360, 150], [540, 150], [180, 285], [360, 285], [540, 285]];
    var POOL = [
      { id: "milk", name: "Milk" },
      { id: "bread", name: "Bread" },
      { id: "apple", name: "Apple" },
      { id: "eggs", name: "Eggs" },
      { id: "cheese", name: "Cheese" },
      { id: "juice", name: "Juice" },
      { id: "carrot", name: "Carrot" },
      { id: "cake", name: "Cake" },
      { id: "grapes", name: "Grapes" },
      { id: "tomato", name: "Tomato" }
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
        { label: "Prices caught", value: Math.round(correct / ROUNDS * 100), text: correct + " / " + ROUNDS, good: correct >= 2 },
        { label: "Rounds played", value: Math.round(round / ROUNDS * 100), text: round + " / " + ROUNDS + " rounds", good: round === ROUNDS },
        { label: "Quickest catch", value: qv, text: qt, good: fastest >= 0 && fastest <= 3 }
      ]);
    }
    function shuffled(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
      return a;
    }
    function money(cents) { return "$" + (cents / 100).toFixed(2); }
    function startRound() {
      round++;
      shelf = shuffled(POOL).slice(0, 6).map(function (it) {
        return { id: it.id, name: it.name, price: 90 + Math.floor(Math.random() * 41) * 10 };
      });
      changed = Math.floor(Math.random() * shelf.length);
      oldPrice = shelf[changed].price;
      var delta = (30 + Math.floor(Math.random() * 10) * 10) * (Math.random() < 0.5 ? -1 : 1);
      newPrice = clamp(oldPrice + delta, 50, 590);
      if (newPrice === oldPrice) newPrice = oldPrice + 40;
      picked = -1;
      phase = "show";
      phaseT = 0;
    }
    function drawItem(g, id, x, y) {
      // icon ~40px wide, centered at (x, y)
      if (id === "milk") {
        g.fillStyle = "#ffffff"; g.fillRect(x - 12, y - 13, 24, 28);
        g.fillStyle = "#dbeafe"; g.beginPath(); g.moveTo(x - 12, y - 13); g.lineTo(x, y - 22); g.lineTo(x + 12, y - 13); g.fill();
        g.fillStyle = "#2563eb"; g.fillRect(x - 12, y - 2, 24, 7);
        g.fillStyle = "#1e3a8a"; g.fillRect(x - 4, y - 22, 8, 4);
      } else if (id === "bread") {
        g.fillStyle = "#d97706"; rr(g, x - 18, y - 10, 36, 22, 10); g.fill();
        g.fillStyle = "#fde68a"; rr(g, x - 14, y - 6, 28, 14, 7); g.fill();
        g.fillStyle = "#b45309";
        g.beginPath(); g.arc(x - 6, y + 2, 2, 0, 7); g.fill();
        g.beginPath(); g.arc(x + 5, y - 1, 2, 0, 7); g.fill();
      } else if (id === "apple") {
        g.fillStyle = "#dc2626"; g.beginPath(); g.arc(x, y + 2, 14, 0, 7); g.fill();
        g.fillStyle = "#92400e"; g.fillRect(x - 1, y - 16, 3, 7);
        g.fillStyle = "#16a34a"; g.beginPath(); g.ellipse(x + 8, y - 12, 7, 4, -0.5, 0, 7); g.fill();
      } else if (id === "eggs") {
        g.fillStyle = "#cbd5e1"; rr(g, x - 17, y - 11, 34, 24, 4); g.fill();
        g.fillStyle = "#ffffff";
        g.beginPath(); g.ellipse(x - 8, y - 2, 7, 9, 0, 0, 7); g.fill();
        g.beginPath(); g.ellipse(x + 8, y - 2, 7, 9, 0, 0, 7); g.fill();
      } else if (id === "cheese") {
        g.fillStyle = "#facc15"; g.beginPath(); g.moveTo(x - 17, y + 11); g.lineTo(x + 17, y + 11); g.lineTo(x + 17, y - 11); g.fill();
        g.fillStyle = "#eab308";
        g.beginPath(); g.arc(x - 4, y + 2, 4, 0, 7); g.fill();
        g.beginPath(); g.arc(x + 8, y + 6, 3, 0, 7); g.fill();
      } else if (id === "juice") {
        g.fillStyle = "#fb923c"; g.fillRect(x - 11, y - 15, 22, 30);
        g.fillStyle = "#ffffff"; g.fillRect(x - 11, y - 2, 22, 9);
        g.strokeStyle = "#dc2626"; g.lineWidth = 3;
        g.beginPath(); g.moveTo(x + 5, y - 15); g.lineTo(x + 11, y - 24); g.stroke();
      } else if (id === "carrot") {
        g.fillStyle = "#f97316"; g.beginPath(); g.moveTo(x - 12, y - 7); g.lineTo(x + 12, y - 7); g.lineTo(x, y + 19); g.fill();
        g.fillStyle = "#16a34a";
        g.fillRect(x - 2, y - 18, 4, 11); g.fillRect(x - 8, y - 15, 4, 9); g.fillRect(x + 4, y - 15, 4, 9);
      } else if (id === "cake") {
        g.fillStyle = "#f9a8d4"; g.fillRect(x - 16, y - 5, 32, 19);
        g.fillStyle = "#ffffff"; g.fillRect(x - 16, y - 5, 32, 6);
        g.fillStyle = "#facc15"; g.fillRect(x - 2, y - 16, 4, 11);
        g.fillStyle = "#f97316"; g.beginPath(); g.arc(x, y - 18, 3, 0, 7); g.fill();
      } else if (id === "grapes") {
        g.fillStyle = "#7c3aed";
        g.beginPath(); g.arc(x - 8, y - 4, 7, 0, 7); g.fill();
        g.beginPath(); g.arc(x + 8, y - 4, 7, 0, 7); g.fill();
        g.beginPath(); g.arc(x, y + 7, 7, 0, 7); g.fill();
        g.beginPath(); g.arc(x - 8, y + 11, 5, 0, 7); g.fill();
        g.beginPath(); g.arc(x + 8, y + 11, 5, 0, 7); g.fill();
        g.fillStyle = "#16a34a"; g.fillRect(x - 1, y - 18, 3, 7);
      } else if (id === "tomato") {
        g.fillStyle = "#ef4444"; g.beginPath(); g.arc(x, y + 3, 14, 0, 7); g.fill();
        g.fillStyle = "#16a34a";
        g.beginPath(); g.moveTo(x, y - 9); g.lineTo(x - 7, y - 15); g.lineTo(x - 2, y - 7); g.fill();
        g.beginPath(); g.moveTo(x, y - 9); g.lineTo(x + 7, y - 15); g.lineTo(x + 2, y - 7); g.fill();
      }
    }
    function itemRect(i) {
      return { x: POS[i][0] - 78, y: POS[i][1] - 48, w: 156, h: 108 };
    }
    startRound();
    return {
      status: function () {
        if (done) return "Checkout closed. The switched tag is on the receipt.";
        if (phase === "show") return "Round " + round + " — memorize every price!";
        if (phase === "blink") return "Round " + round + " — the lights blinked…";
        if (phase === "ask") return "Round " + round + " — which price changed?";
        return "Round " + round + " — next round coming…";
      },
      down: function (p, now) {
        el(now);
        if (done || phase !== "ask" || picked >= 0 || !p) return;
        for (var i = 0; i < 6; i++) {
          var r = itemRect(i);
          if (p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h) {
            picked = i;
            if (i === changed) {
              correct++;
              if (fastest < 0 || askT < fastest) fastest = askT;
              flash = 1.0; flashTxt = "Caught! " + shelf[i].name + " went " + money(oldPrice) + " → " + money(newPrice) + "!";
              sndGood();
            } else {
              flash = 1.0; flashTxt = "Nope — the " + shelf[i].name + " still costs " + money(shelf[i].price) + ".";
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
        if (phase === "show" && phaseT > SHOW_T[round - 1]) { phase = "blink"; phaseT = 0; }
        else if (phase === "blink" && phaseT > BLINK_T) { phase = "ask"; phaseT = 0; askT = 0; }
        else if (phase === "ask") { askT += dt; }
        else if (phase === "reveal" && phaseT > REVEAL_T) {
          if (round >= ROUNDS) finishAll(now);
          else startRound();
        }
        // shop wall + floor
        g.fillStyle = dark ? "#1c2733" : "#fef9c3"; g.fillRect(0, 0, W, H);
        g.fillStyle = dark ? "#22303f" : "#fde68a"; g.fillRect(0, 0, W, 46);
        g.fillStyle = dark ? "#31435a" : "#e7c86a"; g.fillRect(0, 46, W, 4);
        // shelves
        g.fillStyle = dark ? "#3f2d20" : "#92400e";
        g.fillRect(60, 216, 600, 8);
        g.fillRect(60, 352, 600, 8);
        if (phase === "show") {
          shelf.forEach(function (it, i) {
            drawItem(g, it.id, POS[i][0], POS[i][1]);
            txt(g, it.name, POS[i][0], POS[i][1] + 34, 14, dark ? "#e2e8f0" : "#334155");
            g.fillStyle = "#fffbeb"; rr(g, POS[i][0] - 32, POS[i][1] + 42, 64, 20, 3); g.fill();
            g.strokeStyle = "#92400e"; g.lineWidth = 1; rr(g, POS[i][0] - 32, POS[i][1] + 42, 64, 20, 3); g.stroke();
            txt(g, money(it.price), POS[i][0], POS[i][1] + 52, 13, "#78350f");
          });
          txt(g, "memorize… " + Math.max(0, Math.ceil(SHOW_T[round - 1] - phaseT)) + "s", 360, 92, 18, dark ? "#fbbf24" : "#b45309");
        } else if (phase === "blink") {
          g.fillStyle = dark ? "#0f172a" : "#1e293b";
          g.globalAlpha = 0.85; g.fillRect(60, 60, 600, 290); g.globalAlpha = 1;
          txt(g, "the lights flickered…", 360, 200, 26, "#fde047");
          txt(g, "did a price move?", 360, 232, 18, "#e2e8f0");
        } else {
          // ask + reveal: shelf with the NEW prices
          shelf.forEach(function (it, i) {
            var price = (i === changed) ? newPrice : it.price;
            var isPick = (picked === i);
            if (phase === "reveal" && i === changed) {
              g.strokeStyle = "#dc2626"; g.lineWidth = 3;
              g.beginPath(); g.ellipse(POS[i][0], POS[i][1] + 52, 40, 14, 0, 0, 7); g.stroke();
            }
            if (isPick) {
              g.fillStyle = (i === changed) ? "rgba(22,163,74,0.18)" : "rgba(220,38,38,0.18)";
              rr(g, POS[i][0] - 78, POS[i][1] - 48, 156, 108, 10); g.fill();
            }
            drawItem(g, it.id, POS[i][0], POS[i][1]);
            txt(g, it.name, POS[i][0], POS[i][1] + 34, 14, dark ? "#e2e8f0" : "#334155");
            g.fillStyle = "#fffbeb"; rr(g, POS[i][0] - 32, POS[i][1] + 42, 64, 20, 3); g.fill();
            g.strokeStyle = (phase === "reveal" && i === changed) ? "#dc2626" : "#92400e"; g.lineWidth = 1;
            rr(g, POS[i][0] - 32, POS[i][1] + 42, 64, 20, 3); g.stroke();
            txt(g, money(price), POS[i][0], POS[i][1] + 52, 13, (phase === "reveal" && i === changed) ? "#dc2626" : "#78350f");
          });
          if (phase === "ask") txt(g, "Which price changed?", 360, 92, 22, dark ? "#e2e8f0" : "#334155");
          if (phase === "reveal") txt(g, shelf[changed].name + ": " + money(oldPrice) + " → " + money(newPrice), 360, 92, 22, dark ? "#fbbf24" : "#b45309");
        }
        txt(g, "round " + round + " / " + ROUNDS + "   •   correct: " + correct, 360, 24, 17, dark ? "#94a3b8" : "#64748b");
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 66, 20, flashTxt.indexOf("Caught") === 0 ? "#16a34a" : "#dc2626"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 22, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#f59e0b" : "#dc2626"; rr(g, 160, H - 22, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
