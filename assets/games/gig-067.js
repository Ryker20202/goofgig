/* ================================================================
   GoofGig — Gig #067 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #067 — Snowball Dodge
         Snowballs from both sides. Every hit shrinks the snowman.
         ================================================================ */
      registerGame({
        n: 67, title: "Snowball Dodge",
        desc: "The neighborhood kids have impeccable aim and no mercy.",
        hint: '<b>Move the pointer</b> — the snowman follows. Dodge the snowballs for <b>15 seconds</b>. Every hit <b>shrinks</b> him.',
        grades: [
          ["Untouchable Snow", "Fifteen seconds of artillery and not a flake out of place."],
          ["Slippery Snowman", "You weaved like a winter Olympian. Mostly intact."],
          ["Slightly Melted", "A few hits landed. He's shorter now, but prouder."],
          ["Snowcone Shaped", "More snow on the ground than in the snowman at this point."],
          ["Puddle With A Hat", "He had a good run. The hat floats now."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdfdfd"; g.beginPath(); g.arc(150, 62, 16, 0, Math.PI * 2); g.arc(150, 34, 11, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e8a33d"; g.beginPath(); g.moveTo(150, 36); g.lineTo(166, 40); g.lineTo(150, 42); g.closePath(); g.fill();
          g.fillStyle = "#cfe8f5"; g.beginPath(); g.arc(112, 30, 8, 0, Math.PI * 2); g.arc(192, 22, 8, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var sx = W / 2, tx = W / 2, balls = [], hits = 0, scale = 1, timeLeft = 15, started = false, done = false, spawnT = 0.5, flash = 0;
          function finishRound() {
            done = true;
            var s = clamp(Math.round(100 - hits * 14), 1, 100);
            if (hits <= 1) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Snowballs dodged", value: clamp((15 - timeLeft) / 15 * 100, 0, 100), text: (15 - timeLeft).toFixed(1) + "s survived", good: hits <= 2 },
              { label: "Hits taken", value: clamp(hits / 7 * 100, 0, 100), text: hits + " direct hits" }
            ] });
          }
          return {
            status: function () { return done ? "Snow war over!" : (started ? "Hits " + hits + " · " + timeLeft.toFixed(0) + "s left" : "Move to start dodging!"); },
            down: function (p) { started = true; tx = p.x; audio(); },
            move: function (p) { started = true; tx = p.x; },
            up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                spawnT -= dt;
                if (spawnT <= 0) {
                  spawnT = 0.55 + Math.random() * 0.4;
                  var fromLeft = Math.random() < 0.5;
                  balls.push({ x: fromLeft ? -16 : W + 16, y: 268 + Math.random() * 110, vx: (fromLeft ? 1 : -1) * (250 + Math.random() * 130) });
                }
                if (timeLeft <= 0) finishRound();
              }
              if (flash > 0) flash -= dt;
              sx += (clamp(tx, 46, W - 46) - sx) * Math.min(1, dt * 13);
              // snowy scene
              g.fillStyle = dark ? "#2c3644" : "#dceef8"; g.fillRect(0, 0, W, 460);
              g.fillStyle = "#ffffff"; g.fillRect(0, 408, W, 52);
              g.fillStyle = dark ? "#3d5a3a" : "#5d8a54";
              [[70, 330], [650, 318], [180, 348]].forEach(function (t) {
                g.beginPath(); g.moveTo(t[0] - 22, t[1] + 60); g.lineTo(t[0], t[1]); g.lineTo(t[0] + 22, t[1] + 60); g.closePath(); g.fill();
              });
              // snowballs
              for (var i = balls.length - 1; i >= 0; i--) {
                var b = balls[i];
                if (started && !done) b.x += b.vx * dt;
                if (b.x < -30 || b.x > W + 30) { balls.splice(i, 1); continue; }
                var bodyY = 408 - 52 * scale;
                if (started && !done && Math.abs(b.x - sx) < 34 * scale + 8 && b.y > bodyY - 66 * scale && b.y < 412) {
                  hits++; scale = clamp(scale - 0.13, 0.45, 1); flash = 0.25; balls.splice(i, 1); sndBad();
                  if (hits >= 7) { finishRound(); break; }
                  continue;
                }
                g.fillStyle = "#ffffff"; g.beginPath(); g.arc(b.x, b.y, 11, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "rgba(120,160,190,.5)"; g.lineWidth = 2; g.stroke();
              }
              // snowman
              var r1 = 40 * scale, r2 = 29 * scale, r3 = 20 * scale;
              var y0 = 408;
              g.fillStyle = flash > 0 ? "#ffd9d0" : "#ffffff";
              g.beginPath(); g.arc(sx, y0 - r1, r1, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(sx, y0 - r1 * 2 - r2 + 8, r2, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(sx, y0 - r1 * 2 - r2 * 2 - r3 + 14, r3, 0, Math.PI * 2); g.fill();
              var hy = y0 - r1 * 2 - r2 * 2 - r3 + 14;
              g.fillStyle = "#33241a"; g.beginPath(); g.arc(sx - 6 * scale, hy - 3, 2.6, 0, Math.PI * 2); g.arc(sx + 6 * scale, hy - 3, 2.6, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#e8a33d"; g.beginPath(); g.moveTo(sx, hy + 1); g.lineTo(sx + 15 * scale, hy + 4); g.lineTo(sx, hy + 6); g.closePath(); g.fill();
              g.fillStyle = "#22242a"; rr(g, sx - 15 * scale, hy - r3 - 9, 30 * scale, 8, 2); g.fill(); rr(g, sx - 9 * scale, hy - r3 - 22, 18 * scale, 15, 2); g.fill();
              // scarf shrinks with him
              g.fillStyle = "#d93e22"; rr(g, sx - r2 * 0.8, hy + r3 - 4, r2 * 1.6, 8 * scale, 3); g.fill();
              txt(g, started ? timeLeft.toFixed(0) + "s" : "15s", 640, 56, 28, dark ? "#f7e8d8" : "#33241a");
              txt(g, "HITS " + hits, 70, 56, 20, hits >= 4 ? "#d93e22" : (dark ? "#c4d4e4" : "#5d7a94"));
              if (!started) txt(g, "Dodge left, dodge right, stay frosty!", W / 2, 120, 21, dark ? "rgba(247,232,216,.85)" : "rgba(51,36,26,.7)");
            }
          };
        }
      });
