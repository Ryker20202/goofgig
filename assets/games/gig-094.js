/* GoofGig — Gig #094 Bubble Wrap */
registerGame({
  n: 94, title: "Bubble Wrap",
  desc: "A fresh sheet of bubble wrap. You have 15 seconds and no self-control.",
  hint: '<b>Drag your finger (or mouse) across the bubbles</b> to pop them all. <b>15 seconds</b>. Pop percentage is your score. Satisfying noises included.',
  grades: [
    ["Wrap Annihilator", "Every single bubble. Gone. The sheet fears nothing anymore."],
    ["Pop Professional", "A near-total popping. Extremely therapeutic."],
    ["Casual Popper", "A respectable popping session. Some bubbles survived to tell tales."],
    ["Gentle Soul", "You popped them like you were apologizing to each one."],
    ["Bubble Preservationist", "The bubbles are all fine. Nothing was accomplished. Slowly."]
  ],
  thumb: function (g) {
    g.fillStyle = "#bfe3f2";
    for (var r = 0; r < 2; r++) for (var c = 0; c < 6; c++) { g.beginPath(); g.arc(105 + c * 19, 30 + r * 26, 8, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.arc(102, 27, 3, 0, Math.PI * 2); g.fill();
  },
  create: function (api) {
    var COLS = 8, ROWS = 4, TOTAL = COLS * ROWS;
    var popped = [], count = 0, timeLeft = 15, started = false, holding = false, done = false;
    for (var i = 0; i < TOTAL; i++) popped.push(false);
    var bx = function (i) { return 92 + (i % COLS) * 78; };
    var by = function (i) { return 128 + Math.floor(i / COLS) * 76; };
    function popAt(p) {
      for (var i = 0; i < TOTAL; i++) {
        if (!popped[i] && dist(p.x, p.y, bx(i), by(i)) < 34) {
          popped[i] = true; count++; blip(300 + Math.random() * 500, .04, "square", .05);
          if (count >= TOTAL) finishRound();
        }
      }
    }
    function finishRound() {
      if (done) return;
      done = true;
      var pct = Math.round(count / TOTAL * 100);
      if (pct >= 90) sndGood(); else sndBad();
      api.finish({ score: pct, rows: [
        { label: "Bubbles popped", value: pct, text: count + " / " + TOTAL, good: pct >= 80 },
        { label: "Time left", value: clamp(timeLeft / 15 * 100, 0, 100), text: timeLeft.toFixed(1) + "s" }
      ] });
    }
    return {
      status: function () { return done ? "Sheet destroyed (or not)." : (started ? "Popped " + count + " / " + TOTAL + " · " + Math.ceil(timeLeft) + "s" : "Press and drag to pop!"); },
      down: function (p) { if (done) return; started = true; holding = true; audio(); popAt(p); },
      move: function (p) { if (done || !holding) return; popAt(p); },
      up: function () { holding = false; },
      draw: function (g, dt) {
        var dark = isDark();
        if (started && !done) { timeLeft -= dt; if (timeLeft <= 0) finishRound(); }
        txt(g, "POP THEM ALL", W / 2, 52, 22, dark ? "#f7e8d8" : "#33241a");
        g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 170, 70, 380, 12, 6); g.fill();
        g.fillStyle = timeLeft < 4 ? "#d93e22" : "#57b7dd"; rr(g, 170, 70, 380 * clamp(timeLeft / 15, 0, 1), 12, 6); g.fill();
        // sheet
        g.fillStyle = dark ? "#31435a" : "#dceef7"; rr(g, 52, 96, 616, 330, 16); g.fill();
        for (var i = 0; i < TOTAL; i++) {
          var x = bx(i), y = by(i);
          if (popped[i]) {
            g.strokeStyle = dark ? "#5a7186" : "#a9c6d8"; g.lineWidth = 2;
            g.beginPath(); g.arc(x, y, 15, 0, Math.PI * 2); g.stroke();
            g.beginPath(); g.moveTo(x - 9, y - 6); g.lineTo(x + 9, y + 6); g.moveTo(x + 9, y - 6); g.lineTo(x - 9, y + 6); g.stroke();
          } else {
            var grad = g.createRadialGradient(x - 9, y - 10, 3, x, y, 27);
            grad.addColorStop(0, "#ffffff"); grad.addColorStop(0.55, "#bfe3f2"); grad.addColorStop(1, "#8fc3dd");
            g.fillStyle = grad; g.beginPath(); g.arc(x, y, 26, 0, Math.PI * 2); g.fill();
            g.strokeStyle = "rgba(90,140,170,.6)"; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 26, 0, Math.PI * 2); g.stroke();
          }
        }
      }
    };
  }
});
