// GoofGig #603 — Pump the Swing
// A tiny everyday gig: Tap at the top of each swing to pump higher. Reach the flag!
registerGame({
  n: 603,
  title: "Pump the Swing",
  desc: "Tap at the top of each swing to pump higher. Reach the flag!",
  hint: "Tap when the swing is <b>at the top</b> of its arc — tap at the bottom and you lose height.",
  grades: [
    ["Swing Champion", "You are officially higher than the flag. The birds are jealous."],
    ["Playground Pro", "So close to the flag you could taste the breeze."],
    ["Casual Sway-er", "A gentle swing. The flag is still up there, unimpressed."],
    ["Bottom Tapper", "You keep tapping at the bottom. The swing sighs."],
    ["Grounded", "The swing barely moved. Gravity sends its regards."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dcfce7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#16a34a"; g.fillRect(0, 80, 300, 12);
    g.strokeStyle = "#78350f"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(150, 10); g.lineTo(120, 58); g.moveTo(150, 10); g.lineTo(180, 58); g.stroke();
    g.fillStyle = "#78350f"; rr(g, 108, 58, 84, 8, 4); g.fill();
    g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(150, 46, 8, 0, 7); g.fill();
    g.fillStyle = "#dc2626"; g.beginPath(); g.moveTo(196, 12); g.lineTo(196, 34); g.lineTo(222, 23); g.closePath(); g.fill();
  },
  create: function (api) {
    var LIMIT = 20, TARGET = 1.0;
    var t0 = -1, done = false;
    var amp = 0.35, phase = 0, pumps = 0, good = 0, bad = 0, won = false;
    var flash = 0, flashTxt = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var h = clamp(amp / TARGET, 0, 1);
      var acc = pumps ? good / pumps : 0;
      var score = won ? 78 + h * 12 + acc * 10 : h * 62 + acc * 22;
      fin(score, [
        { label: "Height", value: Math.round(h * 100), text: Math.round(h * 100) + "% of the flag", good: won },
        { label: "Good pumps", value: Math.round(acc * 100), text: good + " / " + pumps + " on time", good: acc >= 0.6 }
      ]);
    }
    function angle() { return amp * Math.sin(phase); }
    return {
      status: function () {
        return done ? "Swing parked. The flag saw everything." : "Height: " + Math.round(clamp(amp / TARGET, 0, 1) * 100) + "% — tap at the top!";
      },
      down: function (p, now) {
        el(now); if (done) return;
        pumps++;
        var s = Math.abs(Math.sin(phase));
        if (s > 0.72) {
          good++; amp = Math.min(1.12, amp + 0.09);
          flash = 0.5; flashTxt = "Nice pump!"; blip(660, 0.08);
          if (amp >= TARGET && !won) { won = true; flashTxt = "Flag height!"; sndGood(); finishAll(now); }
        } else {
          bad++; amp = Math.max(0.15, amp - 0.045);
          flash = 0.5; flashTxt = s > 0.4 ? "Too early!" : "At the bottom — no power!";
          sndBad();
        }
      },
      move: function (p, now) {},
      up: function (p, now) {},
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        phase += dt * 2.1;
        g.fillStyle = dark ? "#16202b" : "#dcfce7"; g.fillRect(0, 0, W, H);
        // ground + flag pole
        g.fillStyle = dark ? "#1e3a2a" : "#86efac"; g.fillRect(0, 380, W, 60);
        g.fillStyle = dark ? "#5b7d9e" : "#78350f"; g.fillRect(150, 30, 6, 360);
        // flag at target height
        var flagY = 96;
        g.fillStyle = "#dc2626";
        g.beginPath(); g.moveTo(156, flagY); g.lineTo(156, flagY + 22); g.lineTo(196, flagY + 11); g.closePath(); g.fill();
        txt(g, "FLAG", 210, flagY + 12, 15, dark ? "#fca5a5" : "#b91c1c");
        // swing frame
        var a = angle();
        var L = 300, px = 153 + Math.sin(a) * L, py = 96 + Math.cos(a) * L;
        // height arc guide
        g.strokeStyle = dark ? "#33506b" : "#bbf7d0"; g.lineWidth = 3;
        g.beginPath(); g.arc(153, 96, L, 0.35, Math.PI - 0.35); g.stroke();
        // apex markers
        g.strokeStyle = "#f59e0b"; g.lineWidth = 4;
        var ax = 153 + Math.sin(TARGET) * L, ay = 96 + Math.cos(TARGET) * L;
        g.beginPath(); g.arc(ax, ay, 14, 0, 7); g.stroke();
        g.beginPath(); g.arc(153 - Math.sin(TARGET) * L, ay, 14, 0, 7); g.stroke();
        // chains + seat + kid
        g.strokeStyle = dark ? "#94a3b8" : "#78350f"; g.lineWidth = 4;
        g.beginPath(); g.moveTo(153, 96); g.lineTo(px - 26, py); g.moveTo(153, 96); g.lineTo(px + 26, py); g.stroke();
        g.fillStyle = dark ? "#475569" : "#78350f"; rr(g, px - 34, py, 68, 10, 5); g.fill();
        g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(px, py - 26, 13, 0, 7); g.fill();
        g.fillStyle = "#2563eb"; rr(g, px - 12, py - 14, 24, 16, 6); g.fill();
        // height meter
        var h = clamp(amp / TARGET, 0, 1);
        g.fillStyle = dark ? "#223140" : "#ffffff"; rr(g, 560, 60, 130, 280, 10); g.fill();
        g.fillStyle = dark ? "#33506b" : "#e2e8f0"; rr(g, 580, 80, 16, 220, 8); g.fill();
        g.fillStyle = h >= 1 ? "#16a34a" : "#f59e0b"; rr(g, 580, 80 + 220 * (1 - h), 16, 220 * h, 8); g.fill();
        txt(g, "HEIGHT", 625, 320, 13, dark ? "#94a3b8" : "#64748b");
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 60, 26, flashTxt.indexOf("Nice") === 0 || flashTxt.indexOf("Flag") === 0 ? "#16a34a" : "#dc2626"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#16a34a" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
