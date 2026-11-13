/* ================================================================
   GoofGig — Gig #054 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #054 — Peel the Banana
         Drag downward on each of the 4 peel strips to pull it
         open. Steady drags peel smoother than yanks.
         ================================================================ */
      registerGame({
        n: 54, title: "Peel the Banana",
        desc: "Four strips, four smooth pulls. Yanking is a lifestyle, not a strategy.",
        hint: '<b>Press a peel strip</b> and <b>drag downward</b> to pull it open. Peel all <b>4 strips</b> — steady drags score smoother than jerky yanks.',
        grades: [
          ["Banana Surgeon", "Four silk-smooth peels. The banana barely noticed."],
          ["Smooth Peeler", "Opened like a flower. A yellow, potassium flower."],
          ["Competent Snacker", "Banana: open. Dignity: intact. Mostly."],
          ["Jerky Peeler", "It opened the way a screen door opens in a storm."],
          ["Peel Wrestler", "The banana is open and so are several new questions."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#ffd83d"; g.lineWidth = 13; g.lineCap = "round";
          g.beginPath(); g.arc(150, 26, 42, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
          g.strokeStyle = "#f2b705"; g.lineWidth = 5;
          g.beginPath(); g.moveTo(150, 8); g.lineTo(138, 26); g.moveTo(150, 8); g.lineTo(163, 24); g.stroke();
        },
        create: function (api) {
          var S = { x: W / 2, y: 104 };
          var baseAng = [-51, -17, 17, 51];
          var prog = [0, 0, 0, 0];
          var active = -1, lastY = 0, started = false, done = false, time = 0;
          var speeds = [];
          function finishRound() {
            done = true;
            var mean = 0, i;
            for (i = 0; i < speeds.length; i++) mean += speeds[i];
            mean = speeds.length ? mean / speeds.length : 0;
            var varr = 0;
            for (i = 0; i < speeds.length; i++) varr += (speeds[i] - mean) * (speeds[i] - mean);
            var sd = speeds.length ? Math.sqrt(varr / speeds.length) : 0;
            var smooth = clamp(1 - (mean > 0 ? sd / mean : 0) * 0.55, 0, 1);
            var s = clamp(Math.round(62 + smooth * 28 - Math.max(0, time - 6) * 1.2), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Peel smoothness", value: Math.round(smooth * 100), text: Math.round(smooth * 100) + "%", good: smooth > 0.6 },
              { label: "Peel time", value: clamp(time / 12 * 100, 0, 100), text: time.toFixed(1) + "s" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Banana open!";
              var c = 0; for (var i = 0; i < 4; i++) if (prog[i] >= 1) c++;
              return "Strips peeled: " + c + " / 4";
            },
            down: function (p) {
              if (done) return;
              started = true; audio();
              var pa = Math.atan2(p.x - S.x, p.y - S.y) * 180 / Math.PI, best = 1e9;
              active = -1;
              for (var i = 0; i < 4; i++) {
                if (prog[i] >= 1) continue;
                var d = Math.abs(pa - baseAng[i]);
                if (d < best) { best = d; active = i; }
              }
              lastY = p.y;
            },
            move: function (p) {
              if (active < 0 || done) return;
              var dy = p.y - lastY; lastY = p.y;
              if (dy > 0) {
                prog[active] = clamp(prog[active] + dy / 175, 0, 1);
                speeds.push(dy);
                if (prog[active] >= 1) { blip(520, .06, "sine", .06); active = -1; }
              }
            },
            up: function () { active = -1; },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                time += dt;
                var all = true; for (var i = 0; i < 4; i++) if (prog[i] < 1) all = false;
                if (all) { sndGood(); finishRound(); }
              }
              // peel strips (behind body at top, fanning from stem)
              for (var i = 0; i < 4; i++) {
                var dir = baseAng[i] >= 0 ? 1 : -1;
                var ang = (baseAng[i] + dir * prog[i] * 78) * Math.PI / 180;
                var L = 118 + prog[i] * 26;
                var tx = S.x + Math.sin(ang) * L, ty = S.y + Math.cos(ang) * L;
                var w0 = 25, w1 = 9;
                var nx = Math.cos(ang), ny = -Math.sin(ang);
                g.fillStyle = prog[i] > 0.45 ? "#fff3b0" : "#ffd83d";
                g.beginPath();
                g.moveTo(S.x - nx * w0 / 2, S.y - ny * w0 / 2);
                g.lineTo(S.x + nx * w0 / 2, S.y + ny * w0 / 2);
                g.lineTo(tx + nx * w1 / 2, ty + ny * w1 / 2);
                g.lineTo(tx - nx * w1 / 2, ty - ny * w1 / 2);
                g.closePath(); g.fill();
                g.strokeStyle = "rgba(190,140,10,.5)"; g.lineWidth = 2; g.stroke();
              }
              // banana body (thick smile arc)
              g.strokeStyle = "#ffd83d"; g.lineWidth = 54; g.lineCap = "round";
              g.beginPath(); g.arc(W / 2, 128, 108, Math.PI * 0.12, Math.PI * 0.88); g.stroke();
              g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 16;
              g.beginPath(); g.arc(W / 2, 128, 96, Math.PI * 0.2, Math.PI * 0.8); g.stroke();
              // stem
              g.fillStyle = "#8a6b42"; rr(g, S.x - 8, S.y - 22, 16, 26, 6); g.fill();
              // progress dots
              for (var j = 0; j < 4; j++) {
                g.fillStyle = prog[j] >= 1 ? "#35c4a0" : (dark ? "#4a3423" : "#f0dcc4");
                g.beginPath(); g.arc(W / 2 - 54 + j * 36, 428, 10, 0, Math.PI * 2); g.fill();
                if (prog[j] >= 1) txt(g, "✓", W / 2 - 54 + j * 36, 434, 14, "#fff");
              }
              if (!started) txt(g, "Grab a strip and pull it down!", W / 2, 44, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
