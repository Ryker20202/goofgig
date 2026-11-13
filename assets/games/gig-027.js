/* ================================================================
   GoofGig — Gig #027 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #027 — Light Bulbs
         Bulbs keep switching themselves on and heating up.
         Tap each one off before it pops. Thirty seconds.
         ================================================================ */
      registerGame({
        n: 27, title: "Light Bulbs",
        desc: "Bulbs keep flaring up. Tap them off before they pop. Thirty seconds.",
        hint: '<b>Bulbs appear</b> and heat up fast. <b>Tap</b> each one off before it <b>pops</b> — you have <b>30 seconds</b>. Red means about one second from boom.',
        grades: [
          ["Guardian of Lumens", "Every bulb lived. The power company is furious."],
          ["Chief Switch Operator", "Fast fingers. Calm glass. Minimal shrapnel."],
          ["Mostly Illuminated", "A few pops, but the room still has vibes."],
          ["Pop Enthusiast", "At some point you started enjoying the explosions."],
          ["Walking Blackout", "The darkness thanks you for your service."]
        ],
        thumb: function (g) {
          g.fillStyle = "#ffd93e"; g.beginPath(); g.arc(150, 46, 22, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#fdf6ec"; g.beginPath(); g.arc(143, 39, 6, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#8d99ae"; rr(g, 141, 66, 18, 12, 3); g.fill();
        },
        create: function (api) {
          var bulbs = [], saved = 0, popped = 0, timeLeft = 30, spawnT = 0, started = false, done = false, puffs = [];
          function spawn() {
            for (var tries = 0; tries < 8; tries++) {
              var x = 70 + Math.random() * 580, y = 80 + Math.random() * 290, ok = true;
              for (var i = 0; i < bulbs.length; i++) if (dist(x, y, bulbs[i].x, bulbs[i].y) < 92) { ok = false; break; }
              if (ok) { bulbs.push({ x: x, y: y, heat: 0 }); return; }
            }
          }
          function finishRound() {
            done = true;
            var total = saved + popped;
            var ratio = total ? saved / total : 0;
            var s = clamp(Math.round(ratio * 75 + saved * 1.8), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Bulbs saved", value: ratio * 100, text: saved + " switched off", good: saved >= 12 },
              { label: "Bulbs popped", value: clamp(popped * 9, 0, 100), text: popped + " explosions" }
            ] });
          }
          return {
            status: function () {
              if (done) return "The electrician has left the building.";
              return started ? "Time " + Math.ceil(timeLeft) + "s · saved " + saved + " · popped " + popped : "Tap a bulb to start your shift!";
            },
            down: function (p) {
              if (done) return;
              started = true; audio();
              for (var i = 0; i < bulbs.length; i++) {
                if (dist(p.x, p.y, bulbs[i].x, bulbs[i].y) < 38) {
                  puffs.push({ x: bulbs[i].x, y: bulbs[i].y, t: 0.35, good: true });
                  bulbs.splice(i, 1); saved++; blip(340, .06, "sine", .06);
                  return;
                }
              }
              blip(120, .04, "sine", .03);
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt; spawnT -= dt;
                if (spawnT <= 0 && bulbs.length < 5) { spawn(); spawnT = 1.05; }
                for (var i = bulbs.length - 1; i >= 0; i--) {
                  bulbs[i].heat += dt / 1.4;
                  if (bulbs[i].heat >= 1) {
                    puffs.push({ x: bulbs[i].x, y: bulbs[i].y, t: 0.45, good: false });
                    bulbs.splice(i, 1); popped++; blip(190, .1, "sawtooth", .07);
                  }
                }
                if (timeLeft <= 0) { if (saved >= popped) sndGood(); else sndBad(); finishRound(); }
              }
              for (var j = puffs.length - 1; j >= 0; j--) { puffs[j].t -= dt; if (puffs[j].t <= 0) puffs.splice(j, 1); }
              g.fillStyle = dark ? "#2e2a33" : "#efe9f5"; g.fillRect(0, 0, W, 460);
              // puffs
              puffs.forEach(function (pf) {
                g.fillStyle = pf.good ? "rgba(53,196,160,.6)" : "rgba(120,120,130,.55)";
                g.beginPath(); g.arc(pf.x, pf.y, (pf.good ? 0.35 : 0.45) - pf.t > 0 ? 16 : 22, 0, Math.PI * 2); g.fill();
                if (!pf.good) txt(g, "POP!", pf.x, pf.y - 26, 15, "#d93e22");
              });
              // bulbs
              bulbs.forEach(function (b) {
                var h = b.heat;
                var cr = 255, cg = Math.round(217 - h * 130), cb = Math.round(62 - h * 40);
                var glow = 30 + h * 26;
                var grad = g.createRadialGradient(b.x, b.y, 4, b.x, b.y, glow);
                grad.addColorStop(0, "rgba(255," + cg + ",60,.55)"); grad.addColorStop(1, "rgba(255,200,60,0)");
                g.fillStyle = grad; g.beginPath(); g.arc(b.x, b.y, glow, 0, Math.PI * 2); g.fill();
                g.fillStyle = "rgb(" + cr + "," + cg + "," + cb + ")";
                g.beginPath(); g.arc(b.x, b.y, 24, 0, Math.PI * 2); g.fill();
                g.fillStyle = "rgba(255,255,255,.75)"; g.beginPath(); g.arc(b.x - 8, b.y - 8, 6, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#8d99ae"; rr(g, b.x - 8, b.y + 22, 16, 11, 3); g.fill();
                if (h > 0.62) { g.strokeStyle = "rgba(217,62,34,.85)"; g.lineWidth = 2.5; g.beginPath(); g.arc(b.x, b.y, 33 + Math.sin(h * 40) * 2, 0, Math.PI * 2); g.stroke(); }
              });
              if (!started) txt(g, "Tap a bulb to start!", W / 2, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
              if (started && !done) txt(g, Math.ceil(timeLeft) + "s", 640, 44, 24, timeLeft < 6 ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
              txt(g, "SAVED " + saved + " · POPPED " + popped, W / 2, 446, 16, dark ? "#c4a68d" : "#7a5f4d");
            }
          };
        }
      });
