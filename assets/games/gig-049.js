/* ================================================================
   GoofGig — Gig #049 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #049 — Button Up
         Drag 3 loose buttons into their matching holes.
         ================================================================ */
      registerGame({
        n: 49, title: "Button Up",
        desc: "Three loose buttons, three picky holes. Match the colours.",
        hint: '<b>Drag each button</b> onto the hole with the <b>matching colour ring</b>. Wrong drops and slow hands cost points.',
        grades: [
          ["Button Surgeon", "Three for three, steady as a tailor's daydream."],
          ["Shirt Whisperer", "Buttoned up like you dress mannequins for fun."],
          ["Mostly Dressed", "All buttons home, minor fumbling along the way."],
          ["Button Wrestler", "The buttons won several rounds before surrendering."],
          ["Fashion Emergency", "Somewhere, a shirt is still waiting."]
        ],
        thumb: function (g) {
          g.fillStyle = "#7fb6cc"; rr(g, 122, 6, 56, 80, 8); g.fill();
          g.fillStyle = "#e8546d"; g.beginPath(); g.arc(150, 26, 9, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#35c4a0"; g.beginPath(); g.arc(150, 50, 9, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#ffb627"; g.beginPath(); g.arc(150, 74, 9, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var cols = ["#e8546d", "#35c4a0", "#ffb627"];
          var holes = [{ x: W / 2, y: 140 }, { x: W / 2, y: 222 }, { x: W / 2, y: 304 }];
          var btns = [
            { x: 170, y: 415, placed: false },
            { x: W / 2, y: 415, placed: false },
            { x: 550, y: 415, placed: false }
          ];
          // shuffle which button goes where: button i fits hole perm[i]
          var perm = [1, 2, 0];
          var drag = -1, mistakes = 0, time = 0, started = false, done = false, placedCount = 0;
          function finishRound() {
            done = true;
            var s = clamp(Math.round(104 - time * 2.4 - mistakes * 9), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Dressing time", value: clamp(time / 12 * 100, 0, 100), text: time.toFixed(1) + "s", good: time < 7 },
              { label: "Wrong drops", value: clamp(mistakes * 20, 0, 100), text: "" + mistakes }
            ] });
          }
          return {
            status: function () { return done ? "Fully dressed!" : "Buttons home: " + placedCount + " / 3"; },
            down: function (p) {
              if (done) return;
              started = true; audio();
              for (var i = btns.length - 1; i >= 0; i--) {
                if (!btns[i].placed && dist(p.x, p.y, btns[i].x, btns[i].y) <= 30) { drag = i; return; }
              }
            },
            move: function (p) {
              if (drag >= 0 && !done) { btns[drag].x = clamp(p.x, 30, W - 30); btns[drag].y = clamp(p.y, 30, 445); }
            },
            up: function (p) {
              if (drag < 0 || done) { drag = -1; return; }
              var b = btns[drag], h = holes[perm[drag]];
              if (dist(p.x, p.y, h.x, h.y) <= 38) {
                b.x = h.x; b.y = h.y; b.placed = true; placedCount++;
                blip(660, .07, "sine", .07);
                if (placedCount >= 3) { sndGood(); finishRound(); }
              } else {
                // wrong if it landed near a different hole
                for (var j = 0; j < 3; j++) if (j !== perm[drag] && dist(p.x, p.y, holes[j].x, holes[j].y) <= 38) { mistakes++; blip(160, .09, "square", .06); break; }
              }
              drag = -1;
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) time += dt;
              // shirt
              g.fillStyle = dark ? "#5d84a0" : "#7fb6cc"; rr(g, W / 2 - 150, 62, 300, 316, 16); g.fill();
              g.fillStyle = dark ? "#527691" : "#71a7bf";
              rr(g, W / 2 - 196, 84, 48, 120, 12); g.fill(); rr(g, W / 2 + 148, 84, 48, 120, 12); g.fill();
              // collar + placket
              g.fillStyle = "#f7e8d8"; g.beginPath();
              g.moveTo(W / 2 - 40, 62); g.lineTo(W / 2, 100); g.lineTo(W / 2 + 40, 62); g.closePath(); g.fill();
              g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 3;
              g.beginPath(); g.moveTo(W / 2, 104); g.lineTo(W / 2, 372); g.stroke();
              // holes with colour rings
              for (var j = 0; j < 3; j++) {
                var bi = perm.indexOf(j);
                g.strokeStyle = cols[bi]; g.lineWidth = 4;
                g.setLineDash([6, 5]);
                g.beginPath(); g.arc(holes[j].x, holes[j].y, 21, 0, Math.PI * 2); g.stroke();
                g.setLineDash([]);
                g.fillStyle = "rgba(30,30,40,.35)";
                g.beginPath(); g.ellipse(holes[j].x, holes[j].y, 4, 10, 0, 0, Math.PI * 2); g.fill();
              }
              // buttons
              for (var i = 0; i < 3; i++) {
                var b = btns[i];
                g.fillStyle = cols[i];
                g.beginPath(); g.arc(b.x, b.y, 18, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 2;
                g.beginPath(); g.arc(b.x, b.y, 18, 0, Math.PI * 2); g.stroke();
                g.fillStyle = "rgba(255,255,255,.85)";
                [[-5, -5], [5, -5], [-5, 5], [5, 5]].forEach(function (d) {
                  g.beginPath(); g.arc(b.x + d[0], b.y + d[1], 2.4, 0, Math.PI * 2); g.fill();
                });
              }
              if (!started) txt(g, "Drag each button to its colour!", W / 2, 436, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
