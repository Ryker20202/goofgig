/* ================================================================
   GoofGig — Gig #046 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #046 — Paint the Fence
         Hold the brush AND drag along the board. Painted
         coverage grows where the brush passes; parked = drips.
         10 seconds of paint.
         ================================================================ */
      registerGame({
        n: 46, title: "Paint the Fence",
        desc: "Hold and sweep. A fresh fence or a drippy stripe show.",
        hint: '<b>Press and drag</b> the brush along the fence board. Paint sticks where the brush passes <b>while held</b>. Park the brush and it <b>drips</b>. You have <b>10 seconds</b> of paint.',
        grades: [
          ["Fence Finishing Royalty", "Full coverage, zero drips. The neighbors are jealous."],
          ["Brush Captain", "Smooth sweeping. That fence glows now."],
          ["Solid Painter", "Mostly painted. A few rustic gaps."],
          ["Stripe Enthusiast", "You painted modern art. The fence wanted coverage."],
          ["Drip Goblin", "More paint on the grass than on the fence."]
        ],
        thumb: function (g) {
          g.fillStyle = "#b08954"; rr(g, 104, 30, 192, 14, 4); g.fill(); rr(g, 104, 56, 192, 14, 4); g.fill();
          g.fillStyle = "#57b7dd"; rr(g, 104, 30, 120, 14, 4); g.fill();
          g.fillStyle = "#8a5a28"; rr(g, 216, 8, 8, 30, 3); g.fill();
          g.fillStyle = "#57b7dd"; rr(g, 210, 34, 20, 14, 4); g.fill();
        },
        create: function (api) {
          var N = 30, segs = [], painted = 0, drips = 0, dripSpots = [], dripAcc = 0;
          var timeLeft = 10, started = false, done = false, holding = false, px = 0, py = 0, hasP = false, stillT = 0;
          var FX = 90, FW = 540, SEG = FW / N;
          for (var i = 0; i < N; i++) segs.push(false);
          function pct() { return painted / N * 100; }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(pct() - drips * 2.5), 1, 100);
            api.finish({ score: s, rows: [
              { label: "Fence painted", value: pct(), text: Math.round(pct()) + "%", good: pct() >= 70 },
              { label: "Drips", value: clamp(100 - drips * 10, 0, 100), text: drips + (drips === 1 ? " drip" : " drips") }
            ] });
          }
          return {
            status: function () {
              if (done) return "Paint's gone!";
              return started ? "Time " + timeLeft.toFixed(1) + "s · painted " + Math.round(pct()) + "%" : "Hold and sweep the brush!";
            },
            down: function (p) { if (done) return; started = true; holding = true; px = p.x; py = p.y; hasP = true; stillT = 0; audio(); },
            move: function (p) {
              if (done || !holding) return;
              var d = hasP ? dist(p.x, p.y, px, py) : 0;
              if (d > 3) {
                stillT = 0;
                if (p.y > 130 && p.y < 330) {
                  var idx = Math.floor((p.x - FX) / SEG);
                  if (idx >= 0 && idx < N && !segs[idx]) { segs[idx] = true; painted++; blip(420 + painted * 9, .04, "sine", .04); }
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
                  if (stillT > 0.5) { dripAcc += dt; if (dripAcc > 0.45) { dripAcc = 0; drips++; dripSpots.push({ x: px, y: 318 }); blip(150, .06, "square", .05); } }
                }
                if (pct() >= 100 || timeLeft <= 0) { if (pct() >= 100) sndGood(); else sndBad(); finishRound(); }
              }
              var CX = W / 2;
              // grass
              g.fillStyle = dark ? "#274435" : "#a8d89a"; g.fillRect(0, 322, W, 138);
              // posts
              g.fillStyle = "#8a6844"; rr(g, FX + 30, 118, 22, 216, 4); g.fill(); rr(g, FX + FW - 52, 118, 22, 216, 4); g.fill();
              // two boards; painted segments turn fresh blue-white paint color
              [150, 232].forEach(function (by) {
                for (var i = 0; i < N; i++) {
                  g.fillStyle = segs[i] ? "#57b7dd" : "#b08954";
                  g.fillRect(FX + i * SEG + 1, by, SEG - 2, 58);
                  g.fillStyle = segs[i] ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.12)";
                  g.fillRect(FX + i * SEG + 1, by + 6, SEG - 2, 5);
                }
                g.strokeStyle = "rgba(90,60,25,.5)"; g.lineWidth = 3; g.strokeRect(FX, by, FW, 58);
              });
              // nails
              g.fillStyle = "#7d8894";
              [174, 256].forEach(function (ny) { [FX + 41, FX + FW - 41].forEach(function (nx) { g.beginPath(); g.arc(nx, ny, 4, 0, Math.PI * 2); g.fill(); }); });
              // drip spots on the grass
              g.fillStyle = "rgba(87,183,221,.8)";
              dripSpots.forEach(function (d) { g.beginPath(); g.ellipse(d.x, 330, 10, 5, 0, 0, Math.PI * 2); g.fill(); });
              // brush follows pointer while holding
              if (holding && hasP && !done) {
                g.save(); g.translate(px, py); g.rotate(0.3);
                g.fillStyle = "#8a5a28"; rr(g, -5, -56, 10, 44, 4); g.fill();
                g.fillStyle = "#c9ced4"; rr(g, -11, -14, 22, 10, 3); g.fill();
                g.fillStyle = "#57b7dd"; rr(g, -11, -5, 22, 20, 3); g.fill();
                g.restore();
              }
              txt(g, started ? timeLeft.toFixed(1) + "s" : "10.0s", 92, 96, 30, timeLeft < 3 && started ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
              txt(g, "PAINTED " + Math.round(pct()) + "%", CX, 404, 19, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Press, hold and sweep along the boards!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
