/* GoofGig — Gig #090 Color Call */
registerGame({
  n: 90, title: "Color Call",
  desc: "Balls rain down. Only one color is legal. You know which. Probably.",
  hint: 'A <b>target color</b> is called at the top. <b>Tap only balls of that color</b> as they rain down. Wrong taps hurt. <b>20 seconds</b> — go.',
  grades: [
    ["Color Sniper", "Every tap was legal. The rainbow is impressed."],
    ["Sharp Eyes", "Fast, clean, barely any collateral damage."],
    ["Decent Picker", "Mostly the right color. Mostly."],
    ["Color Gambler", "You tapped first and read the instructions never."],
    ["Rainbow Menace", "Every color feared you equally. Chaos achieved."]
  ],
  thumb: function (g) {
    var cols = ["#e3352b", "#57b7dd", "#35c4a0", "#ffb627"];
    cols.forEach(function (c, i) { g.fillStyle = c; g.beginPath(); g.arc(105 + i * 34, 30 + (i % 2) * 26, 14, 0, Math.PI * 2); g.fill(); });
  },
  create: function (api) {
    var NAMES = ["RED", "BLUE", "GREEN", "YELLOW"];
    var COLS = ["#e3352b", "#57b7dd", "#35c4a0", "#ffb627"];
    var target = Math.floor(Math.random() * 4), balls = [], timeLeft = 20, started = false, done = false;
    var correct = 0, wrong = 0, spawnT = 0, targetT = 0;
    function finishRound() {
      done = true;
      var score = clamp(Math.round(correct * 5.5 - wrong * 7), 1, 100);
      if (score >= 70) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Right-color pops", value: clamp(correct * 5, 0, 100), text: "" + correct, good: correct >= 12 },
        { label: "Illegal taps", value: clamp(100 - wrong * 12, 0, 100), text: "" + wrong }
      ] });
    }
    return {
      status: function () { return done ? "Rain over." : (started ? "Time " + Math.ceil(timeLeft) + "s · ✓ " + correct + " · ✗ " + wrong : "Tap a ball to start!"); },
      down: function (p) {
        if (done) return;
        started = true; audio();
        for (var i = balls.length - 1; i >= 0; i--) {
          var b = balls[i];
          if (dist(p.x, p.y, b.x, b.y) < b.r + 6) {
            if (b.c === target) { correct++; blip(620, .07, "sine", .07); }
            else { wrong++; blip(140, .12, "sawtooth", .06); }
            balls.splice(i, 1);
            return;
          }
        }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (started && !done) {
          timeLeft -= dt;
          spawnT -= dt; targetT -= dt;
          if (spawnT <= 0) { spawnT = 0.42; balls.push({ x: 50 + Math.random() * (W - 100), y: -30, r: 24 + Math.random() * 10, c: Math.floor(Math.random() * 4), v: 130 + Math.random() * 130 }); }
          if (targetT <= 0) { targetT = 4.2; target = Math.floor(Math.random() * 4); }
          if (timeLeft <= 0) { finishRound(); }
        }
        for (var i = balls.length - 1; i >= 0; i--) { balls[i].y += balls[i].v * dt; if (balls[i].y > 500) balls.splice(i, 1); }
        // target banner
        g.fillStyle = dark ? "#3a2c20" : "#fdf1dc"; rr(g, 190, 22, 340, 64, 14); g.fill();
        txt(g, "TAP ONLY:", W / 2 - 52, 62, 20, dark ? "#c4a68d" : "#7a5f4d");
        g.fillStyle = COLS[target]; g.beginPath(); g.arc(W / 2 + 62, 54, 17, 0, Math.PI * 2); g.fill();
        txt(g, NAMES[target], W / 2 + 128, 62, 20, COLS[target]);
        // timer bar
        g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 140, 104, 440, 12, 6); g.fill();
        g.fillStyle = timeLeft < 5 ? "#d93e22" : "#35c4a0"; rr(g, 140, 104, 440 * clamp(timeLeft / 20, 0, 1), 12, 6); g.fill();
        // balls
        balls.forEach(function (b) {
          g.fillStyle = b.c === target ? COLS[b.c] : COLS[b.c];
          g.beginPath(); g.arc(b.x, b.y, b.r, 0, Math.PI * 2); g.fill();
          g.fillStyle = "rgba(255,255,255,.45)"; g.beginPath(); g.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.32, 0, Math.PI * 2); g.fill();
        });
        if (!started) txt(g, "Tap any ball to start the rain", W / 2, 250, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
      }
    };
  }
});
