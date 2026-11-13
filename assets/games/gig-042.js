/* ================================================================
   GoofGig — Gig #042 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #042 — Bubble Bath
         Hold to run foam into the tub up to the rim zone.
         Over = foam volcano spilling everywhere.
         ================================================================ */
      registerGame({
        n: 42, title: "Bubble Bath",
        desc: "Hold to foam the tub. Rim-high luxury or a volcano.",
        hint: '<b>Press and hold</b> to fill the tub with foam. Let go when the foam reaches the <b>rim zone (60–85%)</b>. Hold to 100% and it <b>erupts</b>.',
        grades: [
          ["Bath Sommelier", "Rim-high foam, zero spills. A five-star soak."],
          ["Bubble Connoisseur", "Plush, mountainous foam. The duck approves."],
          ["Happy Soaker", "A decent bath. The water is in there somewhere."],
          ["Sad Puddle Host", "Six bubbles. That is a wet floor, not a bath."],
          ["Foam Volcanologist", "The bathroom is a glacier now. Rent a shovel."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdfdf8";
          g.beginPath(); g.arc(122, 40, 13, 0, Math.PI * 2); g.arc(146, 30, 16, 0, Math.PI * 2); g.arc(170, 40, 13, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#57b7dd"; rr(g, 108, 48, 92, 30, 8); g.fill();
          g.fillStyle = "#f7c948"; g.beginPath(); g.arc(196, 26, 7, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(201, 24, 2, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var foam = 0, holding = false, started = false, done = false, erupted = false, bubbles = [];
          var ZONE = { lo: 60, hi: 85 };
          function finishRound() {
            done = true;
            var s;
            if (erupted) s = clamp(Math.round(8 + foam * 0.06), 4, 18);
            else if (foam >= ZONE.lo && foam <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(foam - 72) * 1.9), 62, 100);
            else if (foam < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - foam) * 1.5), 2, 87);
            else s = clamp(Math.round(88 - (foam - ZONE.hi) * 2.4), 28, 87);
            api.finish({ score: s, rows: [
              { label: "Foam level", value: foam, text: Math.round(foam) + "%" + (erupted ? " — VOLCANO!" : "") },
              { label: "Rim zone", value: 72, text: ZONE.lo + "–" + ZONE.hi + "%", good: !erupted && foam >= ZONE.lo && foam <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return erupted ? "Foam volcano. Run." : "Bath judged!";
              return started ? "Foam " + Math.round(foam) + "% — release at the rim zone!" : "Press and HOLD to run the foam!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (foam >= ZONE.lo && foam <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (holding && !done) {
                foam = clamp(foam + dt * 32, 0, 100);
                if (Math.random() < dt * 18) bubbles.push({ x: W / 2 - 150 + Math.random() * 300, y: 300, r: 6 + Math.random() * 12, ph: Math.random() * 6 });
                if (foam >= 100) { erupted = true; holding = false; sndBad(); finishRound(); }
              }
              var CX = W / 2;
              // floor + spill when erupted
              g.fillStyle = dark ? "#3a3f4a" : "#dcebf5"; g.fillRect(0, 384, W, 76);
              if (erupted) {
                g.fillStyle = "rgba(253,253,248,.9)";
                g.beginPath(); g.ellipse(CX, 398, 300, 26, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX - 230, 420, 110, 16, 0, 0, Math.PI * 2); g.fill();
              }
              // faucet
              g.fillStyle = "#aeb9c4"; rr(g, CX - 190, 96, 16, 90, 6); g.fill();
              g.beginPath(); g.moveTo(CX - 182, 96); g.lineTo(CX - 110, 96); g.lineTo(CX - 110, 116); g.lineTo(CX - 168, 116); g.lineTo(CX - 168, 140); g.lineTo(CX - 182, 140); g.closePath(); g.fill();
              if (holding) {
                g.fillStyle = "rgba(87,183,221,.5)"; g.fillRect(CX - 122, 116, 9, 150);
                g.fillStyle = "rgba(253,253,248,.8)";
                for (var sp = 0; sp < 3; sp++) { g.beginPath(); g.arc(CX - 132 + Math.random() * 26, 150 + Math.random() * 100, 4, 0, Math.PI * 2); g.fill(); }
              }
              // tub body
              g.fillStyle = dark ? "#596273" : "#fdfdf8";
              g.beginPath(); g.moveTo(CX - 190, 268); g.lineTo(CX + 190, 268); g.lineTo(CX + 168, 366); g.quadraticCurveTo(CX, 388, CX - 168, 366); g.closePath(); g.fill();
              g.strokeStyle = dark ? "#7b8698" : "#c9ced4"; g.lineWidth = 4; g.stroke();
              g.fillStyle = dark ? "#596273" : "#fdfdf8"; rr(g, CX - 200, 254, 400, 20, 10); g.fill();
              g.fillStyle = "#aeb9c4"; rr(g, CX - 150, 380, 18, 16, 5); g.fill(); rr(g, CX + 132, 380, 18, 16, 5); g.fill();
              // water + foam mound height by foam level
              var topY = 268 - foam * 0.85 - (erupted ? 26 : 0);
              g.fillStyle = "rgba(87,183,221,.5)";
              g.beginPath(); g.ellipse(CX, 300, 172, 17, 0, 0, Math.PI * 2); g.fill();
              bubbles.forEach(function (b) {
                g.fillStyle = "rgba(253,253,248,.95)";
                g.beginPath(); g.arc(b.x, Math.min(b.y, topY + 16) + Math.sin(now / 480 + b.ph) * 2.5, b.r, 0, Math.PI * 2); g.fill();
              });
              if (foam > 8) {
                g.fillStyle = "rgba(253,253,248,.95)";
                g.beginPath(); g.ellipse(CX, topY + 14, 178, 20, 0, 0, Math.PI * 2); g.fill();
              }
              if (erupted) {
                g.beginPath(); g.ellipse(CX, topY - 8, 90, 44, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX - 60, topY + 6, 60, 34, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX + 70, topY + 2, 66, 38, 0, 0, Math.PI * 2); g.fill();
              }
              // rubber duck rides the foam
              var duckY = topY + 2;
              g.fillStyle = "#f7c948";
              g.beginPath(); g.ellipse(CX + 96, duckY, 21, 14, 0, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(CX + 110, duckY - 13, 10, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#e8862b"; g.beginPath(); g.moveTo(CX + 118, duckY - 13); g.lineTo(CX + 130, duckY - 10); g.lineTo(CX + 118, duckY - 7); g.closePath(); g.fill();
              g.fillStyle = "#33241a"; g.beginPath(); g.arc(CX + 112, duckY - 15, 2, 0, Math.PI * 2); g.fill();
              // rim zone marker on the right of the tub
              var RZX = CX + 226;
              g.strokeStyle = "rgba(53,196,160,.85)"; g.lineWidth = 5;
              g.beginPath(); g.moveTo(RZX, 268 - ZONE.hi * 0.85); g.lineTo(RZX + 22, 268 - ZONE.hi * 0.85); g.stroke();
              g.beginPath(); g.moveTo(RZX, 268 - ZONE.lo * 0.85); g.lineTo(RZX + 22, 268 - ZONE.lo * 0.85); g.stroke();
              txt(g, "RIM ZONE", RZX + 10, 268 - ZONE.hi * 0.85 - 12, 12, "#0e9594");
              // foam meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "FOAM", 96, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = foam > ZONE.hi ? "#d93e22" : "#57b7dd"; rr(g, MX, MY - 9, MW * foam / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — stop at the rim zone!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
