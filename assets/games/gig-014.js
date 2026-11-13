/* ================================================================
   GoofGig — Gig #014 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #014 — Bubble Rush
         Pop 15 soap bubbles in 10 seconds.
         ================================================================ */
      registerGame({
        n: 14, title: "Bubble Rush",
        desc: "Fifteen bubbles, ten seconds, zero mercy.",
        hint: '<b>Tap bubbles to pop them</b> — all <b>15</b> in <b>10 seconds</b>. They drift, so chase them.',
        grades: [
          ["Bubble Nemesis", "Fifteen for fifteen. The soap fears you now."],
          ["Pop Professional", "Fast fingers, empty sky, great decisions."],
          ["Bubble Chaser", "Most popped. The survivors tell stories about you."],
          ["Gentle Tapper", "You waved at more bubbles than you popped."],
          ["Bubble Appreciator", "You mostly just watched them float. Fair enough."]
        ],
        thumb: function (g) {
          [[118, 34, 15], [162, 52, 11], [140, 20, 8]].forEach(function (b) {
            g.strokeStyle = "rgba(87,183,221,.9)"; g.lineWidth = 3;
            g.beginPath(); g.arc(b[0], b[1], b[2], 0, Math.PI * 2); g.stroke();
            g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.arc(b[0] - b[2] / 3, b[1] - b[2] / 3, b[2] / 4, 0, Math.PI * 2); g.fill();
          });
        },
        create: function (api) {
          var bubbles = [], spawned = 0, popped = 0, timeLeft = 10, started = false, spawnT = 0, done = false, pops = [];
          function finishRound() {
            done = true;
            var score = clamp(Math.round(popped / 15 * 100), 1, 100);
            api.finish({ score: score, rows: [
              { label: "Bubbles popped", value: popped / 15 * 100, text: popped + " / 15", good: popped >= 11 }
            ] });
          }
          return {
            status: function () { return done ? "Time!" : "Popped " + popped + " / 15 · " + Math.ceil(timeLeft) + "s"; },
            down: function (p) {
              if (done) return;
              if (!started) { started = true; audio(); }
              for (var i = bubbles.length - 1; i >= 0; i--) {
                var b = bubbles[i];
                if (dist(p.x, p.y, b.x, b.y) < b.r + 8) {
                  bubbles.splice(i, 1); popped++;
                  pops.push({ x: b.x, y: b.y, t: 0.3 });
                  blip(700 + Math.random() * 500, .07, "sine", .1);
                  if (popped >= 15) finishRound();
                  return;
                }
              }
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                spawnT -= dt;
                if (spawnT <= 0 && spawned < 15) {
                  spawned++;
                  bubbles.push({ x: 60 + Math.random() * 600, y: 120 + Math.random() * 260, r: 20 + Math.random() * 18, vy: 12 + Math.random() * 22, ph: Math.random() * 9 });
                  spawnT = 0.42;
                }
                if (timeLeft <= 0) finishRound();
              }
              bubbles.forEach(function (b) {
                b.y -= b.vy * dt; b.x += Math.sin(performance.now() / 500 + b.ph) * 14 * dt;
                if (b.y < 46) b.y = 46;
                var grad = g.createRadialGradient(b.x - b.r / 3, b.y - b.r / 3, 2, b.x, b.y, b.r);
                grad.addColorStop(0, "rgba(255,255,255,.25)"); grad.addColorStop(0.8, "rgba(140,210,240,.16)"); grad.addColorStop(1, "rgba(140,210,240,.4)");
                g.fillStyle = grad; g.beginPath(); g.arc(b.x, b.y, b.r, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "rgba(110,190,225,.85)"; g.lineWidth = 2.5; g.stroke();
                g.fillStyle = "rgba(255,255,255,.8)"; g.beginPath(); g.arc(b.x - b.r / 3, b.y - b.r / 3, b.r / 5, 0, Math.PI * 2); g.fill();
              });
              pops = pops.filter(function (pp) { pp.t -= dt; return pp.t > 0; });
              pops.forEach(function (pp) { txt(g, "POP!", pp.x, pp.y, 17, "#ff5a3c"); });
              // wand resting at the side
              g.strokeStyle = "#e3352b"; g.lineWidth = 6; g.lineCap = "round";
              g.beginPath(); g.moveTo(52, 400); g.lineTo(84, 330); g.stroke();
              g.strokeStyle = "#57b7dd"; g.lineWidth = 4;
              g.beginPath(); g.arc(92, 316, 15, 0, Math.PI * 2); g.stroke();
              txt(g, started ? Math.ceil(timeLeft) + "s" : "Tap a bubble to start!", W / 2, 40, started ? 26 : 20, timeLeft < 3.5 && started ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
            }
          };
        }
      });
