/* GoofGig — Gig #091 Odd One Out */
registerGame({
  n: 91, title: "Odd One Out",
  desc: "Nine happy faces. One of them is lying. Find it. Eight times.",
  hint: 'Nine faces, <b>one is subtly different</b> — a wink, a tongue, a wonky brow. <b>Tap the odd one</b>. <b>8 rounds</b>, and the clock gets ruder every round.',
  grades: [
    ["Eagle Eye Supreme", "Eight for eight, at speed. Faces fear your gaze."],
    ["Face Detective", "You read expressions like warning labels."],
    ["Decent Spotter", "Solid work. A few faces fooled you briefly."],
    ["Squinter", "The odd ones were not even hiding that hard."],
    ["Face Blind Freddy", "You tapped the normal ones with total confidence."]
  ],
  thumb: function (g) {
    for (var i = 0; i < 3; i++) { g.fillStyle = "#ffcf4d"; g.beginPath(); g.arc(115 + i * 36, 46, 15, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#33241a"; g.beginPath(); g.arc(110, 42, 2.4, 0, Math.PI * 2); g.arc(152, 42, 2.4, 0, Math.PI * 2); g.fill();
    g.fillRect(182, 41, 9, 2.6);
    g.strokeStyle = "#33241a"; g.lineWidth = 2; g.beginPath(); g.arc(187, 48, 7, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
  },
  create: function (api) {
    var round = 1, odd = 0, kind = 0, timeLeft = 6, roundsWon = 0, speedBonus = 0, done = false, flash = 0;
    function newRound() {
      odd = Math.floor(Math.random() * 9);
      kind = Math.floor(Math.random() * 3);
      timeLeft = Math.max(2.4, 6.2 - round * 0.45);
    }
    newRound();
    function finishRound() {
      done = true;
      var score = clamp(Math.round(roundsWon * 10 + speedBonus), 1, 100);
      if (roundsWon >= 7) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Odd ones found", value: roundsWon * 12.5, text: roundsWon + " / 8", good: roundsWon >= 6 },
        { label: "Speed bonus", value: clamp(speedBonus * 4, 0, 100), text: "+" + Math.round(speedBonus) }
      ] });
    }
    function next() {
      if (round >= 8) { finishRound(); return; }
      round++; newRound();
    }
    var cellX = function (i) { return 205 + (i % 3) * 155; };
    var cellY = function (i) { return 158 + Math.floor(i / 3) * 108; };
    return {
      status: function () { return done ? "Case closed." : "Round " + round + " / 8 · " + timeLeft.toFixed(1) + "s"; },
      down: function (p) {
        if (done) return;
        audio();
        for (var i = 0; i < 9; i++) {
          if (dist(p.x, p.y, cellX(i), cellY(i)) < 52) {
            if (i === odd) { roundsWon++; speedBonus += clamp(timeLeft / 6 * 2.4, 0, 2.4); flash = 0.25; blip(700, .08, "sine", .07); next(); }
            else { blip(150, .12, "sawtooth", .06); speedBonus = Math.max(0, speedBonus - 1); next(); }
            return;
          }
        }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (!done) { timeLeft -= dt; if (flash > 0) flash -= dt; if (timeLeft <= 0) next(); }
        txt(g, "WHICH FACE IS DIFFERENT?", W / 2, 52, 21, dark ? "#f7e8d8" : "#33241a");
        g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 190, 72, 340, 12, 6); g.fill();
        g.fillStyle = timeLeft < 1.5 ? "#d93e22" : "#ffb627"; rr(g, 190, 72, 340 * clamp(timeLeft / 6.2, 0, 1), 12, 6); g.fill();
        for (var i = 0; i < 9; i++) {
          var x = cellX(i), y = cellY(i), isOdd = i === odd;
          g.fillStyle = "#ffcf4d"; g.beginPath(); g.arc(x, y, 42, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "rgba(160,110,20,.5)"; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 42, 0, Math.PI * 2); g.stroke();
          g.fillStyle = "#33241a";
          // eyes
          if (isOdd && kind === 0) { g.fillRect(x + 9, y - 13, 13, 3.4); g.beginPath(); g.arc(x - 15, y - 11, 3.6, 0, Math.PI * 2); g.fill(); }
          else { g.beginPath(); g.arc(x - 15, y - 11, 3.6, 0, Math.PI * 2); g.arc(x + 15, y - 11, 3.6, 0, Math.PI * 2); g.fill(); }
          // brows
          g.strokeStyle = "#33241a"; g.lineWidth = 3;
          g.beginPath();
          if (isOdd && kind === 2) { g.moveTo(x - 22, y - 26); g.lineTo(x - 8, y - 30); g.moveTo(x + 8, y - 22); g.lineTo(x + 22, y - 25); }
          else { g.moveTo(x - 22, y - 25); g.lineTo(x - 8, y - 27); g.moveTo(x + 8, y - 27); g.lineTo(x + 22, y - 25); }
          g.stroke();
          // mouth
          if (isOdd && kind === 1) {
            g.strokeStyle = "#33241a"; g.lineWidth = 3; g.beginPath(); g.arc(x, y + 8, 16, 0.1 * Math.PI, 0.9 * Math.PI); g.stroke();
            g.fillStyle = "#e88ca0"; rr(g, x - 5, y + 21, 10, 13, 5); g.fill();
          } else {
            g.strokeStyle = "#33241a"; g.lineWidth = 3; g.beginPath(); g.arc(x, y + 6, 16, 0.1 * Math.PI, 0.9 * Math.PI); g.stroke();
          }
        }
        if (flash > 0) { g.fillStyle = "rgba(53,196,160,.18)"; g.fillRect(0, 0, W, 460); }
      }
    };
  }
});
