/* ================================================================
   GoofGig — Gig #009 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #009 — Paper Toss
         Flick crumpled paper into the bin. Mind the fan. 5 throws.
         ================================================================ */
      registerGame({
        n: 9, title: "Paper Toss",
        desc: "Five crumpled balls, one bin, one very smug desk fan.",
        hint: '<b>Drag and flick</b> the paper ball into the bin. The fan blows sideways — its strength is shown. <b>5 throws</b>.',
        grades: [
          ["Office Legend", "Five throws of pure destiny. HR is applauding."],
          ["Bin Whisperer", "The bin barely had to move. It never moves. Still."],
          ["Decent Tosser", "More in than out. The carpet forgives you."],
          ["Carpet Decorator", "The floor is now mostly paper with ambition."],
          ["Fan's Best Friend", "The fan won every single round."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdfaf3"; g.beginPath(); g.arc(112, 40, 18, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#cbbfa8"; g.lineWidth = 3; g.stroke();
          g.fillStyle = "#8fa3ad"; g.beginPath(); g.moveTo(196, 34); g.lineTo(238, 34); g.lineTo(232, 78); g.lineTo(202, 78); g.closePath(); g.fill();
        },
        create: function (api) {
          var SX = 108, SY = 318, BIN = { x: 596, y: 300 };
          var throws = 0, baskets = 0, closeSum = 0, ball = null, aiming = null, wind = 0, done = false, restT = 0;
          function newWind() { wind = Math.round((Math.random() * 2 - 1) * 170); }
          newWind();
          function endThrow(made) {
            if (made) { baskets++; sndGood(); } else sndBad();
            throws++;
            if (throws >= 5) {
              done = true;
              var score = clamp(Math.round(baskets * 17 + closeSum), 1, 100);
              api.finish({ score: score, rows: [
                { label: "Baskets", value: baskets / 5 * 100, text: baskets + " / 5", good: baskets >= 3 },
                { label: "Near misses", value: clamp(closeSum / 15 * 100, 0, 100), text: "+" + Math.round(closeSum) + " pts" }
              ] });
            } else { ball = null; newWind(); }
          }
          return {
            status: function () { return done ? "Shift over!" : "Throw " + (throws + 1) + " of 5 · fan " + (wind === 0 ? "calm" : (wind > 0 ? "→ " + wind : "← " + (-wind))); },
            down: function (p) { if (!done && !ball && dist(p.x, p.y, SX, SY) < 70) aiming = { x: p.x, y: p.y }; },
            move: function (p) { if (aiming) { aiming.x = p.x; aiming.y = p.y; } },
            up: function (p) {
              if (!aiming || done) { aiming = null; return; }
              var vx = (p.x - SX) * 5.2, vy = (p.y - SY) * 5.2;
              if (Math.abs(vx) + Math.abs(vy) < 160) { vx = 320; vy = -420; }
              ball = { x: SX, y: SY, vx: clamp(vx, -80, 880), vy: clamp(vy, -980, 200), minD: 1e9 };
              aiming = null; restT = 0; audio();
            },
            draw: function (g, dt) {
              var dark = isDark();
              // office wall + floor
              g.fillStyle = dark ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.5)"; g.fillRect(0, 330, W, 4);
              // fan
              g.save(); g.translate(660, 74);
              g.fillStyle = "#8fa3ad"; g.beginPath(); g.arc(0, 0, 30, 0, Math.PI * 2); g.fill();
              g.fillStyle = dark ? "#3a2a1c" : "#fdf0dc";
              for (var i = 0; i < 3; i++) { g.save(); g.rotate(i * 2.1 + performance.now() / 90); g.beginPath(); g.ellipse(0, -15, 8, 17, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
              g.restore();
              txt(g, wind === 0 ? "fan: calm" : "fan: " + (wind > 0 ? "blowing → " : "blowing ← ") + Math.abs(wind), 660, 122, 14, dark ? "#c4a68d" : "#7a5f4d");
              if (wind !== 0) {
                g.strokeStyle = "rgba(87,183,221,.6)"; g.lineWidth = 3;
                for (var r2 = 0; r2 < 3; r2++) {
                  var yy = 150 + r2 * 26, off = (performance.now() / 6 + r2 * 60) % 120;
                  g.beginPath(); g.moveTo(430 + off, yy); g.lineTo(430 + off + 34, yy); g.stroke();
                }
              }
              // bin
              g.fillStyle = "#8fa3ad";
              g.beginPath(); g.moveTo(BIN.x - 42, BIN.y - 52); g.lineTo(BIN.x + 42, BIN.y - 52); g.lineTo(BIN.x + 32, BIN.y + 46); g.lineTo(BIN.x - 32, BIN.y + 46); g.closePath(); g.fill();
              g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(BIN.x, BIN.y - 52, 42, 9, 0, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2;
              [-24, 0, 24].forEach(function (dx) { g.beginPath(); g.moveTo(BIN.x + dx, BIN.y - 44); g.lineTo(BIN.x + dx * 0.8, BIN.y + 38); g.stroke(); });
              // ball physics
              if (ball) {
                ball.vx += wind * dt; ball.vy += 1150 * dt;
                ball.x += ball.vx * dt; ball.y += ball.vy * dt;
                ball.minD = Math.min(ball.minD, dist(ball.x, ball.y, BIN.x, BIN.y - 52));
                var inBin = ball.vy > 0 && Math.abs(ball.x - BIN.x) < 34 && ball.y > BIN.y - 58 && ball.y < BIN.y - 20;
                if (inBin) { var b2 = ball; ball = null; closeSum += 0; endThrow(true); }
                else if (ball.y > 402 || ball.x > W + 30 || ball.x < -30) {
                  closeSum += clamp(15 - ball.minD / 16, 0, 15);
                  ball = null; endThrow(false);
                }
              }
              // resting / aiming ball
              if (!ball && !done) {
                g.fillStyle = "#fdfaf3"; g.beginPath(); g.arc(SX, SY, 21, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "#cbbfa8"; g.lineWidth = 3; g.stroke();
                g.beginPath(); g.moveTo(SX - 12, SY - 8); g.lineTo(SX + 4, SY + 2); g.lineTo(SX - 4, SY + 13); g.stroke();
                if (aiming) {
                  g.strokeStyle = "rgba(255,90,60,.65)"; g.lineWidth = 3; g.setLineDash([7, 7]);
                  g.beginPath(); g.moveTo(SX, SY); g.lineTo(aiming.x, aiming.y); g.stroke(); g.setLineDash([]);
                  txt(g, "Release to toss!", W / 2, 60, 20, "#ff5a3c");
                } else txt(g, "Grab the ball, drag, and let go", W / 2, 60, 20, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
              }
              if (ball) {
                g.fillStyle = "#fdfaf3"; g.beginPath(); g.arc(ball.x, ball.y, 21, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "#cbbfa8"; g.lineWidth = 3; g.stroke();
              }
            }
          };
        }
      });
