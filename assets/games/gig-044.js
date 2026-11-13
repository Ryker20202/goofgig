/* ================================================================
   GoofGig — Gig #044 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #044 — Iron the Shirt
         Hold the iron AND keep it moving. Wrinkles clear where
         it passes; parked >0.8s scorches. 12 seconds.
         ================================================================ */
      registerGame({
        n: 44, title: "Iron the Shirt",
        desc: "Hold and glide. Crisp shirt, or a scorch-mark souvenir.",
        hint: '<b>Press and drag</b> the iron across the shirt. Wrinkles clear where it passes <b>while held</b>. Park it in one spot for <b>0.8s</b> and it <b>scorches</b>. You have <b>12 seconds</b>.',
        grades: [
          ["Pressing Perfectionist", "Runway crisp. Not one wrinkle survived."],
          ["Laundry Captain", "Smooth, sharp, scorch-free. Lovely pressing."],
          ["Solid Ironer", "Mostly crisp. The collar has secrets."],
          ["Crease Collector", "Half shirt, half accordion. A bold look."],
          ["Scorch Artist", "You branded the shirt. It is a warning now."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdfdf8"; rr(g, 112, 22, 76, 56, 10); g.fill();
          g.strokeStyle = "#b9c4cc"; g.lineWidth = 3; rr(g, 112, 22, 76, 56, 10); g.stroke();
          g.fillStyle = "#57b7dd"; g.beginPath(); g.moveTo(196, 62); g.lineTo(238, 62); g.lineTo(228, 44); g.lineTo(204, 44); g.closePath(); g.fill();
          g.fillStyle = "#3f8fb5"; rr(g, 206, 30, 20, 12, 5); g.fill();
        },
        create: function (api) {
          var COLS = 8, ROWS = 4, cells = [], cleared = 0, scorches = [], scorchSpots = [];
          var timeLeft = 12, started = false, done = false, holding = false, px = 0, py = 0, hasP = false, stillT = 0, steamAcc = 0, puffs = [];
          var SX = 150, SY = 130, CW = 52, CH = 52;
          for (var i = 0; i < COLS * ROWS; i++) cells.push(false);
          function pct() { return cleared / (COLS * ROWS) * 100; }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(pct() - scorches * 9), 1, 100);
            api.finish({ score: s, rows: [
              { label: "Wrinkles cleared", value: pct(), text: Math.round(pct()) + "%", good: pct() >= 70 },
              { label: "Scorch marks", value: clamp(100 - scorches * 25, 0, 100), text: scorches + (scorches === 1 ? " scorch" : " scorches") }
            ] });
          }
          return {
            status: function () {
              if (done) return "Ironing done!";
              return started ? "Time " + timeLeft.toFixed(1) + "s · crisp " + Math.round(pct()) + "%" : "Hold and glide the iron!";
            },
            down: function (p) { if (done) return; started = true; holding = true; px = p.x; py = p.y; hasP = true; stillT = 0; audio(); },
            move: function (p) {
              if (done || !holding) return;
              var d = hasP ? dist(p.x, p.y, px, py) : 0;
              if (d > 3) {
                stillT = 0;
                var c = Math.floor((p.x - SX) / CW), r = Math.floor((p.y - SY) / CH);
                if (c >= 0 && c < COLS && r >= 0 && r < ROWS) {
                  var idx = r * COLS + c;
                  if (!cells[idx]) { cells[idx] = true; cleared++; blip(500 + cleared * 8, .04, "sine", .04); }
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
                  steamAcc += dt;
                  if (steamAcc > 0.12) { steamAcc = 0; puffs.push({ x: px - 16 + Math.random() * 32, y: py - 34, t: 0 }); }
                  if (stillT > 0.8) {
                    stillT = 0.25; scorches++;
                    scorchSpots.push({ x: px, y: py });
                    sndBad();
                  }
                }
                if (pct() >= 100 || timeLeft <= 0) { if (pct() >= 100) sndGood(); finishRound(); }
              }
              for (var q = puffs.length - 1; q >= 0; q--) { puffs[q].t += dt; puffs[q].y -= dt * 34; if (puffs[q].t > 0.8) puffs.splice(q, 1); }
              var CX = W / 2;
              // ironing board
              g.fillStyle = dark ? "#4a3423" : "#d9b98a"; rr(g, 96, 350, 528, 26, 10); g.fill();
              // shirt body
              g.fillStyle = dark ? "#3a3f4a" : "#fdfdf8"; rr(g, SX, SY, COLS * CW, ROWS * CH, 12); g.fill();
              g.strokeStyle = dark ? "#596273" : "#d8dee4"; g.lineWidth = 3; rr(g, SX, SY, COLS * CW, ROWS * CH, 12); g.stroke();
              // collar
              g.fillStyle = dark ? "#454b58" : "#eef1f4";
              g.beginPath(); g.moveTo(CX - 44, SY); g.lineTo(CX, SY + 30); g.lineTo(CX + 44, SY); g.closePath(); g.fill();
              // wrinkle zigzags in un-cleared cells; smooth sheen in cleared
              for (var r2 = 0; r2 < ROWS; r2++) for (var c2 = 0; c2 < COLS; c2++) {
                var x0 = SX + c2 * CW, y0 = SY + r2 * CH;
                if (cells[r2 * COLS + c2]) {
                  g.fillStyle = dark ? "rgba(255,255,255,.06)" : "rgba(87,183,221,.10)"; g.fillRect(x0 + 3, y0 + 3, CW - 6, CH - 6);
                } else {
                  g.strokeStyle = dark ? "#79839a" : "#a7b6c2"; g.lineWidth = 3;
                  g.beginPath();
                  g.moveTo(x0 + 10, y0 + 20); g.lineTo(x0 + 20, y0 + 32); g.lineTo(x0 + 30, y0 + 20); g.lineTo(x0 + 40, y0 + 32);
                  g.stroke();
                }
              }
              // scorch marks
              scorchSpots.forEach(function (s3) {
                g.fillStyle = "rgba(90,52,16,.8)";
                g.beginPath(); g.ellipse(s3.x, s3.y + 8, 20, 9, 0, 0, Math.PI * 2); g.fill();
                g.fillStyle = "rgba(50,28,6,.9)";
                g.beginPath(); g.ellipse(s3.x, s3.y + 8, 11, 5, 0, 0, Math.PI * 2); g.fill();
              });
              // steam puffs
              g.fillStyle = "rgba(255,255,255,.55)";
              puffs.forEach(function (p) { g.beginPath(); g.arc(p.x, p.y, 6 + p.t * 9, 0, Math.PI * 2); g.fill(); });
              // the iron follows the pointer while holding
              if (holding && hasP && !done) {
                g.save(); g.translate(px, py);
                var hot = stillT > 0.55;
                g.fillStyle = hot ? "#d93e22" : "#57b7dd";
                g.beginPath(); g.moveTo(-30, 12); g.lineTo(28, 12); g.quadraticCurveTo(34, 12, 28, -2); g.lineTo(8, -12); g.lineTo(-24, -12); g.quadraticCurveTo(-32, 0, -30, 12); g.closePath(); g.fill();
                g.strokeStyle = hot ? "#8f1f16" : "#3f8fb5"; g.lineWidth = 5;
                g.beginPath(); g.arc(0, -16, 13, Math.PI, Math.PI * 2); g.stroke();
                g.restore();
              }
              txt(g, started ? timeLeft.toFixed(1) + "s" : "12.0s", 92, 96, 30, timeLeft < 3 && started ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
              txt(g, "CRISP " + Math.round(pct()) + "%", CX, 404, 19, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Press, hold and keep it moving!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
