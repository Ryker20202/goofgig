/* ================================================================
   GoofGig — Gig #048 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #048 — Zip It
         Drag the zipper pull up the wavy track. Stray = jammed.
         ================================================================ */
      registerGame({
        n: 48, title: "Zip It",
        desc: "One smooth pull up the jacket. Stray off the track and it jams.",
        hint: '<b>Drag the zipper pull</b> from the bottom of the jacket to the top, staying on the <b>wavy track</b>. Wandering off jams the zipper and burns time.',
        grades: [
          ["Zipper Whisperer", "Bottom to top in one silky pull. The jacket applauds."],
          ["Smooth Operator", "Barely a wobble. That zip never stood a chance."],
          ["Decent Zipper", "It closed. Eventually. With some negotiation."],
          ["Jam Session", "More time stuck than zipping. Impressive, technically."],
          ["Call a Tailor", "The zipper has filed a formal complaint."]
        ],
        thumb: function (g) {
          g.fillStyle = "#31556e"; rr(g, 118, 8, 64, 80, 8); g.fill();
          g.strokeStyle = "#ffd83d"; g.lineWidth = 4;
          g.beginPath(); g.moveTo(150, 84);
          g.bezierCurveTo(132, 60, 168, 44, 150, 12); g.stroke();
          g.fillStyle = "#e8546d"; rr(g, 140, 66, 20, 16, 4); g.fill();
        },
        create: function (api) {
          var prog = 0, stuck = 0, time = 0, started = false, done = false, holding = false, jamNow = false;
          var lastX = 0, lastY = 0, hasP = false;
          function trackX(y) { return W / 2 + Math.sin((380 - y) / 300 * Math.PI * 2.2) * 58; }
          function yOf(p) { return 380 - p * 300; }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(108 - time * 3.2 - stuck * 24), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Zip time", value: clamp(time / 10 * 100, 0, 100), text: time.toFixed(1) + "s", good: time < 6 },
              { label: "Time jammed", value: clamp(stuck / 3 * 100, 0, 100), text: stuck.toFixed(1) + "s" }
            ] });
          }
          return {
            status: function () { return done ? "Zipped!" : (started ? "Zipped " + Math.round(prog * 100) + "%" + (jamNow ? " — JAMMED!" : "") : "Grab the pull and drag up!"); },
            down: function (p) { if (done) return; started = true; holding = true; lastX = p.x; lastY = p.y; hasP = true; audio(); },
            move: function (p) {
              if (done || !holding) return;
              lastX = p.x; lastY = p.y; hasP = true;
              var py = clamp(p.y, 80, 380), cand = (380 - py) / 300;
              if (cand > prog && Math.abs(p.x - trackX(py)) <= 48) prog = cand;
            },
            up: function () { holding = false; hasP = false; },
            draw: function (g, dt) {
              var dark = isDark();
              jamNow = false;
              if (started && !done) {
                time += dt;
                if (holding && hasP) {
                  var cpy = clamp(lastY, 80, 380), cand2 = (380 - cpy) / 300;
                  if (cand2 > prog + 0.002 && Math.abs(lastX - trackX(cpy)) > 48) { stuck += dt; jamNow = true; }
                }
                if (prog >= 0.999) { sndGood(); finishRound(); }
              }
              // jacket body
              g.fillStyle = dark ? "#274b63" : "#31556e"; rr(g, W / 2 - 130, 60, 260, 350, 18); g.fill();
              g.fillStyle = dark ? "#2f5a77" : "#3c6a8a"; rr(g, W / 2 - 130, 60, 126, 350, 18); g.fill();
              // collar
              g.fillStyle = "#22303c"; g.beginPath();
              g.moveTo(W / 2 - 44, 60); g.lineTo(W / 2, 96); g.lineTo(W / 2 + 44, 60); g.closePath(); g.fill();
              // teeth along the track
              for (var y = 84; y <= 380; y += 11) {
                var x = trackX(y), zipped = y >= yOf(prog);
                g.fillStyle = zipped ? "#ffd83d" : "rgba(255,255,255,.45)";
                g.beginPath(); g.arc(x - 5, y, 3, 0, Math.PI * 2); g.arc(x + 5, y, 3, 0, Math.PI * 2); g.fill();
              }
              // zipped seam
              g.strokeStyle = "rgba(255,216,61,.5)"; g.lineWidth = 3; g.beginPath();
              for (var y2 = 380; y2 >= yOf(prog); y2 -= 8) { var x2 = trackX(y2); if (y2 === 380) g.moveTo(x2, y2); else g.lineTo(x2, y2); }
              g.stroke();
              // the pull
              var px = trackX(yOf(prog)), py2 = yOf(prog);
              var jig = jamNow ? (Math.random() * 4 - 2) : 0;
              g.fillStyle = "#e8546d"; rr(g, px - 13 + jig, py2 - 10, 26, 30, 7); g.fill();
              g.strokeStyle = "#f7e8d8"; g.lineWidth = 3;
              g.beginPath(); g.arc(px + jig, py2 + 30, 8, 0, Math.PI * 2); g.stroke();
              if (!started) txt(g, "Drag the red pull — follow the wiggles!", W / 2, 436, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
