/* ================================================================
   GoofGig — Gig #029 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #029 — Sneeze Stop
         Ah… ah… AH— pinch the nose inside the green zone.
         Too late and everyone within six feet knows it.
         ================================================================ */
      registerGame({
        n: 29, title: "Sneeze Stop",
        desc: "Ah… ah… AH— pinch your nose inside the green zone. Or else.",
        hint: 'The sneeze meter climbs with treacherous wobbles. <b>Tap once</b> to pinch your nose inside the <b>green zone (55–80%)</b>. Reach 100% and it is everyone\'s problem.',
        grades: [
          ["Sneeze Assassin", "Stopped mid-'ah'. The tissues are disappointed."],
          ["Nose Pinch Ninja", "Crisis averted. Nasally heroic."],
          ["Polite Suppressor", "It escaped a little, but quietly. So quietly."],
          ["Warning Shot", "That was less a stop, more a preview."],
          ["Biological Event", "Gesundheit. To you, and everyone you just met."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f2b183"; g.beginPath(); g.arc(150, 48, 24, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e89b6a"; g.beginPath(); g.ellipse(150, 54, 6, 9, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#57b7dd";
          [[112, 30], [188, 26], [196, 58]].forEach(function (d) { g.beginPath(); g.arc(d[0], d[1], 3.4, 0, Math.PI * 2); g.fill(); });
        },
        create: function (api) {
          var meter = 0, started = false, done = false, blasted = false, particles = [];
          var ZONE = { lo: 55, hi: 80 };
          function finishRound() {
            done = true;
            var c = (ZONE.lo + ZONE.hi) / 2, s;
            if (blasted) s = clamp(Math.round(8 + Math.random() * 6), 4, 16);
            else if (meter >= ZONE.lo && meter <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(meter - c) * 2.1), 66, 100);
            else if (meter < ZONE.lo) s = clamp(Math.round(87 - (ZONE.lo - meter) * 1.6), 2, 87);
            else s = clamp(Math.round(87 - (meter - ZONE.hi) * 2.4), 25, 87);
            api.finish({ score: s, rows: [
              { label: "Sneeze stopped at", value: meter, text: Math.round(meter) + "%" + (blasted ? " — too late!" : ""), good: !blasted && meter >= ZONE.lo && meter <= ZONE.hi },
              { label: "Safe zone", value: c, text: ZONE.lo + "–" + ZONE.hi + "%", good: true }
            ] });
          }
          return {
            status: function () {
              if (done) return blasted ? "ACHOO. So sorry. Everyone." : "Sneeze stopped at " + Math.round(meter) + "%!";
              if (!started) return "Tap to start the tickle…";
              return meter < 30 ? "ah…" : (meter < 62 ? "ah… ah…" : "AH… AH…");
            },
            down: function () {
              if (done) return;
              if (!started) { started = true; audio(); return; }
              if (meter >= ZONE.lo && meter <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                meter = clamp(meter + dt * (27 + 13 * Math.sin(now / 160) + 5 * Math.sin(now / 47)), 0, 100);
                if (meter >= 100) {
                  blasted = true; sndBad();
                  for (var i = 0; i < 22; i++) particles.push({ x: W / 2, y: 236, vx: (Math.random() * 2 - 1) * 340, vy: (Math.random() * 2 - 0.6) * 260, t: 0.8 });
                  finishRound();
                }
              }
              for (var j = particles.length - 1; j >= 0; j--) {
                var pt = particles[j]; pt.t -= dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 300 * dt;
                if (pt.t <= 0) particles.splice(j, 1);
              }
              var CX = W / 2, tremble = started && !done ? Math.sin(now / 30) * meter / 60 : 0;
              // face
              g.save(); g.translate(CX + tremble, 218);
              g.fillStyle = "#f2b183"; g.beginPath(); g.arc(0, 0, 92, 0, Math.PI * 2); g.fill();
              // scrunched eyes (more scrunched as meter climbs)
              var sq = meter / 100;
              g.strokeStyle = "#5e3a12"; g.lineWidth = 4; g.lineCap = "round";
              g.beginPath(); g.moveTo(-52, -26 + sq * 6); g.lineTo(-24, -20 - sq * 4); g.stroke();
              g.beginPath(); g.moveTo(52, -26 + sq * 6); g.lineTo(24, -20 - sq * 4); g.stroke();
              // nose (wiggles)
              g.fillStyle = "#e89b6a"; g.beginPath(); g.ellipse(Math.sin(now / 90) * sq * 4, 12, 13, 19, 0, 0, Math.PI * 2); g.fill();
              // mouth: wobbling open with the ah-ah-ahs
              var mo = 4 + sq * 20 + (started ? Math.abs(Math.sin(now / 200)) * sq * 8 : 0);
              g.fillStyle = "#7a3324"; g.beginPath(); g.ellipse(0, 56, 14 + sq * 8, mo, 0, 0, Math.PI * 2); g.fill();
              g.restore();
              // blast particles
              particles.forEach(function (pt) {
                g.fillStyle = "rgba(87,183,221,.8)"; g.beginPath(); g.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2); g.fill();
              });
              if (blasted) txt(g, "ACHOO!!", CX, 74, 40, "#d93e22");
              // sneeze meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "SNEEZE", 84, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = meter > ZONE.hi ? "#d93e22" : "#e8a33d"; rr(g, MX, MY - 9, MW * meter / 100, 18, 9); g.fill();
              if (!started) txt(g, "Tap to start — then pinch in the green!", CX, 44, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
