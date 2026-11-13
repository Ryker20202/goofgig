/* ================================================================
   GoofGig — Gig #069 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #069 — Balloon Keep-Up
         Bonk the balloon. The floor is lava (for balloons).
         ================================================================ */
      registerGame({
        n: 69, title: "Balloon Keep-Up",
        desc: "Fifteen seconds between a balloon and the floor. You are the ceiling now.",
        hint: '<b>Tap the balloon</b> to bonk it upward. Keep it off the <b>floor</b> for <b>15 seconds</b>. Low saves score extra.',
        grades: [
          ["Ceiling Impersonator", "The balloon never touched the floor. It barely remembers gravity."],
          ["Bonk Artist", "Textbook keep-up. The balloon has filed for frequent-flyer status."],
          ["Reliable Bonker", "A few close calls, zero floor contact. The crowd gasped twice."],
          ["Panic Paddler", "It survived, but everyone involved needs a sit-down."],
          ["Floor's Plus One", "The balloon met the floor and decided to stay."]
        ],
        thumb: function (g) {
          g.fillStyle = "#e3352b"; g.beginPath(); g.ellipse(150, 34, 20, 25, 0, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#7a4a21"; g.lineWidth = 2; g.beginPath(); g.moveTo(150, 62); g.quadraticCurveTo(142, 74, 150, 86); g.stroke();
          g.fillStyle = "#8fae6b"; rr(g, 100, 86, 100, 5, 2); g.fill();
        },
        create: function (api) {
          var bal = { x: W / 2, y: 150, vy: 40, ph: 0 }, bonks = 0, saves = 0, timeLeft = 15, started = false, done = false, bonkFlash = 0;
          function finishRound(survived) {
            done = true;
            var raw = bonks * 4 + saves * 7;
            var s = survived ? clamp(Math.round(raw), 20, 100) : clamp(Math.round(raw * 0.45), 1, 45);
            if (survived && s >= 70) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Bonks", value: clamp(bonks / 16 * 100, 0, 100), text: bonks + " bonks", good: bonks >= 9 },
              { label: "Near-floor saves", value: clamp(saves / 5 * 100, 0, 100), text: saves + " dramatic saves" }
            ] });
          }
          return {
            status: function () { return done ? "Balloon down!" : (started ? "Bonks " + bonks + " · " + timeLeft.toFixed(0) + "s left" : "Tap the balloon to start!"); },
            down: function (p) {
              started = true; audio();
              if (done) return;
              if (dist(p.x, p.y, bal.x, bal.y) < 62) {
                if (bal.y > 330) saves++;
                bal.vy = -345; bonks++; bonkFlash = 0.15;
                bal.x += (p.x < bal.x ? 1 : -1) * -14;
                blip(500 + bonks * 22, .06, "sine", .06);
              }
            },
            move: function () {},
            up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                bal.vy = clamp(bal.vy + 430 * dt, -360, 300);
                bal.y += bal.vy * dt;
                bal.ph += dt * 2;
                bal.x += Math.sin(bal.ph) * 22 * dt + Math.sin(now / 700) * 12 * dt;
                if (bal.x < 46) bal.x = 46; if (bal.x > W - 46) bal.x = W - 46;
                if (bal.y - 40 < 30) { bal.y = 70; bal.vy = Math.abs(bal.vy) * 0.5; }
                if (bal.y + 42 >= 436) { bal.y = 436 - 42; finishRound(false); }
                else if (timeLeft <= 0) finishRound(true);
              }
              if (bonkFlash > 0) bonkFlash -= dt;
              // room
              g.fillStyle = dark ? "#33302c" : "#f3e2c7"; g.fillRect(0, 0, W, 436);
              g.fillStyle = dark ? "#241d16" : "#c99e5f"; g.fillRect(0, 436, W, 24);
              g.strokeStyle = "rgba(217,62,34,.5)"; g.lineWidth = 3; g.setLineDash([10, 8]);
              g.beginPath(); g.moveTo(0, 436); g.lineTo(W, 436); g.stroke(); g.setLineDash([]);
              // danger zone glow when balloon is low
              if (bal.y > 320 && !done) { g.fillStyle = "rgba(217,62,34," + (0.05 + 0.04 * Math.sin(now / 90)) + ")"; g.fillRect(0, 330, W, 106); }
              // balloon
              var sq = bonkFlash > 0 ? 1.12 : 1;
              g.save(); g.translate(bal.x, bal.y); g.scale(2 - sq, sq);
              var grad = g.createRadialGradient(-12, -16, 6, 0, 0, 46);
              grad.addColorStop(0, "#ff8a7a"); grad.addColorStop(1, "#d92b1d");
              g.fillStyle = grad; g.beginPath(); g.ellipse(0, 0, 38, 44, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "rgba(255,255,255,.5)"; g.beginPath(); g.ellipse(-13, -16, 9, 14, 0.4, 0, Math.PI * 2); g.fill();
              g.restore();
              g.fillStyle = "#b32e18"; g.beginPath(); g.moveTo(bal.x - 5, bal.y + 45); g.lineTo(bal.x + 5, bal.y + 45); g.lineTo(bal.x, bal.y + 53); g.closePath(); g.fill();
              g.strokeStyle = dark ? "#c4a68d" : "#7a5f4d"; g.lineWidth = 2;
              g.beginPath(); g.moveTo(bal.x, bal.y + 53); g.quadraticCurveTo(bal.x + Math.sin(now / 200) * 8, bal.y + 78, bal.x, bal.y + 98); g.stroke();
              txt(g, started ? timeLeft.toFixed(0) + "s" : "15s", 640, 56, 28, dark ? "#f7e8d8" : "#33241a");
              txt(g, "BONKS " + bonks, 76, 56, 20, "#b32e18");
              if (!started) txt(g, "Tap the balloon — never let it land!", W / 2, 116, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
