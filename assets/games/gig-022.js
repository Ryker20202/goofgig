/* ================================================================
   GoofGig — Gig #022 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #022 — Elevator Stop
         The cab rises on its own. One tap stops it — line it up
         with the lit target floor.
         ================================================================ */
      registerGame({
        n: 22, title: "Elevator Stop",
        desc: "The cab is rising. One tap stops it. Line up with the lit floor.",
        hint: 'The elevator rises <b>on its own</b>. <b>Tap once</b> to stop it — the closer the doors align with the <b>lit target floor</b>, the higher your score.',
        grades: [
          ["Elevator Whisperer", "Doors open. Perfect floor. Not a single awkward silence."],
          ["Smooth Operator", "Barely a wobble. The passengers are impressed."],
          ["Floor-ish", "Close enough that everyone pretends not to notice."],
          ["Stair Enthusiast", "Somewhere between floors, emotionally and physically."],
          ["Express to Nowhere", "You stopped in a wall. The wall says hi."]
        ],
        thumb: function (g) {
          g.fillStyle = "#8d99ae"; rr(g, 128, 8, 44, 76, 4); g.fill();
          g.fillStyle = "#ffd166"; rr(g, 134, 34, 32, 44, 3); g.fill();
          g.fillStyle = "#ef476f"; g.beginPath(); g.arc(150, 20, 6, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var TOP = 46, FLOORS = 9, FH = 46;
          var target = 3 + Math.floor(Math.random() * 5); // floor index from top, 3..7
          var targetY = TOP + target * FH + FH / 2;
          var cabY = TOP + FLOORS * FH - 30; // cab center starts at the bottom
          var speed = 96, stopped = false, done = false, err = 0;
          function finishRound() {
            done = true;
            err = Math.abs(cabY - targetY);
            var s = clamp(Math.round(100 - err * 1.5), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Alignment error", value: clamp(100 - err * 1.5, 0, 100), text: Math.round(err) + " px off", good: err < 14 },
              { label: "Target floor", value: 100, text: "Floor " + (FLOORS - target), good: true }
            ] });
          }
          return {
            status: function () {
              if (done) return err < 14 ? "Ding! Perfect floor." : "Stopped " + Math.round(err) + " px from the floor.";
              if (stopped) return "Stopping…";
              return "Rising… tap to stop at floor " + (FLOORS - target) + "!";
            },
            down: function () {
              if (done || stopped) return;
              stopped = true; audio(); blip(660, .08, "sine", .07);
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (!done) {
                if (stopped) {
                  speed = Math.max(0, speed - dt * 260);
                  cabY -= speed * dt;
                  if (speed <= 0) { if (err < 14) {} finishRound(); }
                } else {
                  cabY -= speed * dt;
                  if (cabY < TOP - 40) { cabY = TOP - 40; finishRound(); }
                }
                if (done && err < 14) sndGood(); else if (done) sndBad();
              }
              var SX = 282, SW = 156;
              // building shaft
              g.fillStyle = dark ? "#2b3446" : "#dfe6ee"; rr(g, SX - 16, TOP - 14, SW + 32, FLOORS * FH + 28, 10); g.fill();
              // floors
              for (var i = 0; i < FLOORS; i++) {
                var fy = TOP + i * FH;
                var isT = i === target;
                g.fillStyle = isT ? "rgba(255,209,102,.85)" : (dark ? "#3a465c" : "#bfcbd8");
                rr(g, SX, fy + 4, SW, FH - 8, 4); g.fill();
                txt(g, String(FLOORS - i), SX - 34, fy + FH / 2 + 6, 17, isT ? "#e8a33d" : (dark ? "#8fa3b8" : "#7a8a99"));
                if (isT) txt(g, "★", SX + SW + 24, fy + FH / 2 + 7, 19, "#e8a33d");
              }
              // cables
              g.strokeStyle = dark ? "#6b7a8d" : "#93a5b5"; g.lineWidth = 3;
              g.beginPath(); g.moveTo(W / 2 - 18, TOP - 12); g.lineTo(W / 2 - 18, cabY - 30); g.stroke();
              g.beginPath(); g.moveTo(W / 2 + 18, TOP - 12); g.lineTo(W / 2 + 18, cabY - 30); g.stroke();
              // cab
              g.fillStyle = "#8d99ae"; rr(g, W / 2 - 46, cabY - 30, 92, 60, 6); g.fill();
              g.fillStyle = stopped && !done ? "#ffd166" : "#f4f7fa"; rr(g, W / 2 - 38, cabY - 23, 33, 46, 3); g.fill();
              rr(g, W / 2 + 5, cabY - 23, 33, 46, 3); g.fill();
              g.fillStyle = "#ef476f"; g.beginPath(); g.arc(W / 2, cabY - 38, 5, 0, Math.PI * 2); g.fill();
              // side note
              txt(g, "TARGET", 120, targetY - 8, 14, dark ? "#c4a68d" : "#7a5f4d");
              txt(g, "FLOOR " + (FLOORS - target), 120, targetY + 16, 20, "#e8a33d");
              if (!stopped && !done) txt(g, "Tap to stop!", W / 2, 446, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
