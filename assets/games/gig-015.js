/* ================================================================
   GoofGig — Gig #015 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #015 — Cap Flick
         Flick a bottle cap onto the target spot. 3 flicks, best counts.
         ================================================================ */
      registerGame({
        n: 15, title: "Cap Flick",
        desc: "One metal cap, one painted target, pure table physics.",
        hint: '<b>Drag and flick</b> the bottle cap so it slides to a stop on the <b>target rings</b>. <b>3 flicks</b>, best one counts.',
        grades: [
          ["Dead-Centre Flicker", "The cap landed like it was magnetised."],
          ["Table Sharpshooter", "Right in the rings. The table applauds quietly."],
          ["Cap Commuter", "It travelled well and stopped close enough."],
          ["Rim Tourist", "The cap visited every corner except the target."],
          ["Cap Launcher", "That cap has left the county."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#0e9594"; g.lineWidth = 4;
          [30, 19, 9].forEach(function (r) { g.beginPath(); g.arc(168, 46, r, 0, Math.PI * 2); g.stroke(); });
          g.fillStyle = "#c8d6dd"; g.beginPath(); g.arc(112, 52, 13, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#8fa3ad"; g.lineWidth = 3; g.stroke();
        },
        create: function (api) {
          var SX = 116, SY = 348;
          var T = { x: 470 + Math.random() * 130, y: 130 + Math.random() * 150 };
          var flicks = 0, best = 0, cap = null, aiming = null, done = false;
          function endFlick() {
            var d = dist(cap.x, cap.y, T.x, T.y);
            var s = clamp(Math.round(100 - d / 4.6), 1, 100);
            best = Math.max(best, s);
            if (s >= 70) sndGood(); else sndBad();
            cap.rest = s;
            flicks++;
            if (flicks >= 3) {
              done = true;
              api.finish({ score: best, rows: [
                { label: "Best landing", value: best, text: best + " / 100", good: best >= 70 },
                { label: "Distance off", value: clamp(100 - d / 4.6, 0, 100), text: Math.round(d) + " px" }
              ] });
            }
          }
          return {
            status: function () { return done ? "Table cleared!" : "Flick " + (flicks + 1) + " of 3 · best " + best; },
            down: function (p) { if (!done && !cap && dist(p.x, p.y, SX, SY) < 64) aiming = { x: p.x, y: p.y }; },
            move: function (p) { if (aiming) { aiming.x = p.x; aiming.y = p.y; } },
            up: function (p) {
              if (!aiming || done) { aiming = null; return; }
              var vx = (p.x - SX) * 6.4, vy = (p.y - SY) * 6.4;
              if (Math.abs(vx) + Math.abs(vy) < 200) { vx = 420; vy = -260; }
              cap = { x: SX, y: SY, vx: clamp(vx, -200, 1050), vy: clamp(vy, -1050, 1050), rest: null, still: 0 };
              aiming = null; audio();
            },
            draw: function (g, dt) {
              var dark = isDark();
              // table top-down
              g.fillStyle = dark ? "#4a3520" : "#c99a5e"; rr(g, 24, 24, W - 48, H - 48, 18); g.fill();
              g.strokeStyle = "rgba(90,55,15,.35)"; g.lineWidth = 2;
              [120, 220, 320].forEach(function (y) { g.beginPath(); g.moveTo(40, y); g.lineTo(W - 40, y); g.stroke(); });
              // target rings
              [46, 32, 18].forEach(function (r, i) {
                g.strokeStyle = i === 2 ? "#ff5a3c" : "#0e9594"; g.lineWidth = 4;
                g.beginPath(); g.arc(T.x, T.y, r, 0, Math.PI * 2); g.stroke();
              });
              g.fillStyle = "#ff5a3c"; g.beginPath(); g.arc(T.x, T.y, 5, 0, Math.PI * 2); g.fill();
              // cap physics (friction slide)
              if (cap && cap.rest === null) {
                cap.x += cap.vx * dt; cap.y += cap.vy * dt;
                var f = Math.pow(0.32, dt); cap.vx *= f; cap.vy *= f;
                if (cap.x < 44) { cap.x = 44; cap.vx *= -0.5; } if (cap.x > W - 44) { cap.x = W - 44; cap.vx *= -0.5; }
                if (cap.y < 44) { cap.y = 44; cap.vy *= -0.5; } if (cap.y > H - 44) { cap.y = H - 44; cap.vy *= -0.5; }
                if (Math.abs(cap.vx) + Math.abs(cap.vy) < 26) { cap.still += dt; if (cap.still > 0.25) endFlick(); }
              }
              function drawCap(x, y) {
                g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(x + 3, y + 5, 21, 8, 0, 0, Math.PI * 2); g.fill();
                var grad = g.createRadialGradient(x - 6, y - 6, 3, x, y, 21);
                grad.addColorStop(0, "#f2f6f8"); grad.addColorStop(1, "#aeb9c4");
                g.fillStyle = grad; g.beginPath(); g.arc(x, y, 20, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "#8fa3ad"; g.lineWidth = 3; g.stroke();
                txt(g, "★", x, y + 1, 17, "#ff5a3c");
              }
              if (cap) {
                drawCap(cap.x, cap.y);
                if (cap.rest !== null && !done) {
                  txt(g, cap.rest + "! Next flick — grab the new cap", W / 2, 420, 18, dark ? "#f7e8d8" : "#33241a");
                  if (!cap.cleared) { cap.cleared = true; setTimeout(function () { cap = null; }, 650); }
                }
              } else if (!done) {
                drawCap(SX, SY);
                if (aiming) {
                  g.strokeStyle = "rgba(255,90,60,.65)"; g.lineWidth = 3; g.setLineDash([7, 7]);
                  g.beginPath(); g.moveTo(SX, SY); g.lineTo(aiming.x, aiming.y); g.stroke(); g.setLineDash([]);
                } else txt(g, "Grab the cap, drag, flick!", 330, 420, 19, dark ? "rgba(247,232,216,.85)" : "rgba(51,36,26,.75)");
              }
            }
          };
        }
      });
