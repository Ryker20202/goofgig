/* ================================================================
   GoofGig — Gig #063 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #063 — Umbrella Duty
         Gusty rain slants sideways. Keep the kid dry for 15s.
         ================================================================ */
      registerGame({
        n: 63, title: "Umbrella Duty",
        desc: "The rain has a side hustle: blowing sideways. Good luck.",
        hint: '<b>Move the pointer</b> to slide the umbrella. The rain <b>slants with the wind</b> — cover the kid, not where the rain starts, where it lands. <b>15 seconds.</b>',
        grades: [
          ["Human Roof", "Not one drop got through. The kid may legally be a duck now. Wait, no — dry."],
          ["Storm Parent", "Textbook umbrella work. The wind is furious and empty-handed."],
          ["Reliable Cover", "A few drops snuck in, but the kid's mostly a dry zone."],
          ["Leaky Guardian", "The umbrella was present. Morally supportive, physically porous."],
          ["Rain's Best Friend", "The kid got rained on with extra steps. Yours."]
        ],
        thumb: function (g) {
          g.fillStyle = "#d93e22"; g.beginPath(); g.ellipse(150, 34, 46, 20, 0, Math.PI, Math.PI * 2); g.closePath(); g.fill();
          g.strokeStyle = "#7a4a21"; g.lineWidth = 3; g.beginPath(); g.moveTo(150, 34); g.lineTo(150, 66); g.stroke();
          g.fillStyle = "#57b7dd"; g.beginPath(); g.ellipse(118, 12, 3, 6, 0.5, 0, Math.PI * 2); g.ellipse(182, 8, 3, 6, 0.5, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#f2c185"; g.beginPath(); g.arc(150, 74, 8, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var ux = W / 2, tx = W / 2, drops = [], dry = 100, timeLeft = 15, started = false, done = false, spawnT = 0;
          var KID = { x: W / 2, headY: 330 };
          function windAt(now) { return Math.sin(now / 1400) * 0.9 + Math.sin(now / 470) * 0.35; }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(dry), 1, 100);
            if (s >= 80) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Kid dryness", value: dry, text: Math.round(dry) + "% dry", good: dry >= 75 },
              { label: "Rain endured", value: clamp((15 - timeLeft) / 15 * 100, 0, 100), text: (15 - timeLeft).toFixed(1) + "s of 15s" }
            ] });
          }
          return {
            status: function () { return done ? "Storm over!" : (started ? "Dryness " + Math.round(dry) + "% · " + timeLeft.toFixed(0) + "s" : "Move to raise the umbrella!"); },
            down: function (p) { started = true; tx = p.x; audio(); },
            move: function (p) { started = true; tx = p.x; },
            up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              var wind = windAt(now);
              ux += (clamp(tx, 90, W - 90) - ux) * Math.min(1, dt * 10);
              if (started && !done) {
                timeLeft -= dt;
                spawnT -= dt;
                if (spawnT <= 0) { spawnT = 0.07; drops.push({ x: 20 + Math.random() * (W - 40) - wind * 60, y: -10, blocked: false, checked: false }); }
                if (timeLeft <= 0 || dry <= 0) finishRound();
              }
              // ground
              g.fillStyle = dark ? "#2c3a2a" : "#8fae6b"; g.fillRect(0, 428, W, 32);
              // wind hint arrows
              g.strokeStyle = dark ? "rgba(247,232,216,.35)" : "rgba(93,58,22,.3)"; g.lineWidth = 3;
              for (var a = 0; a < 3; a++) {
                var ay = 66 + a * 30, off = (now / 8 + a * 160) % 220 - 60, ax = W / 2 + off * Math.sign(wind || 1);
                g.beginPath(); g.moveTo(ax - 16 * Math.sign(wind || 1), ay); g.lineTo(ax + 16 * Math.sign(wind || 1), ay); g.stroke();
              }
              // rain
              for (var i = drops.length - 1; i >= 0; i--) {
                var d = drops[i];
                if (started && !done) { d.y += 330 * dt; d.x += wind * 130 * dt; }
                if (!d.checked && d.y >= 214) {
                  d.checked = true;
                  d.blocked = Math.abs(d.x - ux) < 96;
                  if (d.blocked) { drops.splice(i, 1); continue; }
                }
                if (d.y >= KID.headY - 14 && Math.abs(d.x - KID.x) < 27) {
                  dry = clamp(dry - 2.4, 0, 100); drops.splice(i, 1);
                  if (Math.random() < 0.3) blip(500, .04, "sine", .04);
                  continue;
                }
                if (d.y > 430) { drops.splice(i, 1); continue; }
                g.strokeStyle = "rgba(87,183,221,.8)"; g.lineWidth = 2.5;
                g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x - wind * 9, d.y - 13); g.stroke();
              }
              // kid
              var soggy = 1 - dry / 100;
              g.fillStyle = "#f2c185"; g.beginPath(); g.arc(KID.x, KID.headY, 15, 0, Math.PI * 2); g.fill();
              g.fillStyle = soggy > 0.5 ? "#7a4a8c" : "#e8a33d"; rr(g, KID.x - 13, KID.headY + 13, 26, 34, 7); g.fill();
              g.fillStyle = "#4a3220"; rr(g, KID.x - 13, KID.headY + 47, 10, 18, 3); g.fill(); rr(g, KID.x + 3, KID.headY + 47, 10, 18, 3); g.fill();
              // umbrella canopy at y~210 follows pointer x, tilts with wind
              g.save(); g.translate(ux, 212); g.rotate(wind * 0.18);
              g.fillStyle = "#d93e22"; g.beginPath(); g.ellipse(0, 0, 100, 34, 0, Math.PI, Math.PI * 2); g.closePath(); g.fill();
              g.fillStyle = "#b32e18"; g.beginPath(); g.ellipse(0, 0, 100, 34, 0, Math.PI * 1.5, Math.PI * 2); g.closePath(); g.fill();
              g.strokeStyle = "#7a4a21"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 52); g.quadraticCurveTo(0, 62, 10, 60); g.stroke();
              g.restore();
              // dryness meter
              txt(g, "DRYNESS", 92, 428, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 158, 419, 404, 18, 9); g.fill();
              g.fillStyle = dry < 35 ? "#d93e22" : "#35c4a0"; rr(g, 158, 419, 404 * dry / 100, 18, 9); g.fill();
              txt(g, started ? timeLeft.toFixed(0) + "s" : "15s", 640, 90, 28, dark ? "#f7e8d8" : "#33241a");
              if (!started) txt(g, "The wind lies. Watch where rain lands!", W / 2, 118, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
