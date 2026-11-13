/* ================================================================
   GoofGig — Gig #066 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #066 — Firefly Jar
         They blink for less than a second. Tap fast, jar 15.
         ================================================================ */
      registerGame({
        n: 66, title: "Firefly Jar",
        desc: "Nature's tiniest disco. Catch 15 before the lights go out.",
        hint: '<b>Tap a firefly</b> while it is <b>lit</b> to jar it. Catch <b>15</b> within <b>30 seconds</b> — they only glow for a blink.',
        grades: [
          ["Jar of Suns", "Fifteen fireflies. Your jar is now visible from space."],
          ["Twilight Hunter", "Fast hands, soft jar. The fireflies never stood a chance."],
          ["Evening Enthusiast", "A respectable glow collection. The night approves."],
          ["Slow Blink Fan Club", "You admired them beautifully. Caught a few, too."],
          ["Darkness Appreciator", "The jar is empty but your heart is full. Of darkness."]
        ],
        thumb: function (g) {
          g.fillStyle = "#2c3a55"; rr(g, 96, 4, 108, 84, 10); g.fill();
          g.fillStyle = "#ffe066"; g.beginPath(); g.arc(132, 34, 5, 0, Math.PI * 2); g.arc(168, 56, 5, 0, Math.PI * 2); g.arc(150, 72, 4, 0, Math.PI * 2); g.fill();
          g.fillStyle = "rgba(255,224,102,.35)"; g.beginPath(); g.arc(132, 34, 11, 0, Math.PI * 2); g.arc(168, 56, 11, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var flies = [], jarred = 0, timeLeft = 30, started = false, done = false, spawnT = 0, jarFlies = [];
          function spawn() {
            flies.push({ x: 50 + Math.random() * (W - 100), y: 60 + Math.random() * 300, t: 0, life: 0.9 + Math.random() * 0.25 });
          }
          function finishRound() {
            done = true;
            var s = jarred >= 15 ? clamp(Math.round(74 + timeLeft / 30 * 26), 74, 100) : clamp(Math.round(jarred / 15 * 73), 1, 73);
            if (jarred >= 12) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Fireflies jarred", value: clamp(jarred / 15 * 100, 0, 100), text: jarred + " / 15", good: jarred >= 15 },
              { label: "Time to spare", value: clamp(timeLeft / 30 * 100, 0, 100), text: timeLeft.toFixed(1) + "s left" }
            ] });
          }
          return {
            status: function () { return done ? "Jar sealed!" : (started ? "Jarred " + jarred + " / 15 · " + timeLeft.toFixed(0) + "s" : "Tap a glowing firefly!"); },
            down: function (p) {
              started = true; audio();
              if (done) return;
              for (var i = 0; i < flies.length; i++) {
                var f = flies[i];
                if (f.t < f.life && dist(p.x, p.y, f.x, f.y) < 36) {
                  flies.splice(i, 1); jarred++;
                  jarFlies.push({ x: 596 + Math.random() * 44, y: 356 + Math.random() * 46 });
                  blip(980 + jarred * 30, .06, "sine", .06);
                  if (jarred >= 15) finishRound();
                  return;
                }
              }
            },
            move: function () {},
            up: function () {},
            draw: function (g, dt) {
              // night sky always (this gig is nocturnal)
              g.fillStyle = "#232f47"; g.fillRect(0, 0, W, 460);
              g.fillStyle = "rgba(255,255,255,.5)";
              for (var s2 = 0; s2 < 26; s2++) { g.fillRect((s2 * 167) % W, (s2 * 89) % 240, 2.4, 2.4); }
              g.fillStyle = "#f7e8d8"; g.beginPath(); g.arc(648, 52, 20, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#232f47"; g.beginPath(); g.arc(658, 46, 17, 0, Math.PI * 2); g.fill();
              if (started && !done) {
                timeLeft -= dt;
                spawnT -= dt;
                if (spawnT <= 0 && flies.length < 3) { spawnT = 0.35; spawn(); }
                if (timeLeft <= 0) finishRound();
              }
              // grass
              g.fillStyle = "#1d2b1a"; g.fillRect(0, 420, W, 40);
              // flies
              for (var i = flies.length - 1; i >= 0; i--) {
                var f = flies[i];
                if (started && !done) f.t += dt;
                if (f.t >= f.life) { flies.splice(i, 1); continue; }
                var glow = 1 - f.t / f.life;
                g.fillStyle = "rgba(255,224,102," + (0.35 * glow) + ")"; g.beginPath(); g.arc(f.x, f.y, 20, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#ffe066"; g.beginPath(); g.arc(f.x, f.y, 6 + glow * 2, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#4a3b12"; g.beginPath(); g.arc(f.x, f.y - 7, 3.4, 0, Math.PI * 2); g.fill();
              }
              // jar
              g.fillStyle = "rgba(190,225,245,.28)"; rr(g, 580, 336, 78, 84, 10); g.fill();
              g.strokeStyle = "rgba(220,240,250,.8)"; g.lineWidth = 2.5; rr(g, 580, 336, 78, 84, 10); g.stroke();
              g.fillStyle = "#8a5a28"; rr(g, 588, 326, 62, 12, 4); g.fill();
              jarFlies.forEach(function (jf) {
                g.fillStyle = "#ffe066"; g.beginPath(); g.arc(jf.x, jf.y, 4, 0, Math.PI * 2); g.fill();
              });
              txt(g, "JARRED " + jarred + " / 15", 104, 428, 20, "#ffe066");
              txt(g, started ? timeLeft.toFixed(0) + "s" : "30s", 84, 52, 28, "#f7e8d8");
              if (!started) txt(g, "Tap them while they glow!", W / 2, 130, 22, "rgba(247,232,216,.85)");
            }
          };
        }
      });
