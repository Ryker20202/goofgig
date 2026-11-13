/* ================================================================
   GoofGig — Gig #002 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #002 — Perfect Pour
         Hold to pour, release to stop right on the fill line.
         ================================================================ */
      registerGame({
        n: 2, title: "Perfect Pour",
        desc: "Hold to pour, let go on the line. A splash too far is a flood.",
        hint: '<b>Press and hold</b> to pour water into the glass. <b>Release</b> to stop exactly on the dashed line.',
        grades: [
          ["Steady-Hand Sipper", "Not a drop wasted. The line salutes you."],
          ["Pro Pourer", "The glass is happy and so is the table."],
          ["Decent Decanter", "Close enough that nobody checks twice."],
          ["Splash Hazard", "The table is wearing most of that drink."],
          ["Flood Manager", "That was less pouring, more weather event."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#7fb3c8"; g.lineWidth = 5;
          g.beginPath(); g.moveTo(110, 14); g.lineTo(122, 74); g.lineTo(178, 74); g.lineTo(190, 14); g.stroke();
          g.fillStyle = "#57b7dd"; g.fillRect(128, 44, 44, 26);
          g.strokeStyle = "#ff5a3c"; g.lineWidth = 3; g.setLineDash([6, 5]);
          g.beginPath(); g.moveTo(122, 40); g.lineTo(178, 40); g.stroke(); g.setLineDash([]);
        },
        create: function (api) {
          var TARGET = 0.78, level = 0, holding = false, done = false;
          var GX = 285, GY = 120, GW = 150, GH = 230; // glass box
          return {
            status: function () { return done ? "Poured!" : "Filled " + Math.round(level * 100) + "% · line at 78%"; },
            down: function () { if (!done) { holding = true; audio(); } },
            move: function () {},
            up: function () {
              if (!holding || done) return;
              holding = false; done = true;
              var diff = Math.abs(level - TARGET);
              var score = level >= 0.995 ? clamp(Math.round(30 - (level - TARGET) * 60), 2, 30)
                : clamp(Math.round(100 - diff * 265), 2, 100);
              api.finish({ score: score, rows: [
                { label: "Your fill", value: level * 100, text: Math.round(level * 100) + "%" },
                { label: "The line", value: TARGET * 100, text: "78%", good: true }
              ] });
            },
            draw: function (g, dt) {
              if (holding && !done) level = Math.min(1.04, level + dt * 0.30);
              var dark = isDark();
              // jug
              g.save(); g.translate(150, 92); g.rotate(holding ? 0.5 : 0.18);
              g.fillStyle = "#9fc6d8"; rr(g, -52, -34, 104, 68, 14); g.fill();
              g.fillStyle = "#57b7dd"; rr(g, -52, 2, 104, 32, 12); g.fill();
              g.fillStyle = "#9fc6d8"; g.beginPath(); g.moveTo(52, -18); g.lineTo(86, -4); g.lineTo(52, 8); g.closePath(); g.fill();
              g.restore();
              if (holding && !done) { g.fillStyle = "rgba(87,183,221,.75)"; g.fillRect(238, 118, 7, Math.max(0, GY + GH - level * GH - 118)); }
              // glass
              var wy = GY + GH - level * GH;
              if (level > 0) {
                g.fillStyle = "#57b7dd";
                g.beginPath();
                g.moveTo(GX + 10, GY + GH - 6); g.lineTo(GX + 16, wy); g.lineTo(GX + GW - 16, wy); g.lineTo(GX + GW - 10, GY + GH - 6);
                g.closePath(); g.fill();
                g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(GX + 16, wy, GW - 32, 5);
              }
              g.strokeStyle = dark ? "#cfe6ef" : "#7fb3c8"; g.lineWidth = 6; g.lineJoin = "round";
              g.beginPath(); g.moveTo(GX, GY); g.lineTo(GX + 10, GY + GH); g.lineTo(GX + GW - 10, GY + GH); g.lineTo(GX + GW, GY); g.stroke();
              // target line
              var ty = GY + GH - TARGET * GH;
              g.strokeStyle = "#ff5a3c"; g.lineWidth = 4; g.setLineDash([10, 7]);
              g.beginPath(); g.moveTo(GX - 26, ty); g.lineTo(GX + GW + 26, ty); g.stroke(); g.setLineDash([]);
              txt(g, "THE LINE", GX + GW + 62, ty, 15, "#ff5a3c");
              txt(g, holding ? "Pouring…" : (done ? "" : "Hold anywhere to pour"), W / 2, 402, 20, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
              if (level > 1) txt(g, "OVERFLOW!", W / 2, 60, 26, "#d93e22");
            }
          };
        }
      });
