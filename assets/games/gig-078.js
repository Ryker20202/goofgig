/* ================================================================
   GoofGig — Gig #078 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #078 — Paper Plane
         Hold to build throw power into the green zone, release,
         and watch the plane try to thread the hoop.
         ================================================================ */
      registerGame({
        n: 78, title: "Paper Plane",
        desc: "One throw. One hoop. Paper-based glory awaits.",
        hint: '<b>Hold</b> to build power into the <b>green zone</b>, then <b>release</b>. Your power decides the flight path — thread the plane through the <b>hoop</b>.',
        grades: [
          ["Ace of Paper", "Straight through the hoop. Aerodynamics sends its regards."],
          ["Smooth Glider", "That plane flew like it had tiny insurance."],
          ["Decent Toss", "It flew. The hoop saw it go by and nodded politely."],
          ["Wobbly Wing", "More helicopter than plane, honestly."],
          ["Floor Inspector", "The plane chose the ground. Immediately."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdfdf8"; g.beginPath();
          g.moveTo(96, 52); g.lineTo(168, 30); g.lineTo(150, 58); g.lineTo(132, 46); g.closePath(); g.fill();
          g.strokeStyle = "#b9c6cc"; g.lineWidth = 2; g.stroke();
          g.strokeStyle = "#e88ca0"; g.lineWidth = 5;
          g.beginPath(); g.arc(228, 46, 24, 0, Math.PI * 2); g.stroke();
        },
        create: function (api) {
          var charging = false, power = 0, done = false, thrown = false;
          var plane = null, through = false, resultY = 0;
          var HOOP_X = 470, HOOP_Y = 208, IDEAL = 67;
          function finishRound() {
            done = true;
            var err = Math.abs(resultY - HOOP_Y);
            var s;
            if (through) s = clamp(Math.round(100 - err * 0.9), 72, 100);
            else s = clamp(Math.round(70 - err * 0.5), 3, 69);
            if (through) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Throw power", value: power, text: Math.round(power) + "% (ideal " + IDEAL + "%)" },
              { label: "Through the hoop", value: through ? 100 : clamp(100 - err * 1.4, 0, 90), text: through ? "Threaded it!" : "Missed by " + Math.round(err) + " px", good: through }
            ] });
          }
          return {
            status: function () {
              if (done) return through ? "THROUGH THE HOOP!" : "The hoop remains unthreaded.";
              if (plane) return "Fly, tiny plane, fly…";
              return charging ? "Power " + Math.round(power) + "% — release in the green!" : "Hold to charge your throw!";
            },
            down: function () {
              if (done || thrown || charging) return;
              audio(); charging = true; power = 0;
            },
            move: function () {},
            up: function () {
              if (done || !charging) return;
              charging = false; thrown = true;
              resultY = HOOP_Y + (IDEAL - power) * 2.7;
              plane = { x: 74, t: 0 };
              blip(600, .08, "sine", .05);
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (charging && !done) power = clamp(power + dt * 58, 0, 100);
              // sky + clouds
              g.fillStyle = dark ? "#1d2f45" : "#dff2fc"; g.fillRect(0, 40, W, 380);
              g.fillStyle = dark ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.85)";
              [[140, 96], [330, 70], [600, 110], [520, 320], [170, 330]].forEach(function (c) {
                g.beginPath(); g.ellipse(c[0], c[1], 34, 13, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(c[0] + 22, c[1] + 4, 24, 10, 0, 0, Math.PI * 2); g.fill();
              });
              // hoop on a pole
              g.fillStyle = "#8a5a28"; g.fillRect(HOOP_X - 4, HOOP_Y + 30, 8, 190);
              g.strokeStyle = "#e88ca0"; g.lineWidth = 7;
              g.beginPath(); g.arc(HOOP_X, HOOP_Y, 34, 0, Math.PI * 2); g.stroke();
              g.strokeStyle = dark ? "rgba(247,232,216,.4)" : "rgba(93,58,22,.3)"; g.lineWidth = 2;
              g.beginPath(); g.moveTo(HOOP_X - 34, HOOP_Y); g.lineTo(HOOP_X + 34, HOOP_Y); g.stroke();
              txt(g, "HOOP", HOOP_X, 448, 14, dark ? "#c4a68d" : "#7a5f4d");
              // hand + plane before throw
              if (!plane) {
                g.fillStyle = "#ffd9a0"; g.beginPath(); g.arc(84, 268, 19, 0, Math.PI * 2); g.fill();
                drawPlane(g, 96, 236 + (charging ? Math.sin(performance.now() / 60) * 2 : 0), 0);
              }
              // flight
              if (plane && !done) {
                plane.t += dt;
                plane.x = 74 + plane.t * 330;
                var frac = clamp((plane.x - 74) / (660 - 74), 0, 1);
                var baseY = 236 + (resultY - 236) * Math.pow(frac, 0.8);
                var py = baseY + Math.sin(plane.t * 9) * 7 * (1 - frac * 0.5);
                drawPlane(g, plane.x, py, Math.sin(plane.t * 9) * 0.1);
                if (plane.x >= HOOP_X && !plane.checked) {
                  plane.checked = true;
                  through = Math.abs(py - HOOP_Y) <= 30;
                  resultY = py;
                  if (through) blip(880, .12, "sine", .07);
                }
                if (plane.x >= 660) finishRound();
              }
              function drawPlane(g2, x, y, rot) {
                g2.save(); g2.translate(x, y); g2.rotate(rot);
                g2.fillStyle = "#fdfdf8";
                g2.beginPath(); g2.moveTo(-26, 8); g2.lineTo(28, -6); g2.lineTo(12, 12); g2.lineTo(2, 4); g2.closePath(); g2.fill();
                g2.strokeStyle = "#b9c6cc"; g2.lineWidth = 2; g2.stroke();
                g2.restore();
              }
              // power meter
              var PW = 380, PX = (W - PW) / 2, PY = 402;
              txt(g, "POWER", PX - 16, PY + 15, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, PX + 52, PY, PW - 52, 20, 10); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(PX + 52 + (PW - 52) * 0.55, PY, (PW - 52) * 0.25, 20);
              g.fillStyle = "#57b7dd"; rr(g, PX + 52, PY, Math.max(10, (PW - 52) * power / 100), 20, 10); g.fill();
              if (!charging && !plane && !done) txt(g, "Hold… release with the bar in the green!", W / 2, 66, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
