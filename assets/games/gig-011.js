/* ================================================================
   GoofGig — Gig #011 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #011 — Spin the Dough
         Circle-drags spin the dough bigger. Overshoot and it tears.
         ================================================================ */
      registerGame({
        n: 11, title: "Spin the Dough",
        desc: "Twirl it wide, stop at the ring, whatever you do don't tear it.",
        hint: '<b>Drag in circles</b> around the dough to spin it bigger. Stop on the <b>target ring</b> and lift off — overshoot and it <b>tears</b>.',
        grades: [
          ["Dough Acrobat", "Perfect diameter, zero drama. Dinner is saved."],
          ["Pizza Virtuoso", "Round, even, and ready for toppings."],
          ["Home Spinner", "Slightly oval. Call it rustic, nobody will know."],
          ["Flour Wrestler", "The dough fought back and mostly won."],
          ["Tear Collector", "That is now two doughs. Neither is round."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#0e9594"; g.lineWidth = 3; g.setLineDash([6, 5]);
          g.beginPath(); g.arc(150, 46, 38, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
          g.fillStyle = "#f3ddba"; g.beginPath(); g.arc(150, 46, 27, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var CX = W / 2, CY = 218, TARGET = 128 + Math.random() * 30;
          var r = 42, lastAng = null, drawing = false, done = false, torn = false, spin = 0;
          function scoreNow() {
            var diff = Math.abs(r - TARGET);
            var s = clamp(Math.round(100 - diff * 1.7), 2, 100);
            if (torn) s = Math.min(s, 38);
            return s;
          }
          function finishRound() {
            done = true;
            api.finish({ score: scoreNow(), rows: [
              { label: "Your dough", value: clamp(r / (TARGET * 1.25) * 100, 0, 100), text: Math.round(r) + " px" },
              { label: "Target ring", value: clamp(TARGET / (TARGET * 1.25) * 100, 0, 100), text: Math.round(TARGET) + " px", good: true }
            ] });
          }
          return {
            status: function () { return done ? (torn ? "TORN!" : "Dough done!") : "Dough " + Math.round(r) + " · ring " + Math.round(TARGET); },
            down: function (p) { if (!done) { drawing = true; lastAng = Math.atan2(p.y - CY, p.x - CX); audio(); } },
            move: function (p) {
              if (!drawing || done) return;
              var a = Math.atan2(p.y - CY, p.x - CX);
              var da = a - lastAng;
              while (da > Math.PI) da -= Math.PI * 2;
              while (da < -Math.PI) da += Math.PI * 2;
              lastAng = a;
              spin += Math.abs(da);
              r += Math.abs(da) * 5.4;
              if (r > TARGET + 30) { torn = true; sndBad(); finishRound(); }
            },
            up: function () {
              if (done) return;
              drawing = false;
              if (r > 62) finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              // board
              g.fillStyle = "#d9b98a"; rr(g, 56, 60, 608, 330, 18); g.fill();
              g.fillStyle = "rgba(255,255,255,.35)";
              for (var i = 0; i < 26; i++) { g.beginPath(); g.arc(90 + (i * 67) % 540, 90 + (i * 113) % 280, 3, 0, Math.PI * 2); g.fill(); }
              // target ring
              g.strokeStyle = "#0e9594"; g.lineWidth = 4; g.setLineDash([12, 9]);
              g.beginPath(); g.arc(CX, CY, TARGET, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
              txt(g, "TARGET", CX, CY - TARGET - 16, 15, dark ? "#35c4c3" : "#0e9594");
              // dough
              var wob = drawing ? Math.sin(now * 9) * 3 : 0;
              var grad = g.createRadialGradient(CX - r * 0.3, CY - r * 0.3, r * 0.2, CX, CY, r);
              grad.addColorStop(0, "#f8ead0"); grad.addColorStop(1, "#eed3a5");
              g.fillStyle = grad;
              g.beginPath(); g.ellipse(CX, CY, r + wob, r - wob, spin * 0.3, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#dcbd8a"; g.lineWidth = 5; g.stroke();
              if (torn) {
                g.strokeStyle = "#b9905f"; g.lineWidth = 4;
                g.beginPath(); g.moveTo(CX - r * 0.5, CY - r * 0.4); g.lineTo(CX - r * 0.1, CY); g.lineTo(CX - r * 0.4, CY + r * 0.5); g.stroke();
                txt(g, "IT TORE!", CX, CY, 30, "#d93e22");
              }
              txt(g, drawing ? "Spinning…" : "Drag in circles on the dough", W / 2, 424, 19, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
