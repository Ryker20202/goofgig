/* ================================================================
   GoofGig — Gig #037 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #037 — Glue the Line
         Hold AND steer along the dotted line. Glue lays only
         while holding and moving. 8 seconds of glue.
         ================================================================ */
      registerGame({
        n: 37, title: "Glue the Line",
        desc: "Hold, steer, cover the dotted line before the glue dies.",
        hint: '<b>Press and drag</b> along the <b>dotted line</b>. Glue only flows while you <b>hold and move</b> — park the bottle and it <b>blobs</b>. You have <b>8 seconds</b> of glue.',
        grades: [
          ["Glue Surgeon", "Every dot covered. A flawless sticky seam."],
          ["Craft Fair Pro", "Smooth, steady, barely a blob. Lovely work."],
          ["Solid Sticker", "The line is stuck down. Mostly. It will hold."],
          ["Wobbly Gluer", "Half line, half modern art. Points for spirit."],
          ["Blob Goblin", "You glued the table, your hand, and one (1) dot."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdfdf8"; rr(g, 104, 14, 192, 64, 6); g.fill();
          g.strokeStyle = "#b9c4cc"; g.lineWidth = 3; g.setLineDash([6, 6]);
          g.beginPath(); g.moveTo(116, 46); g.quadraticCurveTo(200, 20, 284, 46); g.stroke(); g.setLineDash([]);
          g.strokeStyle = "#ffb627"; g.lineWidth = 5;
          g.beginPath(); g.moveTo(116, 46); g.quadraticCurveTo(170, 30, 210, 38); g.stroke();
          g.fillStyle = "#ffb627"; rr(g, 196, 6, 16, 26, 5); g.fill();
        },
        create: function (api) {
          var N = 44, pts = [], glued = [], cov = 0, blobs = 0, blobAcc = 0;
          var timeLeft = 8, started = false, done = false, holding = false, px = 0, py = 0, hasP = false, stillT = 0;
          for (var i = 0; i < N; i++) {
            var t = i / (N - 1);
            pts.push({ x: 90 + t * 540, y: 235 + Math.sin(t * Math.PI * 2.2) * 62 });
            glued.push(false);
          }
          function coverage() { var c = 0; glued.forEach(function (v) { if (v) c++; }); return c / N * 100; }
          function finishRound() {
            done = true;
            var c = coverage();
            var s = clamp(Math.round(c - blobs * 2.5), 1, 100);
            api.finish({ score: s, rows: [
              { label: "Line covered", value: c, text: Math.round(c) + "%", good: c >= 70 },
              { label: "Glue blobs", value: clamp(100 - blobs * 10, 0, 100), text: blobs + (blobs === 1 ? " blob" : " blobs") }
            ] });
          }
          return {
            status: function () {
              if (done) return "Glue's gone!";
              return started ? "Time " + timeLeft.toFixed(1) + "s · covered " + Math.round(coverage()) + "%" : "Hold and trace the line!";
            },
            down: function (p) { if (done) return; started = true; holding = true; px = p.x; py = p.y; hasP = true; stillT = 0; audio(); },
            move: function (p) {
              if (done || !holding) return;
              var d = hasP ? dist(p.x, p.y, px, py) : 0;
              if (d > 2) {
                stillT = 0;
                for (var i = 0; i < N; i++) {
                  if (!glued[i] && dist(p.x, p.y, pts[i].x, pts[i].y) < 30) { glued[i] = true; }
                }
              }
              px = p.x; py = p.y; hasP = true;
            },
            up: function () { holding = false; hasP = false; stillT = 0; },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                if (holding && hasP) {
                  stillT += dt;
                  if (stillT > 0.45) { blobAcc += dt; if (blobAcc > 0.5) { blobAcc = 0; blobs++; blip(140, .07, "square", .06); } }
                }
                if (coverage() >= 100 || timeLeft <= 0) { if (coverage() >= 100) sndGood(); else sndBad(); finishRound(); }
              }
              var CX = W / 2;
              // paper
              g.fillStyle = dark ? "#3a3f4a" : "#fdfdf8"; rr(g, 60, 120, 600, 240, 10); g.fill();
              g.strokeStyle = dark ? "#596273" : "#d8dee4"; g.lineWidth = 3; rr(g, 60, 120, 600, 240, 10); g.stroke();
              // dotted target line
              g.strokeStyle = dark ? "#8b95a5" : "#b9c4cc"; g.lineWidth = 4; g.setLineDash([2, 12]); g.lineCap = "round";
              g.beginPath(); pts.forEach(function (p, i) { if (i === 0) g.moveTo(p.x, p.y); else g.lineTo(p.x, p.y); }); g.stroke(); g.setLineDash([]);
              // glued segments shine amber
              g.strokeStyle = "#ffb627"; g.lineWidth = 8; g.lineCap = "round";
              g.beginPath();
              var pen = false;
              pts.forEach(function (p, i) {
                if (glued[i]) { if (!pen) { g.moveTo(p.x, p.y); pen = true; } else g.lineTo(p.x, p.y); }
                else pen = false;
              });
              g.stroke();
              // blobs
              g.fillStyle = "rgba(255,182,39,.85)";
              for (var b = 0; b < blobs; b++) {
                g.beginPath(); g.ellipse(120 + (b * 67) % 480, 322 - (b * 31) % 30, 13, 9, 0, 0, Math.PI * 2); g.fill();
              }
              // glue bottle follows the pointer while holding
              if (holding && hasP && !done) {
                g.save(); g.translate(px, py - 26); g.rotate(0.35);
                g.fillStyle = "#fdfdf8"; rr(g, -13, -34, 26, 44, 7); g.fill();
                g.fillStyle = "#ffb627"; rr(g, -13, -34, 26, 14, 7); g.fill();
                g.fillStyle = "#e8a33d"; g.beginPath(); g.moveTo(-5, 10); g.lineTo(5, 10); g.lineTo(0, 22); g.closePath(); g.fill();
                g.restore();
              }
              // glue timer
              txt(g, started ? timeLeft.toFixed(1) + "s" : "8.0s", 92, 128 - 34, 30, timeLeft < 2.5 && started ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
              txt(g, "COVERED " + Math.round(coverage()) + "%", CX, 404, 19, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Press, hold and trace the dotted line!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
