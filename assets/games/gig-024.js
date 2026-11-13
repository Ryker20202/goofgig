/* ================================================================
   GoofGig — Gig #024 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #024 — High Five
         A hand swings in from the right. Tap at the exact moment
         it meets yours — too early is air, too late is a thumb.
         ================================================================ */
      registerGame({
        n: 24, title: "High Five",
        desc: "A hand is swinging in. Slap it at the exact meeting moment.",
        hint: 'A hand swings in from the <b>right</b>. <b>Tap</b> the instant it meets your hand in the middle. Too early slaps air, too late is a tragic thumb collision.',
        grades: [
          ["Palm Synchronized", "Somewhere, a stadium crowd felt that clap."],
          ["Clean Contact", "Full palm. Zero awkwardness. Beautiful."],
          ["Mostly Fingers", "It counted. Technically. Barely."],
          ["Thumb Incident", "Two thumbs met and neither apologized."],
          ["Swung at a Ghost", "Your hand is still out there, waiting."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f2b183"; rr(g, 96, 30, 34, 44, 10); g.fill();
          g.fillStyle = "#e89b6a"; rr(g, 170, 30, 34, 44, 10); g.fill();
          g.fillStyle = "#ffd166"; g.beginPath(); g.arc(150, 50, 8, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var T_END = 1.9, TM = 1.12; // seconds; meet moment
          var t = 0, started = false, done = false, judged = false, errPx = 0, burst = 0;
          var MEET = { x: 396, y: 228 };
          function handAt(tt) {
            // quadratic path: (706,96) -> control (520,120) -> meet (396,228) -> continue to (306,348)
            if (tt <= TM) {
              var u = tt / TM;
              var x = (1 - u) * (1 - u) * 706 + 2 * (1 - u) * u * 520 + u * u * 396;
              var y = (1 - u) * (1 - u) * 96 + 2 * (1 - u) * u * 120 + u * u * 228;
              return { x: x, y: y };
            }
            var v = (tt - TM) / (T_END - TM);
            return { x: 396 + (306 - 396) * v, y: 228 + (348 - 228) * v };
          }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(100 - errPx * 0.85), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Contact error", value: clamp(100 - errPx * 0.85, 0, 100), text: Math.round(errPx) + " px off", good: errPx < 26 },
              { label: "Timing", value: clamp(100 - errPx * 0.85, 0, 100), text: errPx < 26 ? "Dead center" : (errPx < 70 ? "Grazed it" : "Whiffed") }
            ] });
          }
          function judge() {
            var p = handAt(t);
            errPx = dist(p.x, p.y, MEET.x, MEET.y);
            judged = true; burst = 0.6;
            if (errPx < 26) { sndGood(); blip(880, .1, "sine", .08); } else sndBad();
            finishRound();
          }
          return {
            status: function () {
              if (done) return errPx < 26 ? "CLAP! Perfect contact." : "Missed by " + Math.round(errPx) + " px.";
              return started ? "Here it comes…" : "Get ready… tap to start the swing!";
            },
            down: function () {
              if (done) return;
              if (!started) { started = true; audio(); return; }
              judge();
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                t += dt;
                if (t >= T_END) { errPx = dist(handAt(T_END).x, handAt(T_END).y, MEET.x, MEET.y) + 60; sndBad(); finishRound(); }
              }
              if (burst > 0) burst -= dt;
              var hp = handAt(Math.min(t, T_END));
              // your arm + hand (left, waiting)
              g.fillStyle = "#3f7fbf"; rr(g, 40, 218, 190, 34, 16); g.fill();
              g.fillStyle = "#f2b183"; rr(g, 300, 190, 56, 84, 20); g.fill();
              g.fillStyle = "#e89b6a";
              for (var f = 0; f < 4; f++) rr(g, 302 + f * 13, 172, 10, 26, 5), g.fill();
              // incoming arm + hand
              g.save(); g.translate(hp.x, hp.y); g.rotate(-0.5);
              g.fillStyle = "#bf4a3f"; rr(g, 26, -16, 190, 34, 16); g.fill();
              g.fillStyle = "#f2b183"; rr(g, -28, -42, 56, 84, 20); g.fill();
              g.fillStyle = "#e89b6a";
              for (var f2 = 0; f2 < 4; f2++) rr(g, -26 + f2 * 13, -68, 10, 26, 5), g.fill();
              g.restore();
              // meeting point marker
              g.strokeStyle = "rgba(232,163,61,.65)"; g.lineWidth = 2.5;
              g.beginPath(); g.arc(MEET.x, MEET.y, 34 + Math.sin(now / 200) * 3, 0, Math.PI * 2); g.stroke();
              // clap burst
              if (burst > 0) {
                g.strokeStyle = "#ffd166"; g.lineWidth = 4;
                for (var r = 0; r < 8; r++) {
                  var a = r / 8 * Math.PI * 2, rr2 = (0.6 - burst) * 90;
                  g.beginPath(); g.moveTo(MEET.x + Math.cos(a) * rr2 * 0.5, MEET.y + Math.sin(a) * rr2 * 0.5);
                  g.lineTo(MEET.x + Math.cos(a) * rr2, MEET.y + Math.sin(a) * rr2); g.stroke();
                }
                txt(g, "CLAP!", MEET.x, MEET.y - 66, 30, "#e8a33d");
              }
              if (!started) txt(g, "Tap to start the swing — then slap!", W / 2, 44, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
