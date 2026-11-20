// GoofGig #614 — Hang the Laundry
// A tiny everyday gig: Five wet clothes, one clothesline. Drag each piece up and peg it on the line.
registerGame({
  n: 614,
  title: "Hang the Laundry",
  desc: "Five wet clothes, one sunny clothesline. Drag each piece up and peg it on the line.",
  hint: "Drag a piece from the basket to an <b>empty peg</b> on the line. Drop it anywhere else and it flops back in the basket!",
  grades: [
    ["Laundry Legend", "Five pieces, five pegs, zero wrinkles. The sun applauds."],
    ["Line Manager", "Four up and drying. The fifth is still damp and judging you."],
    ["Peg Juggler", "Most of the load is up. The basket is not impressed."],
    ["Basket Case", "More laundry in the basket than on the line. The sun went down."],
    ["Laundry Day Fail", "The clothes stayed wet. The basket stayed full. So did you."]
  ],
  thumb: function (g) {
    g.fillStyle = "#bae6fd"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#facc15"; g.beginPath(); g.arc(40, 22, 12, 0, 7); g.fill();
    g.strokeStyle = "#78350f"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(30, 46); g.lineTo(270, 46); g.stroke();
    g.fillStyle = "#f472b6"; rr(g, 70, 46, 30, 26, 3); g.fill();
    g.fillStyle = "#38bdf8"; rr(g, 130, 46, 30, 26, 3); g.fill();
    g.fillStyle = "#facc15"; rr(g, 190, 46, 30, 26, 3); g.fill();
    g.fillStyle = "#78350f"; g.fillRect(28, 30, 4, 60); g.fillRect(268, 30, 4, 60);
  },
  create: function (api) {
    var LIMIT = 25;
    var t0 = -1, done = false;
    var LINE_Y = 150;
    var spots = [150, 250, 350, 450, 550];
    var clothes = [];
    var drag = -1, misses = 0, hung = 0;
    var flash = 0, flashTxt = "";
    var home = [[150, 380], [250, 380], [350, 380], [450, 380], [550, 380]];
    var defs = [
      { kind: "shirt", col: "#f472b6" },
      { kind: "sock", col: "#38bdf8" },
      { kind: "towel", col: "#facc15" },
      { kind: "shorts", col: "#34d399" },
      { kind: "dress", col: "#a78bfa" }
    ];
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var t = el(now);
      var score = hung * 17 + (hung === 5 ? 15 : 0);
      fin(score, [
        { label: "Clothes hung", value: Math.round(hung / 5 * 100), text: hung + " / 5", good: hung >= 4 },
        { label: "Time left", value: Math.round(clamp(1 - t / LIMIT, 0, 1) * 100), text: Math.max(0, Math.round(LIMIT - t)) + "s left", good: hung === 5 },
        { label: "Dropped back", value: Math.round(clamp(1 - misses / 8, 0, 1) * 100), text: misses + " flop" + (misses === 1 ? "" : "s"), good: misses <= 1 }
      ]);
    }
    function init() {
      for (var i = 0; i < 5; i++) {
        clothes.push({ i: i, kind: defs[i].kind, col: defs[i].col, x: home[i][0], y: home[i][1], hx: home[i][0], hy: home[i][1], spot: -1, sway: Math.random() * 6 });
      }
    }
    init();
    function drawPiece(g, c, t) {
      var x = c.x, y = c.y;
      var sway = c.spot >= 0 ? Math.sin(t * 2 + c.sway) * 3 : 0;
      g.save();
      g.translate(x + sway, y);
      g.fillStyle = c.col;
      if (c.kind === "shirt") {
        rr(g, -26, -16, 52, 44, 6); g.fill();
        rr(g, -40, -14, 16, 20, 4); g.fill();
        rr(g, 24, -14, 16, 20, 4); g.fill();
        g.fillStyle = "#ffffff"; g.beginPath(); g.arc(0, 4, 7, 0, 7); g.fill();
      } else if (c.kind === "sock") {
        rr(g, -12, -22, 24, 34, 8); g.fill();
        rr(g, -12, 4, 34, 14, 7); g.fill();
        g.fillStyle = "#ffffff"; rr(g, -12, -22, 24, 8, 4); g.fill();
      } else if (c.kind === "towel") {
        rr(g, -28, -20, 56, 44, 4); g.fill();
        g.fillStyle = "#ffffff"; rr(g, -28, -6, 56, 6, 2); g.fill(); rr(g, -28, 8, 56, 6, 2); g.fill();
      } else if (c.kind === "shorts") {
        rr(g, -26, -18, 52, 26, 6); g.fill();
        rr(g, -26, 4, 22, 22, 5); g.fill();
        rr(g, 4, 4, 22, 22, 5); g.fill();
        g.fillStyle = "#ffffff"; rr(g, -26, -18, 52, 7, 3); g.fill();
      } else {
        g.beginPath(); g.moveTo(-14, -20); g.lineTo(14, -20); g.lineTo(26, 24); g.lineTo(-26, 24); g.closePath(); g.fill();
        g.fillStyle = "#ffffff"; g.beginPath(); g.arc(0, -6, 6, 0, 7); g.fill();
      }
      g.restore();
      if (c.spot >= 0) {
        g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(x + sway, y - 22, 5, 0, 7); g.fill();
      }
    }
    return {
      status: function () {
        return done ? "All hung! The sun can do the rest." : "Hung: " + hung + " / 5 — drag from the basket to a peg!";
      },
      down: function (p, now) {
        el(now);
        if (done || drag >= 0) return;
        var best = -1, bd = 1e9;
        for (var i = 0; i < clothes.length; i++) {
          var c = clothes[i];
          if (c.spot >= 0) continue;
          var d = Math.hypot(p.x - c.x, p.y - c.y);
          if (d < 55 && d < bd) { bd = d; best = i; }
        }
        if (best >= 0) { drag = best; blip(500, 0.05); }
      },
      move: function (p, now) {
        if (drag < 0 || done) return;
        var c = clothes[drag];
        c.x = clamp(p.x, 40, 680); c.y = clamp(p.y, 60, 400);
      },
      up: function (p, now) {
        if (drag < 0 || done) return;
        var c = clothes[drag];
        var placed = false;
        for (var s = 0; s < 5; s++) {
          var taken = false;
          for (var j = 0; j < clothes.length; j++) if (clothes[j].spot === s) taken = true;
          if (!taken && Math.abs(c.x - spots[s]) < 42 && Math.abs(c.y - LINE_Y) < 46) {
            c.spot = s; c.x = spots[s]; c.y = LINE_Y + 22; hung++;
            flash = 0.7; flashTxt = hung === 5 ? "All hung! Sunshine time!" : "Pegged! " + hung + " / 5";
            blip(760, 0.07); if (hung === 5) sndGood();
            placed = true; break;
          }
        }
        if (!placed) {
          misses++;
          c.x = c.hx; c.y = c.hy;
          flash = 0.6; flashTxt = "Flop! Back in the basket.";
          sndBad();
        }
        drag = -1;
        if (hung === 5) finishAll(now);
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        g.fillStyle = dark ? "#0f1f2e" : "#bae6fd"; g.fillRect(0, 0, W, H);
        // sun + clouds
        g.fillStyle = "#facc15"; g.beginPath(); g.arc(640, 60, 30, 0, 7); g.fill();
        g.fillStyle = dark ? "#223140" : "#ffffff";
        g.beginPath(); g.arc(120, 70, 22, 0, 7); g.arc(145, 70, 26, 0, 7); g.arc(170, 70, 20, 0, 7); g.fill();
        g.beginPath(); g.arc(480, 45, 18, 0, 7); g.arc(500, 45, 22, 0, 7); g.arc(522, 45, 16, 0, 7); g.fill();
        // grass
        g.fillStyle = dark ? "#14532d" : "#86efac"; g.fillRect(0, 400, W, 40);
        // poles + line
        g.fillStyle = "#78350f"; g.fillRect(96, 90, 8, 310); g.fillRect(616, 90, 8, 310);
        g.strokeStyle = dark ? "#e2e8f0" : "#475569"; g.lineWidth = 3;
        g.beginPath(); g.moveTo(100, LINE_Y); g.lineTo(620, LINE_Y); g.stroke();
        // peg spots
        for (var s = 0; s < 5; s++) {
          var taken = false;
          for (var j = 0; j < clothes.length; j++) if (clothes[j].spot === s) taken = true;
          if (!taken) {
            g.fillStyle = dark ? "#64748b" : "#94a3b8";
            g.beginPath(); g.arc(spots[s], LINE_Y, 6, 0, 7); g.fill();
          }
        }
        // basket
        g.fillStyle = "#b45309"; rr(g, 110, 348, 500, 52, 10); g.fill();
        g.fillStyle = "#92400e";
        for (var b = 0; b < 9; b++) g.fillRect(130 + b * 52, 352, 6, 44);
        // clothes
        for (var i = 0; i < clothes.length; i++) {
          if (i === drag) continue;
          drawPiece(g, clothes[i], t);
        }
        if (drag >= 0) drawPiece(g, clothes[drag], t);
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 52, 26, dark ? "#fde68a" : "#b45309"); }
        txt(g, "Hung: " + hung + " / 5", 360, 425, 18, dark ? "#e2e8f0" : "#14532d");
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#e0f2fe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#16a34a" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
