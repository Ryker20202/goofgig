/* ================================================================
   GoofGig — Gig #080 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #080 — Alley Bowling
         Drag sideways to aim, flick up to roll. Ten pins,
         two rolls, zero rental shoes.
         ================================================================ */
      registerGame({
        n: 80, title: "Alley Bowling",
        desc: "Aim the ball, flick it down the lane, bully ten pins.",
        hint: '<b>Drag sideways</b> to aim the ball, then <b>flick upward</b> to roll. You get <b>2 rolls</b> at the same rack of <b>10 pins</b>.',
        grades: [
          ["Turkey Royalty", "Every pin down. The lane is requesting your autograph."],
          ["Lane Boss", "That rack never recovered. Beautiful violence."],
          ["League Night Regular", "Respectable carnage. The pins saw it coming."],
          ["Gutter Enthusiast", "The gutters send their warmest regards."],
          ["Pin Preservationist", "Ten pins, all still standing, all deeply unbothered."]
        ],
        thumb: function (g) {
          g.fillStyle = "#7a4a21"; rr(g, 92, 6, 116, 80, 6); g.fill();
          g.fillStyle = "#fdfdf8";
          [[150, 18], [138, 32], [162, 32], [150, 46]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 5, 0, Math.PI * 2); g.fill(); });
          g.fillStyle = "#33241a"; g.beginPath(); g.arc(150, 72, 12, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var rolls = 0, done = false, rolling = null, restTimer = 0;
          var ballX = W / 2, dragging = false, trail = [];
          var LANE_L = 268, LANE_R = 452, BALL_Y = 388;
          // pin layout in lane coords (y grows downward on screen; pins near top)
          var pins = [];
          (function build() {
            var rowsY = [96, 122, 148, 174];
            for (var r = 0; r < 4; r++) {
              for (var i = 0; i <= r; i++) {
                pins.push({ x: W / 2 + (i - r / 2) * 34, y: rowsY[r], down: false });
              }
            }
          })();
          function pinsDown() { return pins.filter(function (p) { return p.down; }).length; }
          function knockAt(bx) {
            pins.forEach(function (p) {
              if (!p.down && Math.abs(p.x - bx) <= 30) p.down = true;
            });
            // one-step cascade: neighbours of freshly fallen pins wobble over
            var fresh = pins.filter(function (p) { return p.down; });
            pins.forEach(function (p) {
              if (p.down) return;
              for (var i = 0; i < fresh.length; i++) {
                if (dist(p.x, p.y, fresh[i].x, fresh[i].y) <= 36) { p.down = true; break; }
              }
            });
          }
          function finishRound() {
            done = true;
            var n = pinsDown();
            if (n >= 8) sndGood(); else if (n >= 4) blip(520, .08, "sine", .06); else sndBad();
            api.finish({ score: n * 10, rows: [
              { label: "Pins knocked down", value: n * 10, text: n + " / 10", good: n >= 7 },
              { label: "Rolls used", value: 100, text: rolls + " / 2" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Bowling judged!";
              if (rolling) return "Rolling…";
              return "Roll " + (rolls + 1) + " / 2 · Pins down: " + pinsDown() + " — drag to aim, flick up!";
            },
            down: function (p) {
              if (done || rolling) return;
              audio(); dragging = true; trail = [{ x: p.x, y: p.y, t: performance.now() }];
              ballX = clamp(p.x, LANE_L + 20, LANE_R - 20);
            },
            move: function (p) {
              if (!dragging || done || rolling) return;
              ballX = clamp(p.x, LANE_L + 20, LANE_R - 20);
              trail.push({ x: p.x, y: p.y, t: performance.now() });
              if (trail.length > 14) trail.shift();
            },
            up: function () {
              if (!dragging || done || rolling) return;
              dragging = false;
              var now = performance.now(), vy = 0;
              for (var i = trail.length - 1; i >= 0; i--) {
                if (now - trail[i].t > 130) { vy = (trail[trail.length - 1].y - trail[i].y) / Math.max(1, now - trail[i].t); break; }
              }
              if (vy < -0.22) {
                rolling = { y: BALL_Y, speed: clamp(-vy * 620, 380, 980), hitRows: {} };
                blip(160, .1, "sine", .07);
              } else {
                blip(240, .05, "square", .04);
              }
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (rolling && !done) {
                rolling.y -= rolling.speed * dt;
                pins.forEach(function (p) {
                  if (!p.down && !rolling.hitRows[p.y] && rolling.y <= p.y + 14 && rolling.y > p.y - 30) {
                    rolling.hitRows[p.y] = true; knockAt(ballX);
                    if (pinsDown() > 0) blip(120, .06, "square", .06);
                  }
                });
                if (rolling.y < 58) { rolling = null; rolls++; restTimer = 0.8; }
              }
              if (restTimer > 0 && !done) {
                restTimer -= dt;
                if (restTimer <= 0 && rolls >= 2) finishRound();
              }
              // alley
              g.fillStyle = dark ? "#241a12" : "#8a5a28"; g.fillRect(0, 40, W, 420);
              g.fillStyle = dark ? "#5d4023" : "#d9a860"; g.fillRect(LANE_L, 40, LANE_R - LANE_L, 420);
              g.fillStyle = dark ? "#170f08" : "#5d3410"; g.fillRect(LANE_L - 26, 40, 22, 420); g.fillRect(LANE_R + 4, 40, 22, 420);
              g.strokeStyle = "rgba(120,72,20,.35)"; g.lineWidth = 2;
              for (var lx = LANE_L + 32; lx < LANE_R; lx += 32) { g.beginPath(); g.moveTo(lx, 44); g.lineTo(lx, 456); g.stroke(); }
              // pins
              pins.forEach(function (p) {
                if (p.down) {
                  g.save(); g.translate(p.x, p.y + 8); g.rotate(1.35);
                  g.fillStyle = "#fdfdf8"; rr(g, -6, -16, 12, 32, 6); g.fill();
                  g.fillStyle = "#e3352b"; g.fillRect(-6, -6, 12, 5);
                  g.restore();
                } else {
                  g.fillStyle = "#fdfdf8"; rr(g, p.x - 7, p.y - 17, 14, 34, 7); g.fill();
                  g.fillStyle = "#e3352b"; g.fillRect(p.x - 7, p.y - 7, 14, 5);
                }
              });
              // ball
              var by = rolling ? rolling.y : BALL_Y;
              g.fillStyle = "#33241a"; g.beginPath(); g.arc(ballX, by, 21, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#574a3a";
              g.beginPath(); g.arc(ballX - 6, by - 7, 3.6, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(ballX + 5, by - 10, 3.6, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(ballX + 1, by - 1, 3.6, 0, Math.PI * 2); g.fill();
              if (!rolling && !done) {
                g.strokeStyle = dark ? "rgba(247,232,216,.5)" : "rgba(60,35,10,.45)"; g.lineWidth = 2; g.setLineDash([6, 8]);
                g.beginPath(); g.moveTo(ballX, BALL_Y - 30); g.lineTo(ballX, 210); g.stroke(); g.setLineDash([]);
                txt(g, "Drag to aim — flick UP to roll!", W / 2, 448, 18, dark ? "rgba(247,232,216,.85)" : "rgba(50,30,8,.8)");
              }
              txt(g, "Pins down: " + pinsDown() + " / 10", 104, 66, 16, dark ? "#f7e8d8" : "#fdf0da");
            }
          };
        }
      });
