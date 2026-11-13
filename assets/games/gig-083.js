/* ================================================================
   GoofGig — Gig #083 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #083 — Rope Swing
         Swing on the rope, tap to let go, and fly —
         land on the target mat if you can.
         ================================================================ */
      registerGame({
        n: 83, title: "Rope Swing",
        desc: "One swing, one leap of faith, one very judgmental mat.",
        hint: 'You swing on the rope. <b>Tap</b> to let go and fly — land as close to the <b>center of the mat</b> as you can.',
        grades: [
          ["Mat Magnet", "Dead center. The mat sends a thank-you card."],
          ["Tarzan Trainee", "Graceful flight, tidy landing, minimal screaming."],
          ["Brave Leaper", "You landed on the mat's greater metropolitan area."],
          ["Grass Greeter", "The lawn breaks your fall and your dignity."],
          ["Human Lawn Dart", "Stuck the landing. In the wrong postcode."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#8a5a28"; g.lineWidth = 4;
          g.beginPath(); g.moveTo(110, 4); g.lineTo(150, 50); g.stroke();
          g.fillStyle = "#ffd9a0"; g.beginPath(); g.arc(152, 54, 8, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e3352b"; rr(g, 196, 74, 62, 10, 4); g.fill();
          g.fillStyle = "#fdfdf8"; rr(g, 216, 74, 18, 10, 3); g.fill();
        },
        create: function (api) {
          var t = 0, done = false, flyer = null, landedX = null;
          var AX = 330, AY = 56, L = 196, GROUND = 416, MAT_X = 585, MAT_HW = 56;
          function angleAt(time) { return 0.92 * Math.sin(1.85 * time); }
          function finishRound() {
            done = true;
            var d = Math.abs(landedX - MAT_X);
            var s = clamp(Math.round(100 - Math.max(0, d - 10) * 1.05), 2, 100);
            if (d <= MAT_HW) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Landing spot", value: clamp(100 - Math.max(0, d - 10) * 1.05, 0, 100), text: d <= MAT_HW ? Math.round(d) + " px from mat center" : Math.round(d) + " px away — missed the mat", good: d <= MAT_HW },
              { label: "Mat center", value: 100, text: "Bullseye = dead center" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Landing judged!";
              if (flyer) return "Wheee—";
              return "Tap to LET GO at the right moment!";
            },
            down: function () {
              if (done || flyer) return;
              audio();
              var th = angleAt(t);
              var om = 0.92 * 1.85 * Math.cos(1.85 * t);
              var px = AX + L * Math.sin(th), py = AY + L * Math.cos(th);
              flyer = { x: px, y: py, vx: L * om * Math.cos(th), vy: -L * om * Math.sin(th), rot: 0 };
              blip(500, .07, "sine", .05);
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (!done && !flyer) t += dt;
              // sky, cliff and tree
              g.fillStyle = dark ? "#1d2f45" : "#dff2fc"; g.fillRect(0, 0, W, GROUND);
              g.fillStyle = dark ? "#3a5a2a" : "#8fbf6a"; g.fillRect(0, 0, 210, 44);
              g.fillStyle = "#7a4a21"; g.fillRect(120, 30, 210, 16);
              g.fillStyle = dark ? "#274a22" : "#9ed07a"; g.fillRect(0, GROUND, W, 44);
              // target mat
              g.fillStyle = "#e3352b"; rr(g, MAT_X - MAT_HW, GROUND - 4, MAT_HW * 2, 14, 5); g.fill();
              g.fillStyle = "#fdfdf8"; rr(g, MAT_X - 20, GROUND - 4, 40, 14, 5); g.fill();
              txt(g, "MAT", MAT_X, GROUND + 30, 14, dark ? "#cfe8c9" : "#4a7a38");
              // distance ticks
              g.strokeStyle = dark ? "rgba(247,232,216,.3)" : "rgba(93,58,22,.3)"; g.lineWidth = 2; g.setLineDash([4, 7]);
              g.beginPath(); g.moveTo(MAT_X, GROUND - 40); g.lineTo(MAT_X, GROUND - 6); g.stroke(); g.setLineDash([]);
              var th = angleAt(t);
              var px = AX + L * Math.sin(th), py = AY + L * Math.cos(th);
              // flyer physics
              if (flyer && !done) {
                flyer.vy += 620 * dt;
                flyer.x += flyer.vx * dt;
                flyer.y += flyer.vy * dt;
                flyer.rot += dt * 3;
                if (flyer.y >= GROUND - 14) {
                  flyer.y = GROUND - 14;
                  landedX = clamp(flyer.x, 16, W - 16);
                  finishRound();
                }
              }
              // rope + swinger
              if (!flyer) {
                g.strokeStyle = "#8a5a28"; g.lineWidth = 4;
                g.beginPath(); g.moveTo(AX, AY); g.lineTo(px, py); g.stroke();
                drawPerson(g, px, py, th * 0.6);
              } else {
                g.strokeStyle = "#8a5a28"; g.lineWidth = 4;
                g.beginPath(); g.moveTo(AX, AY); g.lineTo(AX + L * Math.sin(angleAt(t) * 0.2), AY + L * 0.98); g.stroke();
                drawPerson(g, flyer.x, flyer.y, flyer.rot);
                if (done && landedX !== null) {
                  g.strokeStyle = "#e3352b"; g.lineWidth = 3;
                  g.beginPath(); g.moveTo(landedX, GROUND - 44); g.lineTo(landedX, GROUND - 16); g.stroke();
                  g.fillStyle = "#e3352b"; g.beginPath(); g.moveTo(landedX, GROUND - 44); g.lineTo(landedX + 14, GROUND - 38); g.lineTo(landedX, GROUND - 32); g.closePath(); g.fill();
                }
              }
              function drawPerson(g2, x, y, rot) {
                g2.save(); g2.translate(x, y); g2.rotate(rot);
                g2.fillStyle = "#ffd9a0"; g2.beginPath(); g2.arc(0, -12, 9, 0, Math.PI * 2); g2.fill();
                g2.strokeStyle = "#2471a3"; g2.lineWidth = 6;
                g2.beginPath(); g2.moveTo(0, -4); g2.lineTo(0, 12); g2.stroke();
                g2.strokeStyle = "#33241a"; g2.lineWidth = 5;
                g2.beginPath(); g2.moveTo(0, 12); g2.lineTo(-8, 24); g2.stroke();
                g2.beginPath(); g2.moveTo(0, 12); g2.lineTo(9, 22); g2.stroke();
                g2.restore();
              }
              if (!flyer && !done) txt(g, "Let go late on the right swing… trust the arc!", W / 2, 448, 17, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
