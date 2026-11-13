/* ================================================================
   GoofGig — Gig #082 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #082 — Free Throw
         Hold to charge the shot, release in the zone for a swish.
         Five shots at the hoop.
         ================================================================ */
      registerGame({
        n: 82, title: "Free Throw",
        desc: "Five free throws. Swishes are worth bragging rights.",
        hint: '<b>Hold</b> to charge, <b>release</b> to shoot. The <b>green zone</b> is a swish — a little either side still drops, way off is a brick. <b>5 shots.</b>',
        grades: [
          ["Swish Royalty", "Nothing but net. The rim feels unemployed."],
          ["Charity Stripe Sniper", "The hoop has started flinching when you step up."],
          ["Decent Shooter", "Mostly in. The backboard has seen worse."],
          ["Rim's Workout Partner", "The rim got more touches than the net did."],
          ["Brick Mason", "Five bricks. You could build a small shed now."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdfdf8"; rr(g, 128, 8, 44, 30, 3); g.fill();
          g.strokeStyle = "#e3352b"; g.lineWidth = 4; g.beginPath(); g.ellipse(150, 42, 20, 6, 0, 0, Math.PI * 2); g.stroke();
          g.fillStyle = "#e8862b"; g.beginPath(); g.arc(150, 68, 13, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var shots = 5, pts = 0, makes = 0, swishes = 0, done = false;
          var charging = false, power = 0, ball = null, restTimer = 0, lastResult = "";
          var SX = W / 2, SY = 392, RIM_Y = 168;
          var SWISH = { lo: 62, hi: 74 }, MAKE = { lo: 54, hi: 82 };
          function shoot() {
            var kind;
            if (power >= SWISH.lo && power <= SWISH.hi) kind = "swish";
            else if (power >= MAKE.lo && power <= MAKE.hi) kind = "make";
            else kind = power < MAKE.lo ? "short" : "long";
            var endX = SX, endY = RIM_Y + 16;
            if (kind === "short") { endX = SX + 8; endY = RIM_Y + 58; }
            if (kind === "long") { endX = SX + 46; endY = RIM_Y + 74; }
            ball = { t: 0, kind: kind, endX: endX, endY: endY, peak: SY - (170 + power * 2.1) };
            blip(300, .06, "sine", .05);
          }
          function resolve() {
            if (ball.kind === "swish") { pts += 23; swishes++; makes++; lastResult = "SWISH!"; sndGood(); }
            else if (ball.kind === "make") { pts += 17; makes++; lastResult = "It drops!"; blip(660, .09, "sine", .06); }
            else { lastResult = ball.kind === "short" ? "Too short — front rim." : "Too long — off the glass."; sndBad(); }
            ball = null; shots--;
            restTimer = 0.75;
          }
          function finishRound() {
            done = true;
            api.finish({ score: clamp(pts, 0, 100), rows: [
              { label: "Shots made", value: makes / 5 * 100, text: makes + " / 5", good: makes >= 4 },
              { label: "Swishes", value: swishes / 5 * 100, text: swishes + " clean" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Shooting judged!";
              if (ball) return "Ball's up…";
              if (lastResult && restTimer > 0) return lastResult;
              return "Shots left: " + shots + " — hold to charge!";
            },
            down: function () {
              if (done || ball || shots <= 0 || charging) return;
              audio(); charging = true; power = 0;
            },
            move: function () {},
            up: function () {
              if (done || !charging) return;
              charging = false;
              shoot();
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (charging && !done) power = clamp(power + dt * 64, 0, 100);
              if (ball) {
                ball.t += dt / 0.85;
                if (ball.t >= 1) resolve();
              }
              if (restTimer > 0 && !done) {
                restTimer -= dt;
                if (restTimer <= 0 && shots <= 0) finishRound();
              }
              // court
              g.fillStyle = dark ? "#4a2f1d" : "#e0aa6e"; g.fillRect(0, 396, W, 64);
              g.strokeStyle = dark ? "rgba(247,232,216,.3)" : "rgba(120,60,20,.35)"; g.lineWidth = 2;
              g.beginPath(); g.moveTo(0, 396); g.lineTo(W, 396); g.stroke();
              // backboard + rim + net
              g.fillStyle = "rgba(253,253,248,.92)"; rr(g, SX - 52, 96, 104, 62, 4); g.fill();
              g.strokeStyle = "#e3352b"; g.lineWidth = 3; g.strokeRect(SX - 52, 96, 104, 62);
              g.strokeStyle = "#e8862b"; g.strokeRect(SX - 22, 122, 44, 30);
              g.fillStyle = "#e3352b"; rr(g, SX - 25, RIM_Y - 4, 50, 7, 3); g.fill();
              g.strokeStyle = dark ? "#ddd" : "#bbb"; g.lineWidth = 2;
              for (var i = -2; i <= 2; i++) {
                g.beginPath(); g.moveTo(SX + i * 11, RIM_Y + 3); g.lineTo(SX + i * 7, RIM_Y + 32); g.stroke();
              }
              g.beginPath(); g.moveTo(SX - 20, RIM_Y + 32); g.lineTo(SX + 20, RIM_Y + 32); g.stroke();
              // shooter
              g.fillStyle = "#2471a3"; rr(g, SX - 13, 348, 26, 44, 9); g.fill();
              g.fillStyle = "#ffd9a0"; g.beginPath(); g.arc(SX, 336, 13, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#ffd9a0"; g.lineWidth = 7;
              g.beginPath(); g.moveTo(SX + 8, 356); g.lineTo(SX + 20, 372); g.stroke();
              // ball
              var bx = SX, by = SY - 26;
              if (ball) {
                var f = clamp(ball.t, 0, 1);
                bx = SX + (ball.endX - SX) * f;
                by = (1 - f) * (SY - 26) + f * ball.endY - Math.sin(f * Math.PI) * ((SY - 26) - ball.peak) * 0.9;
              }
              g.fillStyle = "#e8862b"; g.beginPath(); g.arc(bx, by, 15, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#a85a14"; g.lineWidth = 2;
              g.beginPath(); g.arc(bx, by, 15, 0, Math.PI * 2); g.stroke();
              g.beginPath(); g.moveTo(bx - 15, by); g.lineTo(bx + 15, by); g.stroke();
              g.beginPath(); g.moveTo(bx, by - 15); g.lineTo(bx, by + 15); g.stroke();
              if (lastResult && restTimer > 0) txt(g, lastResult, W / 2, 66, 23, dark ? "#f7e8d8" : "#33241a");
              // power meter with zones
              var PW = 380, PX = (W - PW) / 2, PY = 424;
              txt(g, "POWER", PX - 14, PY + 15, 14, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, PX + 54, PY, PW - 54, 18, 9); g.fill();
              g.fillStyle = "rgba(232,134,43,.45)"; g.fillRect(PX + 54 + (PW - 54) * MAKE.lo / 100, PY, (PW - 54) * (MAKE.hi - MAKE.lo) / 100, 18);
              g.fillStyle = "rgba(53,196,160,.6)"; g.fillRect(PX + 54 + (PW - 54) * SWISH.lo / 100, PY, (PW - 54) * (SWISH.hi - SWISH.lo) / 100, 18);
              g.fillStyle = "#e3352b"; rr(g, PX + 54, PY, Math.max(8, (PW - 54) * power / 100), 18, 9); g.fill();
              txt(g, "Shots: " + "●".repeat(Math.max(0, shots)) + "○".repeat(Math.max(0, 5 - shots)), 96, 66, 16, dark ? "#f7e8d8" : "#33241a");
            }
          };
        }
      });
