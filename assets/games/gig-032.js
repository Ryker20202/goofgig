/* ================================================================
   GoofGig — Gig #032 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #032 — Photo the Ghost
         It fades in. It fades out. Five shots of film.
         Only photograph what you can actually see.
         ================================================================ */
      registerGame({
        n: 32, title: "Photo the Ghost",
        desc: "It fades in and out. Five shots. Only snap it when it's clearly there.",
        hint: 'A ghost drifts around, <b>fading in and out</b>. Tap the <b>shutter</b> only while it is <b>clearly visible</b> (solid, not a whisper). You have <b>5 shots</b> — mistimed ones waste film.',
        grades: [
          ["Ghost Photographer, PhD", "Peer-reviewed proof of the afterlife. Congratulations."],
          ["Paranormal Professional", "The ghost is asking for your autograph."],
          ["Blurry Believer", "Something is in these photos. Probably."],
          ["Film Waster", "Five photos of a wall. A haunted wall, allegedly."],
          ["The Ghost Photographed YOU", "Somehow you are the blurry one now."]
        ],
        thumb: function (g) {
          g.fillStyle = "rgba(230,240,250,.95)";
          g.beginPath(); g.arc(150, 42, 18, Math.PI, 0); g.lineTo(168, 66);
          g.lineTo(160, 58); g.lineTo(152, 66); g.lineTo(144, 58); g.lineTo(136, 66); g.lineTo(132, 66);
          g.closePath(); g.fill();
          g.fillStyle = "#263238"; g.beginPath(); g.arc(143, 40, 2.6, 0, Math.PI * 2); g.arc(157, 40, 2.6, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#e3352b"; g.lineWidth = 3; rr(g, 96, 12, 108, 66, 6); g.stroke();
        },
        create: function (api) {
          var SHOTS = 5, shots = 0, qualities = [], gx = 200, gy = 190, cyc = 0, period = 2.3, gap = 0, flash = 0;
          var started = false, done = false, alphaNow = 0;
          function newSpot() {
            gx = 110 + Math.random() * 500; gy = 100 + Math.random() * 260;
            period = 1.9 + Math.random() * 1.1; cyc = 0;
          }
          newSpot();
          function finishRound() {
            done = true;
            var sum = 0; qualities.forEach(function (q) { sum += q; });
            var avg = sum / SHOTS;
            var s = clamp(Math.round(avg * 100), 2, 100);
            var rows = [{ label: "Ghost clarity (avg)", value: avg * 100, text: Math.round(avg * 100) + "% visible", good: avg > 0.6 }];
            rows.push({ label: "Film used", value: 100, text: shots + " / " + SHOTS + " shots", good: true });
            api.finish({ score: s, rows: rows });
          }
          return {
            status: function () {
              if (done) return "The film is developed. Spooky.";
              return started ? "Shots left: " + (SHOTS - shots) + " · clarity " + Math.round(alphaNow * 100) + "%" : "Tap to enter the haunted room…";
            },
            down: function () {
              if (done) return;
              if (!started) { started = true; audio(); return; }
              if (gap > 0) return;
              shots++; flash = 0.3;
              qualities.push(alphaNow);
              if (alphaNow > 0.6) { sndGood(); blip(1250, .05, "square", .05); } else { sndBad(); }
              if (shots >= SHOTS) { finishRound(); return; }
              gap = 0.55;
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                if (gap > 0) { gap -= dt; if (gap <= 0) newSpot(); }
                else {
                  cyc += dt;
                  var ph = (cyc % period) / period;
                  alphaNow = clamp(Math.sin(ph * Math.PI), 0, 1);
                }
                if (gap > 0) alphaNow = 0;
              }
              if (flash > 0) flash -= dt;
              // haunted room
              g.fillStyle = dark ? "#232733" : "#d8dce8"; g.fillRect(0, 0, W, 460);
              g.fillStyle = dark ? "#2e3345" : "#c3c9da"; g.fillRect(0, 380, W, 80);
              g.fillStyle = dark ? "#3a405a" : "#b9c0d4"; rr(g, 60, 90, 90, 120, 4); g.fill();
              txt(g, "R.I.P.", 105, 150, 15, dark ? "#8fa3b8" : "#7a8a99");
              g.fillStyle = dark ? "#3a405a" : "#b9c0d4"; rr(g, 570, 110, 80, 100, 4); g.fill();
              // ghost
              if (started && gap <= 0 && !done) {
                var bob = Math.sin(now / 300) * 8;
                g.save(); g.globalAlpha = alphaNow;
                g.fillStyle = "#eef4fb";
                g.beginPath(); g.arc(gx, gy + bob, 40, Math.PI, 0);
                g.lineTo(gx + 40, gy + 52 + bob);
                for (var wv = 0; wv < 4; wv++) g.lineTo(gx + 30 - wv * 20, gy + 40 + bob + (wv % 2 ? 8 : 0));
                g.lineTo(gx - 40, gy + 52 + bob);
                g.closePath(); g.fill();
                g.fillStyle = "#263238";
                g.beginPath(); g.arc(gx - 14, gy - 6 + bob, 5, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.arc(gx + 14, gy - 6 + bob, 5, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(gx, gy + 12 + bob, 7, 10, 0, 0, Math.PI * 2); g.fill();
                g.restore();
              }
              // camera viewfinder corners
              g.strokeStyle = done ? "#8fa3b8" : "#e3352b"; g.lineWidth = 4;
              [[36, 36, 1, 1], [684, 36, -1, 1], [36, 424, 1, -1], [684, 424, -1, -1]].forEach(function (c) {
                g.beginPath(); g.moveTo(c[0] + 34 * c[2], c[1]); g.lineTo(c[0], c[1]); g.lineTo(c[0], c[1] + 34 * c[3]); g.stroke();
              });
              // photo flash
              if (flash > 0) { g.fillStyle = "rgba(255,255,255," + (flash * 1.6) + ")"; g.fillRect(0, 0, W, 460); }
              // film strip
              for (var i = 0; i < SHOTS; i++) {
                var fx = W / 2 - 70 + i * 34;
                g.fillStyle = i < shots ? (qualities[i] > 0.6 ? "#35c4a0" : "#d93e22") : (dark ? "#546e7a" : "#c3ced4");
                rr(g, fx, 420, 28, 20, 3); g.fill();
              }
              if (!started) txt(g, "Tap to begin the haunting!", W / 2, 240, 22, dark ? "rgba(247,232,216,.9)" : "rgba(38,50,56,.8)");
            }
          };
        }
      });
