/* GoofGig — Gig #100 The 100th Gig */
registerGame({
  n: 100, title: "The 100th Gig",
  desc: "One hundred gigs. One giant popper. One hundred taps. Fifteen seconds.",
  hint: '<b>Mash tap</b> like you mean it: <b>100 taps</b> before the <b>15-second</b> timer ends, and the giant party popper is yours. This is the finale. Act like it.',
  grades: [
    ["CENTURY LEGEND", "One hundred taps. One hundred gigs. Confetti everywhere. You ARE GoofGig."],
    ["Popper Royalty", "So close to confetti glory the popper started sweating."],
    ["Finale Material", "A heroic mash. The popper respects the effort."],
    ["Warm-Up Act", "Half a finale. The confetti remains theoretical."],
    ["Gentle Tapper", "You tapped it like it was asleep. It was not asleep. It was a popper."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e3352b"; g.beginPath(); g.moveTo(128, 78); g.lineTo(172, 78); g.lineTo(160, 22); g.lineTo(140, 22); g.closePath(); g.fill();
    g.fillStyle = "#ffb627"; g.beginPath(); g.arc(132, 16, 5, 0, Math.PI * 2); g.arc(168, 12, 5, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#35c4a0"; g.beginPath(); g.arc(150, 6, 4, 0, Math.PI * 2); g.fill();
    txt(g, "100", 150, 60, 19, "#fff");
  },
  create: function (api) {
    var taps = 0, timeLeft = 15, started = false, done = false, won = false, confetti = [], shake = 0, lastBlip = 0;
    var CONF = ["#e3352b", "#ffb627", "#35c4a0", "#57b7dd", "#9b7ebd", "#ff8c42"];
    function burst() {
      for (var i = 0; i < 130; i++) {
        confetti.push({ x: W / 2, y: 300, vx: (Math.random() - 0.5) * 560, vy: -240 - Math.random() * 320, rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 9, c: CONF[i % CONF.length], life: 2.6 + Math.random() });
      }
    }
    function finishRound() {
      done = true;
      var score = clamp(taps, 1, 100);
      if (won) { sndGood(); burst(); } else sndBad();
      api.finish({ score: score, rows: [
        { label: "Taps landed", value: taps, text: taps + " / 100", good: taps >= 80 },
        { label: "Popper status", value: won ? 100 : taps, text: won ? "POPPED!" : "Still loaded…" }
      ] });
    }
    return {
      status: function () {
        if (done) return won ? "POP! One hundred gigs, celebrated properly." : "The popper survives. This time.";
        return started ? taps + " / 100 taps · " + Math.ceil(timeLeft) + "s" : "Tap to start the finale!";
      },
      down: function (p, now) {
        if (done) return;
        if (!started) { started = true; audio(); }
        taps++; shake = Math.min(6, shake + 1.6);
        if (now - lastBlip > 70) { lastBlip = now; blip(280 + taps * 4, .04, "square", .05); }
        if (taps >= 100 && !won) { won = true; finishRound(); }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (started && !done) { timeLeft -= dt; if (timeLeft <= 0) finishRound(); }
        if (shake > 0) shake = Math.max(0, shake - dt * 16);
        var jx = (Math.random() - 0.5) * shake, jy = (Math.random() - 0.5) * shake;
        // banner
        txt(g, "★ GIG #100 ★", W / 2, 54, 26, "#e08e00");
        txt(g, "THE FINALE", W / 2, 84, 15, dark ? "#c4a68d" : "#7a5f4d");
        // timer bar
        g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 140, 102, 440, 13, 7); g.fill();
        g.fillStyle = timeLeft < 4 ? "#d93e22" : "#35c4a0"; rr(g, 140, 102, 440 * clamp(timeLeft / 15, 0, 1), 13, 7); g.fill();
        // giant popper
        g.save(); g.translate(W / 2 + jx, 296 + jy);
        var swell = 1 + taps / 100 * 0.25;
        g.scale(swell, swell);
        g.fillStyle = won ? "#8a715a" : "#e3352b";
        g.beginPath(); g.moveTo(-58, 84); g.lineTo(58, 84); g.lineTo(30, -66); g.lineTo(-30, -66); g.closePath(); g.fill();
        g.fillStyle = "#ffb627"; g.fillRect(-44, 8, 88, 15); g.fillRect(-36, 44, 72, 13);
        g.fillStyle = "#57b7dd"; g.beginPath(); g.arc(0, -20, 11, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#fff"; txt(g, "100", 0, 30, 26, "#fff");
        if (!won) {
          g.strokeStyle = dark ? "#c4a68d" : "#7a5f4d"; g.lineWidth = 4;
          g.beginPath(); g.moveTo(34, 84); g.quadraticCurveTo(58, 108, 50, 128); g.stroke();
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(50, 132, 8, 0, Math.PI * 2); g.fill();
        }
        g.restore();
        // pressure / tap meter
        txt(g, "TAPS", 96, 428, 15, dark ? "#c4a68d" : "#7a5f4d");
        g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 140, 418, 440, 18, 9); g.fill();
        g.fillStyle = taps >= 100 ? "#35c4a0" : "#e08e00"; rr(g, 140, 418, 440 * clamp(taps / 100, 0, 1), 18, 9); g.fill();
        // confetti
        for (var i = confetti.length - 1; i >= 0; i--) {
          var c = confetti[i];
          c.life -= dt; c.x += c.vx * dt; c.y += c.vy * dt; c.vy += 420 * dt; c.rot += c.vr * dt;
          if (c.life <= 0 || c.y > 470) { confetti.splice(i, 1); continue; }
          g.save(); g.translate(c.x, c.y); g.rotate(c.rot); g.fillStyle = c.c; g.fillRect(-5, -3, 10, 6); g.restore();
        }
        if (done && won && confetti.length === 0 && Math.random() < 0.1) burst();
        if (!started) txt(g, "100 taps. 15 seconds. GO when ready!", W / 2, 160, 19, "#0e9594");
      }
    };
  }
});
