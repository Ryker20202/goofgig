/* ================================================================
   GoofGig — Gig #034 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #034 — Butter the Toast
         Ten seconds, one knife, one slice. Bare bread is
         a crime and the butter dish is watching.
         ================================================================ */
      registerGame({
        n: 34, title: "Butter the Toast",
        desc: "Ten seconds, one knife, zero tolerance for bare bread.",
        hint: '<b>Press and drag</b> the knife back and forth across the toast. Your score is the <b>butter coverage</b> when the <b>10 seconds</b> run out. Bare corners will be judged.',
        grades: [
          ["Butter Architect", "Every millimeter. Buttered. Urban planners applaud."],
          ["Golden Spreader", "That toast is wearing butter like a tailored suit."],
          ["Decent Breakfast", "A few pale patches, but the jam can cover your sins."],
          ["Butter Tourist", "You visited the toast. Briefly. With one stripe."],
          ["Dry Toast Criminal", "The butter dish has filed a restraining order."]
        ],
        thumb: function (g) {
          g.fillStyle = "#c9853e"; rr(g, 108, 16, 84, 62, 12); g.fill();
          g.fillStyle = "#e8b04b"; rr(g, 116, 24, 68, 46, 9); g.fill();
          g.fillStyle = "#ffe98a"; rr(g, 124, 32, 34, 30, 6); g.fill();
          g.fillStyle = "#8d99ae"; rr(g, 176, 56, 34, 8, 4); g.fill();
        },
        create: function (api) {
          var TX = 205, TY = 118, TW = 310, TH = 236, CELL = 20;
          var COLS = Math.floor(TW / CELL), ROWS = Math.floor(TH / CELL);
          var cells = [], covered = 0, total = COLS * ROWS;
          for (var i = 0; i < total; i++) cells.push(false);
          var pressing = false, px = 0, py = 0, hasP = false, timeLeft = 10, started = false, done = false;
          function markAt(x, y) {
            var c = Math.floor((x - TX) / CELL), r = Math.floor((y - TY) / CELL);
            if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return;
            var idx = r * COLS + c;
            if (!cells[idx]) { cells[idx] = true; covered++; }
          }
          function smear(x0, y0, x1, y1) {
            var steps = Math.max(1, Math.ceil(dist(x0, y0, x1, y1) / 9));
            for (var s = 0; s <= steps; s++) markAt(x0 + (x1 - x0) * s / steps, y0 + (y1 - y0) * s / steps);
          }
          function coverage() { return covered / total * 100; }
          function finishRound() {
            done = true;
            var cov = coverage();
            var s = clamp(Math.round(cov * 1.06), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Butter coverage", value: cov, text: Math.round(cov) + "% of the toast", good: cov > 75 },
              { label: "Bare bread left", value: 100 - cov, text: Math.round(100 - cov) + "% — the jam saw it" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Coverage: " + Math.round(coverage()) + "%. The toast rests.";
              return started ? "Time " + Math.ceil(timeLeft) + "s · coverage " + Math.round(coverage()) + "%" : "Press on the toast and spread!";
            },
            down: function (p) {
              if (done) return;
              started = true; audio();
              pressing = true; px = p.x; py = p.y; hasP = true;
              markAt(p.x, p.y); blip(300, .04, "sine", .04);
            },
            move: function (p) {
              if (done || !pressing) return;
              if (hasP) smear(px, py, p.x, p.y);
              px = p.x; py = p.y; hasP = true;
            },
            up: function () { pressing = false; hasP = false; },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                if (timeLeft <= 0) { if (coverage() > 75) sndGood(); else sndBad(); finishRound(); }
              }
              // plate + table
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; g.fillRect(0, 384, W, 76);
              g.fillStyle = dark ? "#5b7a99" : "#bfe3f2"; g.beginPath(); g.ellipse(W / 2, 244, 218, 138, 0, 0, Math.PI * 2); g.fill();
              // toast slice
              g.fillStyle = "#c9853e"; rr(g, TX - 8, TY - 8, TW + 16, TH + 16, 26); g.fill();
              g.fillStyle = "#e8b04b"; rr(g, TX, TY, TW, TH, 20); g.fill();
              // buttered cells
              g.fillStyle = "rgba(255,233,138,.92)";
              for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
                if (cells[r * COLS + c]) g.fillRect(TX + c * CELL + 1, TY + r * CELL + 1, CELL - 2, CELL - 2);
              }
              // butter pat melting in the corner + knife at pointer
              g.fillStyle = "#ffe98a"; rr(g, TX + TW - 52, TY + 12, 36, 24, 5); g.fill();
              if (hasP && !done) {
                g.save(); g.translate(px, py); g.rotate(0.6);
                g.fillStyle = "#d7dde3"; rr(g, -4, -46, 9, 52, 4); g.fill();
                g.fillStyle = "#8a5a28"; rr(g, -5, 4, 11, 34, 5); g.fill();
                g.fillStyle = "#ffe98a"; g.beginPath(); g.arc(0, -44, 6, 0, Math.PI * 2); g.fill();
                g.restore();
              }
              // timer + coverage readouts
              txt(g, started ? Math.ceil(timeLeft) + "s" : "10s", 84, 92, 28, timeLeft < 3 && started ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
              txt(g, Math.round(coverage()) + "% buttered", W - 120, 92, 20, dark ? "#f7e8d8" : "#7a5f4d");
              if (!started) txt(g, "Press & drag to spread the butter!", W / 2, 446, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
