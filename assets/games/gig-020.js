/* ================================================================
   GoofGig — Gig #020 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #020 — Onion Chop
         Chop 24 pieces before the tears meter fills.
         ================================================================ */
      registerGame({
        n: 20, title: "Onion Chop",
        desc: "Twenty-four pieces. One onion. Zero emotional control.",
        hint: '<b>Tap fast</b> to chop the onion into <b>24 pieces</b> before the <b>tears meter</b> fills up and ends the round.',
        grades: [
          ["Tearless Chef", "Twenty-four pieces and not one tear. Superhuman."],
          ["Knife Sprinter", "Chopped like the wind, cried only a little."],
          ["Brave Chopper", "The onion is done. Your eyes have notes."],
          ["Sniffly Sous-Chef", "Half an onion, a whole lot of feelings."],
          ["Emotional Support Needed", "The onion won. It wasn't even close."]
        ],
        thumb: function (g) {
          g.fillStyle = "#cdb4dd"; g.beginPath(); g.ellipse(150, 50, 32, 30, 0, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#9b7ebd"; g.lineWidth = 3;
          g.beginPath(); g.arc(150, 50, 20, 0, Math.PI * 2); g.stroke();
          g.beginPath(); g.arc(150, 50, 10, 0, Math.PI * 2); g.stroke();
        },
        create: function (api) {
          var pieces = 0, tears = 0, started = false, done = false, chopFlash = 0, NEED = 24;
          function finishRound(complete) {
            done = true;
            var score = complete ? clamp(Math.round(70 + (1 - tears) * 30), 70, 100)
              : clamp(Math.round(pieces / NEED * 88), 1, 88);
            api.finish({ score: score, rows: [
              { label: "Pieces chopped", value: pieces / NEED * 100, text: pieces + " / " + NEED, good: pieces >= 18 },
              { label: "Tears held back", value: (1 - tears) * 100, text: Math.round((1 - tears) * 100) + "%" }
            ] });
          }
          return {
            status: function () { return done ? "Chopping done!" : "Pieces " + pieces + " / " + NEED + " · tears " + Math.round(tears * 100) + "%"; },
            down: function () {
              if (done) return;
              started = true;
              pieces++; tears = clamp(tears + 0.012, 0, 1); chopFlash = 0.12;
              blip(300 + Math.random() * 120, .05, "square", .06);
              if (pieces >= NEED) { sndGood(); finishRound(true); }
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                tears = clamp(tears + dt * 0.062, 0, 1);
                if (tears >= 1) { sndBad(); finishRound(false); }
              }
              if (chopFlash > 0) chopFlash -= dt;
              // board
              g.fillStyle = "#d9b98a"; rr(g, 70, 300, 580, 78, 12); g.fill();
              // chopped pieces pile (grows with pieces)
              for (var i = 0; i < pieces; i++) {
                var px = 150 + (i * 47) % 420, py = 322 + (i * 29) % 44;
                g.fillStyle = i % 2 ? "#e6d7f2" : "#d9c6ec";
                g.beginPath(); g.ellipse(px, py, 13, 7, (i * 1.3) % 3, 0, Math.PI * 2); g.fill();
              }
              // remaining onion shrinks as pieces are chopped
              var remain = 1 - pieces / NEED, ox = W / 2, oy = 218;
              if (remain > 0.02) {
                var r = 30 + remain * 62, jig = chopFlash > 0 ? (Math.random() * 5 - 2.5) : 0;
                var grad = g.createRadialGradient(ox - r / 3, oy - r / 3, 6, ox, oy, r);
                grad.addColorStop(0, "#e9ddf5"); grad.addColorStop(1, "#b794d9");
                g.fillStyle = grad; g.beginPath(); g.ellipse(ox + jig, oy, r, r * 0.92, 0, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "rgba(155,94,229,.55)"; g.lineWidth = 3;
                [0.66, 0.4].forEach(function (f) { g.beginPath(); g.ellipse(ox + jig, oy, r * f, r * f * 0.92, 0, 0, Math.PI * 2); g.stroke(); });
                g.fillStyle = "#8a6b42"; g.beginPath(); g.ellipse(ox + jig, oy - r * 0.92, 7, 5, 0, 0, Math.PI * 2); g.fill();
              }
              // knife flashes down on chop
              if (chopFlash > 0) {
                g.save(); g.translate(ox + 120, oy - 60); g.rotate(0.5);
                g.fillStyle = "#aeb9c4"; g.beginPath(); g.moveTo(-9, -70); g.lineTo(11, -70); g.lineTo(11, 8); g.quadraticCurveTo(0, 18, -9, 8); g.closePath(); g.fill();
                g.fillStyle = "#8a4b21"; rr(g, -8, -104, 17, 36, 7); g.fill();
                g.restore();
              }
              // eyes with rising tears
              var ey = 96;
              [-52, 52].forEach(function (dx) {
                g.fillStyle = "#fff"; g.beginPath(); g.ellipse(W / 2 + dx, ey, 21, 14 + tears * 3, 0, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#33241a"; g.beginPath(); g.arc(W / 2 + dx, ey, 6, 0, Math.PI * 2); g.fill();
                if (tears > 0.45) { g.fillStyle = "#57b7dd"; g.beginPath(); g.ellipse(W / 2 + dx, ey + 20 + tears * 16, 5, 8, 0, 0, Math.PI * 2); g.fill(); }
              });
              // tears meter
              txt(g, "TEARS", 96, 404, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 140, 394, 440, 18, 9); g.fill();
              g.fillStyle = tears > 0.75 ? "#d93e22" : "#57b7dd"; rr(g, 140, 394, 440 * tears, 18, 9); g.fill();
              if (!started) txt(g, "Tap the onion — fast!", W / 2, 44, 21, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
