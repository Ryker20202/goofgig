/* ================================================================
   GoofGig — Gig #003 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #003 — Stand the Egg
         Hold the egg and lean against the wobble. Survive 20 seconds.
         ================================================================ */
      registerGame({
        n: 3, title: "Stand the Egg",
        desc: "One egg, zero flat sides. Keep it upright for 20 seconds.",
        hint: '<b>Press, hold and drag sideways</b> to lean against the wobble. Keep the egg upright for <b>20 seconds</b>.',
        grades: [
          ["Egg Whisperer", "Twenty seconds of pure balance. Breakfast royalty."],
          ["Shell Stabilizer", "That egg trusts you with its life."],
          ["Wobble Rider", "It leaned, it swayed, it survived. Mostly."],
          ["Scramble Candidate", "The egg has seen things. Mostly the floor."],
          ["Omelette Origin Story", "It fell so fast it set a record somewhere."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdf6ec"; g.beginPath(); g.ellipse(150, 48, 26, 34, 0, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#d9c6a5"; g.lineWidth = 3; g.stroke();
          g.fillStyle = "#a9743f"; rr(g, 96, 78, 108, 8, 4); g.fill();
        },
        create: function (api) {
          var ang = 0, vel = 0, time = 0, started = false, holding = false, done = false, px = W / 2;
          var GOAL = 20;
          function finishRound() {
            done = true;
            var score = clamp(Math.round(time / GOAL * 100), 2, 100);
            api.finish({ score: score, rows: [
              { label: "Time upright", value: score, text: time.toFixed(1) + "s / 20s", good: score >= 85 }
            ] });
          }
          return {
            status: function () { return done ? "Egg down!" : "Upright for " + time.toFixed(1) + "s / 20s"; },
            down: function (p) { holding = true; started = true; px = p.x; audio(); },
            move: function (p) { px = p.x; },
            up: function () { holding = false; },
            draw: function (g, dt, t) {
              var dark = isDark();
              if (started && !done) {
                time += dt;
                var sway = Math.sin(time * 1.9) * 0.55 + Math.sin(time * 3.3 + 1) * 0.3;
                vel += sway * dt * 0.9;
                if (holding) vel += ((px - W / 2) / (W / 2)) * -2.4 * dt;
                vel *= Math.pow(0.12, dt); ang += vel * dt * 3.2;
                if (Math.abs(ang) > 0.62) { ang = clamp(ang, -1.2, 1.2); sndBad(); finishRound(); }
                else if (time >= GOAL) { sndGood(); finishRound(); }
              }
              // table
              g.fillStyle = "#b9834e"; rr(g, 60, 356, 600, 40, 12); g.fill();
              g.fillStyle = "rgba(90,55,15,.3)"; g.fillRect(80, 372, 560, 4);
              // balance zone
              g.strokeStyle = "rgba(14,149,148,.55)"; g.lineWidth = 3; g.setLineDash([8, 7]);
              g.beginPath(); g.arc(W / 2, 356, 130, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); g.setLineDash([]);
              txt(g, "WOBBLE ZONE", W / 2, 196, 15, dark ? "#35c4c3" : "#0e9594");
              // egg
              g.save(); g.translate(W / 2, 356); g.rotate(ang);
              var grad = g.createRadialGradient(-16, -92, 10, 0, -70, 90);
              grad.addColorStop(0, "#fffdf6"); grad.addColorStop(1, "#efdfc2");
              g.fillStyle = grad;
              g.beginPath(); g.ellipse(0, -62, 52, 66, 0, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#d9c6a5"; g.lineWidth = 3; g.stroke();
              g.fillStyle = "rgba(217,62,34,.85)";
              g.beginPath(); g.arc(-14, -78, 5, 0, Math.PI * 2); g.arc(16, -66, 5, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "rgba(51,36,26,.8)"; g.lineWidth = 3;
              g.beginPath(); g.arc(1, -52, 10, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
              g.restore();
              // timer bar
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 160, 402, 400, 14, 7); g.fill();
              g.fillStyle = "#0e9594"; rr(g, 160, 402, 400 * clamp(time / GOAL, 0, 1), 14, 7); g.fill();
              if (!started) txt(g, "Hold the egg to start the clock", W / 2, 60, 21, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
