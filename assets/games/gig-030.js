/* ================================================================
   GoofGig — Gig #030 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #030 — Red Light Brake
         The car rolls toward the crosswalk. The light turns red
         whenever it feels like it. Brake. Precisely.
         ================================================================ */
      registerGame({
        n: 30, title: "Red Light Brake",
        desc: "The light turns red without warning. Stop your bumper on the line.",
        hint: 'Your car rolls toward the <b>crosswalk</b>. When the light turns <b>red</b>, <b>tap to brake</b>. Stop with your bumper as close to the <b>line</b> as possible — overshooting is a ticket.',
        grades: [
          ["Bumper Poet", "Stopped on the line like it was choreography."],
          ["Smooth Brakes", "The passengers didn't even spill their coffee."],
          ["Nervous Stopper", "Legal. Barely. The instructor is sweating."],
          ["Line? What Line?", "You waved at the crosswalk as you passed it."],
          ["Ticket Collector", "The traffic camera got your best angle."]
        ],
        thumb: function (g) {
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(150, 20, 7, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#3a3a3a"; rr(g, 142, 12, 16, 40, 5); g.fill();
          g.fillStyle = "#35c4a0"; rr(g, 100, 56, 56, 22, 9); g.fill();
          g.fillStyle = "#263238"; g.beginPath(); g.arc(112, 80, 7, 0, Math.PI * 2); g.arc(144, 80, 7, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var LINE = 548, carX = 56, v = 168, redAt = 1.3 + Math.random() * 1.9, t = 0;
          var started = false, red = false, braking = false, stopped = false, done = false, err = 0, ranIt = false;
          function finishRound() {
            done = true;
            var front = carX + 96;
            err = Math.abs(front - LINE);
            ranIt = front > LINE + 46;
            var s = ranIt ? clamp(Math.round(24 - (front - LINE) * 0.05), 3, 24)
              : clamp(Math.round(100 - err * 0.95), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Stopping error", value: clamp(100 - err * 0.95, 0, 100), text: Math.round(err) + " px from the line", good: !ranIt && err < 22 },
              { label: "Traffic law", value: ranIt ? 6 : 100, text: ranIt ? "Ran it. Camera saw everything." : "Fully respected", good: !ranIt }
            ] });
          }
          return {
            status: function () {
              if (done) return ranIt ? "You ran the light. Bold. Illegal." : "Stopped " + Math.round(err) + " px from the line.";
              if (!started) return "Tap to start the car!";
              if (stopped) return "Stopped!";
              return red ? "RED! BRAKE!" : "Rolling… watch the light…";
            },
            down: function () {
              if (done) return;
              if (!started) { started = true; audio(); return; }
              if (!braking && !stopped) { braking = true; blip(220, .07, "sine", .06); }
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                t += dt;
                if (!red && t >= redAt) { red = true; blip(980, .1, "square", .06); }
                if (braking && v > 0) v = Math.max(0, v - dt * 300);
                carX += v * dt;
                if (braking && v <= 0) { stopped = true; if (Math.abs(carX + 96 - LINE) < 22) sndGood(); else sndBad(); finishRound(); }
                if (carX > W + 60) { sndBad(); finishRound(); }
              }
              // road
              g.fillStyle = dark ? "#37474f" : "#90a4ae"; g.fillRect(0, 316, W, 118);
              g.fillStyle = dark ? "#263238" : "#78909c"; g.fillRect(0, 300, W, 16);
              g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 4; g.setLineDash([26, 22]);
              g.beginPath(); g.moveTo(0, 398); g.lineTo(W, 398); g.stroke(); g.setLineDash([]);
              // crosswalk + stop line
              g.fillStyle = "rgba(255,255,255,.85)";
              for (var s = 0; s < 5; s++) g.fillRect(LINE + 14, 322 + s * 22, 34, 12);
              g.fillStyle = "#ffd93e"; g.fillRect(LINE - 4, 316, 6, 118);
              // traffic light pole
              g.fillStyle = "#37474f"; g.fillRect(636, 118, 8, 198);
              g.fillStyle = "#263238"; rr(g, 618, 66, 44, 108, 10); g.fill();
              g.fillStyle = red ? "#e3352b" : "#5a2b26"; g.beginPath(); g.arc(640, 92, 13, 0, Math.PI * 2); g.fill();
              if (red) { g.strokeStyle = "rgba(227,53,43,.6)"; g.lineWidth = 3; g.beginPath(); g.arc(640, 92, 20 + Math.sin(now / 90) * 2, 0, Math.PI * 2); g.stroke(); }
              g.fillStyle = red ? "#5a4426" : "#ffb627"; g.beginPath(); g.arc(640, 122, 13, 0, Math.PI * 2); g.fill();
              g.fillStyle = red ? "#1f4d3a" : "#35c4a0"; g.beginPath(); g.arc(640, 152, 13, 0, Math.PI * 2); g.fill();
              // car
              var cy = 336, bob = (!stopped && started && !done) ? Math.sin(now / 60) * 1.6 : 0;
              g.save(); g.translate(carX, cy + bob);
              g.fillStyle = "#35c4a0"; rr(g, 0, 8, 96, 30, 10); g.fill();
              g.fillStyle = "#2aa583"; rr(g, 18, -12, 52, 26, 9); g.fill();
              g.fillStyle = "#bfe3f2"; rr(g, 25, -8, 18, 17, 4); g.fill(); rr(g, 47, -8, 17, 17, 4); g.fill();
              g.fillStyle = braking ? "#ffdd33" : "#fff3b0"; g.beginPath(); g.arc(94, 22, 5, 0, Math.PI * 2); g.fill();
              g.fillStyle = braking ? "#ff2222" : "#a33"; g.beginPath(); g.arc(2, 22, 5, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#263238";
              g.beginPath(); g.arc(22, 40, 11, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(74, 40, 11, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#90a4ae";
              g.beginPath(); g.arc(22, 40, 5, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(74, 40, 5, 0, Math.PI * 2); g.fill();
              g.restore();
              // distance readout
              var dFront = Math.max(0, Math.round(LINE - (carX + 96)));
              if (started && !done) txt(g, braking ? "BRAKING…" : ("Line in " + dFront + " px"), 110, 70, 20, red ? "#d93e22" : (dark ? "#f7e8d8" : "#55483a"));
              if (red && !done && !braking) txt(g, "TAP TO BRAKE!", W / 2, 200, 30, "#d93e22");
              if (!started) txt(g, "Tap to start the car!", W / 2, 120, 22, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
