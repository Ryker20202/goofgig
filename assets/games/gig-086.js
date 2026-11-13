/* ================================================================
   GoofGig — Gig #086 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #086 — Marble Gates
         Drag to tilt the board. Roll the marble through all
         3 gates before the 20 seconds run out.
         ================================================================ */
      registerGame({
        n: 86, title: "Marble Gates",
        desc: "Tilt the board, thread three gates, beat the clock.",
        hint: '<b>Press and drag</b> to tilt the board — the marble rolls toward your pointer. Guide it through all <b>3 gates</b> in <b>20 seconds</b>.',
        grades: [
          ["Marble Maestro", "Three gates, time to spare. Gravity works for you now."],
          ["Smooth Roller", "Every gate threaded. The marble respects the tilt."],
          ["Gate Negotiator", "Through, eventually. The walls have dents and stories."],
          ["Wall Enthusiast", "The marble has inspected every surface except the gaps."],
          ["Gravity's Toy", "The marble went where it wanted. It was not the gates."]
        ],
        thumb: function (g) {
          g.fillStyle = "#d9c6a5"; rr(g, 96, 10, 108, 72, 6); g.fill();
          g.fillStyle = "#8a5a28"; g.fillRect(96, 32, 62, 7); g.fillRect(190, 56, 110, 7); g.fillRect(96, 56, 50, 7);
          var grd = g.createRadialGradient(128, 44, 2, 132, 48, 13);
          grd.addColorStop(0, "#fdfdf8"); grd.addColorStop(1, "#2471a3");
          g.fillStyle = grd; g.beginPath(); g.arc(132, 48, 11, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var done = false, started = false, timeLeft = 20;
          var m = { x: W / 2, y: 104, vx: 0, vy: 0 };
          var tilt = { x: 0, y: 0 }, hasPointer = false;
          var GATES = [
            { y: 168, cx: 190, hw: 48, passed: false },
            { y: 262, cx: 524, hw: 48, passed: false },
            { y: 356, cx: 308, hw: 48, passed: false }
          ];
          var TOP = 62, BOT = 446, LFT = 24, RGT = W - 24, RAD = 13;
          function gatesDone() { return GATES.filter(function (gt) { return gt.passed; }).length; }
          function finishRound() {
            done = true;
            var n = gatesDone();
            var bonus = n === 3 ? clamp(Math.round(timeLeft), 0, 16) : 0;
            var s = clamp(n * 28 + bonus, 0, 100);
            if (n === 3) sndGood(); else if (n > 0) blip(500, .08, "sine", .06); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Gates cleared", value: n / 3 * 100, text: n + " / 3", good: n === 3 },
              { label: "Time remaining", value: clamp(timeLeft / 20 * 100, 0, 100), text: Math.max(0, timeLeft).toFixed(1) + " s" }
            ] });
          }
          function setTilt(p) {
            hasPointer = true;
            tilt.x = clamp((p.x - W / 2) / (W / 2), -1, 1);
            tilt.y = clamp((p.y - 230) / 230, -1, 1);
          }
          return {
            status: function () {
              if (done) return "Marble judged!";
              if (!started) return "Press & drag to start tilting!";
              return "Gates " + gatesDone() + " / 3 · " + Math.max(0, timeLeft).toFixed(1) + "s left";
            },
            down: function (p) { if (done) return; audio(); started = true; setTilt(p); },
            move: function (p) { if (done) return; if (started) setTilt(p); },
            up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                // physics
                m.vx += tilt.x * 980 * dt;
                m.vy += tilt.y * 980 * dt;
                var damp = Math.max(0, 1 - 1.5 * dt);
                m.vx *= damp; m.vy *= damp;
                m.x += m.vx * dt;
                m.y += m.vy * dt;
                // outer walls
                if (m.x < LFT + RAD) { m.x = LFT + RAD; m.vx = Math.abs(m.vx) * 0.55; }
                if (m.x > RGT - RAD) { m.x = RGT - RAD; m.vx = -Math.abs(m.vx) * 0.55; }
                if (m.y < TOP + RAD) { m.y = TOP + RAD; m.vy = Math.abs(m.vy) * 0.55; }
                if (m.y > BOT - RAD) { m.y = BOT - RAD; m.vy = -Math.abs(m.vy) * 0.55; }
                // gates: solid outside the gap, passable inside
                GATES.forEach(function (gt) {
                  var inGap = Math.abs(m.x - gt.cx) < gt.hw - 4;
                  if (!inGap && Math.abs(m.y - gt.y) < RAD + 3) {
                    if (m.vy > 0 && m.y < gt.y) { m.y = gt.y - RAD - 3; m.vy = -Math.abs(m.vy) * 0.5; }
                    else if (m.vy < 0 && m.y > gt.y) { m.y = gt.y + RAD + 3; m.vy = Math.abs(m.vy) * 0.5; }
                    else { m.y = m.y < gt.y ? gt.y - RAD - 3 : gt.y + RAD + 3; m.vy *= -0.5; }
                  }
                  if (!gt.passed && inGap && Math.abs(m.y - gt.y) < 8) {
                    gt.passed = true;
                    blip(760, .1, "sine", .07);
                    if (gatesDone() === 3) { finishRound(); }
                  }
                });
                if (timeLeft <= 0 && !done) { timeLeft = 0; finishRound(); }
              }
              // board
              g.fillStyle = dark ? "#4a3423" : "#e8d3a8"; rr(g, LFT - 8, TOP - 8, (RGT - LFT) + 16, (BOT - TOP) + 16, 10); g.fill();
              g.fillStyle = dark ? "#5d4023" : "#f3e2c7"; rr(g, LFT, TOP, RGT - LFT, BOT - TOP, 6); g.fill();
              // tilt hint arrows
              if (hasPointer && !done) {
                g.strokeStyle = "rgba(53,196,160,.5)"; g.lineWidth = 3;
                g.beginPath(); g.moveTo(W / 2, 240); g.lineTo(W / 2 + tilt.x * 42, 240 + tilt.y * 42); g.stroke();
              }
              // gates
              GATES.forEach(function (gt, i) {
                g.fillStyle = gt.passed ? "rgba(53,196,160,.75)" : "#c0392b";
                g.fillRect(LFT, gt.y - 4, (gt.cx - gt.hw) - LFT, 8);
                g.fillRect(gt.cx + gt.hw, gt.y - 4, RGT - (gt.cx + gt.hw), 8);
                g.fillStyle = gt.passed ? "#35c4a0" : "#e88ca0";
                g.beginPath(); g.moveTo(gt.cx - 10, gt.y - 12); g.lineTo(gt.cx + 10, gt.y - 12); g.lineTo(gt.cx, gt.y - 2); g.closePath(); g.fill();
                txt(g, "GATE " + (i + 1) + (gt.passed ? " ✓" : ""), gt.cx, gt.y + 26, 13, gt.passed ? "#0e9594" : (dark ? "#c4a68d" : "#7a5f4d"));
              });
              // start pad
              g.strokeStyle = dark ? "rgba(247,232,216,.35)" : "rgba(93,58,22,.3)"; g.lineWidth = 2; g.setLineDash([5, 6]);
              g.beginPath(); g.arc(W / 2, 104, 24, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
              // marble
              var grd = g.createRadialGradient(m.x - 4, m.y - 5, 2, m.x, m.y, RAD + 2);
              grd.addColorStop(0, "#fdfdf8"); grd.addColorStop(0.45, "#7fb6cc"); grd.addColorStop(1, "#1d5f8a");
              g.fillStyle = grd; g.beginPath(); g.arc(m.x, m.y, RAD, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "rgba(20,50,80,.5)"; g.lineWidth = 2; g.beginPath(); g.arc(m.x, m.y, RAD, 0, Math.PI * 2); g.stroke();
              // HUD: timer bar
              txt(g, "TIME", 44, 40, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 96, 30, 380, 16, 8); g.fill();
              g.fillStyle = timeLeft < 5 ? "#d93e22" : "#35c4a0"; rr(g, 96, 30, Math.max(8, 380 * clamp(timeLeft / 20, 0, 1)), 16, 8); g.fill();
              txt(g, "Gates " + gatesDone() + " / 3", 580, 42, 16, dark ? "#f7e8d8" : "#33241a");
              if (!started && !done) txt(g, "Drag anywhere — the board tilts toward your finger!", W / 2, 452, 16, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
