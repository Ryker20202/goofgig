/* ================================================================
   GoofGig — Gig #036 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #036 — Ketchup Blob
         Hold to squirt ketchup over the fries.
         Release in the zone; over = ketchup flood.
         ================================================================ */
      registerGame({
        n: 36, title: "Ketchup Blob",
        desc: "Hold to squirt. Golden fries or a red sea.",
        hint: '<b>Press and hold</b> to squirt ketchup over the fries. Let go inside the <b>zone (55–85%)</b>. Hold to 100% and the tray <b>drowns in ketchup</b>.',
        grades: [
          ["Sauce Artist", "A zigzag worthy of a food commercial. Stunning."],
          ["Ketchup Captain", "Every fry kissed by sauce. Perfect coverage."],
          ["Happy Dunker", "Solid saucing. A few naked fries, no tragedy."],
          ["Sauce Shy", "Three drops. The fries feel neglected."],
          ["Ketchup Tsunami", "The fries have filed for disaster relief."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f2b035"; rr(g, 128, 34, 10, 48, 4); g.fill(); rr(g, 146, 28, 10, 54, 4); g.fill(); rr(g, 164, 34, 10, 48, 4); g.fill();
          g.fillStyle = "#e3352b"; g.beginPath(); g.moveTo(124, 52); g.quadraticCurveTo(150, 38, 176, 52); g.quadraticCurveTo(150, 62, 124, 52); g.fill();
          g.fillStyle = "#d93e22"; rr(g, 118, 76, 64, 10, 5); g.fill();
        },
        create: function (api) {
          var amt = 0, holding = false, started = false, done = false, flood = false, drips = [];
          var ZONE = { lo: 55, hi: 85 };
          function finishRound() {
            done = true;
            var s;
            if (flood) s = clamp(Math.round(8 + amt * 0.06), 4, 18);
            else if (amt >= ZONE.lo && amt <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(amt - 70) * 1.8), 62, 100);
            else if (amt < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - amt) * 1.5), 2, 87);
            else s = clamp(Math.round(88 - (amt - ZONE.hi) * 2.2), 30, 87);
            api.finish({ score: s, rows: [
              { label: "Ketchup level", value: amt, text: Math.round(amt) + "%" + (flood ? " — full flood!" : "") },
              { label: "Sauce zone", value: 70, text: ZONE.lo + "–" + ZONE.hi + "%", good: !flood && amt >= ZONE.lo && amt <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return flood ? "The tray has drowned." : "Fries judged!";
              return started ? "Ketchup " + Math.round(amt) + "% — release in the zone!" : "Press and HOLD to squirt!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (amt >= ZONE.lo && amt <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (holding && !done) {
                amt = clamp(amt + dt * 33, 0, 100);
                if (Math.random() < dt * 14) drips.push({ x: W / 2 - 60 + Math.random() * 120, y: 176, v: 260 + Math.random() * 120 });
                if (amt >= 100) { flood = true; holding = false; sndBad(); finishRound(); }
              }
              for (var i = drips.length - 1; i >= 0; i--) { drips[i].y += drips[i].v * dt; if (drips[i].y > 268) drips.splice(i, 1); }
              var CX = W / 2;
              // table
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; g.fillRect(0, 372, W, 88);
              // tray
              g.fillStyle = "#d93e22"; rr(g, CX - 150, 330, 300, 34, 10); g.fill();
              g.fillStyle = "#b92c1a"; rr(g, CX - 150, 356, 300, 10, 5); g.fill();
              // fries
              var fryCols = ["#f7c948", "#f2b035", "#ffd968"];
              for (var f = 0; f < 9; f++) {
                var fx = CX - 118 + f * 29, fh = 84 + (f * 37) % 40;
                g.fillStyle = fryCols[f % 3]; rr(g, fx, 330 - fh, 20, fh, 5); g.fill();
              }
              // ketchup zigzag grows over the fries with amount
              var covered = Math.floor(amt / 100 * 26);
              g.strokeStyle = "#e3352b"; g.lineWidth = 9; g.lineCap = "round";
              g.beginPath();
              for (var k = 0; k < covered; k++) {
                var kx = CX - 118 + k * 9.4, ky = 268 + (k % 2 ? -13 : 13);
                if (k === 0) g.moveTo(kx, ky); else g.lineTo(kx, ky);
              }
              if (covered > 1) g.stroke();
              // ketchup pool grows on the tray
              if (amt > 30) {
                g.fillStyle = "rgba(227,53,43,.75)";
                g.beginPath(); g.ellipse(CX, 336, 40 + amt * 0.9, 8 + amt * 0.1, 0, 0, Math.PI * 2); g.fill();
              }
              // flood covers everything
              if (flood) {
                g.fillStyle = "rgba(200,30,20,.88)";
                g.beginPath(); g.ellipse(CX, 330, 220, 52, 0, 0, Math.PI * 2); g.fill();
                g.fillStyle = "rgba(227,53,43,.9)"; g.fillRect(0, 372, W, 30);
              }
              // falling drips
              g.fillStyle = "#e3352b";
              drips.forEach(function (d) { g.beginPath(); g.ellipse(d.x, d.y, 4, 7, 0, 0, Math.PI * 2); g.fill(); });
              // bottle upside-down at top, nozzle over the fries
              var jig = holding ? Math.sin(now / 40) * 1.6 : 0;
              g.save(); g.translate(CX + jig, 118);
              g.fillStyle = "#e3352b"; rr(g, -30, -78, 60, 108, 16); g.fill();
              g.fillStyle = "#fdfdf8"; rr(g, -30, -40, 60, 40, 8); g.fill();
              txt(g, "TOM", 0, -12, 15, "#e3352b");
              g.fillStyle = "#c22f24"; g.beginPath(); g.moveTo(-9, 30); g.lineTo(9, 30); g.lineTo(3, 52); g.lineTo(-3, 52); g.closePath(); g.fill();
              g.restore();
              // amount meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "SAUCE", 92, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = amt > ZONE.hi ? "#d93e22" : "#e3352b"; rr(g, MX, MY - 9, MW * amt / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — stop in the green!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
