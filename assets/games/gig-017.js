/* ================================================================
   GoofGig — Gig #017 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #017 — Mow the Strip
         Drag the mower over the lawn; keep off the flower patch.
         ================================================================ */
      registerGame({
        n: 17, title: "Mow the Strip",
        desc: "One lawn, neat stripes, and a flower patch begging for mercy.",
        hint: '<b>Drag the mower</b> across the lawn to mow it all. The <b>flower patch</b> in the corner is not grass — mowing it costs you.',
        grades: [
          ["Stripe Perfectionist", "Every blade accounted for. The flowers send thanks."],
          ["Lawn Artist", "Clean coverage, happy flowers, proud mower."],
          ["Weekend Mower", "Mostly mowed. The corners have chosen freedom."],
          ["Patchy Gardener", "That lawn looks like a haircut given in the dark."],
          ["Flower Menace", "The lawn is patchy AND the flowers are gone. Bold."]
        ],
        thumb: function (g) {
          g.fillStyle = "#57a639"; rr(g, 96, 16, 108, 62, 8); g.fill();
          g.fillStyle = "#7cc24f"; g.fillRect(96, 16, 27, 62); g.fillRect(150, 16, 27, 62);
          g.fillStyle = "#ff8fa3"; g.beginPath(); g.arc(190, 66, 6, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var LAWN = { x: 60, y: 84, w: 600, h: 268 }, CELL = 20;
          var COLS = Math.floor(LAWN.w / CELL), ROWS = Math.floor(LAWN.h / CELL);
          var FLOWER = { x: 472, y: 238, w: 188, h: 114 };
          var cells = [], totalGrass = 0, mowed = 0, flowerHit = 0, flowerCells = [];
          var mower = null, done = false;
          for (var r2 = 0; r2 < ROWS; r2++) for (var c2 = 0; c2 < COLS; c2++) {
            var cx = LAWN.x + c2 * CELL + CELL / 2, cy = LAWN.y + r2 * CELL + CELL / 2;
            var isF = cx > FLOWER.x && cy > FLOWER.y;
            cells.push({ x: cx, y: cy, f: isF, done: false });
            if (isF) flowerCells.push(cells[cells.length - 1]); else totalGrass++;
          }
          function coverage() { return mowed / totalGrass; }
          function finishRound() {
            done = true;
            var dmg = flowerCells.filter(function (c) { return c.done; }).length / flowerCells.length;
            var score = clamp(Math.round(coverage() * 100 - dmg * 45), 1, 100);
            api.finish({ score: score, rows: [
              { label: "Lawn mowed", value: coverage() * 100, text: Math.round(coverage() * 100) + "%", good: coverage() >= 0.9 },
              { label: "Flowers safe", value: (1 - dmg) * 100, text: Math.round((1 - dmg) * 100) + "%", good: dmg < 0.1 }
            ] });
          }
          function mowAt(p) {
            cells.forEach(function (cell) {
              if (!cell.done && dist(p.x, p.y, cell.x, cell.y) < 30) {
                cell.done = true;
                if (cell.f) flowerHit++; else mowed++;
              }
            });
          }
          return {
            status: function () { return done ? "Lawn done!" : "Mowed " + Math.round(coverage() * 100) + "%"; },
            down: function (p) { if (!done) { mower = { x: p.x, y: p.y }; mowAt(p); audio(); } },
            move: function (p) { if (mower && !done) { mower = { x: p.x, y: p.y }; mowAt(p); if (coverage() >= 0.985) finishRound(); } },
            up: function () {
              mower = null;
              if (!done && coverage() > 0.5) finishRound();
            },
            draw: function (g) {
              var dark = isDark();
              // lawn base
              g.fillStyle = "#57a639"; rr(g, LAWN.x, LAWN.y, LAWN.w, LAWN.h, 10); g.fill();
              // mowed cells (lighter, striped by column)
              cells.forEach(function (cell, i) {
                if (!cell.done) return;
                g.fillStyle = cell.f ? "#8a6b42" : (Math.floor(i % COLS) % 2 ? "#7cc24f" : "#8fd45e");
                g.fillRect(cell.x - CELL / 2, cell.y - CELL / 2, CELL, CELL);
              });
              // flower patch
              g.fillStyle = "#6db84a"; rr(g, FLOWER.x, FLOWER.y, FLOWER.w, FLOWER.h, 8); g.fill();
              g.strokeStyle = "#ffb627"; g.lineWidth = 3; g.setLineDash([8, 6]);
              rr(g, FLOWER.x, FLOWER.y, FLOWER.w, FLOWER.h, 8); g.stroke(); g.setLineDash([]);
              for (var i = 0; i < 14; i++) {
                var fx = FLOWER.x + 18 + (i * 37) % (FLOWER.w - 30), fy = FLOWER.y + 20 + (i * 53) % (FLOWER.h - 34);
                var cellHit = cells.some(function (cell) { return cell.f && cell.done && dist(fx, fy, cell.x, cell.y) < 16; });
                if (cellHit) { g.fillStyle = "#8a6b42"; g.fillRect(fx - 4, fy - 2, 8, 4); }
                else {
                  g.fillStyle = i % 2 ? "#ff8fa3" : "#ffb627";
                  for (var p2 = 0; p2 < 5; p2++) { var a = p2 / 5 * Math.PI * 2; g.beginPath(); g.arc(fx + Math.cos(a) * 5, fy + Math.sin(a) * 5, 3.4, 0, Math.PI * 2); g.fill(); }
                  g.fillStyle = "#fff"; g.beginPath(); g.arc(fx, fy, 2.6, 0, Math.PI * 2); g.fill();
                }
              }
              txt(g, "FLOWERS — KEEP OFF", FLOWER.x + FLOWER.w / 2, FLOWER.y + FLOWER.h + 20, 13, dark ? "#ffb627" : "#a8740a");
              // fence top
              g.fillStyle = "#b9834e";
              for (var fx2 = LAWN.x; fx2 < LAWN.x + LAWN.w; fx2 += 44) g.fillRect(fx2, LAWN.y - 22, 9, 22);
              g.fillRect(LAWN.x, LAWN.y - 18, LAWN.w, 6);
              // mower
              var mp = mower || { x: 130, y: 300 };
              g.save(); g.translate(mp.x, mp.y);
              g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(2, 12, 30, 9, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#e3352b"; rr(g, -27, -18, 54, 32, 10); g.fill();
              g.fillStyle = "#8f1f16"; rr(g, -27, -18, 54, 10, 6); g.fill();
              g.fillStyle = "#33241a";
              [[-20, 14], [20, 14], [-20, -20], [20, -20]].forEach(function (w2) { g.beginPath(); g.arc(w2[0], w2[1], 6.5, 0, Math.PI * 2); g.fill(); });
              g.strokeStyle = "#33241a"; g.lineWidth = 5; g.lineCap = "round";
              g.beginPath(); g.moveTo(16, -12); g.lineTo(38, -34); g.stroke();
              g.restore();
              if (!mower && !done) txt(g, "Press and drag to mow — stripes encouraged", W / 2, 44, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
