/* ================================================================
   GoofGig — Gig #070 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #070 — Paddle Bounce
         Twelve bounces off the paddle. One miss ends the dream.
         ================================================================ */
      registerGame({
        n: 70, title: "Paddle Bounce",
        desc: "Just you, a paddle, and a ball with commitment issues.",
        hint: '<b>Move the pointer</b> to slide the paddle. Bounce the ball <b>12 times</b>. Let it past you and the round ends with whatever you earned.',
        grades: [
          ["Wall With Hands", "Twelve bounces, zero doubt. The ball has given up escaping."],
          ["Paddle Royalty", "Every return was a statement. Mostly 'nope'."],
          ["Reliable Returner", "A full dozen, achieved with only minor sweating."],
          ["Net Enthusiast", "Some fine bounces before the ball found the exit."],
          ["Open Gate Policy", "The ball visited briefly, then left forever."]
        ],
        thumb: function (g) {
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(150, 26, 11, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#3f7fbf"; rr(g, 106, 62, 88, 12, 6); g.fill();
          g.strokeStyle = "#7a4a21"; g.lineWidth = 3; g.beginPath(); g.moveTo(150, 74); g.lineTo(150, 88); g.stroke();
        },
        create: function (api) {
          var px = W / 2, tx = W / 2, ball = { x: W / 2, y: 120, vx: 150, vy: 60 }, bounces = 0, started = false, done = false;
          var PADY = 418, PADW = 118;
          function finishRound(full) {
            done = true;
            var s = full ? 100 : clamp(Math.round(bounces / 12 * 88), 1, 88);
            if (full) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Bounces", value: bounces / 12 * 100, text: bounces + " / 12", good: bounces >= 12 },
              { label: "Best angle control", value: clamp(100 - Math.abs(ball.vx) / 3, 4, 100), text: Math.abs(ball.vx) > 200 ? "Wild and spicy" : "Calm and placed" }
            ] });
          }
          return {
            status: function () { return done ? "Rally over!" : (started ? "Bounces " + bounces + " / 12" : "Move to start the rally!"); },
            down: function (p) { started = true; tx = p.x; audio(); },
            move: function (p) { started = true; tx = p.x; },
            up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              px += (clamp(tx, PADW / 2, W - PADW / 2) - px) * Math.min(1, dt * 16);
              if (started && !done) {
                ball.x += ball.vx * dt; ball.y += ball.vy * dt;
                ball.vy = clamp(ball.vy + 130 * dt, -430, 430);
                if (ball.x < 16) { ball.x = 16; ball.vx = Math.abs(ball.vx); }
                if (ball.x > W - 16) { ball.x = W - 16; ball.vx = -Math.abs(ball.vx); }
                if (ball.y < 16) { ball.y = 16; ball.vy = Math.abs(ball.vy); }
                if (ball.vy > 0 && ball.y >= PADY - 12 && ball.y <= PADY + 8 && Math.abs(ball.x - px) < PADW / 2 + 10) {
                  var off = clamp((ball.x - px) / (PADW / 2), -1, 1);
                  ball.vy = -Math.max(300, Math.abs(ball.vy) * 1.02);
                  ball.vx = clamp(ball.vx + off * 190, -330, 330);
                  ball.y = PADY - 13;
                  bounces++; blip(420 + bounces * 30, .05, "square", .05);
                  if (bounces >= 12) finishRound(true);
                }
                if (ball.y > 458) finishRound(false);
              }
              // court
              g.strokeStyle = dark ? "rgba(247,232,216,.16)" : "rgba(93,58,22,.14)"; g.lineWidth = 3;
              rr(g, 14, 14, W - 28, 432, 10); g.stroke();
              g.setLineDash([8, 10]); g.beginPath(); g.moveTo(14, 226); g.lineTo(W - 14, 226); g.stroke(); g.setLineDash([]);
              // ball trail
              g.fillStyle = "rgba(227,53,43,.25)"; g.beginPath(); g.arc(ball.x - ball.vx * 0.05, ball.y - ball.vy * 0.05, 8, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#e3352b"; g.beginPath(); g.arc(ball.x, ball.y, 12, 0, Math.PI * 2); g.fill();
              g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.arc(ball.x - 4, ball.y - 4, 4, 0, Math.PI * 2); g.fill();
              // paddle
              g.fillStyle = "#3f7fbf"; rr(g, px - PADW / 2, PADY, PADW, 14, 7); g.fill();
              g.fillStyle = "#2b5d8a"; rr(g, px - PADW / 2, PADY, PADW, 6, 3); g.fill();
              txt(g, "BOUNCES " + bounces + " / 12", W / 2, 52, 22, dark ? "#f7e8d8" : "#33241a");
              if (!started) txt(g, "Slide under the ball. Twelve times.", W / 2, 300, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
