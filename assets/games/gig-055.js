/* ================================================================
   GoofGig — Gig #055 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #055 — Open the Jar
         Drag in circles around the lid. Three full turns of
         twisting pops it open.
         ================================================================ */
      registerGame({
        n: 55, title: "Open the Jar",
        desc: "One stubborn lid. Three full twists. Pickles are watching.",
        hint: '<b>Drag in circles</b> around the jar lid to twist it. <b>3 full turns</b> pops it open — bigger circles twist faster.',
        grades: [
          ["Lid Liberator", "POP. Three turns, zero grunting. Kitchen legend."],
          ["Twist Professional", "That lid never had a chance. Or a prayer."],
          ["Jar Opener (Human)", "Opened it the normal way: eventually."],
          ["Grip Struggler", "The jar is telling this story at parties now."],
          ["Pickle's Bodyguard", "The pickles remain safe. From everyone. Forever."]
        ],
        thumb: function (g) {
          g.fillStyle = "rgba(160,220,235,.55)"; rr(g, 124, 30, 52, 56, 8); g.fill();
          g.fillStyle = "#e3352b"; rr(g, 120, 14, 60, 20, 6); g.fill();
          g.fillStyle = "#7bc96f"; g.beginPath(); g.ellipse(140, 58, 7, 13, 0.4, 0, Math.PI * 2); g.ellipse(160, 62, 7, 13, -0.3, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var C = { x: W / 2, y: 140 };
          var total = 0, NEED = Math.PI * 2 * 3;
          var holding = false, lastAng = 0, hasAng = false;
          var started = false, done = false, time = 0, popT = 0;
          function finishRound() {
            done = true; popT = 0.6;
            var s = clamp(Math.round(104 - time * 2.6), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Twist time", value: clamp(time / 14 * 100, 0, 100), text: time.toFixed(1) + "s", good: time < 8 },
              { label: "Turns twisted", value: 100, text: "3 / 3" }
            ] });
          }
          return {
            status: function () { return done ? "POP! Open!" : "Twist: " + (total / (Math.PI * 2)).toFixed(1) + " / 3 turns"; },
            down: function (p) {
              if (done) return;
              started = true; holding = true; audio();
              lastAng = Math.atan2(p.y - C.y, p.x - C.x); hasAng = true;
            },
            move: function (p) {
              if (!holding || done) return;
              var a = Math.atan2(p.y - C.y, p.x - C.x);
              if (hasAng) {
                var d = a - lastAng;
                while (d > Math.PI) d -= Math.PI * 2;
                while (d < -Math.PI) d += Math.PI * 2;
                total += Math.abs(d);
                if (total >= NEED) { sndGood(); finishRound(); }
              }
              lastAng = a; hasAng = true;
            },
            up: function () { holding = false; hasAng = false; },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) time += dt;
              if (popT > 0) popT -= dt;
              var lift = done ? clamp((0.6 - popT) * 60, 0, 34) : 0;
              // jar body
              g.fillStyle = "rgba(160,220,235,.4)"; rr(g, W / 2 - 96, 168, 192, 226, 20); g.fill();
              g.strokeStyle = dark ? "#7fb6cc" : "#5d97ad"; g.lineWidth = 3; rr(g, W / 2 - 96, 168, 192, 226, 20); g.stroke();
              // pickles inside
              g.fillStyle = "#5da24a";
              [[-48, 250, 0.3], [8, 268, -0.2], [52, 240, 0.5], [-16, 320, 0.1], [38, 330, -0.4]].forEach(function (pk) {
                g.beginPath(); g.ellipse(W / 2 + pk[0], pk[1], 17, 34, pk[2], 0, Math.PI * 2); g.fill();
              });
              g.fillStyle = "rgba(255,255,255,.3)"; rr(g, W / 2 - 78, 186, 22, 190, 10); g.fill();
              // lid (rises when popped)
              g.save(); g.translate(0, -lift);
              if (done) { g.translate(C.x, C.y); g.rotate(-0.16); g.translate(-C.x, -C.y); }
              g.fillStyle = "#e3352b"; rr(g, C.x - 84, C.y - 24, 168, 48, 12); g.fill();
              g.fillStyle = "rgba(255,255,255,.3)"; rr(g, C.x - 84, C.y - 24, 168, 14, 12); g.fill();
              // grip ridges
              g.fillStyle = "rgba(120,10,10,.4)";
              for (var i = -3; i <= 3; i++) g.fillRect(C.x + i * 22 - 3, C.y - 24, 6, 48);
              // rotation marker dot riding the lid
              var ma = total % (Math.PI * 2);
              g.fillStyle = "#ffd83d";
              g.beginPath(); g.arc(C.x + Math.cos(ma) * 60, C.y + Math.sin(ma) * 15, 7, 0, Math.PI * 2); g.fill();
              g.restore();
              // turn progress ring
              g.strokeStyle = dark ? "#4a3423" : "#f0dcc4"; g.lineWidth = 9;
              g.beginPath(); g.arc(C.x, C.y, 108, 0, Math.PI * 2); g.stroke();
              g.strokeStyle = "#35c4a0";
              g.beginPath(); g.arc(C.x, C.y, 108, -Math.PI / 2, -Math.PI / 2 + (total / NEED) * Math.PI * 2); g.stroke();
              txt(g, (total / (Math.PI * 2)).toFixed(1) + " turns", C.x, 428, 18, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Drag in circles around the lid!", W / 2, 48, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
