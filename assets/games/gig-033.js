/* ================================================================
   GoofGig — Gig #033 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #033 — Fry Flip
         One pancake. One flip. The golden moment is a window,
         and the window is not wide.
         ================================================================ */
      registerGame({
        n: 33, title: "Fry Flip",
        desc: "One pancake, one flip. Too early is soup. Too late is charcoal.",
        hint: 'The pancake cooks and the <b>doneness meter</b> climbs. <b>Tap once</b> to flip it inside the <b>golden zone (55–75%)</b>. Before that it is batter soup; after, it is a hockey puck.',
        grades: [
          ["Golden Flip Master", "Breakfast restaurants are quietly bidding for you."],
          ["Brunch Royalty", "That color belongs in a magazine. A pancake magazine."],
          ["Solid Short-Order", "Edible, golden-ish, and proudly served."],
          ["Pale and Sad", "That pancake needed therapy and more heat."],
          ["Hockey Puck Chef", "It bounces now. Pancakes should never bounce."]
        ],
        thumb: function (g) {
          g.fillStyle = "#45525a"; g.beginPath(); g.arc(150, 50, 30, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e8b04b"; g.beginPath(); g.ellipse(150, 48, 21, 17, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#f7d774"; g.beginPath(); g.ellipse(143, 42, 6, 4, -0.4, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var done = 0, started = false, finished = false, burnt = false, flipAnim = 0, flippedAt = 0;
          var doneness = 0;
          var ZONE = { lo: 55, hi: 75 };
          function finishRound() {
            finished = true;
            var c = (ZONE.lo + ZONE.hi) / 2, s;
            if (burnt) s = clamp(Math.round(6 + Math.random() * 6), 3, 14);
            else if (doneness >= ZONE.lo && doneness <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(doneness - c) * 2.4), 64, 100);
            else if (doneness < ZONE.lo) s = clamp(Math.round(86 - (ZONE.lo - doneness) * 1.6), 2, 86);
            else s = clamp(Math.round(86 - (doneness - ZONE.hi) * 2.6), 22, 86);
            api.finish({ score: s, rows: [
              { label: "Flipped at", value: doneness, text: Math.round(doneness) + "% done" + (burnt ? " — charcoal" : ""), good: !burnt && doneness >= ZONE.lo && doneness <= ZONE.hi },
              { label: "Golden zone", value: c, text: ZONE.lo + "–" + ZONE.hi + "%", good: true }
            ] });
          }
          return {
            status: function () {
              if (finished) return burnt ? "It has become a discus." : "Flipped at " + Math.round(doneness) + "%!";
              return started ? "Doneness " + Math.round(doneness) + "% — flip in the gold!" : "Tap to light the stove!";
            },
            down: function () {
              if (finished) return;
              if (!started) { started = true; audio(); return; }
              flipAnim = 0.5; flippedAt = doneness;
              if (doneness >= ZONE.lo && doneness <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !finished) {
                doneness = clamp(doneness + dt * (26 + 6 * Math.sin(now / 300)), 0, 100);
                if (doneness >= 100) { burnt = true; sndBad(); finishRound(); }
              }
              if (flipAnim > 0) flipAnim -= dt;
              var CX = W / 2, CY = 236;
              // stove top
              g.fillStyle = dark ? "#37474f" : "#cfd8dc"; g.fillRect(0, 330, W, 130);
              g.fillStyle = "rgba(255,110,40,.35)"; g.beginPath(); g.ellipse(CX, 348, 150, 16, 0, 0, Math.PI * 2); g.fill();
              // pan
              g.fillStyle = "#45525a"; g.beginPath(); g.arc(CX, CY, 118, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#37474f"; g.beginPath(); g.arc(CX, CY, 102, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#263238"; rr(g, CX + 108, CY - 11, 108, 22, 10); g.fill();
              // pancake (color by doneness; flips up when tapped)
              var d = (burnt ? 100 : (finished ? flippedAt : doneness)) / 100;
              var cr = Math.round(244 - d * 150), cg = Math.round(214 - d * 140), cb = Math.round(150 - d * 108);
              var lift = flipAnim > 0 ? Math.sin((0.5 - flipAnim) / 0.5 * Math.PI) * 90 : 0;
              var squash = flipAnim > 0 ? Math.abs(Math.cos((0.5 - flipAnim) / 0.5 * Math.PI)) : 1;
              g.fillStyle = "rgb(" + cr + "," + cg + "," + cb + ")";
              g.beginPath(); g.ellipse(CX, CY - lift, 84, Math.max(10, 66 * squash), 0, 0, Math.PI * 2); g.fill();
              // bubbles + browning spots
              if (!finished || flipAnim > 0) {
                g.fillStyle = "rgba(255,255,255,.5)";
                for (var i = 0; i < 5; i++) {
                  var bx = CX - 50 + (i * 37) % 100, by = CY - lift - 24 + (i * 29) % 46;
                  g.beginPath(); g.arc(bx, by, 3 + (i % 3), 0, Math.PI * 2); g.fill();
                }
              }
              g.fillStyle = "rgba(120,64,10,.45)";
              for (var j = 0; j < 4; j++) {
                g.beginPath(); g.ellipse(CX - 44 + j * 30, CY - lift + 14 - (j % 2) * 22, 7, 4.5, j, 0, Math.PI * 2); g.fill();
              }
              if (burnt) {
                g.fillStyle = "rgba(60,60,60,.4)";
                for (var s2 = 0; s2 < 3; s2++) { g.beginPath(); g.arc(CX - 30 + s2 * 30, CY - 90 - ((now / 16 + s2 * 22) % 44), 13, 0, Math.PI * 2); g.fill(); }
              }
              // doneness meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "DONE", 92, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(232,163,61,.6)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = doneness > ZONE.hi ? "#6e451d" : "#e8a33d"; rr(g, MX, MY - 9, MW * (finished && !burnt ? flippedAt : doneness) / 100, 18, 9); g.fill();
              if (!started) txt(g, "Tap to light the stove!", CX, 56, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
