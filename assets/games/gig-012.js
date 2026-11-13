/* ================================================================
   GoofGig — Gig #012 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #012 — Shake the Soda
         Waggle fast to build fizz; be inside the zone when time ends.
         ================================================================ */
      registerGame({
        n: 12, title: "Shake the Soda",
        desc: "Eight seconds of waggling. Too little: flat. Too much: geyser.",
        hint: '<b>Waggle the pointer fast</b> (press and shake!) to build fizz. When the <b>8-second</b> timer ends, be inside the <b>green zone</b>.',
        grades: [
          ["Fizz Wizard", "Perfectly fizzy. Not a single drop rebelled."],
          ["Bubble Balancer", "That soda is alive in exactly the right way."],
          ["Cautious Shaker", "Drinkable, with a hint of nervous energy."],
          ["Flat Soda Fan", "That is just sweet water with dreams."],
          ["Geyser Manager", "The ceiling is drinking most of that soda now."]
        ],
        thumb: function (g) {
          g.fillStyle = "#e3352b"; rr(g, 128, 22, 44, 62, 10); g.fill();
          g.fillStyle = "#fff"; g.beginPath(); g.arc(142, 44, 5, 0, Math.PI * 2); g.arc(156, 58, 4, 0, Math.PI * 2); g.arc(148, 68, 3, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var fizz = 0, timeLeft = 8, started = false, done = false, px = 0, py = 0, hasP = false, shaking = 0;
          var ZONE = { lo: 60, hi: 78 };
          function finishRound() {
            done = true;
            var c = (ZONE.lo + ZONE.hi) / 2, s;
            if (fizz >= ZONE.lo && fizz <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(fizz - c) * 1.6), 60, 100);
            else {
              var d = fizz < ZONE.lo ? ZONE.lo - fizz : fizz - ZONE.hi;
              s = clamp(Math.round(88 - d * 2.6), 2, 87);
            }
            api.finish({ score: s, rows: [
              { label: "Your fizz", value: fizz, text: Math.round(fizz) + "%" },
              { label: "Fizz zone", value: (ZONE.lo + ZONE.hi) / 2, text: ZONE.lo + "–" + ZONE.hi + "%", good: true }
            ] });
          }
          return {
            status: function () { return done ? "Timer up!" : (started ? "Time " + timeLeft.toFixed(1) + "s · fizz " + Math.round(fizz) + "%" : "Waggle to start the timer!"); },
            down: function (p) { started = true; px = p.x; py = p.y; hasP = true; audio(); },
            move: function (p) {
              if (done || !started) return;
              if (hasP) {
                var d = dist(p.x, p.y, px, py);
                fizz = clamp(fizz + d * 0.055, 0, 100);
                shaking = Math.min(1, shaking + d * 0.01);
              }
              px = p.x; py = p.y; hasP = true;
            },
            up: function () { hasP = false; },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                fizz = clamp(fizz - dt * 1.1, 0, 100);
                shaking = Math.max(0, shaking - dt * 3);
                if (timeLeft <= 0) { if (fizz >= 60 && fizz <= 78) sndGood(); else sndBad(); finishRound(); }
              }
              var BX = W / 2, jig = shaking * (Math.random() * 7 - 3.5);
              // bottle
              g.save(); g.translate(BX + jig, 0);
              g.fillStyle = "#c22f24"; rr(g, -52, 150, 104, 218, 20); g.fill();
              g.fillStyle = "#e3352b"; rr(g, -52, 150, 104, 90, 20); g.fill();
              g.fillStyle = "#8f1f16"; rr(g, -17, 108, 34, 46, 8); g.fill();
              g.fillStyle = "#ffb627"; rr(g, -19, 94, 38, 18, 5); g.fill();
              // liquid + bubbles
              var lh = 200 * (0.35 + fizz / 160);
              g.fillStyle = "#7a2d12"; rr(g, -44, 368 - lh, 88, lh, 14); g.fill();
              g.fillStyle = "rgba(255,255,255,.75)";
              var nb = Math.floor(fizz / 6);
              for (var i = 0; i < nb; i++) {
                var bx = -36 + (i * 41) % 72, by = 350 - (i * 53 + performance.now() / (6 + i % 4)) % Math.max(20, lh);
                g.beginPath(); g.arc(bx, by, 3 + (i % 3), 0, Math.PI * 2); g.fill();
              }
              g.fillStyle = "#fdf6ec"; rr(g, -40, 236, 80, 62, 8); g.fill();
              txt(g, "FIZZ!", 0, 268, 21, "#c22f24");
              g.restore();
              // meter
              var MX = 592, MY = 110, MH = 258;
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY, 30, MH, 10); g.fill();
              g.fillStyle = "rgba(53,196,160,.5)"; g.fillRect(MX, MY + MH * (1 - ZONE.hi / 100), 30, MH * (ZONE.hi - ZONE.lo) / 100);
              g.fillStyle = "#ff5a3c"; rr(g, MX, MY + MH * (1 - fizz / 100), 30, MH * fizz / 100, 10); g.fill();
              txt(g, "FIZZ", MX + 15, MY - 18, 15, dark ? "#c4a68d" : "#7a5f4d");
              txt(g, "zone", MX + 52, MY + MH * (1 - (ZONE.lo + ZONE.hi) / 200), 13, "#0e9594");
              // timer
              txt(g, started ? timeLeft.toFixed(1) + "s" : "8.0s", 92, 128, 30, timeLeft < 2.5 && started ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
              if (!started) txt(g, "Press and waggle like you mean it", W / 2, 424, 19, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
