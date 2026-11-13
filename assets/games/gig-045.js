/* ================================================================
   GoofGig — Gig #045 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #045 — Frost the Donut
         The donut rotates on its own. Hold to pipe frosting;
         frosted arc coverage climbs. Zone 80–95%.
         ================================================================ */
      registerGame({
        n: 45, title: "Frost the Donut",
        desc: "Hold to frost a spinning donut. Pink glory or blob chaos.",
        hint: 'The donut <b>spins by itself</b>. <b>Press and hold</b> to pipe frosting around it. Let go at <b>80–95% frosted</b>. Hit 100% and it becomes <b>frosting blob chaos</b>.',
        grades: [
          ["Bakery Royalty", "A flawless pink ring. The display case weeps."],
          ["Frosting Captain", "Glossy, even, sprinkle-ready. Beautiful work."],
          ["Donut Decorator", "Mostly frosted. The bald arc has charm."],
          ["Naked Donut Apologist", "Half pastry, half frosting dream. Bold."],
          ["Blob Chaos Goblin", "That is a frosting swamp with a donut rumor."]
        ],
        thumb: function (g) {
          g.fillStyle = "#e0aa6e"; g.beginPath(); g.arc(150, 48, 32, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#f78fb3"; g.beginPath(); g.arc(150, 48, 30, Math.PI * 0.6, Math.PI * 2); g.lineTo(150, 48); g.fill();
          g.fillStyle = "#fdf6ec"; g.beginPath(); g.arc(150, 48, 11, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e3352b"; rr(g, 138, 24, 4, 9, 2); g.fill();
          g.fillStyle = "#35c4a0"; rr(g, 158, 30, 4, 9, 2); g.fill();
        },
        create: function (api) {
          var cov = 0, holding = false, started = false, done = false, chaos = false, rot = 0;
          var ZONE = { lo: 80, hi: 95 };
          function finishRound() {
            done = true;
            var s;
            if (chaos) s = clamp(Math.round(38 + cov * 0.1), 34, 58);
            else if (cov >= ZONE.lo && cov <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(cov - 87) * 2), 62, 100);
            else if (cov < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - cov) * 1.2), 2, 87);
            else s = clamp(Math.round(88 - (cov - ZONE.hi) * 3.4), 26, 87);
            api.finish({ score: s, rows: [
              { label: "Frosted arc", value: cov, text: Math.round(cov) + "%" + (chaos ? " — blob chaos!" : "") },
              { label: "Target zone", value: 87, text: ZONE.lo + "–" + ZONE.hi + "%", good: !chaos && cov >= ZONE.lo && cov <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return chaos ? "Blob chaos achieved." : "Donut judged!";
              return started ? "Frosted " + Math.round(cov) + "% — release at 80–95%!" : "Press and HOLD to frost!";
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
              rot += dt * 0.7;
              if (holding && !done) {
                cov = clamp(cov + dt * 30, 0, 100);
                if (cov >= 100) { chaos = true; holding = false; sndBad(); finishRound(); }
              }
              var CX = W / 2, CY = 238, R = 108;
              // plate
              g.fillStyle = dark ? "#454b58" : "#eef1f4"; g.beginPath(); g.ellipse(CX, CY + 8, 150, 132, 0, 0, Math.PI * 2); g.fill();
              // donut base (rotating shading dots)
              g.fillStyle = "#e0aa6e"; g.beginPath(); g.arc(CX, CY, R, 0, Math.PI * 2); g.fill();
              g.fillStyle = "rgba(160,105,45,.5)";
              for (var d = 0; d < 7; d++) {
                var da = rot + d * 0.9;
                g.beginPath(); g.arc(CX + Math.cos(da) * 76, CY + Math.sin(da) * 76, 6, 0, Math.PI * 2); g.fill();
              }
              // frosted arc: starts at the piping tip (top), extends as coverage grows
              if (cov > 0) {
                g.strokeStyle = "#f78fb3"; g.lineWidth = 44; g.lineCap = "round";
                var start = -Math.PI / 2 + rot * 0.15, sweep = cov / 100 * Math.PI * 2;
                g.beginPath(); g.arc(CX, CY, R - 26, start, start + sweep); g.stroke();
                // glossy highlight
                g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 9;
                g.beginPath(); g.arc(CX, CY, R - 38, start + 0.15, start + sweep * 0.92); g.stroke();
              }
              // hole
              g.fillStyle = dark ? "#2b241c" : "#fdf6ec"; g.beginPath(); g.arc(CX, CY, 34, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "rgba(160,105,45,.6)"; g.lineWidth = 4; g.beginPath(); g.arc(CX, CY, 34, 0, Math.PI * 2); g.stroke();
              // sprinkles appear once nicely frosted
              if (cov > 55) {
                var cols = ["#e3352b", "#35c4a0", "#ffb627", "#57b7dd"];
                for (var s2 = 0; s2 < 14; s2++) {
                  var sa = s2 * 1.93 + 0.4;
                  g.save(); g.translate(CX + Math.cos(sa) * 80, CY + Math.sin(sa) * 80); g.rotate(sa * 2);
                  g.fillStyle = cols[s2 % 4]; g.fillRect(-5, -2, 10, 4);
                  g.restore();
                }
              }
              // chaos blobs
              if (chaos) {
                g.fillStyle = "rgba(247,143,179,.85)";
                g.beginPath(); g.ellipse(CX - 90, CY + 96, 60, 20, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX + 104, CY + 84, 48, 17, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX + 10, CY - 118, 40, 14, 0, 0, Math.PI * 2); g.fill();
              }
              // piping bag at top, tip at the arc start; squeezes while holding
              var tipA = -Math.PI / 2 + rot * 0.15 + (cov / 100) * Math.PI * 2;
              var tipX = CX + Math.cos(tipA) * (R - 26), tipY = CY + Math.sin(tipA) * (R - 26);
              g.save(); g.translate(tipX, tipY - 44); g.rotate(Math.sin(now / 300) * 0.06);
              g.fillStyle = "#fdfdf8"; g.beginPath(); g.moveTo(-24, -52); g.lineTo(24, -52); g.lineTo(6, 6); g.lineTo(-6, 6); g.closePath(); g.fill();
              g.fillStyle = "#f78fb3"; g.beginPath(); g.moveTo(-24, -52); g.lineTo(24, -52); g.lineTo(15, -22); g.lineTo(-15, -22); g.closePath(); g.fill();
              g.fillStyle = "#aeb9c4"; rr(g, -7, 4, 14, 12, 3); g.fill();
              g.restore();
              if (holding) { g.fillStyle = "#f78fb3"; g.beginPath(); g.ellipse(tipX, tipY - 22, 5, 9, 0, 0, Math.PI * 2); g.fill(); }
              // coverage meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "FROST", 92, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = cov > ZONE.hi ? "#d93e22" : "#f78fb3"; rr(g, MX, MY - 9, MW * cov / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — stop at 80–95%!", CX, 44, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
