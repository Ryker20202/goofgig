/* ================================================================
   GoofGig — Gig #026 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #026 — Beat Tap
         Eight pulses shrink toward the ring. Tap as each one
         lands exactly on it. Rhythm is a contact sport.
         ================================================================ */
      registerGame({
        n: 26, title: "Beat Tap",
        desc: "Eight pulses shrink toward the ring. Tap each one dead on the beat.",
        hint: 'Pulses shrink toward the <b>ring</b>. <b>Tap</b> the moment a pulse <b>exactly overlaps</b> the ring. Eight beats — your score is your average timing error.',
        grades: [
          ["Human Metronome", "Drummers are taking notes. And possibly revenge."],
          ["Pocket Groove", "Locked in. The beat works for you now."],
          ["Shower Singer Timing", "Mostly music. Occasionally just noise."],
          ["Tambourine Liability", "You hit everything except the beat."],
          ["Beat? Never Met Her", "That was eight tiny car crashes in a trench coat."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#0e9594"; g.lineWidth = 4; g.beginPath(); g.arc(150, 46, 24, 0, Math.PI * 2); g.stroke();
          g.strokeStyle = "#e8a33d"; g.lineWidth = 3; g.beginPath(); g.arc(150, 46, 36, 0, Math.PI * 2); g.stroke();
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(150, 46, 6, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var CX = W / 2, CY = 224, RING = 48, R0 = 150, TRAVEL = 1.05, GAP = 1.0, TOTAL = 8;
          var pulses = [], spawned = 0, judged = 0, errSum = 0, clock = -0.7, started = false, done = false, flash = 0, lastJudge = "";
          function finishRound() {
            done = true;
            var avg = errSum / TOTAL;
            var s = clamp(Math.round(100 - avg * 1.6), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Average error", value: clamp(100 - avg * 1.6, 0, 100), text: Math.round(avg) + " px", good: avg < 16 },
              { label: "Beats hit", value: judged / TOTAL * 100, text: judged + " / " + TOTAL, good: judged >= 6 }
            ] });
          }
          return {
            status: function () {
              if (done) return "The song is over. The crowd has opinions.";
              return started ? "Beat " + Math.min(spawned, TOTAL) + " / " + TOTAL + (lastJudge ? " · " + lastJudge : "") : "Tap to start the track!";
            },
            down: function () {
              if (done) return;
              if (!started) { started = true; audio(); return; }
              var best = null, bestErr = 1e9;
              pulses.forEach(function (pu) {
                if (pu.done) return;
                var e = Math.abs(pu.r - RING);
                if (e < bestErr) { bestErr = e; best = pu; }
              });
              if (best && bestErr < 62) {
                best.done = true; judged++; errSum += bestErr; flash = 0.25;
                lastJudge = bestErr < 10 ? "PERFECT" : (bestErr < 24 ? "Good" : "Sloppy");
                blip(bestErr < 10 ? 990 : 520, .08, "sine", .07);
              }
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                clock += dt;
                if (spawned < TOTAL && clock >= spawned * GAP) { pulses.push({ r: R0, done: false }); spawned++; }
                var allDone = spawned >= TOTAL;
                for (var i = 0; i < pulses.length; i++) {
                  var pu = pulses[i];
                  if (pu.done) continue;
                  pu.r -= (R0 - 8) / TRAVEL * dt;
                  if (pu.r < RING - 30) { pu.done = true; errSum += 58; lastJudge = "Missed"; blip(140, .07, "sawtooth", .05); }
                  if (!pu.done) allDone = false;
                }
                if (allDone && pulses.every(function (p2) { return p2.done; })) { if (errSum / TOTAL < 16) sndGood(); else sndBad(); finishRound(); }
              }
              if (flash > 0) flash -= dt;
              // stage
              g.fillStyle = dark ? "#263238" : "#eef3f6"; rr(g, 90, 60, 540, 330, 18); g.fill();
              // pulses
              pulses.forEach(function (pu) {
                if (pu.done) return;
                g.strokeStyle = Math.abs(pu.r - RING) < 10 ? "#35c4a0" : "#e8a33d";
                g.lineWidth = 5; g.beginPath(); g.arc(CX, CY, pu.r, 0, Math.PI * 2); g.stroke();
              });
              // the ring
              g.strokeStyle = flash > 0 ? "#35c4a0" : (dark ? "#f7e8d8" : "#33241a");
              g.lineWidth = flash > 0 ? 8 : 5;
              g.beginPath(); g.arc(CX, CY, RING, 0, Math.PI * 2); g.stroke();
              g.fillStyle = "#e3352b"; g.beginPath(); g.arc(CX, CY, 9, 0, Math.PI * 2); g.fill();
              if (lastJudge && started && !done) txt(g, lastJudge, CX, CY + 118, 24, lastJudge === "PERFECT" ? "#0e9594" : (dark ? "#f7e8d8" : "#7a5f4d"));
              // beat dots
              for (var d = 0; d < TOTAL; d++) {
                g.fillStyle = d < judged ? "#35c4a0" : (d < spawned ? "#e8a33d" : (dark ? "#546e7a" : "#c3ced4"));
                g.beginPath(); g.arc(CX - 105 + d * 30, 428, 8, 0, Math.PI * 2); g.fill();
              }
              if (!started) txt(g, "Tap anywhere to start!", CX, 44, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
