/* ================================================================
   GoofGig — Gig #035 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #035 — Toothpaste Squeeze
         Hold to squeeze a line of paste onto the brush.
         Release inside the length zone; over = gloopy mess.
         ================================================================ */
      registerGame({
        n: 35, title: "Toothpaste Squeeze",
        desc: "Hold to squeeze. A perfect stripe, or a gloopy swamp.",
        hint: '<b>Press and hold</b> to squeeze toothpaste onto the brush. Let go when the stripe is inside the <b>zone (55–85%)</b>. Squeeze to 100% and it <b>gloops everywhere</b>.',
        grades: [
          ["Stripe Surgeon", "A runway-perfect stripe. The dentist framed it."],
          ["Mint Professional", "Clean, even, minty. The brush is thrilled."],
          ["Decent Squeezer", "It covers the bristles. Mostly. Good enough."],
          ["Timid Tube Tapper", "That is a rumor of toothpaste. Barely a stripe."],
          ["Gloop Goblin", "The sink is wearing more paste than the brush."]
        ],
        thumb: function (g) {
          g.fillStyle = "#57b7dd"; rr(g, 96, 56, 150, 14, 7); g.fill();
          g.fillStyle = "#fff"; rr(g, 120, 44, 96, 12, 6); g.fill();
          g.fillStyle = "#e3352b"; rr(g, 226, 30, 30, 44, 6); g.fill();
          g.fillStyle = "#fdfdf8"; rr(g, 231, 24, 20, 10, 4); g.fill();
        },
        create: function (api) {
          var len = 0, holding = false, started = false, done = false, gloopy = false;
          var ZONE = { lo: 55, hi: 85 };
          function finishRound() {
            done = true;
            var s;
            if (gloopy) s = clamp(Math.round(8 + len * 0.06), 4, 18);
            else if (len >= ZONE.lo && len <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(len - 70) * 1.8), 62, 100);
            else if (len < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - len) * 1.5), 2, 87);
            else s = clamp(Math.round(88 - (len - ZONE.hi) * 2.2), 30, 87);
            api.finish({ score: s, rows: [
              { label: "Stripe length", value: len, text: Math.round(len) + "%" + (gloopy ? " — gloop explosion!" : "") },
              { label: "Perfect zone", value: 70, text: ZONE.lo + "–" + ZONE.hi + "%", good: !gloopy && len >= ZONE.lo && len <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return gloopy ? "Gloop. Everywhere." : "Stripe judged!";
              return started ? "Stripe " + Math.round(len) + "% — release in the zone!" : "Press and HOLD to squeeze!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (len >= ZONE.lo && len <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (holding && !done) {
                len = clamp(len + dt * 36, 0, 100);
                if (len >= 100) { gloopy = true; holding = false; sndBad(); finishRound(); }
              }
              var CX = W / 2;
              // counter
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; g.fillRect(0, 360, W, 100);
              // toothbrush (handle + head) horizontal
              g.fillStyle = "#57b7dd"; rr(g, CX - 250, 296, 330, 20, 10); g.fill();
              g.fillStyle = "#3f8fb5"; rr(g, CX + 66, 288, 120, 34, 10); g.fill();
              // bristles
              g.fillStyle = "#fdfdf8";
              for (var i = 0; i < 10; i++) g.fillRect(CX + 74 + i * 11, 272, 6, 18);
              // paste stripe grows along the bristles
              var pw = 112 * len / 100;
              g.fillStyle = "#eafcff";
              if (len > 0) { rr(g, CX + 70, 262, pw, 13, 6); g.fill(); }
              g.fillStyle = "rgba(87,183,221,.5)";
              if (len > 0) { rr(g, CX + 70, 270, pw, 4, 2); g.fill(); }
              // gloop blob if it burst
              if (gloopy) {
                g.fillStyle = "#eafcff";
                g.beginPath(); g.ellipse(CX + 120, 330, 90, 26, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX + 40, 344, 50, 16, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX + 210, 342, 42, 14, 0, 0, Math.PI * 2); g.fill();
              }
              // tube at top-left, squeezes thinner while holding
              var sq = holding ? 0.72 : 1;
              g.save(); g.translate(CX - 210, 150); g.rotate(-0.5);
              g.fillStyle = "#fdfdf8"; rr(g, -34 * sq, -70, 68 * sq, 130, 14); g.fill();
              g.fillStyle = "#e3352b"; rr(g, -34 * sq, -70, 68 * sq, 34, 14); g.fill();
              g.fillStyle = "#57b7dd"; rr(g, -34 * sq, -6, 68 * sq, 16, 6); g.fill();
              g.fillStyle = "#c9ced4"; rr(g, -11, 58, 22, 18, 4); g.fill();
              g.restore();
              // paste strand from tube nozzle to brush while holding
              if (holding && len < 100) {
                g.strokeStyle = "#eafcff"; g.lineWidth = 7;
                g.beginPath(); g.moveTo(CX - 176, 196); g.quadraticCurveTo(CX - 120, 240, CX + 70 + pw, 268); g.stroke();
              }
              // target zone marker above bristles
              var ZX = CX + 70, ZW = 112;
              g.fillStyle = "rgba(53,196,160,.35)"; g.fillRect(ZX + ZW * ZONE.lo / 100, 232, ZW * (ZONE.hi - ZONE.lo) / 100, 10);
              txt(g, "ZONE", ZX + ZW * 0.7, 226, 12, "#0e9594");
              // length meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "PASTE", 92, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = len > ZONE.hi ? "#d93e22" : "#57b7dd"; rr(g, MX, MY - 9, MW * len / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — stop in the green!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
