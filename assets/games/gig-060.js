/* ================================================================
   GoofGig — Gig #060 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #060 — Polish the Apple
         Rub the cloth in little circles. Shine builds where
         you circle — straight rubs count half. 10 seconds.
         ================================================================ */
      registerGame({
        n: 60, title: "Polish the Apple",
        desc: "Little circles, big shine. Straight lines are half-hearted and the apple knows.",
        hint: '<b>Press and rub in little circles</b> all over the apple. Circling builds <b>shine</b> — straight-line rubbing counts <b>half</b>. You have <b>10 seconds</b>.',
        grades: [
          ["Mirror Apple", "You can see your future in it. It looks shiny."],
          ["Professional Polisher", "Orchards hire people for less shine than this."],
          ["Respectably Glossy", "A solid sheen. The apple is presentable."],
          ["Half-Hearted Buffer", "Some shine, some dull, all vibes."],
          ["Still Just an Apple", "It remains, defiantly, matte."]
        ],
        thumb: function (g) {
          g.fillStyle = "#d93e22"; g.beginPath(); g.arc(150, 52, 32, 0, Math.PI * 2); g.fill();
          g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(136, 38, 10, 15, -0.4, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#5da24a"; g.beginPath(); g.ellipse(162, 16, 12, 6, 0.5, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#7fb6cc"; rr(g, 168, 58, 26, 22, 5); g.fill();
        },
        create: function (api) {
          var C = { x: W / 2, y: 224 }, R = 118, CELL = 30;
          var cells = [], x, y;
          for (y = C.y - R; y < C.y + R; y += CELL) for (x = C.x - R; x < C.x + R; x += CELL) {
            var cx = x + CELL / 2, cy = y + CELL / 2;
            if (dist(cx, cy, C.x, C.y) <= R - 8) cells.push({ x: cx, y: cy, shine: 0 });
          }
          var holding = false, started = false, done = false, timeLeft = 10;
          var px = W / 2 + 170, py = 360, lastX = 0, lastY = 0, lastDir = 0, hasDir = false;
          function avgShine() {
            var s = 0; for (var i = 0; i < cells.length; i++) s += cells[i].shine;
            return cells.length ? s / cells.length : 0;
          }
          function finishRound() {
            done = true;
            var p = Math.round(avgShine() * 100);
            if (p >= 80) sndGood(); else if (p < 35) sndBad();
            api.finish({ score: clamp(p, 1, 100), rows: [
              { label: "Shine level", value: p, text: p + "%", good: p >= 75 },
              { label: "Still dull", value: 100 - p, text: (100 - p) + "%" }
            ] });
          }
          return {
            status: function () { return done ? "Time up!" : (started ? timeLeft.toFixed(1) + "s · shine " + Math.round(avgShine() * 100) + "%" : "Press and rub in circles!"); },
            down: function (p) {
              if (done) return;
              started = true; holding = true; audio();
              px = p.x; py = p.y; lastX = p.x; lastY = p.y; hasDir = false;
            },
            move: function (p) {
              px = p.x; py = p.y;
              if (!holding || done) return;
              var d = dist(p.x, p.y, lastX, lastY);
              if (d >= 2) {
                var ang = Math.atan2(p.y - lastY, p.x - lastX), factor = 0.5;
                if (hasDir) {
                  var turn = Math.abs(ang - lastDir);
                  while (turn > Math.PI) turn = Math.PI * 2 - turn;
                  factor = 0.5 + 0.5 * clamp(turn / 1.1, 0, 1);
                }
                var gain = d * 0.0075 * factor;
                for (var i = 0; i < cells.length; i++) {
                  var dc = dist(p.x, p.y, cells[i].x, cells[i].y);
                  if (dc < 48) cells[i].shine = clamp(cells[i].shine + gain * (1 - dc / 48), 0, 1);
                }
                lastDir = ang; hasDir = true;
              }
              lastX = p.x; lastY = p.y;
            },
            up: function () { holding = false; hasDir = false; },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                if (timeLeft <= 0) finishRound();
              }
              // table
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; g.fillRect(0, 356, W, 104);
              // apple shadow + body
              g.fillStyle = "rgba(0,0,0,.15)"; g.beginPath(); g.ellipse(C.x, C.y + R + 12, 104, 14, 0, 0, Math.PI * 2); g.fill();
              var grad = g.createRadialGradient(C.x - 40, C.y - 46, 20, C.x, C.y, R + 16);
              grad.addColorStop(0, "#f0604a"); grad.addColorStop(1, "#c22f24");
              g.fillStyle = grad; g.beginPath(); g.arc(C.x, C.y, R, 0, Math.PI * 2); g.fill();
              // shine cells, clipped to the apple
              g.save();
              g.beginPath(); g.arc(C.x, C.y, R, 0, Math.PI * 2); g.clip();
              for (var i = 0; i < cells.length; i++) {
                if (cells[i].shine <= 0.02) continue;
                g.fillStyle = "rgba(255,255,255," + (cells[i].shine * 0.5).toFixed(3) + ")";
                g.fillRect(cells[i].x - CELL / 2, cells[i].y - CELL / 2, CELL, CELL);
              }
              g.restore();
              // gloss spot grows with overall shine
              var av = avgShine();
              g.fillStyle = "rgba(255,255,255," + (0.18 + av * 0.4).toFixed(3) + ")";
              g.beginPath(); g.ellipse(C.x - 44, C.y - 52, 22 + av * 14, 34 + av * 16, -0.4, 0, Math.PI * 2); g.fill();
              // stem + leaf
              g.strokeStyle = "#8a5a28"; g.lineWidth = 8; g.lineCap = "round";
              g.beginPath(); g.moveTo(C.x, C.y - R + 6); g.quadraticCurveTo(C.x + 6, C.y - R - 14, C.x + 18, C.y - R - 16); g.stroke();
              g.fillStyle = "#5da24a"; g.beginPath(); g.ellipse(C.x + 34, C.y - R - 10, 20, 9, 0.5, 0, Math.PI * 2); g.fill();
              // cloth
              g.save(); g.translate(px, py); g.rotate(holding ? 0.2 : 0);
              g.fillStyle = "#7fb6cc"; rr(g, -28, -24, 56, 48, 9); g.fill();
              g.fillStyle = "rgba(255,255,255,.35)"; rr(g, -28, -24, 56, 14, 9); g.fill();
              g.strokeStyle = "rgba(70,120,150,.6)"; g.lineWidth = 2;
              g.beginPath(); g.moveTo(-28, 2); g.lineTo(28, 2); g.moveTo(-28, 14); g.lineTo(28, 14); g.stroke();
              g.restore();
              // timer bar
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 190, 424, 340, 14, 7); g.fill();
              g.fillStyle = timeLeft < 3 ? "#d93e22" : "#35c4a0"; rr(g, 190, 424, 340 * clamp(timeLeft / 10, 0, 1), 14, 7); g.fill();
              txt(g, "TIME", 148, 436, 15, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Rub in little circles — cover the whole apple!", W / 2, 40, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
