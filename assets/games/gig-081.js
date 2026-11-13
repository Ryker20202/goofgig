/* ================================================================
   GoofGig — Gig #081 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #081 — Darts
         The dartboard slides side to side. Tap to throw at the
         crosshair — where the board is decides your rings.
         ================================================================ */
      registerGame({
        n: 81, title: "Darts",
        desc: "A sliding dartboard. Five darts. Bullseye is 25.",
        hint: 'The board <b>slides left and right</b>. <b>Tap</b> to throw at the center crosshair — your dart scores by where the <b>board center</b> was when it landed. <b>5 darts.</b>',
        grades: [
          ["Bullseye Bandit", "The board is considering a restraining order."],
          ["Pub Legend", "Darts night fears you and your terrifying timing."],
          ["Steady Arm", "Solid rings. The wall behind remains mostly safe."],
          ["Wall Decorator", "Several darts have chosen an alternative surface."],
          ["Safety Hazard", "Spectators are now standing behind furniture."]
        ],
        thumb: function (g) {
          var rings = [[38, "#fdfdf8"], [30, "#33241a"], [22, "#35c4a0"], [14, "#33241a"], [7, "#e3352b"]];
          rings.forEach(function (r) { g.fillStyle = r[1]; g.beginPath(); g.arc(150, 46, r[0], 0, Math.PI * 2); g.fill(); });
          g.fillStyle = "#f2c230"; g.beginPath(); g.moveTo(196, 14); g.lineTo(178, 32); g.lineTo(186, 36); g.closePath(); g.fill();
          g.fillStyle = "#2471a3"; rr(g, 168, 34, 16, 5, 2); g.fill();
        },
        create: function (api) {
          var t = 0, darts = 5, raw = 0, hits = [], done = false, flight = null, restTimer = 0;
          var CY = 218, AIM_X = W / 2, R = 96;
          function boardX(time) { return W / 2 + Math.sin(time * 1.05) * 205; }
          function ringValue(d) {
            if (d <= 15) return 25;
            if (d <= 33) return 18;
            if (d <= 54) return 12;
            if (d <= 75) return 7;
            if (d <= R) return 3;
            return 0;
          }
          function resolve() {
            var bx = flight.bx;
            var d = Math.abs(AIM_X - bx);
            var v = ringValue(d);
            raw += v;
            hits.push({ off: AIM_X - bx, v: v });
            if (v >= 18) sndGood(); else if (v > 0) blip(520, .07, "sine", .06); else sndBad();
            flight = null; darts--;
            restTimer = 0.6;
          }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(raw / 125 * 100), 0, 100);
            var bulls = hits.filter(function (h) { return h.v === 25; }).length;
            api.finish({ score: s, rows: [
              { label: "Total ring points", value: s, text: raw + " / 125", good: raw >= 75 },
              { label: "Bullseyes", value: bulls / 5 * 100, text: bulls + " hit" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Darts judged!";
              if (flight) return "Dart away…";
              return "Darts left: " + darts + " — tap to throw!";
            },
            down: function () {
              if (done || flight || darts <= 0) return;
              audio();
              flight = { bx: boardX(t), p: 0 };
              blip(340, .05, "square", .05);
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (!done && !flight) t += dt;
              if (flight) {
                flight.p += dt * 3.4;
                if (flight.p >= 1) resolve();
              }
              if (restTimer > 0 && !done) {
                restTimer -= dt;
                if (restTimer <= 0 && darts <= 0) finishRound();
              }
              var bx = flight ? flight.bx : boardX(t);
              // wall + rail
              g.fillStyle = dark ? "#2c2119" : "#f3e2c7"; g.fillRect(0, 56, W, 330);
              g.fillStyle = dark ? "#574433" : "#d9bd8f"; g.fillRect(0, 96, W, 8);
              // dartboard
              var rings = [[R, "#fdfdf8"], [75, "#33241a"], [54, "#35c4a0"], [33, "#e8dcc3"], [15, "#e3352b"]];
              rings.forEach(function (r) {
                g.fillStyle = r[1]; g.beginPath(); g.arc(bx, CY, r[0], 0, Math.PI * 2); g.fill();
              });
              g.strokeStyle = "#8a5a28"; g.lineWidth = 5; g.beginPath(); g.arc(bx, CY, R, 0, Math.PI * 2); g.stroke();
              g.fillStyle = "#f2c230"; g.beginPath(); g.arc(bx, CY, 6, 0, Math.PI * 2); g.fill();
              // stuck darts (they ride with the board)
              hits.forEach(function (h) {
                drawDart(g, bx + h.off, CY, 0.8);
              });
              // crosshair at aim point
              g.strokeStyle = "#e3352b"; g.lineWidth = 3;
              g.beginPath(); g.arc(AIM_X, CY, 13, 0, Math.PI * 2); g.stroke();
              g.beginPath(); g.moveTo(AIM_X - 20, CY); g.lineTo(AIM_X - 6, CY); g.stroke();
              g.beginPath(); g.moveTo(AIM_X + 6, CY); g.lineTo(AIM_X + 20, CY); g.stroke();
              g.beginPath(); g.moveTo(AIM_X, CY - 20); g.lineTo(AIM_X, CY - 6); g.stroke();
              g.beginPath(); g.moveTo(AIM_X, CY + 6); g.lineTo(AIM_X, CY + 20); g.stroke();
              // flying dart grows toward board
              if (flight) drawDart(g, AIM_X - 130 * (1 - flight.p), CY + 60 * (1 - flight.p), 0.4 + flight.p * 0.5);
              function drawDart(g2, x, y, s) {
                g2.save(); g2.translate(x, y); g2.scale(s, s);
                g2.fillStyle = "#bbb"; g2.beginPath(); g2.moveTo(0, 0); g2.lineTo(-16, -4); g2.lineTo(-16, 4); g2.closePath(); g2.fill();
                g2.fillStyle = "#2471a3"; g2.fillRect(-34, -3, 18, 6);
                g2.fillStyle = "#e3352b";
                g2.beginPath(); g2.moveTo(-34, -3); g2.lineTo(-46, -12); g2.lineTo(-42, 0); g2.lineTo(-46, 12); g2.lineTo(-34, 3); g2.closePath(); g2.fill();
                g2.restore();
              }
              txt(g, "Darts: " + "●".repeat(Math.max(0, darts)) + "○".repeat(Math.max(0, 5 - darts)) + " · Points " + raw, 128, 66, 16, dark ? "#f7e8d8" : "#33241a");
              txt(g, "Board points: bull 25 · then 18 / 12 / 7 / 3", W / 2, 424, 15, dark ? "#c4a68d" : "#7a5f4d");
              if (!flight && !done) txt(g, "Tap when the bull crosses the red sight!", W / 2, 448, 17, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
