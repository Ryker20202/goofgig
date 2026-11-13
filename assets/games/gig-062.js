/* ================================================================
   GoofGig — Gig #062 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #062 — Sprinkler Dodge
         The sprinkler sweeps. You weave. Stay dry for 12 seconds.
         ================================================================ */
      registerGame({
        n: 62, title: "Sprinkler Dodge",
        desc: "One rotating sprinkler, one gardener, zero dry socks guaranteed.",
        hint: '<b>Move the pointer</b> to slide the gardener along the lawn. Stay out of the <b>water jet</b> for <b>12 seconds</b> — getting sprayed fills the soaked meter.',
        grades: [
          ["Untouchable", "Twelve seconds next to a sprinkler and bone dry. Witchcraft."],
          ["Lawn Ninja", "You danced between the droplets like a soggy-season pro."],
          ["Mostly Arid", "A light misting. Your dignity remains waterproof."],
          ["Damp Around the Edges", "Technically watered. Like a houseplant with legs."],
          ["Fully Irrigated", "You are now part of the lawn's watering schedule."]
        ],
        thumb: function (g) {
          g.fillStyle = "#8fae6b"; rr(g, 96, 74, 108, 12, 5); g.fill();
          g.fillStyle = "#57b7dd"; g.beginPath(); g.moveTo(150, 70); g.lineTo(118, 16); g.lineTo(132, 14); g.lineTo(158, 62); g.closePath(); g.fill();
          g.fillStyle = "#e8a33d"; g.beginPath(); g.arc(186, 58, 9, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#3f7fbf"; rr(g, 178, 66, 16, 18, 4); g.fill();
        },
        create: function (api) {
          var gx = 120, tx = 120, soaked = 0, timeLeft = 12, started = false, done = false;
          function finishRound() {
            done = true;
            var s = clamp(Math.round(100 - soaked * 0.85), 1, 100);
            if (soaked < 40) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Soaked meter", value: soaked, text: Math.round(soaked) + "% wet" },
              { label: "Time survived", value: clamp((12 - timeLeft) / 12 * 100, 0, 100), text: (12 - timeLeft).toFixed(1) + "s of 12s", good: timeLeft <= 0.05 }
            ] });
          }
          return {
            status: function () { return done ? "Showers over!" : (started ? "Soaked " + Math.round(soaked) + "% · " + timeLeft.toFixed(0) + "s" : "Move to start dodging!"); },
            down: function (p) { started = true; tx = p.x; audio(); },
            move: function (p) { started = true; tx = p.x; },
            up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              var SX = W / 2, SY = 432, GY = 372;
              var ang = Math.sin(now / 620) * 1.05; // jet angle from vertical
              gx += (clamp(tx, 40, W - 40) - gx) * Math.min(1, dt * 12);
              if (started && !done) {
                timeLeft -= dt;
                var gAng = Math.atan2(gx - SX, SY - GY); // angle of gardener from sprinkler
                if (Math.abs(gAng - ang) < 0.17) { soaked = clamp(soaked + dt * 30, 0, 100); if (Math.random() < dt * 6) blip(900 + Math.random() * 300, .03, "sine", .03); }
                if (soaked >= 100 || timeLeft <= 0) finishRound();
              }
              // lawn
              g.fillStyle = dark ? "#2c3a2a" : "#8fae6b"; g.fillRect(0, 396, W, 64);
              g.fillStyle = dark ? "#243020" : "#7c9c58"; g.fillRect(0, 396, W, 8);
              // water jet (fan of droplets along angle)
              var dx = Math.sin(ang), dy = -Math.cos(ang);
              for (var i = 0; i < 42; i++) {
                var t = (i / 42) + (now % 90) / 90 / 42, len = 70 + t * 330;
                var spread = Math.sin(i * 12.9898) * 14 * t;
                var px = SX + dx * len + Math.cos(ang) * spread, py = SY + dy * len + Math.sin(ang) * spread;
                g.fillStyle = "rgba(87,183,221,.75)"; g.beginPath(); g.arc(px, py, 3.4, 0, Math.PI * 2); g.fill();
              }
              g.strokeStyle = "rgba(87,183,221,.35)"; g.lineWidth = 22;
              g.beginPath(); g.moveTo(SX, SY); g.lineTo(SX + dx * 380, SY + dy * 380); g.stroke();
              // sprinkler base
              g.fillStyle = "#5b6770"; rr(g, SX - 16, 420, 32, 16, 5); g.fill();
              g.fillStyle = "#39424a"; g.beginPath(); g.arc(SX, 420, 8, 0, Math.PI * 2); g.fill();
              // gardener
              var jig = started && !done ? Math.sin(now / 60) * 1.5 : 0;
              g.fillStyle = "#f2c185"; g.beginPath(); g.arc(gx, GY - 34 + jig, 12, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#e8a33d"; g.beginPath(); g.ellipse(gx, GY - 46 + jig, 15, 6, 0, Math.PI, Math.PI * 2); g.fill();
              g.fillStyle = soaked > 55 ? "#2b5d8a" : "#3f7fbf"; rr(g, gx - 11, GY - 24 + jig, 22, 28, 6); g.fill();
              g.fillStyle = "#5b4632"; rr(g, gx - 11, GY + 4, 9, 16, 3); g.fill(); rr(g, gx + 3, GY + 4, 9, 16, 3); g.fill();
              // soaked meter
              txt(g, "SOAKED", 92, 428, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 150, 419, 420, 18, 9); g.fill();
              g.fillStyle = soaked > 70 ? "#d93e22" : "#57b7dd"; rr(g, 150, 419, 420 * soaked / 100, 18, 9); g.fill();
              txt(g, started ? timeLeft.toFixed(0) + "s" : "12s", 640, 90, 28, dark ? "#f7e8d8" : "#33241a");
              if (!started) txt(g, "Stay out of the jet!", W / 2, 110, 22, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
