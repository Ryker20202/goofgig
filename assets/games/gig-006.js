/* ================================================================
   GoofGig — Gig #006 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #006 — Crack It Gently
         Stop the sweeping needle in the green zone. 3 eggs.
         ================================================================ */
      registerGame({
        n: 6, title: "Crack It Gently",
        desc: "Too soft: nothing. Too hard: shell confetti. Find the zone.",
        hint: 'The needle sweeps back and forth — <b>tap</b> to stop it inside the <b>green zone</b>. <b>3 eggs</b>, average score.',
        grades: [
          ["Shell Surgeon", "Three perfect cracks. Omelettes everywhere approve."],
          ["Gentle Tapper", "Clean cracks, happy yolks, no crunchy surprises."],
          ["Kitchen Realist", "Edible, technically. Mind the small crunchy bits."],
          ["Shell Shrapnel Fan", "That egg exploded politely, but it exploded."],
          ["Egg Demolition Crew", "The egg has filed a formal complaint."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdf6ec"; g.beginPath(); g.ellipse(150, 46, 30, 36, 0, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#33241a"; g.lineWidth = 3;
          g.beginPath(); g.moveTo(138, 22); g.lineTo(150, 40); g.lineTo(142, 56); g.lineTo(156, 72); g.stroke();
        },
        create: function (api) {
          var eggs = 0, scores = [], needle = null, zoneC = 8, cracked = null, crackT = 0, done = false, t0 = Math.random() * 9;
          function nextEgg() { zoneC = -34 + Math.random() * 68; cracked = null; }
          nextEgg();
          function finishIfDone() {
            done = true;
            var avg = Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length);
            api.finish({ score: clamp(avg, 1, 100), rows: scores.map(function (v, i) {
              return { label: "Egg " + (i + 1), value: v, text: v + "", good: v >= 70 };
            }) });
          }
          return {
            status: function () { return done ? "All cracked!" : "Egg " + (eggs + 1) + " of 3"; },
            down: function (p, now) {
              if (done || cracked) return;
              var a = Math.sin((now + t0) * 2.6) * 62;
              var d = Math.abs(a - zoneC);
              var s = d <= 9 ? 100 : clamp(Math.round(100 - (d - 9) * 2.6), 2, 92);
              scores.push(s); eggs++;
              cracked = { clean: d <= 9, s: s }; crackT = 0.8;
              if (d <= 9) sndGood(); else sndBad();
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (cracked) { crackT -= dt; if (crackT <= 0) { if (eggs >= 3) finishIfDone(); else nextEgg(); } }
              var cx = W / 2, cy = 330;
              // gauge arc
              g.strokeStyle = dark ? "#4a3423" : "#f0dcc4"; g.lineWidth = 26;
              g.beginPath(); g.arc(cx, cy, 190, Math.PI * 1.18, Math.PI * 1.82); g.stroke();
              function angX(a) { return cx + Math.sin(a * Math.PI / 180) * 190; }
              function angY(a) { return cy - Math.cos(a * Math.PI / 180) * 190; }
              g.strokeStyle = "#35c4a0"; g.lineWidth = 26;
              g.beginPath(); g.arc(cx, cy, 190,
                Math.PI * 1.5 + (zoneC - 9) * Math.PI / 180, Math.PI * 1.5 + (zoneC + 9) * Math.PI / 180); g.stroke();
              // needle
              var a = cracked ? zoneC + (scores[scores.length - 1] >= 100 ? 0 : 20) : Math.sin((now + t0) * 2.6) * 62;
              if (!cracked) {
                g.strokeStyle = "#ff5a3c"; g.lineWidth = 6; g.lineCap = "round";
                g.beginPath(); g.moveTo(cx, cy - 26); g.lineTo(angX(a), angY(a)); g.stroke();
                g.fillStyle = "#33241a"; g.beginPath(); g.arc(cx, cy - 26, 11, 0, Math.PI * 2); g.fill();
              }
              // egg on a stand
              g.fillStyle = "#b9834e"; rr(g, cx - 90, cy + 62, 180, 16, 8); g.fill();
              g.save(); g.translate(cx, cy + 58);
              var grad = g.createRadialGradient(-14, -64, 8, 0, -44, 76);
              grad.addColorStop(0, "#fffdf6"); grad.addColorStop(1, "#efdfc2");
              g.fillStyle = grad; g.beginPath(); g.ellipse(0, -44, 46, 58, 0, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#d9c6a5"; g.lineWidth = 3; g.stroke();
              if (cracked) {
                g.strokeStyle = "#8a6b42"; g.lineWidth = 3;
                g.beginPath(); g.moveTo(-30, -66); g.lineTo(-10, -48); g.lineTo(-20, -30); g.lineTo(2, -14); g.lineTo(14, -34); g.lineTo(30, -50); g.stroke();
                if (cracked.clean) { g.fillStyle = "#ffb627"; g.beginPath(); g.ellipse(0, -18, 17, 10, 0, 0, Math.PI * 2); g.fill(); }
                txt(g, cracked.clean ? "CLEAN CRACK!" : "CRUNCH…", 0, -140, 24, cracked.clean ? "#0e9594" : "#d93e22");
              }
              g.restore();
              if (!cracked && !done) txt(g, "TAP TO CRACK", W / 2, 46, 17, dark ? "rgba(247,232,216,.75)" : "rgba(93,58,22,.65)");
            }
          };
        }
      });
