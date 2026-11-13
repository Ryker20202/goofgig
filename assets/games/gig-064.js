/* ================================================================
   GoofGig — Gig #064 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #064 — Leaf Catch
         Golden leaves good. Brown leaves clog the basket.
         ================================================================ */
      registerGame({
        n: 64, title: "Leaf Catch",
        desc: "Autumn is falling. Catch the gold, dodge the brown.",
        hint: '<b>Move the pointer</b> to slide the basket. Catch <b>golden leaves</b>; <b>brown leaves</b> clog the basket and slow it down. <b>20 seconds.</b>',
        grades: [
          ["Autumn Royalty", "You caught fall itself and barely got clogged doing it."],
          ["Leaf Baron", "A golden haul. The trees demand a rematch."],
          ["Rake-Free Wonder", "Plenty of gold, minimal yard-work energy."],
          ["Casual Sweeper", "Some gold, some brown, strong 'good enough' energy."],
          ["Compost Enthusiast", "Mostly brown leaves. The basket is now a salad."]
        ],
        thumb: function (g) {
          g.fillStyle = "#e8a33d"; g.beginPath(); g.ellipse(128, 26, 12, 7, 0.6, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#8a5a28"; g.beginPath(); g.ellipse(168, 18, 12, 7, -0.4, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#b85f14"; g.beginPath(); g.moveTo(116, 52); g.lineTo(184, 52); g.lineTo(174, 84); g.lineTo(126, 84); g.closePath(); g.fill();
        },
        create: function (api) {
          var bx = W / 2, tx = W / 2, leaves = [], gold = 0, brown = 0, clog = 0, timeLeft = 20, started = false, done = false, spawnT = 0;
          function finishRound() {
            done = true;
            var s = clamp(Math.round(gold * 4.2 - brown * 3.5 + 12), 1, 100);
            if (gold >= 16) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Golden leaves", value: clamp(gold / 22 * 100, 0, 100), text: gold + " caught", good: gold >= 14 },
              { label: "Brown clogs", value: clamp(brown / 10 * 100, 0, 100), text: brown + " clogged" }
            ] });
          }
          return {
            status: function () { return done ? "Autumn over!" : (started ? "Gold " + gold + " · brown " + brown + " · " + timeLeft.toFixed(0) + "s" : "Move to start catching!"); },
            down: function (p) { started = true; tx = p.x; audio(); },
            move: function (p) { started = true; tx = p.x; },
            up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                if (clog > 0) clog -= dt;
                spawnT -= dt;
                if (spawnT <= 0) { spawnT = 0.5 + Math.random() * 0.2; leaves.push({ x: 30 + Math.random() * (W - 60), y: -14, v: 120 + Math.random() * 70, gold: Math.random() < 0.65, ph: Math.random() * 6.28, rot: Math.random() * 3 }); }
                if (timeLeft <= 0) finishRound();
              }
              var speed = clog > 0 ? 3.2 : 11;
              bx += (clamp(tx, 52, W - 52) - bx) * Math.min(1, dt * speed);
              // tree tops
              g.fillStyle = dark ? "#4a3423" : "#a8722c";
              [[60, 10], [240, 4], [470, 8], [660, 12]].forEach(function (c) {
                g.beginPath(); g.ellipse(c[0], c[1], 86, 26, 0, 0, Math.PI * 2); g.fill();
              });
              // ground
              g.fillStyle = dark ? "#3a2c1c" : "#c99e5f"; g.fillRect(0, 430, W, 30);
              // leaves
              for (var i = leaves.length - 1; i >= 0; i--) {
                var L = leaves[i];
                if (started && !done) { L.y += L.v * dt; L.x += Math.sin(now / 300 + L.ph) * 34 * dt; L.rot += dt * 1.5; }
                if (L.y >= 388 && L.y <= 408 && Math.abs(L.x - bx) < 50) {
                  if (L.gold) { gold++; blip(760, .05, "sine", .05); } else { brown++; clog = 1.3; blip(180, .08, "square", .05); }
                  leaves.splice(i, 1); continue;
                }
                if (L.y > 434) { leaves.splice(i, 1); continue; }
                g.save(); g.translate(L.x, L.y); g.rotate(L.rot);
                g.fillStyle = L.gold ? "#e8a33d" : "#8a5a28";
                g.beginPath(); g.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2); g.fill();
                g.strokeStyle = L.gold ? "#b87a1e" : "#5e3a12"; g.lineWidth = 1.6;
                g.beginPath(); g.moveTo(-12, 0); g.lineTo(14, 0); g.stroke();
                g.restore();
              }
              // basket
              g.fillStyle = clog > 0 ? "#8a5a28" : "#b85f14";
              g.beginPath(); g.moveTo(bx - 56, 392); g.lineTo(bx + 56, 392); g.lineTo(bx + 44, 438); g.lineTo(bx - 44, 438); g.closePath(); g.fill();
              g.strokeStyle = "rgba(0,0,0,.18)"; g.lineWidth = 3;
              g.beginPath(); g.moveTo(bx - 50, 406); g.lineTo(bx + 50, 406); g.moveTo(bx - 47, 420); g.lineTo(bx + 47, 420); g.stroke();
              if (clog > 0) txt(g, "CLOGGED!", bx, 376, 16, "#d93e22");
              txt(g, started ? timeLeft.toFixed(0) + "s" : "20s", 640, 90, 28, dark ? "#f7e8d8" : "#33241a");
              txt(g, "GOLD " + gold, 80, 90, 20, "#b87a1e");
              if (!started) txt(g, "Gold good. Brown slows you down!", W / 2, 118, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
