/* ================================================================
   GoofGig — Gig #059 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #059 — Squeegee the Window
         Drag the squeegee over the fogged window in strokes.
         Fog clears in its path. 12 seconds. Score = % cleared.
         ================================================================ */
      registerGame({
        n: 59, title: "Squeegee the Window",
        desc: "One foggy window, one squeegee, a view worth fighting for.",
        hint: '<b>Press and drag</b> the squeegee across the fog in strokes. Fog clears where it passes. <b>12 seconds</b> — reveal the whole view!',
        grades: [
          ["Window Wizard", "Crystal clear. Birds are now a safety concern."],
          ["Squeegee Pro", "That view earned every stroke. Postcard stuff."],
          ["Clear Enough", "You can see the garden. And most of the sky."],
          ["Streak Enthusiast", "Abstract fog art with occasional visibility."],
          ["Fog's Landlord", "The fog pays rent now. It is not leaving."]
        ],
        thumb: function (g) {
          g.fillStyle = "#a8d4e6"; rr(g, 106, 8, 88, 66, 4); g.fill();
          g.fillStyle = "rgba(240,248,252,.85)"; rr(g, 150, 8, 44, 66, 4); g.fill();
          g.fillStyle = "#ffd83d"; g.beginPath(); g.arc(126, 26, 9, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#4a4a52"; rr(g, 138, 44, 34, 8, 3); g.fill();
        },
        create: function (api) {
          var WIN = { x: 90, y: 58, w: 540, h: 330 };
          var COLS = 18, ROWS = 11, cells = [], i, j;
          for (j = 0; j < ROWS; j++) for (i = 0; i < COLS; i++) cells.push(false);
          var holding = false, started = false, done = false, timeLeft = 12, sx = W / 2, sy = 220, blipT = 0;
          function cellRect(c) {
            return { x: WIN.x + (c % COLS) * (WIN.w / COLS), y: WIN.y + Math.floor(c / COLS) * (WIN.h / ROWS), w: WIN.w / COLS, h: WIN.h / ROWS };
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
              { label: "Window cleared", value: p, text: p + "%", good: p >= 80 },
              { label: "Fog remaining", value: 100 - p, text: (100 - p) + "%" }
            ] });
          }
          return {
            status: function () { return done ? "Time up!" : (started ? timeLeft.toFixed(1) + "s · cleared " + pct() + "%" : "Press and squeegee!"); },
            down: function (p) {
              if (done) return;
              started = true; holding = true; sx = p.x; sy = p.y; audio();
            },
            move: function (p) { sx = p.x; sy = p.y; },
            up: function () { holding = false; },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                if (holding) {
                  // squeegee band: 132 wide, 30 tall centred on pointer
                  for (var k = 0; k < cells.length; k++) {
                    if (cells[k]) continue;
                    var r = cellRect(k), cx = r.x + r.w / 2, cy = r.y + r.h / 2;
                    if (Math.abs(cx - sx) <= 72 && Math.abs(cy - sy) <= 24) cells[k] = true;
                  }
                  blipT -= dt;
                  if (blipT <= 0) { blipT = 0.5; blip(500, .03, "sine", .03); }
                }
                if (timeLeft <= 0) finishRound();
              }
              // the view behind the glass
              var grad = g.createLinearGradient(0, WIN.y, 0, WIN.y + WIN.h);
              grad.addColorStop(0, "#8ecfee"); grad.addColorStop(1, "#dff3fa");
              g.fillStyle = grad; g.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
              g.fillStyle = "#ffd83d"; g.beginPath(); g.arc(WIN.x + 84, WIN.y + 62, 30, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#79b657"; g.beginPath(); g.ellipse(WIN.x + 120, WIN.y + WIN.h, 190, 74, 0, Math.PI, Math.PI * 2); g.fill();
              g.beginPath(); g.ellipse(WIN.x + 430, WIN.y + WIN.h, 210, 92, 0, Math.PI, Math.PI * 2); g.fill();
              g.fillStyle = "#e8e0cc"; rr(g, WIN.x + 356, WIN.y + 176, 96, 70, 4); g.fill();
              g.fillStyle = "#c25e3a"; g.beginPath();
              g.moveTo(WIN.x + 348, WIN.y + 178); g.lineTo(WIN.x + 404, WIN.y + 140); g.lineTo(WIN.x + 460, WIN.y + 178); g.closePath(); g.fill();
              // fog on uncleared cells
              for (var k2 = 0; k2 < cells.length; k2++) {
                if (cells[k2]) continue;
                var r2 = cellRect(k2);
                g.fillStyle = "rgba(238,246,250,.93)"; g.fillRect(r2.x, r2.y, r2.w + 1, r2.h + 1);
              }
              // frame + mullions
              g.strokeStyle = dark ? "#5e4020" : "#8a5a28"; g.lineWidth = 10; rr(g, WIN.x, WIN.y, WIN.w, WIN.h, 6); g.stroke();
              g.lineWidth = 5;
              g.beginPath(); g.moveTo(W / 2, WIN.y); g.lineTo(W / 2, WIN.y + WIN.h); g.stroke();
              // squeegee (handle + rubber blade) and drip streaks under it
              if (holding) {
                g.fillStyle = "rgba(190,225,245,.5)";
                for (var d2 = -2; d2 <= 2; d2++) g.fillRect(sx + d2 * 26 - 2, sy + 16, 4, 22 + (d2 + 2) * 5);
              }
              g.fillStyle = "#4a4a52"; rr(g, sx - 66, sy - 13, 132, 15, 6); g.fill();
              g.fillStyle = "#2b6fe3"; rr(g, sx - 10, sy - 34, 20, 24, 6); g.fill();
              // timer bar
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 190, 424, 340, 14, 7); g.fill();
              g.fillStyle = timeLeft < 3.5 ? "#d93e22" : "#35c4a0"; rr(g, 190, 424, 340 * clamp(timeLeft / 12, 0, 1), 14, 7); g.fill();
              txt(g, "TIME", 148, 436, 15, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Wipe the fog away — find the view!", W / 2, 34, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
