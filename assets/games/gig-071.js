/* ================================================================
   GoofGig — Gig #071 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #071 — Goalie Hands
         Ten shots. One glove. Defend the goal with your pointer.
         ================================================================ */
      registerGame({
        n: 71, title: "Goalie Hands",
        desc: "Ten shots are coming. You are the entire defense.",
        hint: '<b>Move the glove</b> with the pointer and get it in front of each <b>shot</b>. <b>10 shots</b> — every save counts.',
        grades: [
          ["The Wall", "Ten shots, and the goal is still a rumor to the ball."],
          ["Octopus Intern", "Shots came from everywhere. So did your glove."],
          ["Reliable Keeper", "Mostly saves, minor heartbreak, strong posture."],
          ["Highlight Victim", "You saved some beauties. The rest are on the internet now."],
          ["Decorative Keeper", "Great glove. Shame it was mostly there for photos."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#5d8a54"; g.lineWidth = 4; rr(g, 104, 14, 92, 62, 4); g.stroke();
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(150, 44, 10, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#f5c542"; g.beginPath(); g.ellipse(176, 52, 13, 16, 0.4, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var glove = { x: W / 2, y: 280 }, tx = W / 2, ty = 280;
          var shot = null, shotsDone = 0, saves = 0, waitT = 0.8, started = false, done = false, flashTxt = "", flashT = 0;
          var GOAL = { x0: 170, x1: 550, y0: 140, y1: 386 };
          function nextShot() {
            var sx = 90 + Math.random() * (W - 180), sy = 74;
            var gx = GOAL.x0 + 26 + Math.random() * (GOAL.x1 - GOAL.x0 - 52);
            var gy = GOAL.y0 + 30 + Math.random() * (GOAL.y1 - GOAL.y0 - 60);
            shot = { x: sx, y: sy, sx: sx, sy: sy, gx: gx, gy: gy, t: 0, dur: 0.72 + Math.random() * 0.18 };
          }
          function finishRound() {
            done = true;
            var s = saves * 10;
            if (saves >= 8) sndGood(); else sndBad();
            api.finish({ score: clamp(s, 1, 100), rows: [
              { label: "Saves", value: saves * 10, text: saves + " / 10 saved", good: saves >= 7 },
              { label: "Goals conceded", value: (10 - saves) * 10, text: (10 - saves) + " slipped in" }
            ] });
          }
          return {
            status: function () { return done ? "Full time!" : (started ? "Shot " + Math.min(shotsDone + 1, 10) + " / 10 · saves " + saves : "Move to take your position!"); },
            down: function (p) { started = true; tx = p.x; ty = p.y; audio(); },
            move: function (p) { started = true; tx = p.x; ty = p.y; },
            up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              glove.x += (clamp(tx, 30, W - 30) - glove.x) * Math.min(1, dt * 18);
              glove.y += (clamp(ty, 110, 430) - glove.y) * Math.min(1, dt * 18);
              if (flashT > 0) flashT -= dt;
              if (started && !done) {
                if (!shot) {
                  waitT -= dt;
                  if (waitT <= 0) nextShot();
                } else {
                  shot.t += dt / shot.dur;
                  var e = shot.t;
                  shot.x = shot.sx + (shot.gx - shot.sx) * e;
                  shot.y = shot.sy + (shot.gy - shot.sy) * e;
                  if (dist(shot.x, shot.y, glove.x, glove.y) < 47) {
                    saves++; shotsDone++; flashTxt = "SAVED!"; flashT = 0.55; shot = null; waitT = 0.55; blip(760, .07, "sine", .07);
                    if (shotsDone >= 10) finishRound();
                  } else if (shot.t >= 1) {
                    shotsDone++; flashTxt = "GOAL…"; flashT = 0.55; shot = null; waitT = 0.55; sndBad();
                    if (shotsDone >= 10) finishRound();
                  }
                }
              }
              // pitch
              g.fillStyle = dark ? "#27402a" : "#6fa85c"; g.fillRect(0, 0, W, 460);
              g.fillStyle = dark ? "#2e4a30" : "#7cb668"; g.fillRect(0, 0, W, 120);
              // goal frame
              g.fillStyle = "rgba(255,255,255,.1)"; g.fillRect(GOAL.x0, GOAL.y0, GOAL.x1 - GOAL.x0, GOAL.y1 - GOAL.y0);
              g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2;
              for (var nx = GOAL.x0; nx <= GOAL.x1; nx += 24) { g.beginPath(); g.moveTo(nx, GOAL.y0); g.lineTo(nx, GOAL.y1); g.stroke(); }
              for (var ny = GOAL.y0; ny <= GOAL.y1; ny += 24) { g.beginPath(); g.moveTo(GOAL.x0, ny); g.lineTo(GOAL.x1, ny); g.stroke(); }
              g.strokeStyle = "#ffffff"; g.lineWidth = 7; rr(g, GOAL.x0, GOAL.y0, GOAL.x1 - GOAL.x0, GOAL.y1 - GOAL.y0, 4); g.stroke();
              // incoming shot telegraph
              if (shot) {
                g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 2; g.setLineDash([6, 8]);
                g.beginPath(); g.moveTo(shot.sx, shot.sy); g.lineTo(shot.gx, shot.gy); g.stroke(); g.setLineDash([]);
                var sc = 8 + shot.t * 9;
                g.fillStyle = "#ffffff"; g.beginPath(); g.arc(shot.x, shot.y, sc, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#33241a"; g.beginPath(); g.arc(shot.x - 3, shot.y - 2, sc * 0.32, 0, Math.PI * 2); g.arc(shot.x + 4, shot.y + 3, sc * 0.26, 0, Math.PI * 2); g.fill();
              }
              // shooter label at top
              txt(g, "SHOOTER", W / 2, 66, 15, "rgba(255,255,255,.75)");
              // glove
              g.save(); g.translate(glove.x, glove.y);
              g.fillStyle = "#f5c542"; g.beginPath(); g.ellipse(0, 0, 26, 32, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#e8a33d";
              [-16, -5, 6, 17].forEach(function (fx) { g.beginPath(); g.ellipse(fx, -32, 6.5, 13, 0, 0, Math.PI * 2); g.fill(); });
              g.fillStyle = "#d93e22"; rr(g, -24, 22, 48, 14, 6); g.fill();
              g.restore();
              if (flashT > 0) txt(g, flashTxt, W / 2, 116, 30, flashTxt === "SAVED!" ? "#aef2c8" : "#ffb3a3");
              txt(g, "SAVES " + saves + " / 10", 92, 428, 20, "#ffffff");
              if (!started) txt(g, "Glove follows your pointer — block everything!", W / 2, 424, 20, "rgba(255,255,255,.9)");
            }
          };
        }
      });
