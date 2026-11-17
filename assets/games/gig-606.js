// GoofGig #606 — Fold the Map
// A tiny everyday gig: Fold the road map back up. Four corners, four marks, one tidy square.
registerGame({
  n: 606,
  title: "Fold the Map",
  desc: "Fold the road map back up. Four corners, four marks, one tidy square.",
  hint: "Drag each corner to its <b>numbered mark</b> — in order 1 to 4 for a perfect fold.",
  grades: [
    ["Origami Navigator", "A perfect little square. The map has never looked so smug."],
    ["Neat Folder", "Crisp folds, tidy edges, one tiny dog-ear. Forgivable."],
    ["Backseat Folder", "It folds. It is not a square. It is a lifestyle choice."],
    ["Map Mangler", "That is not a fold, that is a crumple with confidence."],
    ["Lost and Crumpled", "The map is now a ball. You are navigating by vibes."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fef9c3"; g.fillRect(0, 0, 300, 92);
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(40, 70); g.quadraticCurveTo(150, 20, 260, 66); g.stroke();
    g.beginPath(); g.moveTo(60, 20); g.quadraticCurveTo(150, 60, 240, 24); g.stroke();
    g.fillStyle = "#dc2626"; g.beginPath(); g.arc(150, 46, 6, 0, 7); g.fill();
    g.strokeStyle = "#2563eb"; g.lineWidth = 2; g.setLineDash([4, 4]);
    g.strokeRect(120, 30, 60, 34); g.setLineDash([]);
    g.fillStyle = "#2563eb"; g.beginPath(); g.arc(60, 46, 8, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 25;
    var t0 = -1, done = false;
    var corners = [
      { x: 130, y: 90, tx: 300, ty: 180, n: 1, locked: false, home: { x: 130, y: 90 } },
      { x: 590, y: 90, tx: 420, ty: 180, n: 2, locked: false, home: { x: 590, y: 90 } },
      { x: 130, y: 360, tx: 300, ty: 270, n: 3, locked: false, home: { x: 130, y: 360 } },
      { x: 590, y: 360, tx: 420, ty: 270, n: 4, locked: false, home: { x: 590, y: 360 } }
    ];
    var dragIdx = -1, folded = 0, inOrder = 0, expected = 1, misdrags = 0;
    var flash = 0, flashTxt = "";
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var t = el(now);
      var orderBonus = inOrder === 4 ? 12 : inOrder * 3;
      var score = folded === 4 ? 58 + clamp(25 - t, 0, 25) * 1.2 + orderBonus - misdrags * 4 : folded * 15 - misdrags * 3;
      fin(score, [
        { label: "Corners folded", value: Math.round(folded / 4 * 100), text: folded + " / 4", good: folded === 4 },
        { label: "In order", value: Math.round(inOrder / 4 * 100), text: inOrder + " / 4 in order", good: inOrder === 4 }
      ]);
    }
    return {
      status: function () {
        return done ? "Folded! The glove box applauds." : "Folded: " + folded + " / 4 — next corner: " + expected;
      },
      down: function (p, now) {
        el(now); if (done) return;
        for (var i = 0; i < 4; i++) {
          var c = corners[i];
          if (!c.locked && dist(p.x, p.y, c.x, c.y) < 52) {
            dragIdx = i;
            if (c.n !== expected) misdrags++;
            return;
          }
        }
      },
      move: function (p, now) {
        if (dragIdx < 0 || done) return;
        var c = corners[dragIdx];
        c.x = clamp(p.x, 110, 610); c.y = clamp(p.y, 70, 380);
        if (dist(c.x, c.y, c.tx, c.ty) < 42) {
          c.locked = true; c.x = c.tx; c.y = c.ty;
          folded++;
          if (c.n === expected) { inOrder++; expected++; }
          dragIdx = -1;
          flash = 0.6; flashTxt = folded === 4 ? "Perfectly folded!" : "Corner " + c.n + " folded!";
          blip(520 + folded * 80, 0.08);
          if (folded === 4) { sndGood(); finishAll(now); }
        }
      },
      up: function (p, now) {
        if (dragIdx < 0) return;
        var c = corners[dragIdx];
        if (!c.locked) { c.x = c.home.x; c.y = c.home.y; }
        dragIdx = -1;
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        g.fillStyle = dark ? "#16202b" : "#e0f2fe"; g.fillRect(0, 0, W, H);
        // table
        g.fillStyle = dark ? "#2b3a4a" : "#fef9c3"; rr(g, 90, 60, 540, 340, 14); g.fill();
        // map print: roads + river + town
        g.strokeStyle = dark ? "#5b7d9e" : "#94a3b8"; g.lineWidth = 3;
        g.beginPath(); g.moveTo(130, 320); g.quadraticCurveTo(360, 200, 590, 300); g.stroke();
        g.beginPath(); g.moveTo(200, 90); g.quadraticCurveTo(360, 240, 480, 360); g.stroke();
        g.strokeStyle = dark ? "#3b82f6" : "#60a5fa"; g.lineWidth = 10;
        g.beginPath(); g.moveTo(130, 140); g.quadraticCurveTo(360, 220, 590, 160); g.stroke();
        g.fillStyle = "#dc2626"; g.beginPath(); g.arc(360, 225, 9, 0, 7); g.fill();
        txt(g, "YOU ARE HERE", 360, 200, 14, "#dc2626");
        // fold marks
        corners.forEach(function (c) {
          if (c.locked) return;
          g.strokeStyle = "#2563eb"; g.lineWidth = 3; g.setLineDash([6, 5]);
          g.beginPath(); g.arc(c.tx, c.ty, 26, 0, 7); g.stroke(); g.setLineDash([]);
          txt(g, String(c.n), c.tx, c.ty, 20, "#2563eb");
        });
        // folded center
        if (folded > 0) {
          g.fillStyle = dark ? "#1d4e6b" : "#bae6fd";
          rr(g, 285, 165, 150, 120, 10); g.fill();
          txt(g, "folded x" + folded, 360, 225, 16, dark ? "#bae6fd" : "#075985");
        }
        // corners
        corners.forEach(function (c, i) {
          var sel = i === dragIdx;
          g.fillStyle = c.locked ? "#16a34a" : (sel ? "#f59e0b" : "#2563eb");
          g.beginPath(); g.arc(c.x, c.y, sel ? 26 : 22, 0, 7); g.fill();
          g.fillStyle = "#ffffff"; txt(g, String(c.n), c.x, c.y, 20, "#ffffff");
        });
        if (folded === 0 && dragIdx < 0) txt(g, "grab a corner and drag it to its number", 360, 40, 18, dark ? "#94a3b8" : "#64748b");
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 40, 24, "#16a34a"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#2563eb" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
