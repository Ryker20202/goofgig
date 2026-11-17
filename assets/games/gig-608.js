// GoofGig #608 — Chase the Runaway Hat
// A tiny everyday gig: The wind stole your hat. Catch it before it reaches the pond!
registerGame({
  n: 608,
  title: "Chase the Runaway Hat",
  desc: "The wind stole your hat. Catch it before it reaches the pond!",
  hint: "Move to catch the hat — touch it to grab it <b>before it splashes into the pond</b>.",
  grades: [
    ["Hat Hero", "Caught mid-bounce. The wind owes you an apology."],
    ["Wind Sprinter", "Hat saved, dignity mostly intact, hair a mess."],
    ["Park Jogger", "You got it — right at the water's edge. Phew."],
    ["Hat Watcher", "You watched it sail away like a tiny boat."],
    ["Bareheaded", "The ducks are wearing your hat now. It suits them."]
  ],
  thumb: function (g) {
    g.fillStyle = "#bae6fd"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#16a34a"; g.fillRect(0, 78, 300, 14);
    g.fillStyle = "#3b82f6"; g.beginPath(); g.ellipse(262, 66, 34, 20, 0, 0, 7); g.fill();
    g.fillStyle = "#78350f";
    g.beginPath(); g.ellipse(120, 60, 34, 10, 0, 0, 7); g.fill();
    rr(g, 104, 38, 32, 20, 6); g.fill();
    g.strokeStyle = "#ffffff"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(60, 40); g.quadraticCurveTo(80, 30, 100, 40); g.stroke();
    g.beginPath(); g.moveTo(170, 30); g.quadraticCurveTo(190, 20, 210, 30); g.stroke();
  },
  create: function (api) {
    var LIMIT = 20;
    var t0 = -1, done = false, caught = false, lost = false;
    var px = 120, py = 330;
    var hat = { x: 200, y: 330, vy: 0, vx: 46 };
    var gust = 0, gustT = 0, flash = 0, flashTxt = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var t = el(now);
      var score = caught ? 55 + clamp(LIMIT - t, 0, LIMIT) * 2.2 : (lost ? 6 : Math.max(0, 30 - (640 - hat.x) / 20));
      fin(score, [
        { label: "Hat status", value: caught ? 100 : 0, text: caught ? "caught!" : (lost ? "in the pond" : "still running"), good: caught },
        { label: "Time left", value: Math.round(clamp(1 - t / LIMIT, 0, 1) * 100), text: Math.max(0, Math.round(LIMIT - t)) + "s left", good: caught }
      ]);
    }
    return {
      status: function () {
        return done ? (caught ? "Hat recovered!" : "The hat is duck property now.") : "Catch the hat before the pond!";
      },
      down: function (p, now) { el(now); px = clamp(p.x, 40, 680); },
      move: function (p, now) { px = clamp(p.x, 40, 680); },
      up: function (p, now) {},
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        // wind gusts
        gustT -= dt;
        if (gustT <= 0) { gust = 20 + Math.random() * 70; gustT = 1 + Math.random() * 1.6; }
        // hat physics: bounces, drifts right, gusts speed it up
        if (!done) {
          hat.vy += 900 * dt;
          hat.y += hat.vy * dt;
          hat.x += (hat.vx + gust) * dt;
          if (hat.y >= 330) { hat.y = 330; hat.vy = -(260 + Math.random() * 160); }
          if (hat.x >= 640) { lost = true; flash = 1; flashTxt = "Splash! The hat is gone!"; sndBad(); finishAll(now); }
          if (dist(px, py - 10, hat.x, hat.y) < 52) {
            caught = true; flash = 1; flashTxt = "Got it!"; sndGood(); finishAll(now);
          }
        }
        g.fillStyle = dark ? "#16202b" : "#bae6fd"; g.fillRect(0, 0, W, H);
        // sun, clouds, trees
        g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(90, 70, 28, 0, 7); g.fill();
        g.fillStyle = dark ? "#2b4258" : "#ffffff";
        g.beginPath(); g.ellipse(300, 80, 60, 15, 0, 0, 7); g.fill();
        g.beginPath(); g.ellipse(520, 120, 70, 15, 0, 0, 7); g.fill();
        g.fillStyle = "#16a34a"; g.fillRect(0, 330, W, 110);
        g.fillStyle = "#78350f"; g.fillRect(60, 270, 12, 60); g.fillRect(420, 280, 12, 50);
        g.fillStyle = "#22c55e"; g.beginPath(); g.arc(66, 260, 34, 0, 7); g.fill(); g.beginPath(); g.arc(426, 272, 28, 0, 7); g.fill();
        // pond at right edge
        g.fillStyle = dark ? "#1d4e6b" : "#38bdf8";
        g.beginPath(); g.ellipse(690, 385, 90, 55, 0, 0, 7); g.fill();
        txt(g, "POND", 680, 385, 15, "#ffffff");
        // wind streaks
        g.strokeStyle = dark ? "#7dd3fc" : "#ffffff"; g.lineWidth = 3; g.lineCap = "round";
        for (var i = 0; i < 3; i++) {
          var wy = 140 + i * 60, wx = ((t * 260 + i * 220) % 760) - 20;
          g.beginPath(); g.moveTo(wx, wy); g.quadraticCurveTo(wx + 30, wy - 8, wx + 60, wy); g.stroke();
        }
        // hat
        g.fillStyle = "#78350f";
        g.beginPath(); g.ellipse(hat.x, hat.y + 6, 30, 9, 0, 0, 7); g.fill();
        rr(g, hat.x - 15, hat.y - 16, 30, 20, 6); g.fill();
        g.fillStyle = "#f59e0b"; g.fillRect(hat.x - 15, hat.y - 4, 30, 5);
        // player
        var runBob = Math.abs(Math.sin(t * 8)) * 4;
        g.fillStyle = "#334155"; g.beginPath(); g.arc(px, py - 52 - runBob, 13, 0, 7); g.fill();
        g.fillStyle = "#dc2626"; rr(g, px - 14, py - 40 - runBob, 28, 30, 8); g.fill();
        g.fillStyle = "#334155"; rr(g, px - 12, py - 10, 9, 12, 3); g.fill(); rr(g, px + 3, py - 10, 9, 12, 3); g.fill();
        // catch hint arrow
        if (!done) txt(g, "move to catch it!", hat.x, hat.y - 40, 16, dark ? "#fbbf24" : "#b45309");
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 60, 28, flashTxt.indexOf("Got") === 0 ? "#16a34a" : "#0284c7"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#16a34a" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
