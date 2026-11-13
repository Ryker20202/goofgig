/* ================================================================
   GoofGig — Gig #058 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #058 — Vacuum the Rug
         Drag the vacuum head over the dirty rug. Dirt vanishes
         where it passes. 12 seconds. Score = % cleaned.
         ================================================================ */
      registerGame({
        n: 58, title: "Vacuum the Rug",
        desc: "Twelve seconds, one filthy rug, zero mercy for crumbs.",
        hint: '<b>Press and drag</b> the vacuum head across the rug. Dirt clears wherever it passes. You have <b>12 seconds</b> — cover it all!',
        grades: [
          ["Crumbs' Worst Enemy", "That rug could be eaten off. Please don't, but could."],
          ["Vacuum Virtuoso", "Hospital corners. Museum floors. This rug."],
          ["Tidy Human", "Respectably clean. The dust bunnies have relocated."],
          ["Spot Cleaner", "You vacuumed a lovely little racetrack. Only."],
          ["Dirt's Best Friend", "The crumbs threw a small party afterwards."]
        ],
        thumb: function (g) {
          g.fillStyle = "#b5524a"; rr(g, 104, 16, 92, 60, 6); g.fill();
          g.fillStyle = "#8a3a34"; rr(g, 112, 24, 76, 44, 4); g.fill();
          g.fillStyle = "#4a4a52"; rr(g, 138, 30, 34, 18, 5); g.fill();
          g.fillStyle = "#c8ccd2"; g.fillRect(154, 12, 5, 20);
        },
        create: function (api) {
          var RUG = { x: 110, y: 88, w: 500, h: 302 };
          var COLS = 16, ROWS = 9, cells = [], i, j;
          for (j = 0; j < ROWS; j++) for (i = 0; i < COLS; i++) cells.push(false);
          var holding = false, started = false, done = false, timeLeft = 12, hx = W / 2, hy = 240, blipT = 0;
          function cellCenter(c) {
            return { x: RUG.x + (c % COLS + 0.5) * (RUG.w / COLS), y: RUG.y + (Math.floor(c / COLS) + 0.5) * (RUG.h / ROWS) };
          }
          function pct() {
            var c = 0; for (var k = 0; k < cells.length; k++) if (cells[k]) c++;
            return Math.round(c / cells.length * 100);
          }
          function finishRound() {
            done = true;
            var p = pct();
            if (p >= 85) sndGood(); else if (p < 40) sndBad();
            api.finish({ score: clamp(p, 1, 100), rows: [
              { label: "Rug cleaned", value: p, text: p + "%", good: p >= 80 },
              { label: "Dirt remaining", value: 100 - p, text: (100 - p) + "%" }
            ] });
          }
          return {
            status: function () { return done ? "Time up!" : (started ? timeLeft.toFixed(1) + "s · cleaned " + pct() + "%" : "Press and vacuum!"); },
            down: function (p) {
              if (done) return;
              started = true; holding = true; hx = p.x; hy = p.y; audio();
            },
            move: function (p) { hx = p.x; hy = p.y; },
            up: function () { holding = false; },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                if (holding) {
                  for (var k = 0; k < cells.length; k++) {
                    if (cells[k]) continue;
                    var cc = cellCenter(k);
                    if (dist(hx, hy, cc.x, cc.y) <= 48) cells[k] = true;
                  }
                  blipT -= dt;
                  if (blipT <= 0) { blipT = 0.4; blip(90, .06, "sawtooth", .04); }
                }
                if (timeLeft <= 0) finishRound();
              }
              // floor + rug
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; g.fillRect(0, 0, W, 460);
              g.fillStyle = "#b5524a"; rr(g, RUG.x - 10, RUG.y - 10, RUG.w + 20, RUG.h + 20, 14); g.fill();
              g.fillStyle = "#c4635a"; rr(g, RUG.x, RUG.y, RUG.w, RUG.h, 10); g.fill();
              g.strokeStyle = "rgba(255,220,180,.5)"; g.lineWidth = 4; rr(g, RUG.x + 14, RUG.y + 14, RUG.w - 28, RUG.h - 28, 8); g.stroke();
              // dirt speckles on uncleaned cells
              g.fillStyle = "rgba(70,45,25,.55)";
              for (var k2 = 0; k2 < cells.length; k2++) {
                if (cells[k2]) continue;
                var c2 = cellCenter(k2);
                for (var s2 = 0; s2 < 3; s2++) {
                  var ox = ((k2 * 37 + s2 * 53) % 23) - 11, oy = ((k2 * 29 + s2 * 41) % 19) - 9;
                  g.beginPath(); g.arc(c2.x + ox, c2.y + oy, 2.6, 0, Math.PI * 2); g.fill();
                }
              }
              // vacuum head + hose
              g.strokeStyle = "#4a4a52"; g.lineWidth = 9;
              g.beginPath(); g.moveTo(hx, hy - 14);
              g.bezierCurveTo(hx + 60, hy - 90, hx + 130, hy - 60, W - 30, 30); g.stroke();
              g.fillStyle = "#4a4a52"; rr(g, hx - 36, hy - 20, 72, 40, 10); g.fill();
              g.fillStyle = "#e8546d"; rr(g, hx - 36, hy - 20, 72, 12, 10); g.fill();
              g.fillStyle = "rgba(255,255,255,.75)";
              g.beginPath(); g.arc(hx - 18, hy + 22, 6, 0, Math.PI * 2); g.arc(hx + 18, hy + 22, 6, 0, Math.PI * 2); g.fill();
              // timer bar
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 190, 424, 340, 14, 7); g.fill();
              g.fillStyle = timeLeft < 3.5 ? "#d93e22" : "#35c4a0"; rr(g, 190, 424, 340 * clamp(timeLeft / 12, 0, 1), 14, 7); g.fill();
              txt(g, "TIME", 148, 436, 15, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Press and scrub that rug clean!", W / 2, 48, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
