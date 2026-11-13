/* ================================================================
   GoofGig — Gig #007 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #007 — Balloon Gamble
         Hold to inflate into the target ring. Too long = pop, zero.
         ================================================================ */
      registerGame({
        n: 7, title: "Balloon Gamble",
        desc: "Inflate into the ring, let go, pray. Greed pops balloons.",
        hint: '<b>Press and hold</b> to inflate the balloon into the <b>dashed ring</b>. <b>Release</b> inside it — hold too long and it <b>pops for 0</b>.',
        grades: [
          ["Ring Whisperer", "Exactly ring-sized. The balloon respects you."],
          ["Cool-Hand Inflator", "Stopped right where courage meets sense."],
          ["Casual Gambler", "A little small, a little safe, entirely fine."],
          ["Timid Puff", "That balloon is still basically a grape."],
          ["Pop Star", "It popped. Spectacularly. Score zero, story priceless."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#ff5a3c"; g.lineWidth = 3; g.setLineDash([6, 5]);
          g.beginPath(); g.arc(150, 44, 34, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
          g.fillStyle = "#ff8fa3"; g.beginPath(); g.arc(150, 44, 24, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var R = 96 + Math.random() * 30, r = 18, holding = false, done = false, popped = false;
          var CX = W / 2, CY = 218, POP_R = 158;
          return {
            status: function () { return done ? (popped ? "POPPED!" : "Banked!") : "Balloon " + Math.round(r) + " · ring " + Math.round(R); },
            down: function () { if (!done) { holding = true; audio(); } },
            move: function () {},
            up: function () {
              if (!holding || done) return;
              holding = false; done = true;
              var diff = Math.abs(r - R);
              var score = clamp(Math.round(100 - diff * 2.1), 3, 100);
              api.finish({ score: score, rows: [
                { label: "Your balloon", value: clamp(r / POP_R * 100, 0, 100), text: Math.round(r) + "" },
                { label: "Target ring", value: clamp(R / POP_R * 100, 0, 100), text: Math.round(R) + "", good: true }
              ] });
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (holding && !done) {
                r += dt * 44;
                if (r >= POP_R) {
                  popped = true; done = true; holding = false; sndBad();
                  api.finish({ score: 0, gradeOverride: ["Pop Star", "It popped. Spectacularly. Score zero, story priceless."],
                    rows: [{ label: "Your balloon", value: 100, text: "POP" }] });
                }
              }
              // target ring
              g.strokeStyle = "#0e9594"; g.lineWidth = 4; g.setLineDash([12, 9]);
              g.beginPath(); g.arc(CX, CY, R, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
              txt(g, "TARGET RING", CX, CY - R - 18, 15, dark ? "#35c4c3" : "#0e9594");
              // danger zone
              g.strokeStyle = "rgba(217,62,34,.4)"; g.lineWidth = 2;
              g.beginPath(); g.arc(CX, CY, POP_R, 0, Math.PI * 2); g.stroke();
              txt(g, "POP LINE", CX + POP_R * 0.72, CY - POP_R * 0.72, 13, "rgba(217,62,34,.75)");
              if (!popped) {
                var inRing = Math.abs(r - R) <= 9;
                var grad = g.createRadialGradient(CX - r * 0.35, CY - r * 0.4, r * 0.15, CX, CY, r);
                grad.addColorStop(0, "#ffc2cf"); grad.addColorStop(1, "#f2788f");
                g.fillStyle = grad; g.beginPath(); g.arc(CX, CY, r, 0, Math.PI * 2); g.fill();
                if (inRing && !done) { g.strokeStyle = "#ffb627"; g.lineWidth = 5; g.beginPath(); g.arc(CX, CY, r, 0, Math.PI * 2); g.stroke(); }
                g.fillStyle = "#f2788f"; g.beginPath();
                g.moveTo(CX - 7, CY + r); g.lineTo(CX + 7, CY + r); g.lineTo(CX, CY + r + 13); g.closePath(); g.fill();
                g.strokeStyle = dark ? "#c4a68d" : "#7a5f4d"; g.lineWidth = 2;
                g.beginPath(); g.moveTo(CX, CY + r + 13); g.quadraticCurveTo(CX + 14, CY + r + 34, CX - 4, CY + r + 52); g.stroke();
                if (inRing && holding) txt(g, "LET GO NOW!", CX, 40, 24, "#0e9594");
              } else {
                for (var i = 0; i < 10; i++) {
                  var a = i / 10 * Math.PI * 2;
                  txt(g, "✳", CX + Math.cos(a) * 120, CY + Math.sin(a) * 120, 26, "#f2788f");
                }
                txt(g, "POP!", CX, CY, 44, "#d93e22");
              }
              if (!done) txt(g, holding ? "Inflating…" : "Hold anywhere to inflate", W / 2, 424, 18, dark ? "rgba(247,232,216,.75)" : "rgba(93,58,22,.65)");
            }
          };
        }
      });
