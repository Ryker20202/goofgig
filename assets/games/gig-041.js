/* ================================================================
   GoofGig — Gig #041 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #041 — Shaving Foam
         Hold to spray foam across the chin.
         Target coverage 70–90%. Over = foam monster.
         ================================================================ */
      registerGame({
        n: 41, title: "Shaving Foam",
        desc: "Hold to spray. A clean chin or a foam monster.",
        hint: '<b>Press and hold</b> to spray shaving foam across the chin. Let go at <b>70–90% coverage</b>. Spray to 100% and the whole face <b>vanishes into foam</b>.',
        grades: [
          ["Barber Virtuoso", "Textbook foam. The razor is already jealous."],
          ["Lather Captain", "Even, plush coverage. A very pampered chin."],
          ["Foam Apprentice", "Decent lather. A few bald patches of chin."],
          ["Foam Miser", "Three puffs. The chin can see its own reflection."],
          ["Foam Monster", "There was a person under there. Was."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f2c79b"; g.beginPath(); g.arc(150, 50, 30, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#fdfdf8";
          g.beginPath(); g.arc(132, 66, 13, 0, Math.PI * 2); g.arc(150, 72, 15, 0, Math.PI * 2); g.arc(168, 66, 13, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#aeb9c4"; rr(g, 236, 22, 18, 42, 6); g.fill();
          g.fillStyle = "#57b7dd"; rr(g, 240, 14, 10, 10, 3); g.fill();
        },
        create: function (api) {
          var cov = 0, holding = false, started = false, done = false, monster = false, puffs = [];
          var ZONE = { lo: 70, hi: 90 };
          function finishRound() {
            done = true;
            var s;
            if (monster) s = clamp(Math.round(10 + cov * 0.05), 5, 20);
            else if (cov >= ZONE.lo && cov <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(cov - 80) * 1.9), 62, 100);
            else if (cov < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - cov) * 1.4), 2, 87);
            else s = clamp(Math.round(88 - (cov - ZONE.hi) * 3), 26, 87);
            api.finish({ score: s, rows: [
              { label: "Foam coverage", value: cov, text: Math.round(cov) + "%" + (monster ? " — foam monster!" : "") },
              { label: "Target zone", value: 80, text: ZONE.lo + "–" + ZONE.hi + "%", good: !monster && cov >= ZONE.lo && cov <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return monster ? "The face is gone." : "Lather judged!";
              return started ? "Coverage " + Math.round(cov) + "% — release at 70–90%!" : "Press and HOLD to spray!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (cov >= ZONE.lo && cov <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (holding && !done) {
                cov = clamp(cov + dt * 40, 0, 100);
                if (Math.random() < dt * 20) puffs.push({ a: Math.random() * Math.PI * 2, r: 12 + Math.random() * 44, s: 8 + Math.random() * 13, ph: Math.random() * 6 });
                if (cov >= 100) { monster = true; holding = false; sndBad(); finishRound(); }
              }
              var CX = W / 2 - 60, FY = 232;
              // face
              g.fillStyle = "#f2c79b"; g.beginPath(); g.ellipse(CX, FY, 96, 112, 0, 0, Math.PI * 2); g.fill();
              // ears
              g.beginPath(); g.ellipse(CX - 98, FY, 13, 22, 0, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.ellipse(CX + 98, FY, 13, 22, 0, 0, Math.PI * 2); g.fill();
              // eyes + brows
              g.fillStyle = "#33241a";
              g.beginPath(); g.arc(CX - 34, FY - 30, 6, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(CX + 34, FY - 30, 6, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#33241a"; g.lineWidth = 4;
              g.beginPath(); g.moveTo(CX - 46, FY - 48); g.lineTo(CX - 22, FY - 48); g.stroke();
              g.beginPath(); g.moveTo(CX + 22, FY - 48); g.lineTo(CX + 46, FY - 48); g.stroke();
              // nose
              g.strokeStyle = "rgba(146,96,48,.7)"; g.lineWidth = 4;
              g.beginPath(); g.moveTo(CX, FY - 14); g.quadraticCurveTo(CX + 8, FY + 8, CX - 2, FY + 14); g.stroke();
              // mouth (hidden as foam reaches it)
              if (cov < 45) {
                g.strokeStyle = "#b25a2a"; g.lineWidth = 4;
                g.beginPath(); g.arc(CX, FY + 42, 18, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
              }
              // foam puffs live on the chin/jaw area; monster covers the whole face
              puffs.forEach(function (p, i) {
                var spread = monster ? 100 : 62;
                var fx = CX + Math.cos(p.a) * p.r * 1.25 * (monster ? 1.1 : 1), fy = (monster ? FY : FY + 62) + Math.sin(p.a) * p.r * 0.62;
                if (!monster && i > puffs.length * (0.35 + cov / 160)) return;
                g.fillStyle = "rgba(253,253,248,.95)";
                g.beginPath(); g.arc(fx, fy + Math.sin(now / 500 + p.ph) * 1.2, p.s, 0, Math.PI * 2); g.fill();
              });
              if (monster) {
                g.fillStyle = "rgba(253,253,248,.92)";
                g.beginPath(); g.ellipse(CX, FY + 6, 104, 116, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.arc(CX - 40, FY - 60, 26, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.arc(CX + 46, FY - 78, 20, 0, Math.PI * 2); g.fill();
              }
              // spray can at right, puffs jet out while holding
              var SX = W / 2 + 216;
              g.save(); g.translate(SX, 196); g.rotate(-0.28);
              g.fillStyle = "#aeb9c4"; rr(g, -19, -58, 38, 116, 9); g.fill();
              g.fillStyle = "#57b7dd"; rr(g, -19, -58, 38, 30, 9); g.fill();
              g.fillStyle = "#7d8894"; rr(g, -8, -72, 16, 15, 4); g.fill();
              g.restore();
              if (holding) {
                g.fillStyle = "rgba(253,253,248,.85)";
                for (var j = 0; j < 4; j++) {
                  var jx = SX - 40 - Math.random() * 60, jy = 158 + Math.random() * 30;
                  g.beginPath(); g.arc(jx, jy, 4 + Math.random() * 5, 0, Math.PI * 2); g.fill();
                }
              }
              // coverage meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "FOAM", 96, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = cov > ZONE.hi ? "#d93e22" : "#57b7dd"; rr(g, MX, MY - 9, MW * cov / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — stop at 70–90%!", W / 2, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
