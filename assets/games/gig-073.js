/* ================================================================
   GoofGig — Gig #073 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #073 — Walk the Dog
         The dog has plans. Counter-pull the leash, hold the line.
         ================================================================ */
      registerGame({
        n: 73, title: "Walk the Dog",
        desc: "He saw a squirrel. He IS the squirrel now. Hold the center line.",
        hint: '<b>Drag left and right</b> to counter-pull the leash. The dog wanders on his own — keep him near the <b>dashed center line</b> for <b>15 seconds</b>.',
        grades: [
          ["Dog Whisperer", "Fifteen seconds of perfect line discipline. The dog is taking notes."],
          ["Certified Walker", "Centered, calm, only mildly dragged. Professional work."],
          ["Mostly In Charge", "The line won most of the arguments. Most."],
          ["Negotiating Partner", "You and the dog have a democracy. He has more votes."],
          ["Being Walked", "Let's be honest about who held the leash here."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#b85f14"; g.lineWidth = 3; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(150, 4); g.lineTo(150, 88); g.stroke(); g.setLineDash([]);
          g.fillStyle = "#c9853d"; g.beginPath(); g.ellipse(172, 52, 20, 12, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.arc(192, 44, 9, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#7a4a21"; g.lineWidth = 2; g.beginPath(); g.moveTo(120, 20); g.lineTo(186, 42); g.stroke();
          g.fillStyle = "#f2c185"; g.beginPath(); g.arc(118, 18, 7, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var dogX = W / 2, dogVX = 0, handX = W / 2, tx = W / 2, holding = false;
          var wanderVX = 0, wanderT = 0, centeredT = 0, timeLeft = 15, started = false, done = false;
          var CX = W / 2, DOGY = 318;
          function finishRound() {
            done = true;
            var pct = centeredT / 15 * 100;
            var s = clamp(Math.round(pct * 1.04), 1, 100);
            if (s >= 75) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Time on the line", value: pct, text: centeredT.toFixed(1) + "s of 15s centered", good: pct >= 65 },
              { label: "Dog's opinion", value: clamp(100 - pct * 0.6, 4, 100), text: pct >= 65 ? "Respectful. Suspiciously calm." : "He regrets nothing." }
            ] });
          }
          return {
            status: function () { return done ? "Walk over!" : (started ? "Centered " + Math.round(centeredT / 15 * 100) + "% · " + timeLeft.toFixed(0) + "s" : "Press and drag to hold the leash!"); },
            down: function (p) { started = true; holding = true; tx = p.x; audio(); },
            move: function (p) { tx = p.x; },
            up: function () { holding = false; },
            draw: function (g, dt, now) {
              var dark = isDark();
              handX += (clamp(tx, 40, W - 40) - handX) * Math.min(1, dt * 14);
              if (started && !done) {
                timeLeft -= dt;
                wanderT -= dt;
                if (wanderT <= 0) { wanderT = 0.6 + Math.random() * 0.7; wanderVX = (Math.random() * 2 - 1) * 175; if (Math.random() < 0.22) wanderVX *= 1.9; }
                // dog's own wander + spring toward leash hand while held
                dogVX += wanderVX * dt * 2.4;
                if (holding) dogVX += clamp(handX - dogX, -260, 260) * dt * 6.5;
                dogVX *= Math.pow(0.12, dt); // damping
                dogX += dogVX * dt;
                if (dogX < 56) { dogX = 56; dogVX = Math.abs(dogVX) * 0.6; }
                if (dogX > W - 56) { dogX = W - 56; dogVX = -Math.abs(dogVX) * 0.6; }
                if (Math.abs(dogX - CX) < 62) centeredT += dt;
                if (timeLeft <= 0) finishRound();
              }
              // park path
              g.fillStyle = dark ? "#2c3a2a" : "#8fae6b"; g.fillRect(0, 0, W, 460);
              g.fillStyle = dark ? "#4a3b28" : "#d9b98a"; g.fillRect(CX - 110, 0, 220, 460);
              // center zone + dashed line
              g.fillStyle = "rgba(53,196,160,.18)"; g.fillRect(CX - 62, 0, 124, 460);
              g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 4; g.setLineDash([16, 14]);
              g.beginPath(); g.moveTo(CX, 0); g.lineTo(CX, 460); g.stroke(); g.setLineDash([]);
              // trees
              g.fillStyle = dark ? "#22331f" : "#5d8a54";
              [[60, 90], [648, 130], [84, 330], [636, 330]].forEach(function (t) {
                g.beginPath(); g.arc(t[0], t[1], 34, 0, Math.PI * 2); g.fill();
              });
              // leash: hand (top) to dog collar
              var handY = 92;
              g.strokeStyle = "#7a4a21"; g.lineWidth = 3;
              g.beginPath(); g.moveTo(handX, handY); g.quadraticCurveTo((handX + dogX) / 2, (handY + DOGY) / 2 + 26, dogX + 16, DOGY - 12); g.stroke();
              // hand
              g.fillStyle = "#f2c185"; g.beginPath(); g.arc(handX, handY, 13, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#3f7fbf"; rr(g, handX - 10, handY - 30, 20, 20, 5); g.fill();
              // dog (faces movement direction)
              var dir = dogVX >= 0 ? 1 : -1, trot = started && !done ? Math.sin(now / 55) * 3 : 0;
              g.save(); g.translate(dogX, DOGY); g.scale(dir, 1);
              g.fillStyle = "#c9853d"; g.beginPath(); g.ellipse(0, 0, 40, 21, 0, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(38, -14, 16, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#a86a28"; g.beginPath(); g.ellipse(30, -26, 7, 11, 0.5, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#33241a"; g.beginPath(); g.arc(52, -14, 3.6, 0, Math.PI * 2); g.arc(40, -18, 2.6, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#c9853d"; g.lineWidth = 6; g.beginPath(); g.moveTo(-38, -6); g.quadraticCurveTo(-52, -16 + trot, -56, -4 + trot * 1.6); g.stroke();
              g.strokeStyle = "#a86a28"; g.lineWidth = 6;
              g.beginPath(); g.moveTo(-24, 16); g.lineTo(-24 + trot, 34); g.stroke();
              g.beginPath(); g.moveTo(22, 16); g.lineTo(22 - trot, 34); g.stroke();
              g.fillStyle = "#d93e22"; rr(g, 22, -18, 16, 8, 3); g.fill(); // collar
              g.restore();
              // centered indicator
              var onLine = Math.abs(dogX - CX) < 62;
              txt(g, onLine ? "ON THE LINE ✓" : "OFF THE LINE!", CX, 442, 19, onLine ? "#1d7a4f" : "#d93e22");
              txt(g, started ? timeLeft.toFixed(0) + "s" : "15s", 640, 52, 28, dark ? "#f7e8d8" : "#33241a");
              if (!started) txt(g, "Hold and drag — counter his every idea!", CX, 180, 21, dark ? "rgba(247,232,216,.9)" : "rgba(51,36,26,.8)");
            }
          };
        }
      });
