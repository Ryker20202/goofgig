/* ================================================================
   GoofGig — Gig #039 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #039 — Inflate the Tire
         Hold to pump. The needle wobbles; release in the green
         pressure zone. Push to 100% and it goes bang.
         ================================================================ */
      registerGame({
        n: 39, title: "Inflate the Tire",
        desc: "Hold to pump. Green zone good. Red zone bang.",
        hint: '<b>Press and hold</b> to pump the bike tire. The needle <b>wobbles</b> as pressure climbs — let go inside the <b>green zone (60–82%)</b>. Hit 100% and it <b>pops</b>.',
        grades: [
          ["Pressure Whisperer", "Dead-center pressure. That tire purrs."],
          ["Pump Professional", "Firm, fast, fearless. Tour de Your Street."],
          ["Roadworthy", "It rolls. It holds air. Good enough to ride."],
          ["Soft Tire Sadness", "That is a pillow pretending to be a tire."],
          ["Bang Manager", "The whole street heard that. The tire is confetti."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#33241a"; g.lineWidth = 11;
          g.beginPath(); g.arc(150, 48, 30, 0, Math.PI * 2); g.stroke();
          g.strokeStyle = "#aeb9c4"; g.lineWidth = 4;
          g.beginPath(); g.arc(150, 48, 17, 0, Math.PI * 2); g.stroke();
          g.strokeStyle = "#d93e22"; g.lineWidth = 4;
          g.beginPath(); g.moveTo(150, 48); g.lineTo(168, 32); g.stroke();
        },
        create: function (api) {
          var psi = 0, holding = false, started = false, done = false, popped = false, wob = 0;
          var ZONE = { lo: 60, hi: 82 };
          function needle() { return clamp(psi + Math.sin(wob * 9) * 3.2 + Math.sin(wob * 23) * 1.4, 0, 104); }
          function finishRound() {
            done = true;
            var n = needle(), s;
            if (popped) s = clamp(Math.round(6 + psi * 0.05), 3, 15);
            else if (n >= ZONE.lo && n <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(n - 71) * 2), 62, 100);
            else if (n < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - n) * 1.6), 2, 87);
            else s = clamp(Math.round(88 - (n - ZONE.hi) * 2.4), 28, 87);
            api.finish({ score: s, rows: [
              { label: "Final pressure", value: clamp(n, 0, 100), text: Math.round(n) + "%" + (popped ? " — BANG!" : "") },
              { label: "Green zone", value: 71, text: ZONE.lo + "–" + ZONE.hi + "%", good: !popped && n >= ZONE.lo && n <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return popped ? "BANG. Tire's gone." : "Pressure judged!";
              return started ? "Pressure " + Math.round(needle()) + "% — mind the wobble!" : "Press and HOLD to pump!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              var n = needle();
              if (n >= ZONE.lo && n <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (holding && !done) {
                psi = clamp(psi + dt * 30, 0, 100);
                wob += dt;
                if (psi >= 100) { popped = true; holding = false; sndBad(); finishRound(); }
              }
              var CX = W / 2;
              // ground
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; g.fillRect(0, 356, W, 104);
              // tire grows slightly with pressure
              var R = 74 + psi * 0.16, cy = 262;
              if (!popped) {
                g.strokeStyle = dark ? "#14100c" : "#33241a"; g.lineWidth = 26;
                g.beginPath(); g.arc(CX - 70, cy, R, 0, Math.PI * 2); g.stroke();
                g.strokeStyle = "#aeb9c4"; g.lineWidth = 5;
                g.beginPath(); g.arc(CX - 70, cy, R - 20, 0, Math.PI * 2); g.stroke();
                g.fillStyle = "#7d8894"; g.beginPath(); g.arc(CX - 70, cy, 12, 0, Math.PI * 2); g.fill();
                // pump hose + pump body, handle bobs while holding
                var bob = holding ? Math.abs(Math.sin(wob * 10)) * 16 : 0;
                g.strokeStyle = "#5d6670"; g.lineWidth = 6;
                g.beginPath(); g.moveTo(CX - 70 + R * 0.6, cy + R * 0.75); g.quadraticCurveTo(CX + 40, 356, CX + 92, 322); g.stroke();
                g.fillStyle = "#e3352b"; rr(g, CX + 84, 236 + bob * 0.2, 16, 92 - bob * 0.2, 7); g.fill();
                g.fillStyle = "#8f1f16"; rr(g, CX + 58, 222 + bob, 68, 14, 7); g.fill();
                g.fillStyle = "#5d6670"; rr(g, CX + 76, 322, 32, 36, 5); g.fill();
              } else {
                // popped: flat squiggle + star burst
                g.strokeStyle = "#33241a"; g.lineWidth = 16;
                g.beginPath(); g.ellipse(CX - 70, 336, 96, 22, 0, 0, Math.PI * 2); g.stroke();
                g.strokeStyle = "#ffb627"; g.lineWidth = 5;
                for (var s2 = 0; s2 < 8; s2++) {
                  var a = s2 / 8 * Math.PI * 2;
                  g.beginPath();
                  g.moveTo(CX - 70 + Math.cos(a) * 60, 240 + Math.sin(a) * 44);
                  g.lineTo(CX - 70 + Math.cos(a) * 92, 240 + Math.sin(a) * 70);
                  g.stroke();
                }
              }
              // pressure gauge (right)
              var GX = CX + 168, GY = 168, GR = 84;
              g.fillStyle = dark ? "#2c2118" : "#fdfdf8"; g.beginPath(); g.arc(GX, GY, GR, 0, Math.PI * 2); g.fill();
              g.strokeStyle = dark ? "#596273" : "#c9ced4"; g.lineWidth = 4; g.beginPath(); g.arc(GX, GY, GR, 0, Math.PI * 2); g.stroke();
              // green zone arc 60-82, red zone 82-100 (angles: -210deg..30deg sweep)
              function arcFor(lo, hi, color) {
                g.strokeStyle = color; g.lineWidth = 12;
                g.beginPath(); g.arc(GX, GY, GR - 10, Math.PI * 0.75 + (lo / 100) * Math.PI * 1.5, Math.PI * 0.75 + (hi / 100) * Math.PI * 1.5); g.stroke();
              }
              arcFor(ZONE.lo, ZONE.hi, "rgba(53,196,160,.8)");
              arcFor(ZONE.hi, 100, "rgba(217,62,34,.75)");
              // needle
              var na = Math.PI * 0.75 + (needle() / 100) * Math.PI * 1.5;
              g.strokeStyle = "#d93e22"; g.lineWidth = 5;
              g.beginPath(); g.moveTo(GX, GY); g.lineTo(GX + Math.cos(na) * (GR - 22), GY + Math.sin(na) * (GR - 22)); g.stroke();
              g.fillStyle = "#33241a"; g.beginPath(); g.arc(GX, GY, 8, 0, Math.PI * 2); g.fill();
              txt(g, "PSI", GX, GY + 40, 15, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Press & HOLD — release in the green!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
