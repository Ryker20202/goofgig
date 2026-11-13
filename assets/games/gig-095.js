/* GoofGig — Gig #095 Sticker Peel */
registerGame({
  n: 95, title: "Sticker Peel",
  desc: "One big sticker. One laptop lid. Peel it slow. Peel it clean.",
  hint: '<b>Drag slowly and steadily</b> across the sticker to peel it off. <b>Too fast and it tears</b>. Fill the tear meter and the peel is ruined.',
  grades: [
    ["Surgical Peeler", "One piece. Zero residue. Deeply satisfying."],
    ["Steady Hands", "A clean, calm peel. The laptop is free."],
    ["Mostly Clean", "It came off, with minor emotional damage."],
    ["Rip Enthusiast", "That was less peeling, more shredding."],
    ["Sticker Shredder", "The sticker is now confetti. The lid is traumatized."]
  ],
  thumb: function (g) {
    g.fillStyle = "#aeb9c4"; rr(g, 92, 18, 116, 58, 6); g.fill();
    g.fillStyle = "#ffb627"; rr(g, 108, 30, 62, 34, 4); g.fill();
    g.fillStyle = "#e08e00"; g.beginPath(); g.moveTo(170, 30); g.lineTo(196, 44); g.lineTo(170, 64); g.closePath(); g.fill();
  },
  create: function (api) {
    var X0 = 130, X1 = 590, progress = 0, tear = 0, dragging = false, lastX = 0, lastNow = 0, done = false, torn = false, started = false;
    function finishRound() {
      done = true;
      var score;
      if (torn) score = clamp(Math.round(progress * 45), 2, 45);
      else score = clamp(Math.round(100 - tear * 55), 55, 100);
      if (!torn && score >= 75) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Peeled", value: Math.round(progress * 100), text: Math.round(progress * 100) + "%", good: progress > 0.9 },
        { label: "Tear damage", value: clamp(100 - tear * 100, 0, 100), text: torn ? "TORE APART" : Math.round(tear * 100) + "%" }
      ] });
    }
    return {
      status: function () {
        if (done) return torn ? "It tore. It really tore." : "Clean peel complete!";
        return "Peeled " + Math.round(progress * 100) + "% · tear " + Math.round(tear * 100) + "%";
      },
      down: function (p) {
        if (done) return;
        started = true; audio();
        if (p.y > 150 && p.y < 330) { dragging = true; lastX = p.x; lastNow = 0; }
      },
      move: function (p, now) {
        if (done || !dragging) return;
        var front = X0 + progress * (X1 - X0);
        if (Math.abs(p.x - front) < 130 && p.y > 130 && p.y < 350) {
          if (lastNow > 0) {
            var dt = Math.max(1, now - lastNow) / 1000;
            var speed = Math.abs(p.x - lastX) / dt; // px per second
            if (speed > 620) tear = clamp(tear + (speed - 620) / 2600, 0, 1);
          }
          lastX = p.x; lastNow = now;
          if (p.x > front) progress = clamp((p.x - X0) / (X1 - X0), progress, 1);
          if (tear >= 1) { torn = true; sndBad(); finishRound(); return; }
          if (progress >= 0.995) { progress = 1; finishRound(); }
        }
      },
      up: function () { dragging = false; lastNow = 0; },
      draw: function (g, dt) {
        var dark = isDark();
        if (!dragging && started && !done) tear = clamp(tear - dt * 0.02, 0, 1);
        txt(g, "PEEL IT… SLOWLY", W / 2, 56, 22, dark ? "#f7e8d8" : "#33241a");
        // laptop lid
        g.fillStyle = dark ? "#3c4654" : "#aeb9c4"; rr(g, 90, 120, 540, 240, 18); g.fill();
        g.strokeStyle = dark ? "#5a6a7a" : "#8b98a5"; g.lineWidth = 3; rr(g, 90, 120, 540, 240, 18); g.stroke();
        var front = X0 + progress * (X1 - X0);
        // peeled-away clean area
        if (progress > 0) { g.fillStyle = dark ? "#46525f" : "#bcc7d1"; rr(g, X0 - 20, 150, front - X0 + 20, 180, 8); g.fill(); }
        // remaining sticker
        if (progress < 1) {
          g.fillStyle = "#ffb627"; rr(g, front, 150, X1 - front, 180, 8); g.fill();
          txt(g, "GOOF!", (front + X1) / 2, 232, 30, "#8a5a00");
          txt(g, "premium sticker", (front + X1) / 2, 262, 14, "#8a5a00");
        }
        // peeling flap (folded part at the front edge)
        if (progress > 0 && progress < 1) {
          g.fillStyle = "#e08e00";
          g.beginPath(); g.moveTo(front, 150); g.lineTo(front - 34, 196); g.lineTo(front, 330); g.closePath(); g.fill();
          g.fillStyle = "#f7e8d8"; g.beginPath(); g.moveTo(front, 150); g.lineTo(front - 34, 196); g.lineTo(front, 240); g.closePath(); g.fill();
        }
        if (torn) {
          g.strokeStyle = "#d93e22"; g.lineWidth = 4;
          g.beginPath(); g.moveTo(front - 10, 150); g.lineTo(front + 14, 220); g.lineTo(front - 6, 280); g.lineTo(front + 10, 330); g.stroke();
        }
        // tear meter
        txt(g, "TEAR", 96, 404, 15, dark ? "#c4a68d" : "#7a5f4d");
        g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 140, 394, 440, 18, 9); g.fill();
        g.fillStyle = tear > 0.65 ? "#d93e22" : "#ffb627"; rr(g, 140, 394, 440 * tear, 18, 9); g.fill();
        // progress %
        txt(g, Math.round(progress * 100) + "% peeled", W / 2, 448, 17, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
        if (!started) txt(g, "Grab the sticker's left edge and drag — gently!", W / 2, 100, 18, "#0e9594");
      }
    };
  }
});
