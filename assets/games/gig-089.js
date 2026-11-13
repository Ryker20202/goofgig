/* GoofGig — Gig #089 Spoon Simon */
registerGame({
  n: 89, title: "Spoon Simon",
  desc: "The spoons light up in a pattern. Repeat it. Blame the spoons.",
  hint: 'Watch the <b>spoons light up</b> in sequence, then <b>tap them in the same order</b>. Each round adds one more spoon. Survive all <b>5 rounds</b>.',
  grades: [
    ["Spoon Whisperer", "Five rounds, zero doubt. The cutlery drawer fears you."],
    ["Pattern Royalty", "Your memory has its own theme music."],
    ["Solid Spooner", "A strong run before the spoons got sneaky."],
    ["Wobbly Recall", "Round two is where it all went sideways."],
    ["Spoon Amnesiac", "The first spoon was already too much lore."]
  ],
  thumb: function (g) {
    [70, 130, 190, 250].forEach(function (x, i) {
      g.fillStyle = ["#e3352b", "#ffb627", "#35c4a0", "#57b7dd"][i];
      g.beginPath(); g.ellipse(x, 34, 15, 19, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#aeb9c4"; g.fillRect(x - 3, 52, 6, 30);
    });
  },
  create: function (api) {
    var seq = [], round = 1, phase = "play", playIdx = 0, playTimer = 0, lit = -1, inputIdx = 0, stepsDone = 0, done = false, waitTimer = 0;
    for (var i = 0; i < 5; i++) seq.push(Math.floor(Math.random() * 4));
    var COLORS = ["#e3352b", "#ffb627", "#35c4a0", "#57b7dd"];
    var spoonX = function (i) { return 150 + i * 140; };
    function finishRound() {
      done = true;
      var score = clamp(Math.round(stepsDone / 15 * 100), 2, 100);
      if (stepsDone >= 15) { score = 100; sndGood(); } else if (stepsDone >= 8) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Steps repeated", value: Math.round(stepsDone / 15 * 100), text: stepsDone + " / 15", good: stepsDone >= 10 },
        { label: "Round reached", value: round * 20, text: "Round " + round + " / 5" }
      ] });
    }
    return {
      status: function () {
        if (done) return "The spoons rest.";
        if (phase === "play") return "Watch… round " + round;
        if (phase === "wait") return "Get ready…";
        return "Your turn — step " + (inputIdx + 1) + " of " + round;
      },
      down: function (p) {
        if (done || phase !== "input") return;
        audio();
        for (var i = 0; i < 4; i++) {
          if (Math.abs(p.x - spoonX(i)) < 62 && p.y > 130 && p.y < 400) {
            lit = i; playTimer = 0.18;
            blip(340 + i * 110, .12, "triangle", .08);
            if (i === seq[inputIdx]) {
              inputIdx++; stepsDone++;
              if (inputIdx >= round) {
                if (round >= 5) { finishRound(); return; }
                round++; inputIdx = 0; phase = "wait"; waitTimer = 0;
              }
            } else { finishRound(); }
            return;
          }
        }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (phase === "wait") { waitTimer += dt; if (waitTimer > 0.9) { phase = "play"; playIdx = 0; playTimer = 0; lit = -1; } }
        else if (phase === "play") {
          playTimer -= dt;
          if (playTimer <= 0) {
            if (lit >= 0) { lit = -1; playTimer = 0.16; }
            else if (playIdx < round) { lit = seq[playIdx]; blip(340 + lit * 110, .12, "triangle", .07); playIdx++; playTimer = 0.46; }
            else { phase = "input"; inputIdx = 0; }
          }
        } else if (lit >= 0) { playTimer -= dt; if (playTimer <= 0) lit = -1; }
        txt(g, "ROUND " + round + " / 5", W / 2, 66, 20, dark ? "#c4a68d" : "#7a5f4d");
        // progress pips
        for (var r = 0; r < 5; r++) { g.fillStyle = r < round - 1 ? "#35c4a0" : (r === round - 1 ? "#ffb627" : (dark ? "#4a3423" : "#e5d9c5")); g.beginPath(); g.arc(W / 2 - 60 + r * 30, 96, 8, 0, Math.PI * 2); g.fill(); }
        // spoons
        for (var i = 0; i < 4; i++) {
          var x = spoonX(i), glow = lit === i;
          if (glow) { g.fillStyle = COLORS[i]; g.globalAlpha = 0.3; g.beginPath(); g.arc(x, 226, 66, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; }
          g.fillStyle = glow ? COLORS[i] : (dark ? "#6b543f" : "#cbb892");
          g.beginPath(); g.ellipse(x, 208, 40, 52, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = glow ? "#fff" : (dark ? "#8a715a" : "#e8dcc2");
          g.beginPath(); g.ellipse(x, 200, 27, 38, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = dark ? "#8a715a" : "#b8a67e"; rr(g, x - 8, 258, 16, 108, 7); g.fill();
          txt(g, "" + (i + 1), x, 410, 17, dark ? "#c4a68d" : "#7a5f4d");
        }
        if (phase === "play") txt(g, "Watch the spoons…", W / 2, 448, 18, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
        if (phase === "input") txt(g, "Now repeat it!", W / 2, 448, 18, "#0e9594");
      }
    };
  }
});
