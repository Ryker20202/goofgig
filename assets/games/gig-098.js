/* GoofGig — Gig #098 Secret 3 Seconds */
registerGame({
  n: 98, title: "Secret 3 Seconds",
  desc: "Feel exactly 3 seconds pass. No clock. Just vibes and confidence.",
  hint: '<b>Tap once</b> to start a hidden timer. <b>Tap again</b> when you believe exactly <b>3.0 seconds</b> have passed. <b>3 attempts</b>, averaged. Trust your gut.',
  grades: [
    ["Human Stopwatch", "Your insides are basically a atomic clock. Terrifying."],
    ["Time Feeler", "You and the seconds are close personal friends."],
    ["Decent Sense of Time", "Close enough that nobody checked. Except us. We checked."],
    ["Vibes-Based Timing", "Your seconds are longer than everyone else's. Or shorter. Both?"],
    ["Time Tourist", "You visited 3 seconds. You just weren't there when it happened."]
  ],
  thumb: function (g) {
    g.strokeStyle = "#57b7dd"; g.lineWidth = 5; g.beginPath(); g.arc(150, 50, 28, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#57b7dd"; g.fillRect(146, 12, 8, 8);
    txt(g, "?", 150, 60, 26, "#e3352b");
  },
  create: function (api) {
    var attempt = 0, running = false, startNow = 0, errors = [], lastTime = -1, done = false;
    function finishRound() {
      done = true;
      var mean = (errors[0] + errors[1] + errors[2]) / 3;
      var score = clamp(Math.round(100 - mean * 58), 2, 100);
      if (score >= 75) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Average error", value: clamp(100 - mean * 58, 0, 100), text: mean.toFixed(2) + "s off", good: mean < 0.35 },
        { label: "Best attempt", value: clamp(100 - Math.min(errors[0], errors[1], errors[2]) * 58, 0, 100), text: Math.min(errors[0], errors[1], errors[2]).toFixed(2) + "s off" }
      ] });
    }
    return {
      status: function () {
        if (done) return "Time has been judged.";
        if (running) return "Counting… in your head… tap at 3.0s";
        return "Attempt " + (attempt + 1) + " / 3 — tap to start";
      },
      down: function (p, now) {
        if (done) return;
        audio();
        if (!running) { running = true; startNow = now; blip(520, .06, "sine", .05); }
        else {
          running = false;
          var t = (now - startNow) / 1000;
          lastTime = t;
          errors.push(Math.abs(t - 3));
          attempt++;
          blip(Math.abs(t - 3) < 0.25 ? 760 : 300, .09, "sine", .06);
          if (attempt >= 3) finishRound();
        }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt, now) {
        var dark = isDark();
        // big mystery clock
        var cx = W / 2, cy = 218;
        g.strokeStyle = dark ? "#8a715a" : "#b8a67e"; g.lineWidth = 8;
        g.beginPath(); g.arc(cx, cy, 104, 0, Math.PI * 2); g.stroke();
        g.fillStyle = dark ? "#3a2c20" : "#fdf1dc"; g.beginPath(); g.arc(cx, cy, 100, 0, Math.PI * 2); g.fill();
        if (running) {
          var pulse = 1 + Math.sin(now / 160) * 0.06;
          txt(g, "?", cx, cy + 30 * pulse, Math.round(84 * pulse), "#e3352b");
          txt(g, "feel it…", cx, cy + 82, 17, dark ? "#c4a68d" : "#7a5f4d");
        } else {
          txt(g, lastTime >= 0 ? lastTime.toFixed(2) + "s" : "3.00s", cx, cy + 18, 44, dark ? "#f7e8d8" : "#33241a");
          txt(g, lastTime >= 0 ? "that was your last attempt" : "your target", cx, cy + 58, 15, dark ? "#c4a68d" : "#7a5f4d");
        }
        g.fillStyle = dark ? "#8a715a" : "#b8a67e"; rr(g, cx - 8, cy - 128, 16, 18, 4); g.fill();
        // attempt dots with errors
        for (var i = 0; i < 3; i++) {
          var x = cx - 60 + i * 60, y = 392;
          if (errors[i] !== undefined) {
            g.fillStyle = errors[i] < 0.25 ? "#35c4a0" : (errors[i] < 0.6 ? "#ffb627" : "#e3352b");
            g.beginPath(); g.arc(x, y, 15, 0, Math.PI * 2); g.fill();
            txt(g, errors[i].toFixed(2), x, y + 38, 14, dark ? "#c4a68d" : "#7a5f4d");
          } else {
            g.strokeStyle = dark ? "#8a715a" : "#b8a67e"; g.lineWidth = 3;
            g.beginPath(); g.arc(x, y, 15, 0, Math.PI * 2); g.stroke();
            txt(g, "" + (i + 1), x, y + 5, 15, dark ? "#c4a68d" : "#7a5f4d");
          }
        }
        txt(g, running ? "TAP at exactly 3.0 seconds!" : "Tap anywhere to " + (attempt === 0 ? "start" : "go again"), W / 2, 448, 17, "#0e9594");
      }
    };
  }
});
