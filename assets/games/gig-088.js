/* GoofGig — Gig #088 Waiter Memory */
registerGame({
  n: 88, title: "Waiter Memory",
  desc: "Memorize the order. Repeat it back. The customer is watching.",
  hint: 'An order of <b>4 dishes</b> shows for <b>2 seconds</b>, then hides. <b>Tap the dishes</b> below in the <b>same order</b>. One retry allowed — for fewer points.',
  grades: [
    ["Memory Sommelier", "Flawless recall. The kitchen bows to you."],
    ["Five-Star Waiter", "The table got exactly what it wanted."],
    ["Reliable Server", "Mostly right. The soup was a surprise, but fine."],
    ["Chaotic Waiter", "Table 6 ordered pizza. They got vibes."],
    ["Fired by Lunch", "You served the order to a completely different restaurant."]
  ],
  thumb: function (g) {
    g.fillStyle = "#f4a259"; g.beginPath(); g.moveTo(120, 66); g.lineTo(180, 66); g.lineTo(150, 22); g.closePath(); g.fill();
    g.fillStyle = "#d93e22"; g.beginPath(); g.arc(142, 54, 5, 0, Math.PI * 2); g.arc(158, 48, 5, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#8a5a28"; rr(g, 205, 34, 44, 14, 6); g.fill();
    g.fillStyle = "#e8cfa8"; rr(g, 205, 50, 44, 12, 6); g.fill();
  },
  create: function (api) {
    var FOODS = ["Pizza", "Burger", "Drink", "Cake", "Apple", "Donut"];
    var order = [], picks = [], phase = "show", timer = 0, attempt = 1, done = false, firstScore = 0;
    var seen = {};
    while (order.length < 4) { var f = Math.floor(Math.random() * 6); if (!seen[f]) { seen[f] = 1; order.push(f); } }
    function drawFood(g, kind, x, y, s) {
      g.save(); g.translate(x, y); g.scale(s, s);
      if (kind === 0) { g.fillStyle = "#f4a259"; g.beginPath(); g.moveTo(-26, 20); g.lineTo(26, 20); g.lineTo(0, -28); g.closePath(); g.fill(); g.fillStyle = "#d93e22"; g.beginPath(); g.arc(-8, 6, 5, 0, Math.PI * 2); g.arc(9, -4, 5, 0, Math.PI * 2); g.fill(); }
      else if (kind === 1) { g.fillStyle = "#e0aa5e"; rr(g, -26, -24, 52, 14, 7); g.fill(); g.fillStyle = "#8a5a28"; rr(g, -26, -6, 52, 10, 4); g.fill(); g.fillStyle = "#7fb069"; rr(g, -26, 6, 52, 7, 3); g.fill(); g.fillStyle = "#e0aa5e"; rr(g, -26, 15, 52, 10, 5); g.fill(); }
      else if (kind === 2) { g.fillStyle = "#57b7dd"; g.beginPath(); g.moveTo(-16, -22); g.lineTo(16, -22); g.lineTo(11, 26); g.lineTo(-11, 26); g.closePath(); g.fill(); g.strokeStyle = "#d93e22"; g.lineWidth = 5; g.beginPath(); g.moveTo(8, -24); g.lineTo(20, -38); g.stroke(); }
      else if (kind === 3) { g.fillStyle = "#f7c8d8"; rr(g, -26, -6, 52, 32, 5); g.fill(); g.fillStyle = "#fff"; rr(g, -26, -16, 52, 12, 5); g.fill(); g.fillStyle = "#ffb627"; g.fillRect(-2, -30, 4, 12); g.fillStyle = "#ff8c42"; g.beginPath(); g.arc(0, -33, 4, 0, Math.PI * 2); g.fill(); }
      else if (kind === 4) { g.fillStyle = "#d93e22"; g.beginPath(); g.arc(0, 4, 24, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#8a5a28"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -16); g.quadraticCurveTo(2, -26, 8, -30); g.stroke(); g.fillStyle = "#7fb069"; g.beginPath(); g.ellipse(14, -24, 9, 5, 0.6, 0, Math.PI * 2); g.fill(); }
      else { g.strokeStyle = "#e88ca0"; g.lineWidth = 13; g.beginPath(); g.arc(0, 0, 17, 0, Math.PI * 2); g.stroke(); g.fillStyle = "#8a5a28"; g.beginPath(); g.arc(-7, -8, 2.5, 0, Math.PI * 2); g.arc(8, 4, 2.5, 0, Math.PI * 2); g.arc(0, 12, 2.5, 0, Math.PI * 2); g.fill(); }
      g.restore();
    }
    function correctCount() { var c = 0; for (var i = 0; i < 4; i++) if (picks[i] === order[i]) c++; return c; }
    function finishRound(score) {
      done = true;
      var c = correctCount();
      api.finish({ score: score, rows: [
        { label: "Dishes in right spot", value: c * 25, text: c + " / 4", good: c >= 3 },
        { label: "Attempts used", value: attempt === 1 ? 100 : 50, text: attempt === 1 ? "First try" : "Needed the retry" }
      ] });
    }
    function judge() {
      var c = correctCount();
      if (attempt === 1) {
        firstScore = c * 25;
        if (c === 4) { sndGood(); finishRound(100); }
        else { phase = "show2"; timer = 0; picks = []; }
      } else {
        var s = Math.min(70, c * 17 + (c === 4 ? 2 : 0));
        if (c >= 3) sndGood(); else sndBad();
        finishRound(Math.max(s, Math.min(firstScore, 40)));
      }
    }
    var btnX = function (i) { return 85 + i * 111; };
    return {
      status: function () {
        if (done) return "Order delivered!";
        if (phase === "show") return "Memorize the order!";
        if (phase === "show2") return "One more look — retry round!";
        return "Your pick " + (picks.length + 1) + " of 4" + (attempt === 2 ? " (retry)" : "");
      },
      down: function (p) {
        if (done || (phase !== "input" && phase !== "input2")) return;
        audio();
        if (p.y > 330 && p.y < 440) {
          for (var i = 0; i < 6; i++) {
            if (Math.abs(p.x - btnX(i)) < 52) {
              if (picks.indexOf(i) >= 0) return;
              picks.push(i); blip(420 + i * 60, .06, "sine", .06);
              if (picks.length === 4) judge();
              return;
            }
          }
        }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if ((phase === "show" || phase === "show2") && !done) {
          timer += dt;
          if (timer >= (phase === "show" ? 2.0 : 1.6)) { phase = phase === "show" ? "input" : "input2"; }
        }
        txt(g, phase === "show2" || phase === "input2" ? "THE ORDER (retry — look well!)" : "THE ORDER", W / 2, 58, 19, dark ? "#c4a68d" : "#7a5f4d");
        // order display area
        g.fillStyle = dark ? "#3a2c20" : "#fdf1dc"; rr(g, 110, 84, 500, 130, 14); g.fill();
        if (phase === "show" || phase === "show2") {
          for (var i = 0; i < 4; i++) {
            drawFood(g, order[i], 180 + i * 120, 150, 1.15);
            txt(g, FOODS[order[i]], 180 + i * 120, 200, 14, dark ? "#f7e8d8" : "#5d3a16");
          }
        } else {
          for (var j = 0; j < 4; j++) {
            if (picks[j] !== undefined) { drawFood(g, picks[j], 180 + j * 120, 150, 1.15); txt(g, FOODS[picks[j]], 180 + j * 120, 200, 14, dark ? "#f7e8d8" : "#5d3a16"); }
            else txt(g, "?", 180 + j * 120, 158, 40, dark ? "#8a715a" : "#c9b18c");
          }
        }
        // notepad line
        txt(g, "Tap the dishes in the order they appeared:", W / 2, 268, 17, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
        // food buttons
        for (var b = 0; b < 6; b++) {
          var used = picks.indexOf(b) >= 0;
          g.fillStyle = used ? (dark ? "#2c2119" : "#e5d9c5") : (dark ? "#4a3423" : "#fff6e8");
          rr(g, btnX(b) - 50, 336, 100, 96, 12); g.fill();
          g.strokeStyle = dark ? "#7a5f4d" : "#d9b98a"; g.lineWidth = 2; rr(g, btnX(b) - 50, 336, 100, 96, 12); g.stroke();
          drawFood(g, b, btnX(b), 372, 0.8);
          txt(g, FOODS[b], btnX(b), 420, 13, used ? "#9a8871" : (dark ? "#f7e8d8" : "#5d3a16"));
        }
      }
    };
  }
});
