/* ================================================================
   GoofGig — Gig #061 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #061 — Rain Bucket
         Slide the bucket under the rain. 20 seconds of downpour.
         ================================================================ */
      registerGame({
        n: 61, title: "Rain Bucket",
        desc: "Twenty seconds of rain. One bucket. Very soggy shoes.",
        hint: '<b>Move the pointer</b> to slide the bucket. Catch as many <b>raindrops</b> as you can in <b>20 seconds</b>.',
        grades: [
          ["Storm Collector", "You caught the weather itself. The clouds are filing a complaint."],
          ["Rain Wrangler", "That bucket has seen things. Mostly rain. Caught beautifully."],
          ["Puddle Professional", "Solid catching. Only mildly damp around the edges."],
          ["Part-Time Umbrella", "Some rain caught, some rain... experienced directly."],
          ["Human Sponge", "The bucket was decorative. Your shoes did the absorbing."]
        ],
        thumb: function (g) {
          g.fillStyle = "#7fb6cc"; g.beginPath(); g.ellipse(132, 16, 4, 8, 0, 0, Math.PI * 2); g.ellipse(152, 10, 4, 8, 0, 0, Math.PI * 2); g.ellipse(170, 18, 4, 8, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e88a3d"; g.beginPath(); g.moveTo(122, 44); g.lineTo(178, 44); g.lineTo(170, 84); g.lineTo(130, 84); g.closePath(); g.fill();
          g.fillStyle = "#57b7dd"; rr(g, 126, 48, 48, 10, 4); g.fill();
        },
        create: function (api) {
          var bx = W / 2, tx = W / 2, drops = [], caught = 0, missed = 0, timeLeft = 20, started = false, done = false, spawnT = 0, splashes = [];
          function finishRound() {
            done = true;
            var total = caught + missed, ratio = total ? caught / total : 0;
            var s = clamp(Math.round(ratio * 60 + Math.min(caught, 40) / 40 * 40), 1, 100);
            if (s >= 85) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Drops caught", value: clamp(caught / 40 * 100, 0, 100), text: caught + " drops", good: caught >= 25 },
              { label: "Drops missed", value: clamp(missed / 40 * 100, 0, 100), text: missed + " splashed" }
            ] });
          }
          return {
            status: function () { return done ? "Downpour over!" : (started ? "Caught " + caught + " · " + timeLeft.toFixed(0) + "s left" : "Move to start the rain!"); },
            down: function (p) { started = true; tx = p.x; audio(); },
            move: function (p) { started = true; tx = p.x; },
            up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                spawnT -= dt;
                if (spawnT <= 0) { spawnT = 0.24 + Math.random() * 0.14; drops.push({ x: 30 + Math.random() * (W - 60), y: -12, v: 250 + Math.random() * 140 }); }
                if (timeLeft <= 0) finishRound();
              }
              bx += (clamp(tx, 50, W - 50) - bx) * Math.min(1, dt * 14);
              // clouds
              g.fillStyle = dark ? "#3d4a5c" : "#aebfd0";
              [[120, 34], [300, 24], [480, 36], [620, 26]].forEach(function (c) {
                g.beginPath(); g.ellipse(c[0], c[1], 62, 20, 0, 0, Math.PI * 2); g.ellipse(c[0] + 30, c[1] + 6, 44, 16, 0, 0, Math.PI * 2); g.fill();
              });
              // ground
              g.fillStyle = dark ? "#2c3a2a" : "#8fae6b"; g.fillRect(0, 428, W, 32);
              // drops
              for (var i = drops.length - 1; i >= 0; i--) {
                var d = drops[i];
                if (started && !done) d.y += d.v * dt;
                if (d.y >= 384 && d.y <= 404 && Math.abs(d.x - bx) < 46) { caught++; drops.splice(i, 1); blip(660 + Math.random() * 200, .04, "sine", .05); continue; }
                if (d.y > 428) { missed++; splashes.push({ x: d.x, t: 0.3 }); drops.splice(i, 1); continue; }
                g.fillStyle = "#57b7dd"; g.beginPath(); g.ellipse(d.x, d.y, 4.5, 9, 0, 0, Math.PI * 2); g.fill();
              }
              // splashes
              for (var j = splashes.length - 1; j >= 0; j--) {
                var sp = splashes[j]; sp.t -= dt;
                if (sp.t <= 0) { splashes.splice(j, 1); continue; }
                g.strokeStyle = "rgba(87,183,221,.7)"; g.lineWidth = 2;
                g.beginPath(); g.ellipse(sp.x, 430, (0.3 - sp.t) * 60, (0.3 - sp.t) * 20, 0, 0, Math.PI * 2); g.stroke();
              }
              // bucket
              g.fillStyle = "#e88a3d";
              g.beginPath(); g.moveTo(bx - 52, 388); g.lineTo(bx + 52, 388); g.lineTo(bx + 42, 436); g.lineTo(bx - 42, 436); g.closePath(); g.fill();
              g.fillStyle = "#57b7dd"; rr(g, bx - 48, 392, 96, clamp(caught, 0, 40), 3); g.fill();
              g.strokeStyle = "#b85f14"; g.lineWidth = 4; rr(g, bx - 52, 388, 104, 10, 5); g.stroke();
              txt(g, started ? timeLeft.toFixed(0) + "s" : "20s", 640, 90, 28, dark ? "#f7e8d8" : "#33241a");
              txt(g, "CAUGHT " + caught, 86, 90, 20, "#2e86ab");
              if (!started) txt(g, "Slide the bucket — catch the rain!", W / 2, 120, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
