/* ================================================================
   GoofGig — Gig #021 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #022):
     1. Copy this file (or gig-template.js) to gig-022.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #021 — Dunk the Biscuit
         Press and hold to dunk; release inside the golden zone.
         Hold to 100% and the biscuit breaks off in the mug.
         ================================================================ */
      registerGame({
        n: 21, title: "Dunk the Biscuit",
        desc: "Hold to dunk. Release in the golden zone. Greed gets crumbs.",
        hint: '<b>Press and hold</b> to dunk the biscuit into the milk. Let go inside the <b>golden zone (55–85%)</b>. Hold all the way to 100% and it <b>breaks off</b> in the mug.',
        grades: [
          ["Perfect Dunk", "Golden soak, crisp edges. You were born for this."],
          ["Tea-Time Pro", "That biscuit knew exactly what it was doing."],
          ["Solid Dunker", "A respectable dunk. The mug approves."],
          ["Cautious Dipper", "A timid little splash. Barely dunked at all."],
          ["Mug Gremlin", "Bone dry, or drowned without a trace. Impressive, honestly."]
        ],
        thumb: function (g) {
          g.fillStyle = "#bfe3f2"; rr(g, 126, 20, 48, 64, 6); g.fill();
          g.fillStyle = "#fdfdf8"; rr(g, 130, 38, 40, 42, 4); g.fill();
          g.fillStyle = "#d9a05b"; g.beginPath(); g.arc(150, 26, 17, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#8a5a28"; g.beginPath(); g.arc(143, 21, 2.4, 0, Math.PI * 2); g.arc(156, 30, 2.4, 0, Math.PI * 2); g.arc(150, 33, 2, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var soak = 0, holding = false, started = false, done = false, broken = false, fallY = 0, splash = 0, lastBlip = 0;
          var ZONE = { lo: 55, hi: 85 };
          function finishRound() {
            done = true;
            var s;
            if (broken) s = clamp(Math.round(10 + soak * 0.05), 5, 20);
            else if (soak >= ZONE.lo && soak <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(soak - 70) * 1.8), 62, 100);
            else if (soak < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - soak) * 1.5), 2, 87);
            else s = clamp(Math.round(88 - (soak - ZONE.hi) * 2.2), 30, 87);
            api.finish({ score: s, rows: [
              { label: "Your soak", value: soak, text: Math.round(soak) + "%" + (broken ? " — it broke off!" : "") },
              { label: "Golden zone", value: 70, text: ZONE.lo + "–" + ZONE.hi + "%", good: !broken && soak >= ZONE.lo && soak <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return broken ? "It broke off in the mug!" : "Dunk judged!";
              return started ? "Soak " + Math.round(soak) + "% — let go in the green!" : "Press and HOLD to dunk!";
            },
            down: function () {
              if (done) return;
              started = true; holding = true; audio();
            },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (soak >= ZONE.lo && soak <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (holding && !done) {
                soak = clamp(soak + dt * 34, 0, 100);
                if (now - lastBlip > 260) { lastBlip = now; blip(240 + soak * 3, .05, "sine", .05); }
                if (soak >= 100) { broken = true; holding = false; splash = 0.5; sndBad(); finishRound(); }
              }
              if (splash > 0) splash -= dt;
              var CX = W / 2;
              // table
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; g.fillRect(0, 402, W, 58);
              // glass of milk (trapezoid mug)
              g.fillStyle = "rgba(160,210,235,.4)";
              g.beginPath(); g.moveTo(CX - 98, 208); g.lineTo(CX + 98, 208); g.lineTo(CX + 82, 400); g.lineTo(CX - 82, 400); g.closePath(); g.fill();
              g.strokeStyle = dark ? "#7fb6cc" : "#5d97ad"; g.lineWidth = 3; g.stroke();
              // milk
              g.fillStyle = "#fdfdf8";
              g.beginPath(); g.moveTo(CX - 90, 252); g.lineTo(CX + 90, 252); g.lineTo(CX + 76, 392); g.lineTo(CX - 76, 392); g.closePath(); g.fill();
              // splash droplets right after a break
              if (splash > 0) {
                g.fillStyle = "#fdfdf8";
                for (var i = 0; i < 6; i++) {
                  var sx = CX - 60 + i * 24, sy = 238 - Math.sin((0.5 - splash) * Math.PI) * (26 + (i % 3) * 9);
                  g.beginPath(); g.arc(sx, sy, 4, 0, Math.PI * 2); g.fill();
                }
              }
              // fallen bottom half after a break
              if (broken) {
                fallY = Math.min(fallY + dt * 160, 128);
                g.fillStyle = "#8a5a28";
                g.beginPath(); g.arc(CX, 238 + fallY, 46, 0.25, Math.PI - 0.25); g.closePath(); g.fill();
              }
              // biscuit (whole until it breaks, then the held top half)
              var dip = clamp(soak / 85, 0, 1);
              var by = 122 + dip * 148 + (holding ? Math.sin(now / 90) * 2 : 0);
              var sog = soak / 100;
              var cr = Math.round(217 - sog * 79), cg = Math.round(160 - sog * 70), cb = Math.round(91 - sog * 51);
              g.fillStyle = "rgb(" + cr + "," + cg + "," + cb + ")";
              g.beginPath();
              if (broken) g.arc(CX, by, 52, Math.PI + 0.25, Math.PI * 2 - 0.25);
              else g.arc(CX, by, 52, 0, Math.PI * 2);
              g.closePath(); g.fill();
              g.strokeStyle = "rgba(120,72,20,.5)"; g.lineWidth = 3;
              g.beginPath();
              if (broken) g.arc(CX, by, 52, Math.PI + 0.25, Math.PI * 2 - 0.25);
              else g.arc(CX, by, 52, 0, Math.PI * 2);
              g.stroke();
              // choc chips
              g.fillStyle = "#5e3a12";
              [[-20, -14], [14, -24], [24, 6], [-8, 16], [-30, 10]].forEach(function (c) {
                if (broken && c[1] > 0) return;
                g.beginPath(); g.arc(CX + c[0], by + c[1], 4.5, 0, Math.PI * 2); g.fill();
              });
              // cracks when nearly saturated
              if (soak > 82 && !broken) {
                g.strokeStyle = "rgba(70,40,8,.75)"; g.lineWidth = 2.5;
                g.beginPath(); g.moveTo(CX - 30, by + 18); g.lineTo(CX - 10, by + 30); g.lineTo(CX + 6, by + 22); g.lineTo(CX + 26, by + 34); g.stroke();
                g.beginPath(); g.moveTo(CX - 6, by + 40); g.lineTo(CX + 4, by + 48); g.stroke();
              }
              // soak meter (bottom) with golden zone band
              var MX = 140, MY = 424, MW = 440;
              txt(g, "SOAK", 96, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = soak > ZONE.hi ? "#d93e22" : "#e8a33d"; rr(g, MX, MY - 9, MW * soak / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — release in the green!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
