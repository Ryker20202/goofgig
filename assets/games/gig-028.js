/* ================================================================
   GoofGig — Gig #028 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #028 — Popcorn Panic
         Six seconds of mashing. Fill the pan to the brim —
         one kernel too many and the whole batch burns.
         ================================================================ */
      registerGame({
        n: 28, title: "Popcorn Panic",
        desc: "Six seconds. Mash to fill the pan. Past 100%, it burns.",
        hint: '<b>Tap like crazy</b> to pop kernels for <b>6 seconds</b>. Finish as close to <b>100% full</b> as you can — every pop past full <b>burns</b> the batch and torches your score.',
        grades: [
          ["Popcorn Perfectionist", "Movie theaters want your secret. And your pan."],
          ["Kernel Commander", "A mountain of popcorn, zero regrets."],
          ["Snack Adequate", "Enough for the trailers, maybe the opening scene."],
          ["Three Kernels Andy", "Bold of you to call that a snack."],
          ["Arson, Snack Division", "That is not popcorn. That is evidence."]
        ],
        thumb: function (g) {
          g.fillStyle = "#5b6770"; rr(g, 108, 48, 84, 28, 8); g.fill();
          g.fillStyle = "#fdf3d8";
          [[126, 44], [146, 36], [166, 42], [136, 30], [158, 28]].forEach(function (k) { g.beginPath(); g.arc(k[0], k[1], 9, 0, Math.PI * 2); g.fill(); });
          g.fillStyle = "#f4d35e"; g.beginPath(); g.arc(146, 36, 4, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var fill = 0, timeLeft = 6, started = false, done = false, pops = [], shake = 0;
          function finishRound() {
            done = true;
            var s;
            if (fill <= 100) s = clamp(Math.round(fill * 0.97), 2, 100);
            else s = clamp(Math.round(100 - (fill - 100) * 3.2), 5, 100);
            api.finish({ score: s, rows: [
              { label: "Pan fullness", value: clamp(fill, 0, 100), text: Math.round(fill) + "%", good: fill >= 88 && fill <= 100 },
              { label: "Burn level", value: clamp((fill - 100) * 4, 0, 100), text: fill > 100 ? "Crispy. Too crispy." : "Zero. Chef's kiss.", good: fill <= 100 }
            ] });
          }
          return {
            status: function () {
              if (done) return fill > 100 ? "It burns! It burns so good." : "Popcorn achieved: " + Math.round(fill) + "%";
              return started ? "Time " + timeLeft.toFixed(1) + "s · pan " + Math.round(fill) + "%" : "Tap to start popping!";
            },
            down: function () {
              if (done) return;
              if (!started) { started = true; audio(); }
              fill += 2.1 + Math.random() * 1.4;
              shake = 0.12;
              pops.push({ x: 200 + Math.random() * 320, y: 210, vy: -140 - Math.random() * 120, t: 0.55 });
              blip(500 + Math.random() * 500, .045, "square", .05);
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                if (timeLeft <= 0) { if (fill >= 85 && fill <= 100) sndGood(); else sndBad(); finishRound(); }
              }
              if (shake > 0) shake -= dt;
              for (var i = pops.length - 1; i >= 0; i--) {
                var pp = pops[i]; pp.t -= dt; pp.vy += 620 * dt; pp.y += pp.vy * dt;
                if (pp.t <= 0) pops.splice(i, 1);
              }
              var jx = shake > 0 ? (Math.random() * 5 - 2.5) : 0;
              // stove
              g.fillStyle = dark ? "#37474f" : "#cfd8dc"; g.fillRect(0, 384, W, 76);
              g.fillStyle = "#263238"; g.beginPath(); g.ellipse(W / 2, 392, 190, 18, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "rgba(255,110,40,.5)"; g.beginPath(); g.ellipse(W / 2, 392, 130, 11, 0, 0, Math.PI * 2); g.fill();
              // popcorn mound inside pan (height by fill)
              var moundH = clamp(fill, 0, 118) * 0.62;
              var burnt = fill > 100;
              g.save(); g.translate(jx, 0);
              g.fillStyle = burnt ? "#4a3320" : "#fdf3d8";
              for (var k = 0; k < 26; k++) {
                var kx = 218 + (k * 61) % 284, ky = 330 - moundH + (k * 37) % Math.max(8, moundH);
                g.beginPath(); g.arc(kx, ky, 13 + (k % 3) * 3, 0, Math.PI * 2); g.fill();
              }
              if (fill > 4) { g.fillStyle = burnt ? "#5e4025" : "#f4d35e"; g.beginPath(); g.arc(W / 2, 322 - moundH, 10, 0, Math.PI * 2); g.fill(); }
              // pan
              g.fillStyle = "#5b6770";
              g.beginPath(); g.moveTo(196, 318); g.lineTo(524, 318); g.lineTo(500, 388); g.lineTo(220, 388); g.closePath(); g.fill();
              g.fillStyle = "#45525a"; rr(g, 508, 330, 92, 15, 7); g.fill();
              g.restore();
              // flying pops
              pops.forEach(function (pp) {
                g.fillStyle = "#fdf3d8"; g.beginPath(); g.arc(pp.x, pp.y, 9, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#f4d35e"; g.beginPath(); g.arc(pp.x, pp.y, 3.6, 0, Math.PI * 2); g.fill();
              });
              // smoke when burnt
              if (burnt) {
                g.fillStyle = "rgba(90,90,90,.35)";
                for (var s2 = 0; s2 < 4; s2++) { g.beginPath(); g.arc(280 + s2 * 56, 240 - ((Date.now() / 14 + s2 * 30) % 60), 15, 0, Math.PI * 2); g.fill(); }
              }
              // fullness meter
              var MX = 140, MY = 432, MW = 440;
              txt(g, "PAN", 100, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(217,62,34,.4)"; g.fillRect(MX + MW * 0.8, MY - 9, MW * 0.2, 18);
              g.fillStyle = burnt ? "#d93e22" : "#e8a33d"; rr(g, MX, MY - 9, MW * clamp(fill, 0, 100) / 100, 18, 9); g.fill();
              txt(g, "FULL", MX + MW * 0.8 + 10, MY - 16, 12, "#d93e22");
              if (!started) txt(g, "Mash! But stop at full!", W / 2, 60, 22, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
              if (started && !done) txt(g, timeLeft.toFixed(1) + "s", 92, 92, 30, timeLeft < 2 ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
            }
          };
        }
      });
