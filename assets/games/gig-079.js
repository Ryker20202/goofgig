/* ================================================================
   GoofGig — Gig #079 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #079 — Coin Catch
         Tap to flip a coin skyward, tap again to catch it.
         Catching near the peak pays best. Three flips.
         ================================================================ */
      registerGame({
        n: 79, title: "Coin Catch",
        desc: "Flip it high. Catch it at the peak. Fumble it dramatically.",
        hint: '<b>Tap</b> to flip the coin, <b>tap again</b> to catch it mid-air. Catches <b>near the peak</b> score best — grab it too low and it is a fumble. <b>3 flips.</b>',
        grades: [
          ["Peak Predator", "Caught at the very top, three times. Reflex royalty."],
          ["Sky Cashier", "Your hands and gravity have an understanding."],
          ["Reliable Catcher", "Caught them all. Style points pending."],
          ["Butterfingers Lite", "The coin visited your hand and chose the floor."],
          ["Floor Donor", "Three coins, generously donated to the ground."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f2c230"; g.beginPath(); g.ellipse(150, 30, 20, 20, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#d9a514"; g.beginPath(); g.ellipse(150, 30, 13, 13, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#ffd9a0"; g.beginPath(); g.ellipse(150, 80, 30, 10, 0, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var flips = 0, total = 0, done = false, results = [];
          var coin = null, flash = 0, HAND_Y = 388, PEAK_T = 0.55;
          function flipPts(f) { return clamp(Math.round(33 * (0.3 + 0.7 * f)), 3, 33); }
          function settle(txtLabel, f) {
            var p = flipPts(f);
            total += p;
            results.push(txtLabel);
            flips++;
            coin = null; flash = 0.6;
            if (f >= 0.9) sndGood(); else if (f >= 0.45) blip(520, .07, "sine", .06); else sndBad();
            if (flips >= 3) finishRound();
          }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(total * 100 / 99), 0, 100);
            api.finish({ score: s, rows: [
              { label: "Catches", value: total, text: results.join(" · "), good: total >= 70 },
              { label: "Flips used", value: 100, text: "3 / 3" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Coin judged!";
              if (coin) return "Catch it near the peak!";
              return "Flip " + (flips + 1) + " / 3 — tap to flip!";
            },
            down: function () {
              if (done) return;
              audio();
              if (!coin) {
                if (flips >= 3) return;
                coin = { t: 0 };
                blip(700, .06, "square", .05);
              } else {
                var f = coin.h / coin.peak;
                settle(f >= 0.9 ? "Peak catch!" : (f >= 0.45 ? "Caught" : "Low grab"), f);
              }
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (flash > 0) flash -= dt;
              var CX = W / 2;
              // backdrop
              g.fillStyle = dark ? "#22314a" : "#eaf6fd"; g.fillRect(0, 40, W, 330);
              // peak zone band
              var peakY = HAND_Y - 248;
              g.fillStyle = "rgba(53,196,160,.18)"; g.fillRect(60, peakY - 26, W - 120, 52);
              g.strokeStyle = "rgba(53,196,160,.6)"; g.lineWidth = 2; g.setLineDash([7, 7]);
              g.beginPath(); g.moveTo(60, peakY - 26); g.lineTo(W - 60, peakY - 26); g.stroke();
              g.beginPath(); g.moveTo(60, peakY + 26); g.lineTo(W - 60, peakY + 26); g.stroke(); g.setLineDash([]);
              txt(g, "PEAK ZONE", W - 108, peakY + 5, 14, "#0e9594");
              // floor
              g.fillStyle = dark ? "#4a3423" : "#caa26b"; g.fillRect(0, 410, W, 50);
              // hand
              g.fillStyle = "#ffd9a0";
              g.beginPath(); g.ellipse(CX, HAND_Y + 24, 52, 16, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#f0bd82";
              [-30, -10, 10, 30].forEach(function (dx) { g.beginPath(); g.ellipse(CX + dx, HAND_Y + 8, 8, 13, 0, 0, Math.PI * 2); g.fill(); });
              // coin physics
              if (coin && !done) {
                coin.t += dt;
                var tt = coin.t;
                var h = 248 * (1 - Math.pow((tt - PEAK_T) / PEAK_T, 2));
                if (tt <= PEAK_T * 2) { coin.h = Math.max(0, h); coin.peak = 248; }
                coin.y = HAND_Y - coin.h;
                coin.spin = tt * 14;
                if (tt > PEAK_T * 2 + 0.02) settle("Fumbled!", 0.04);
              }
              // coin drawing
              if (coin) {
                var sq = Math.abs(Math.cos(coin.spin));
                g.fillStyle = "#f2c230";
                g.beginPath(); g.ellipse(CX, coin.y, 24, 6 + sq * 18, 0, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "#c99612"; g.lineWidth = 3;
                g.beginPath(); g.ellipse(CX, coin.y, 24, 6 + sq * 18, 0, 0, Math.PI * 2); g.stroke();
                if (sq > 0.4) { txt(g, "1", CX, coin.y + 6, 17, "#a87b0c"); }
              } else if (!done) {
                g.fillStyle = "#f2c230"; g.beginPath(); g.ellipse(CX, HAND_Y - 4, 24, 8, 0, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "#c99612"; g.lineWidth = 3; g.beginPath(); g.ellipse(CX, HAND_Y - 4, 24, 8, 0, 0, Math.PI * 2); g.stroke();
              }
              if (flash > 0 && results.length) {
                txt(g, results[results.length - 1], CX, 110, 26, dark ? "#f7e8d8" : "#0e9594");
              }
              txt(g, "Flip " + Math.min(flips + 1, 3) + " / 3 · Points " + total, 118, 66, 16, dark ? "#f7e8d8" : "#33241a");
              if (!coin && !done) txt(g, "Tap to flip — tap again at the top!", CX, 448, 18, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
