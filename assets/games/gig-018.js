/* ================================================================
   GoofGig — Gig #018 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #018 — Coin Count
         Tap each of the 12 coins exactly once before time runs out.
         ================================================================ */
      registerGame({
        n: 18, title: "Coin Count",
        desc: "Twelve coins, one tap each. Double-taps cost you.",
        hint: '<b>Tap every coin exactly once</b> — all <b>12</b> before the clock runs out. Tapping a counted coin again <b>costs points</b>.',
        grades: [
          ["Eagle-Eye Accountant", "Twelve coins, twelve taps, zero funny business."],
          ["Counter Clerk Pro", "Fast, accurate, and the till agrees with you."],
          ["Careful Counter", "A small wobble, but the count stands."],
          ["Double-Tap Dan", "Some coins were counted with great enthusiasm. Twice."],
          ["Coin Chaos Agent", "The coins have unionised against recounts."]
        ],
        thumb: function (g) {
          [[122, 36], [158, 56], [140, 24]].forEach(function (c) {
            g.fillStyle = "#ffb627"; g.beginPath(); g.arc(c[0], c[1], 14, 0, Math.PI * 2); g.fill();
            g.strokeStyle = "#d9930d"; g.lineWidth = 3; g.stroke();
          });
        },
        create: function (api) {
          var coins = [], counted = 0, penalties = 0, timeLeft = 20, started = false, done = false, shakeT = 0;
          var tries = 0;
          while (coins.length < 12 && tries < 500) {
            tries++;
            var x = 70 + Math.random() * 580, y = 84 + Math.random() * 280;
            if (coins.every(function (c) { return dist(x, y, c.x, c.y) > 66; })) coins.push({ x: x, y: y, hit: false });
          }
          function finishRound() {
            done = true;
            var score = clamp(Math.round(counted / 12 * 100 - penalties * 8), 1, 100);
            api.finish({ score: score, rows: [
              { label: "Coins counted", value: counted / 12 * 100, text: counted + " / 12", good: counted >= 10 },
              { label: "Double-taps", value: clamp(100 - penalties * 25, 0, 100), text: penalties + "" }
            ] });
          }
          return {
            status: function () { return done ? "Count closed!" : "Counted " + counted + " / 12 · " + Math.ceil(timeLeft) + "s"; },
            down: function (p) {
              if (done) return;
              started = true; audio();
              for (var i = 0; i < coins.length; i++) {
                var c = coins[i];
                if (dist(p.x, p.y, c.x, c.y) < 32) {
                  if (c.hit) { penalties++; shakeT = 0.35; sndBad(); }
                  else { c.hit = true; counted++; blip(880 + counted * 40, .08, "triangle", .1); if (counted === 12) finishRound(); }
                  return;
                }
              }
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) { timeLeft -= dt; if (timeLeft <= 0) { timeLeft = 0; finishRound(); } }
              if (shakeT > 0) shakeT -= dt;
              // table
              g.fillStyle = dark ? "#4a3520" : "#c99a5e"; rr(g, 24, 52, W - 48, 336, 16); g.fill();
              g.strokeStyle = "rgba(90,55,15,.3)"; g.lineWidth = 2;
              [150, 250].forEach(function (y) { g.beginPath(); g.moveTo(44, y); g.lineTo(W - 44, y); g.stroke(); });
              coins.forEach(function (c, i) {
                var sx = shakeT > 0 && c.hit && i === coins.length - 1 ? (Math.random() * 5 - 2.5) : 0;
                var grad = g.createRadialGradient(c.x - 8, c.y - 8, 3, c.x, c.y, 27);
                grad.addColorStop(0, c.hit ? "#ffe9a8" : "#ffd257"); grad.addColorStop(1, c.hit ? "#e0aa2e" : "#e8a812");
                g.fillStyle = grad; g.beginPath(); g.arc(c.x + sx, c.y, 26, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "#c07f0a"; g.lineWidth = 3.5; g.stroke();
                g.strokeStyle = "rgba(160,105,10,.6)"; g.lineWidth = 2;
                g.beginPath(); g.arc(c.x + sx, c.y, 18, 0, Math.PI * 2); g.stroke();
                if (c.hit) txt(g, "✓", c.x + sx, c.y + 1, 24, "#7a4d00");
                else txt(g, "1", c.x + sx, c.y + 1, 20, "#a8740a");
              });
              txt(g, Math.ceil(timeLeft) + "s", W / 2, 30, 26, timeLeft < 6 ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
              if (!started) txt(g, "Tap a coin to start the clock", W / 2, 420, 19, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
