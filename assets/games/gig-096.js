/* GoofGig — Gig #096 Dice Stop */
registerGame({
  n: 96, title: "Dice Stop",
  desc: "The die is spinning through faces at rude speed. Stop it on the called one.",
  hint: 'A <b>target face</b> is called. The die cycles like crazy — <b>tap to stop it</b> on the target. <b>5 rounds</b>. Near misses count a little.',
  grades: [
    ["Dice Whisperer", "Five stops, pure precision. The casino is nervous."],
    ["Sharp Stopper", "You and the die have an understanding."],
    ["Decent Gambler", "Some hits, some hopeful chaos."],
    ["Luck-Based Human", "Strategy: none. Effort: visible. Results: mixed."],
    ["Dice Victim", "The die did whatever it wanted. Every single time."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fff"; rr(g, 118, 14, 64, 64, 12); g.fill();
    g.strokeStyle = "#c9b18c"; g.lineWidth = 3; rr(g, 118, 14, 64, 64, 12); g.stroke();
    g.fillStyle = "#e3352b";
    [[134, 30], [166, 30], [150, 46], [134, 62], [166, 62]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 6, 0, Math.PI * 2); g.fill(); });
  },
  create: function (api) {
    var PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
    var round = 1, target = 1 + Math.floor(Math.random() * 6), face = 1, cycleT = 0, phase = "spin", resultT = 0, points = 0, hits = 0, done = false;
    function finishRound() {
      done = true;
      var score = clamp(points, 1, 100);
      if (hits >= 4) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Bullseye stops", value: hits * 20, text: hits + " / 5", good: hits >= 3 },
        { label: "Total points", value: points, text: points + " / 100" }
      ] });
    }
    return {
      status: function () {
        if (done) return "The die rests.";
        if (phase === "show") return face === target ? "BULLSEYE!" : "Stopped on " + face + " — target was " + target;
        return "Round " + round + " / 5 — stop on " + target + "!";
      },
      down: function () {
        if (done || phase !== "spin") return;
        audio();
        var d = Math.abs(face - target);
        if (d === 0) { points += 20; hits++; sndGood(); }
        else if (d === 1) { points += 8; blip(500, .08, "sine", .06); }
        else { points += 2; blip(160, .1, "sawtooth", .05); }
        phase = "show"; resultT = 0;
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (phase === "spin" && !done) {
          cycleT += dt;
          if (cycleT > 0.055) { cycleT = 0; face = face % 6 + 1; }
        } else if (phase === "show") {
          resultT += dt;
          if (resultT > 0.95) {
            if (round >= 5) { finishRound(); }
            else { round++; target = 1 + Math.floor(Math.random() * 6); phase = "spin"; cycleT = 0; }
          }
        }
        txt(g, "STOP ON", W / 2, 62, 18, dark ? "#c4a68d" : "#7a5f4d");
        // mini target die
        g.fillStyle = "#35c4a0"; rr(g, W / 2 - 30, 78, 60, 60, 10); g.fill();
        g.fillStyle = "#fff";
        PIPS[target].forEach(function (p) { g.beginPath(); g.arc(W / 2 + p[0] * 15, 108 + p[1] * 15, 6, 0, Math.PI * 2); g.fill(); });
        // big die
        var cx = W / 2, cy = 268, s = 150;
        g.fillStyle = phase === "show" ? (face === target ? "#eafff5" : "#fff") : "#fff";
        rr(g, cx - s / 2, cy - s / 2, s, s, 24); g.fill();
        g.strokeStyle = face === target && phase === "show" ? "#35c4a0" : "#c9b18c"; g.lineWidth = face === target && phase === "show" ? 6 : 3;
        rr(g, cx - s / 2, cy - s / 2, s, s, 24); g.stroke();
        g.fillStyle = face === 1 ? "#e3352b" : "#33241a";
        PIPS[face].forEach(function (p) { g.beginPath(); g.arc(cx + p[0] * 40, cy + p[1] * 40, 13, 0, Math.PI * 2); g.fill(); });
        // round pips
        for (var r = 0; r < 5; r++) { g.fillStyle = r < round - 1 || (r === round - 1 && phase === "show") ? "#ffb627" : (dark ? "#4a3423" : "#e5d9c5"); g.beginPath(); g.arc(W / 2 - 60 + r * 30, 396, 8, 0, Math.PI * 2); g.fill(); }
        txt(g, "Points: " + points, W / 2, 438, 18, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
        if (phase === "spin") txt(g, "TAP TO STOP!", W / 2, 176, 16, "#0e9594");
      }
    };
  }
});
