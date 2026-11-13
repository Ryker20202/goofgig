/* ================================================================
   GoofGig — Gig #043 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #043 — Spray Paint Star
         Hold to spray a stencil star on the wall.
         Coverage zone 75–95%. Over = drips.
         ================================================================ */
      registerGame({
        n: 43, title: "Spray Paint Star",
        desc: "Hold to spray the stencil. Crisp star or drippy regret.",
        hint: '<b>Press and hold</b> to spray-paint the stencil star. Let go at <b>75–95% coverage</b>. Spray to 100% and it <b>drips down the wall</b>.',
        grades: [
          ["Stencil Royalty", "A gallery-grade star. Banksy is nervous."],
          ["Spray Captain", "Bold, even coverage. The wall pops now."],
          ["Tag Apprentice", "A solid star. Slightly ghostly edges."],
          ["Faint Fogger", "That star is a rumor. Squint to believe."],
          ["Drip Disaster", "The star is crying paint. Modern art, maybe."]
        ],
        thumb: function (g) {
          g.fillStyle = "#e3352b";
          g.beginPath();
          var cx = 140, cy = 48, R = 34, r = 14;
          for (var i = 0; i < 10; i++) {
            var rad = i % 2 ? r : R, a = -Math.PI / 2 + i * Math.PI / 5;
            var x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
            if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
          }
          g.closePath(); g.fill();
          g.fillStyle = "#aeb9c4"; rr(g, 216, 22, 20, 46, 6); g.fill();
          g.fillStyle = "#e3352b"; rr(g, 220, 14, 12, 10, 3); g.fill();
        },
        create: function (api) {
          var cov = 0, holding = false, started = false, done = false, drippy = false, speck = [];
          var ZONE = { lo: 75, hi: 95 };
          var CX = W / 2 - 40, CY = 240, R = 118, IR = 49;
          function starPath(g) {
            g.beginPath();
            for (var i = 0; i < 10; i++) {
              var rad = i % 2 ? IR : R, a = -Math.PI / 2 + i * Math.PI / 5;
              var x = CX + Math.cos(a) * rad, y = CY + Math.sin(a) * rad;
              if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
            }
            g.closePath();
          }
          function finishRound() {
            done = true;
            var s;
            if (drippy) s = clamp(Math.round(12 + cov * 0.05), 6, 24);
            else if (cov >= ZONE.lo && cov <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(cov - 85) * 1.9), 62, 100);
            else if (cov < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - cov) * 1.3), 2, 87);
            else s = clamp(Math.round(88 - (cov - ZONE.hi) * 3.4), 26, 87);
            api.finish({ score: s, rows: [
              { label: "Star coverage", value: cov, text: Math.round(cov) + "%" + (drippy ? " — it's dripping!" : "") },
              { label: "Target zone", value: 85, text: ZONE.lo + "–" + ZONE.hi + "%", good: !drippy && cov >= ZONE.lo && cov <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return drippy ? "The star is melting." : "Star judged!";
              return started ? "Coverage " + Math.round(cov) + "% — release at 75–95%!" : "Press and HOLD to spray!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (cov >= ZONE.lo && cov <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (holding && !done) {
                cov = clamp(cov + dt * 38, 0, 100);
                for (var s2 = 0; s2 < 3; s2++) {
                  var a = Math.random() * Math.PI * 2, rr2 = Math.sqrt(Math.random());
                  speck.push({ x: CX + Math.cos(a) * rr2 * (R - 16), y: CY + Math.sin(a) * rr2 * (R - 16), r: 5 + Math.random() * 10 });
                }
                if (cov >= 100) { drippy = true; holding = false; sndBad(); finishRound(); }
              }
              // wall
              g.fillStyle = dark ? "#3d3a38" : "#e8e2d8"; g.fillRect(40, 60, W - 80, 330);
              g.strokeStyle = dark ? "#57534f" : "#cfc8ba"; g.lineWidth = 3; g.strokeRect(40, 60, W - 80, 330);
              // stencil plate (light) then star speckles clipped to star
              starPath(g);
              g.fillStyle = dark ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.55)"; g.fill();
              g.save(); starPath(g); g.clip();
              g.fillStyle = "rgba(227,53,43," + (0.25 + cov / 100 * 0.75) + ")";
              g.fillRect(CX - R, CY - R, R * 2, R * 2);
              g.fillStyle = "rgba(255,90,60,.5)";
              speck.forEach(function (p) { g.beginPath(); g.arc(p.x, p.y, p.r, 0, Math.PI * 2); g.fill(); });
              // drips run down when over-sprayed
              if (cov > ZONE.hi || drippy) {
                var dripN = drippy ? 6 : 3;
                g.fillStyle = "rgba(227,53,43,.85)";
                for (var d = 0; d < dripN; d++) {
                  var dx = CX - 70 + d * 28, dl = (cov - ZONE.hi) * 3.2 + (drippy ? 44 : 0);
                  rr(g, dx, CY + 60, 7, clamp(dl, 6, 120), 3); g.fill();
                }
              }
              g.restore();
              starPath(g); g.strokeStyle = dark ? "#8b95a5" : "#9aa3ab"; g.lineWidth = 3; g.stroke();
              // spray can at right, mist while holding
              var SX = W / 2 + 216;
              g.save(); g.translate(SX, 216); g.rotate(-0.35);
              g.fillStyle = "#aeb9c4"; rr(g, -19, -62, 38, 124, 9); g.fill();
              g.fillStyle = "#e3352b"; rr(g, -19, -62, 38, 34, 9); g.fill();
              g.fillStyle = "#7d8894"; rr(g, -8, -76, 16, 15, 4); g.fill();
              g.restore();
              if (holding) {
                g.fillStyle = "rgba(227,53,43,.4)";
                for (var m = 0; m < 5; m++) { g.beginPath(); g.arc(SX - 50 - Math.random() * 70, 170 + Math.random() * 60, 5 + Math.random() * 7, 0, Math.PI * 2); g.fill(); }
              }
              // coverage meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "PAINT", 92, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = cov > ZONE.hi ? "#d93e22" : "#e3352b"; rr(g, MX, MY - 9, MW * cov / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — stop at 75–95%!", W / 2, 44, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
