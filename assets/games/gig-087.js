/* GoofGig — Gig #087 Sheep Count */
registerGame({
  n: 87, title: "Sheep Count",
  desc: "Sheep hop the fence one by one. Count them. All of them. No pressure.",
  hint: 'Sheep will hop over the fence one at a time. <b>Tap anywhere</b> once for <b>each sheep</b>. At the end, your count faces the truth.',
  grades: [
    ["Shepherd Supreme", "Exact count. The sheep respect you now."],
    ["Certified Counter", "Basically a sheep accountant at this point."],
    ["Decent Herder", "Close. A couple of sheep have questions."],
    ["Woolly Guesser", "Some sheep were counted twice. Some never existed."],
    ["Asleep on Duty", "You had ONE job. The sheep have unionized."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fff"; g.beginPath(); g.ellipse(140, 48, 34, 22, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#33241a"; g.beginPath(); g.arc(172, 42, 9, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#8a5a28"; g.fillRect(196, 26, 6, 46);
    g.fillStyle = "#a06a35"; g.fillRect(182, 40, 34, 6);
  },
  create: function (api) {
    var total = 12 + Math.floor(Math.random() * 7); // 12..18
    var idx = 0, t = 0, hopDur = 1.0, gap = 0.35, phase = "hop", timer = 0, count = 0, done = false;
    function nextHop() { hopDur = 0.75 + Math.random() * 0.75; t = 0; }
    nextHop();
    function finishRound() {
      done = true;
      var err = Math.abs(count - total);
      var score = clamp(Math.round(100 - err * 16), 1, 100);
      if (err === 0) score = 100;
      if (err >= 4) sndBad(); else sndGood();
      api.finish({ score: score, rows: [
        { label: "Your count", value: clamp(100 - err * 16, 2, 100), text: count + " sheep" },
        { label: "Actual sheep", value: 100, text: total + " sheep", good: err === 0 }
      ] });
    }
    return {
      status: function () { return done ? "The flock has spoken." : "Your count: " + count + " (tap per sheep!)"; },
      down: function () { if (done || phase === "end") return; count++; blip(500 + Math.random() * 200, .05, "sine", .05); },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        // sky + ground
        g.fillStyle = dark ? "#2c3e50" : "#bfe6f5"; g.fillRect(0, 0, W, 330);
        g.fillStyle = dark ? "#3d5a3a" : "#8ed081"; g.fillRect(0, 330, W, 130);
        // fence
        g.fillStyle = "#8a5a28"; g.fillRect(352, 252, 10, 92); g.fillRect(430, 252, 10, 92);
        g.fillStyle = "#a06a35"; g.fillRect(330, 272, 132, 10); g.fillRect(330, 306, 132, 10);
        // sheep hop animation
        if (phase === "hop" && idx < total) {
          t += dt / hopDur;
          if (t >= 1) { idx++; phase = "gap"; timer = 0; if (idx >= total) { phase = "end"; timer = 0; } else nextHop(); }
        } else if (phase === "gap") {
          timer += dt; if (timer >= gap) phase = "hop";
        } else if (phase === "end") {
          timer += dt; if (timer >= 0.9 && !done) finishRound();
        }
        if (phase === "hop" && idx < total) {
          var sx = 180 + t * 360, sy = 316 - Math.sin(t * Math.PI) * 120;
          g.fillStyle = "rgba(0,0,0,.12)"; g.beginPath(); g.ellipse(180 + t * 360, 344, 30, 6, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#fff";
          g.beginPath(); g.ellipse(sx, sy, 38, 25, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.arc(sx - 18, sy - 16, 13, 0, Math.PI * 2); g.arc(sx + 10, sy - 20, 15, 0, Math.PI * 2); g.arc(sx + 24, sy - 8, 11, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#33241a"; g.beginPath(); g.arc(sx + 40, sy - 4, 10, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#fff"; g.beginPath(); g.arc(sx + 43, sy - 7, 3, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#33241a"; g.lineWidth = 3;
          g.beginPath(); g.moveTo(sx - 16, sy + 22); g.lineTo(sx - 16, sy + 34); g.moveTo(sx + 16, sy + 22); g.lineTo(sx + 16, sy + 34); g.stroke();
        }
        // already-counted flock waiting on the right
        for (var i = 0; i < Math.min(idx, 6); i++) {
          var fx = 560 + (i % 3) * 52, fy = 356 + Math.floor(i / 3) * 40;
          g.fillStyle = "#fff"; g.beginPath(); g.ellipse(fx, fy, 20, 13, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#33241a"; g.beginPath(); g.arc(fx + 20, fy - 3, 6, 0, Math.PI * 2); g.fill();
        }
        // big counter display
        txt(g, "YOUR COUNT", W / 2, 60, 17, dark ? "#c4a68d" : "#7a5f4d");
        txt(g, "" + count, W / 2, 108, 46, dark ? "#f7e8d8" : "#33241a");
        txt(g, "sheep " + (idx + (phase === "hop" ? 1 : 0)) + " is jumping… shh, no hints", W / 2, 448, 1, "rgba(0,0,0,0)");
        if (phase === "end") txt(g, "That was the last one…", W / 2, 150, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
      }
    };
  }
});
